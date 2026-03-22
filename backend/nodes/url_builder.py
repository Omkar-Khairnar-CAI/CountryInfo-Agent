import urllib.parse

BASE_URL = "https://restcountries.com/v3.1"

def build_url(state: dict) -> dict:
    intent = state.get("intent")
    url = ""
    
    try:
        if intent == "get_country_info":
            # Using fullText=false default or allowing user to specify.
            # Plan says /name/{country}?fullText=true but to avoid spelling issues we just use /name/{country} loosely
            # Actually I will follow plan verbatim: /name/{country}?fullText=true
            country = urllib.parse.quote(state.get("country", ""))
            url = f"{BASE_URL}/name/{country}?fullText=true"
        elif intent == "search_by_region":
            region = urllib.parse.quote(state.get("region", ""))
            url = f"{BASE_URL}/region/{region}"
        elif intent == "search_by_currency":
            currency = urllib.parse.quote(state.get("currency", ""))
            url = f"{BASE_URL}/currency/{currency}"
        elif intent == "search_by_language":
            language = urllib.parse.quote(state.get("language", ""))
            url = f"{BASE_URL}/lang/{language}"
        elif intent == "search_by_capital":
            capital = urllib.parse.quote(state.get("capital", ""))
            url = f"{BASE_URL}/capital/{capital}"
        elif intent == "lookup_by_code":
            code = urllib.parse.quote(state.get("code", ""))
            url = f"{BASE_URL}/alpha/{code}"
            
        fields = state.get("fields", [])
        if fields:
            # Always ensure basic fields are there for a good answer
            essential_fields = {"name", "capital"}
            requested_fields = set(fields)
            all_fields = essential_fields.union(requested_fields)
            
            connector = "&" if "?" in url else "?"
            url += connector + "fields=" + ",".join(all_fields)
            
        return {"url": url}
    except Exception as e:
        return {"error": f"Failed to build URL: {str(e)}"}
