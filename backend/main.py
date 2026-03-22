from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os
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

def process_message_with_ai(message: str) -> str:
    # Invoke the LangGraph agent
    initial_state = {"query": message}
    # Invoke returns the final state
    result_state = agent_graph.invoke(initial_state)
    
    return result_state.get("final_answer", "Sorry, an unknown error occurred.")

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    """
    Endpoint to receive user message and return the AI agent's response.
    """
    ai_response = process_message_with_ai(request.message)
    return ChatResponse(response=ai_response)

@app.get("/health")
def health_check():
    """Health check endpoint to verify backend status."""
    return {"status": "ok", "message": "FastAPI AI Agent server is running"}
