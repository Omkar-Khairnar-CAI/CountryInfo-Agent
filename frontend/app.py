import streamlit as st
import requests
import time

# Configure Streamlit page
st.set_page_config(
    page_title="AI Agent App",
    page_icon="🤖",
    layout="centered"
)

# Constants
API_URL = "http://localhost:8000"

st.title("🤖 Chat with Your AI Agent")
st.markdown("This Streamlit UI is connected to a FastAPI backend.")

# Initialize chat history in session state
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat messages from history on app rerun
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Process User Input
if prompt := st.chat_input("Say something to the AI..."):
    # Display user message in chat message container
    with st.chat_message("user"):
        st.markdown(prompt)
    
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})
    
    # Display assistant response in chat message container
    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        message_placeholder.markdown("▌ Thinking...")
        
        try:
            # Send message to FastAPI backend
            response = requests.post(f"{API_URL}/chat", json={"message": prompt})
            
            if response.status_code == 200:
                ai_response = response.json().get("response", "Error: No response generated.")
                
                # Simulate typing effect
                full_response = ""
                for chunk in ai_response.split():
                    full_response += chunk + " "
                    time.sleep(0.05)
                    message_placeholder.markdown(full_response + "▌")
                
                message_placeholder.markdown(full_response)
                
                # Add assistant response to chat history
                st.session_state.messages.append({"role": "assistant", "content": full_response})
            else:
                error_msg = f"Failed to connect to backend: Status {response.status_code}"
                st.error(error_msg)
        except requests.exceptions.ConnectionError:
            st.error("Could not connect to the FastAPI backend. Make sure it is running on http://localhost:8000")
            message_placeholder.empty()
