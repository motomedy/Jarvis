"""
Agent: VideoCreator
Purpose: Assist in creating TikTok videos based on the 30-day video ideas plan.
"""


import threading
import time
import json
import os

CREATED_VIDEOS_FILE = "created_videos.json"

def log_created_video(idea):
    videos = []
    if os.path.exists(CREATED_VIDEOS_FILE):
        with open(CREATED_VIDEOS_FILE, "r") as f:
            try:
                videos = json.load(f)
            except Exception:
                videos = []
    videos.append({"idea": idea, "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")})
    with open(CREATED_VIDEOS_FILE, "w") as f:
        json.dump(videos, f, indent=2)

def create_video_from_idea(idea: str):
    print(f"[Background] Creating video for idea: {idea}")
    # Simulate video creation
    time.sleep(3)  # Simulate processing time
    log_created_video(idea)
    print(f"[Background] Video created for idea: {idea}")

def create_video_background(idea: str):
    thread = threading.Thread(target=create_video_from_idea, args=(idea,))
    thread.daemon = True
    thread.start()
    print("Video creation started in the background.")

if __name__ == "__main__":
    idea = input("Enter the video idea to create: ")
    create_video_background(idea)
