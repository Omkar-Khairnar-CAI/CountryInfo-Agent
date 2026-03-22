def validate_input(state: dict) -> dict:
    intent = state.get("intent")
    
    # If the intent extractor already surfaced an error (e.g. no API key), pass it along
    if state.get("error"):
        return {"error": state["error"]}
    
    VALID_INTENTS = [
        "get_country_info", "search_by_region", "search_by_currency", 
        "search_by_language", "search_by_capital", "lookup_by_code"
    ]
    
    if not intent or intent not in VALID_INTENTS:
        return {"error": f"Unsupported or unknown intent: {intent}"}
        
    error = None
    if intent == "get_country_info" and not state.get("country"):
        error = "Missing country name."
    elif intent == "search_by_region" and not state.get("region"):
        error = "Missing region name."
    elif intent == "search_by_currency" and not state.get("currency"):
        error = "Missing currency."
    elif intent == "search_by_language" and not state.get("language"):
        error = "Missing language."
    elif intent == "search_by_capital" and not state.get("capital"):
        error = "Missing capital."
    elif intent == "lookup_by_code" and not state.get("code"):
        error = "Missing country code."
        
    if error:
        return {"error": error}
        
    return {"error": None}
