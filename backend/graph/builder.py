from langgraph.graph import StateGraph, END
from graph.state import AgentState
from nodes.intent import extract_intent
from nodes.validate import validate_input
from nodes.url_builder import build_url
from nodes.tool import call_api
from nodes.response_validation import validate_response
from nodes.synthesis import synthesize_answer
from nodes.fallback import fallback_handler

def build_graph():
    builder = StateGraph(AgentState)
    
    # Add nodes
    builder.add_node("intent", extract_intent)
    builder.add_node("validate", validate_input)
    builder.add_node("url_builder", build_url)
    builder.add_node("tool", call_api)
    builder.add_node("response_check", validate_response)
    builder.add_node("synthesis", synthesize_answer)
    builder.add_node("fallback", fallback_handler)
    
    # Define edges
    builder.set_entry_point("intent")
    builder.add_edge("intent", "validate")
    
    def route_after_validate(state: AgentState):
        if state.get("error"):
            return "fallback"
        return "url_builder"
        
    builder.add_conditional_edges("validate", route_after_validate)
    
    builder.add_edge("url_builder", "tool")
    builder.add_edge("tool", "response_check")
    
    def route_after_api(state: AgentState):
        if state.get("error"):
            return "fallback"
        return "synthesis"
        
    builder.add_conditional_edges("response_check", route_after_api)
    
    builder.add_edge("synthesis", END)
    builder.add_edge("fallback", END)
    
    return builder.compile()

# Instantiate the compiled graph for use
agent_graph = build_graph()
