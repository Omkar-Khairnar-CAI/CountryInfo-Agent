from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import Optional, List
import os

class IntentExtraction(BaseModel):
    intent: str = Field(description="One of: get_country_info, search_by_region, search_by_currency, search_by_language, search_by_capital, lookup_by_code. Use 'unknown' if it doesn't match.")
    country: Optional[str] = Field(None, description="The name of the country")
    region: Optional[str] = Field(None, description="The region/continent name")
    currency: Optional[str] = Field(None, description="The currency name or code")
    language: Optional[str] = Field(None, description="The language name")
    capital: Optional[str] = Field(None, description="The capital city name")
    code: Optional[str] = Field(None, description="The 2-letter or 3-letter country code")
    fields: Optional[List[str]] = Field(None, description="List of specific fields asked for, like capital, population, area, currencies, languages, region, subregion, flags. Return empty list if general.")

system_prompt = """You are an AI assistant helping to extract information from user questions about countries. 
Extract the intent and any entities (country, region, currency, language, capital, code).
Also extract the specific fields the user wants to know about, if any.
Valid intents: get_country_info, search_by_region, search_by_currency, search_by_language, search_by_capital, lookup_by_code.
If the question is unrelated to countries, return 'unknown' intent."""

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{query}")
])

def extract_intent(state: dict) -> dict:
    # Initialize the LLM. 
    # Use dummy responses if no OPENAI_API_KEY is provided, to prevent crashes when testing UI
    if not os.environ.get("OPENAI_API_KEY"):
        # Very basic fallback intent extraction if no key is present for simple queries
        query = state["query"].lower()
        if "capital" in query and "japan" in query:
            return {"intent": "get_country_info", "country": "Japan", "fields": ["capital"], "error": None}
        return {"intent": "unknown", "error": "OPENAI_API_KEY not set. Using fallback logic failed."}

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    structured_llm = llm.with_structured_output(IntentExtraction)
    chain = prompt | structured_llm
    
    result = chain.invoke({"query": state["query"]})
    
    return {
        "intent": result.intent,
        "country": result.country,
        "region": result.region,
        "currency": result.currency,
        "language": result.language,
        "capital": result.capital,
        "code": result.code,
        "fields": result.fields or []
    }
