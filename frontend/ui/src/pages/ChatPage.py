from flask import Flask, request, jsonify
from flask_cors import CORS  # Import flask-cors
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/ai_chat', methods=['POST'])
def ai_chat():
    data = request.get_json()
    prompt = data.get("prompt")
    
    if not prompt:
        return jsonify({"error": "Prompt missing"}), 400

    payload = {
        "model": "cooker",
        "prompt": prompt,
        "stream": False
    }
    headers = {
        "Content-Type": "application/json"
    }

    try:
        ollama_response = requests.post("http://localhost:11434/api/generate", json=payload, headers=headers)
        ollama_response.raise_for_status()
        result = ollama_response.json()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5003, debug=True)
