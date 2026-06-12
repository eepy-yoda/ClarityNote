import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "mistral"

def clean_and_structure_text(raw_text: str) -> str:
    """
    Cleans raw OCR text using a local LLM (Ollama).
    """
    prompt = f"""
Rewrite the following handwritten notes into a clean and structured format.
Keep the same meaning but:
- correct grammar
- organize into paragraphs
- add a clear title
- make it easy to read for a student

Text:
{raw_text}
"""

    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()
        return result.get("response", "Could not process text.")
    except Exception as e:
        print(f"Error calling Ollama: {e}")
        return raw_text # Fallback to raw text if AI fails
