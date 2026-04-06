"""
TikTok API Integration: Handles authentication and video upload for automated posting (with PKCE).
"""
import os
import requests
import base64
import hashlib
import secrets

# Placeholder for TikTok API credentials (to be filled after developer registration)
TIKTOK_CLIENT_KEY = os.environ.get("TIKTOK_CLIENT_KEY", "")
TIKTOK_CLIENT_SECRET = os.environ.get("TIKTOK_CLIENT_SECRET", "")
TIKTOK_ACCESS_TOKEN = os.environ.get("TIKTOK_ACCESS_TOKEN", "")
TIKTOK_REFRESH_TOKEN = os.environ.get("TIKTOK_REFRESH_TOKEN", "")

API_BASE = "https://open-api.tiktok.com/"
DISPLAY_API_BASE = "https://open.tiktokapis.com/v2/"

# PKCE helpers
def generate_code_verifier():
    return base64.urlsafe_b64encode(secrets.token_bytes(32)).rstrip(b'=').decode('utf-8')

def generate_code_challenge(verifier):
    digest = hashlib.sha256(verifier.encode('utf-8')).digest()
    return base64.urlsafe_b64encode(digest).rstrip(b'=').decode('utf-8')

# Store code_verifier in memory (for demo; use a persistent store in production)
_last_code_verifier = None

def get_auth_url(redirect_uri: str, state: str = "state123"):
    """
    Generate TikTok OAuth2 authorization URL for user login and consent, using PKCE.
    Returns the URL and stores the code_verifier for later use.
    """
    global _last_code_verifier
    code_verifier = generate_code_verifier()
    code_challenge = generate_code_challenge(code_verifier)
    _last_code_verifier = code_verifier
    # Updated scopes for Display API
    url = (
        f"https://www.tiktok.com/v2/auth/authorize/?client_key={TIKTOK_CLIENT_KEY}"
        f"&response_type=code&scope=user.info.basic,video.list"
        f"&redirect_uri={redirect_uri}&state={state}"
        f"&code_challenge={code_challenge}&code_challenge_method=S256"
    )
    return url

def get_last_code_verifier():
    return _last_code_verifier

def exchange_code_for_token(auth_code: str, redirect_uri: str, code_verifier: str = None):
    """
    Exchange authorization code for access and refresh tokens (PKCE).
    """
    url = f"{API_BASE}oauth/access_token/"
    if code_verifier is None:
        code_verifier = get_last_code_verifier()
    data = {
        "client_key": TIKTOK_CLIENT_KEY,
        "client_secret": TIKTOK_CLIENT_SECRET,
        "code": auth_code,
        "grant_type": "authorization_code",
        "redirect_uri": redirect_uri,
        "code_verifier": code_verifier,
    }
    resp = requests.post(url, data=data)
    return resp.json()

def upload_video(video_path: str, access_token: str, open_id: str, title: str = ""):
    """
    Upload a video to TikTok using the Content Posting API.
    """
    url = f"{API_BASE}share/video/upload/"
    files = {"video": open(video_path, "rb")}
    data = {
        "access_token": access_token,
        "open_id": open_id,
        "title": title,
    }
    resp = requests.post(url, data=data, files=files)
    return resp.json()

# --- TikTok Display API: Fetch user profile ---
def get_user_profile(access_token: str):
    url = f"{DISPLAY_API_BASE}user/info/?fields=open_id,union_id,avatar_url,display_name"
    headers = {"Authorization": f"Bearer {access_token}"}
    resp = requests.get(url, headers=headers)
    return resp.json()

# --- TikTok Display API: Fetch user videos ---
def get_user_videos(access_token: str, max_count: int = 20):
    url = f"{DISPLAY_API_BASE}video/list/?fields=id,title,video_description,duration,cover_image_url,embed_link"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    data = {"max_count": max_count}
    resp = requests.post(url, headers=headers, json=data)
    return resp.json()

# Usage:
# 1. Register your app at https://developers.tiktok.com/
# 2. Set your client key/secret in environment variables.
# 3. Use get_auth_url() to get the login link, complete OAuth, and save tokens.
# 4. Use get_user_profile() and get_user_videos() to display user data.
# 5. Use upload_video() to post content programmatically (if you have Content Posting API access).
