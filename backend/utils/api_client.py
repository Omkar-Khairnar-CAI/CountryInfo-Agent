import requests
from typing import Dict, Any

def fetch_data(url: str) -> Dict[str, Any]:
    try:
        response = requests.get(url, timeout=10)
        # Always return structured dict so nodes can process errors
        if response.status_code == 200:
            return {"success": True, "data": response.json(), "status_code": response.status_code}
        elif response.status_code == 404:
            return {"success": False, "error": "No matching countries found.", "status_code": 404}
        else:
            return {"success": False, "error": f"API error: {response.text}", "status_code": response.status_code}
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": f"Network error: {str(e)}", "status_code": 500}
