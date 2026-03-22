from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import os
import json

system_prompt = """You are a helpful AI assistant summarizing information about countries.
Given the user's original query and the JSON data returned from the REST Countries API, 
provide a concise, human-readable, and grounded answer. Do not hallucinate outside the provided API data.
If the API returned multiple countries when the user asked for one, pick the most relevant or list them briefly."""

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "query: {query}\n\nAPI Data: {api_data}")
])

def synthesize_answer(state: dict) -> dict:
    query = state.get("query", "")
    api_response = state.get("api_response", {})
    
    if not os.environ.get("OPENAI_API_KEY"):
        # Fallback if no LLM key
        countries = api_response if isinstance(api_response, list) else [api_response]
        names = [c.get("name", {}).get("common", "Unknown") for c in countries]
        data_str = json.dumps(api_response)[:300]
        return {"final_answer": f"[Mock Synthesis] Countries found: {', '.join(names)}. Data: {data_str}..."}

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)
    chain = prompt | llm
    
    result = chain.invoke({"query": query, "api_data": json.dumps(api_response)[:3000]})  # Truncate to avoid context window limits if too large
    
    return {"final_answer": result.content}
