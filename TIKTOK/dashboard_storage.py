"""
Persistent storage for video ideas using a JSON file.
"""
import json
import os

STORAGE_FILE = 'video_ideas.json'

def load_ideas():
    if not os.path.exists(STORAGE_FILE):
        return []
    with open(STORAGE_FILE, 'r') as f:
        return json.load(f)

def save_ideas(ideas):
    with open(STORAGE_FILE, 'w') as f:
        json.dump(ideas, f, indent=2)
