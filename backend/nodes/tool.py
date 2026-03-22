from utils.api_client import fetch_data

def call_api(state: dict) -> dict:
    url = state.get("url")
    if not url:
        return {"error": "Missing URL for API call."}
    
    result = fetch_data(url)
    
    if result["success"]:
        return {"api_response": result["data"]}
    else:
        return {"error": result["error"]}
