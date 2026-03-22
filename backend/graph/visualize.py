import os
import sys

# Add backend directory to sys.path so modules can be found
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from graph.builder import agent_graph

if __name__ == "__main__":
    print("Generating Graph Architecture Diagram...")
    try:
        # LangGraph provides a built-in method to export the StateGraph visual to a PNG via Mermaid API
        png_data = agent_graph.get_graph().draw_mermaid_png()
        
        # Save it into the current directory (/graph/)
        output_path = os.path.join(os.path.dirname(__file__), "graph_diagram.png")
        
        with open(output_path, "wb") as f:
            f.write(png_data)
            
        print(f"✅ Success! Diagram saved to: {output_path}")
    except Exception as e:
        print(f"❌ Failed to generate diagram. Error: {e}")
