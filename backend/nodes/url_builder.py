import urllib.parse
import os


REST_COUNTRIES_API_BASE_URL = os.environ.get("REST_COUNTRIES_API_BASE_URL")
print(REST_COUNTRIES_API_BASE_URL)
def build_url(state: dict) -> dict:
    intent = state.get("intent")
    url = ""
    
    try:
        if intent == "get_country_info":
            # Using fullText=false default or allowing user to specify.
            # Plan says /name/{country}?fullText=true but to avoid spelling issues we just use /name/{country} loosely
            # Actually I will follow plan verbatim: /name/{country}?fullText=true
            country = urllib.parse.quote(state.get("country", "")).lower()
            url = f"{REST_COUNTRIES_API_BASE_URL}/name/{country}?fullText=true"
        elif intent == "search_by_region":
            region = urllib.parse.quote(state.get("region", "")).lower()
            url = f"{REST_COUNTRIES_API_BASE_URL}/region/{region}"
        elif intent == "search_by_currency":
            currency = urllib.parse.quote(state.get("currency", "")).lower()
            url = f"{REST_COUNTRIES_API_BASE_URL}/currency/{currency}"
        elif intent == "search_by_language":
            language = urllib.parse.quote(state.get("language", "")).lower()
            url = f"{REST_COUNTRIES_API_BASE_URL}/lang/{language}"
        elif intent == "search_by_capital":
            capital = urllib.parse.quote(state.get("capital", "")).lower()
            url = f"{REST_COUNTRIES_API_BASE_URL}/capital/{capital}"
        elif intent == "lookup_by_code":
            code = urllib.parse.quote(state.get("code", "")).lower()
            url = f"{REST_COUNTRIES_API_BASE_URL}/alpha/{code}"
            
        fields = state.get("fields", [])
        if fields:
            # Always ensure basic fields are there for a good answer
            essential_fields = {"name", "capital"}
            requested_fields = set(fields)
            all_fields = essential_fields.union(requested_fields)
            
            connector = "&" if "?" in url else "?"
            url += connector + "fields=" + ",".join(all_fields)
        print("URL->", url)
        return {"url": url}
    except Exception as e:
        return {"error": f"Failed to build URL: {str(e)}"}
