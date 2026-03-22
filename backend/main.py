from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
import sys
import os
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Add backend directory to sys.path so modules can be found
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from graph.builder import agent_graph

app = FastAPI(title="LangGraph Country AI Agent API", description="FastAPI server for the LangGraph Country AI Agent")

# Allow CORS for local development with Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

async def stream_message_with_ai(message: str):
    initial_state = {"query": message}
    
    try:
        # Utilize astream_events v2 to intercept language model streams from synthesis node
        async for event in agent_graph.astream_events(initial_state, version="v2"):
            kind = event["event"]
            node_name = event.get("metadata", {}).get("langgraph_node")
            
            # 1) Stream tokens ONLY if they are coming from the Synthesis node.
            # This prevents the 'intent' node's raw JSON from being piped to the frontend.
            if kind == "on_chat_model_stream" and node_name == "synthesis":
                chunk = event["data"]["chunk"].content
                if isinstance(chunk, str) and chunk:
                    yield f"data: {json.dumps({'chunk': chunk})}\n\n"
                    
            # 2) Fallback node does not use an LLM, so it won't trigger 'on_chat_model_stream'.
            # We must manually catch its output when it finishes and stream it to the UI in one chunk.
            elif kind == "on_chain_end" and node_name == "fallback":
                output = event.get("data", {}).get("output", {})
                if isinstance(output, dict) and "final_answer" in output:
                    yield f"data: {json.dumps({'chunk': output['final_answer']})}\n\n"
        
        # When graph naturally finishes execution
        yield f"data: {json.dumps({'done': True})}\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\n\n"

@app.post("/chat/stream")
async def chat_stream_endpoint(request: ChatRequest):
    """
    Endpoint to receive user message and return chunked token fragments iteratively via SSE.
    """
    return StreamingResponse(stream_message_with_ai(request.message), media_type="text/event-stream")

@app.get("/health")
def health_check():
    """Health check endpoint to verify backend status."""
    return {"status": "ok", "message": "FastAPI AI Agent server is running"}
