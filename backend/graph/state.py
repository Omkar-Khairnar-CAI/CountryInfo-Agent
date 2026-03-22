from typing import TypedDict, Optional, List, Dict, Any

class AgentState(TypedDict):
    query: str
    
    intent: Optional[str]
    country: Optional[str]
    
    region: Optional[str]
    currency: Optional[str]
    language: Optional[str]
    capital: Optional[str]
    code: Optional[str]
    
    fields: Optional[List[str]]
    
    url: Optional[str]
    api_response: Optional[Dict[str, Any]]
    
    error: Optional[str]
    final_answer: Optional[str]
