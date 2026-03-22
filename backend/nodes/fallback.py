def fallback_handler(state: dict) -> dict:
    error_msg = state.get("error")
    
    if error_msg and "OPENAI_API_KEY" in error_msg:
        final_answer = f"Error: {error_msg}. Please configure the OPENAI_API_KEY environment variable."
    elif state.get("intent") == "unknown":
        final_answer = "I can only answer questions about country-related data such as capital, population, currency, region, and languages."
    elif error_msg:
        final_answer = f"I'm sorry, I couldn't process that request. ({error_msg})"
    else:
        final_answer = "I'm sorry, an unknown error occurred and I cannot answer your question."
        
    return {"final_answer": final_answer}
