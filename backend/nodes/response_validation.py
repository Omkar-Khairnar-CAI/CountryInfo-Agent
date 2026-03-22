def validate_response(state: dict) -> dict:
    if state.get("error"):
        return {"error": state["error"]}
        
    api_response = state.get("api_response")
    
    if not api_response:
        return {"error": "Received empty response from the API."}
        
    if isinstance(api_response, list) and len(api_response) == 0:
        return {"error": "No matching countries found."}
        
    return {"error": None}
