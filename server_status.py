"""
JARVIS Server Status Agent

Checks if backend (server.py) and frontend (Vite) are running, and reports status.
"""

import subprocess
import time
from datetime import datetime
import requests
import os

BACKEND_PROCESS = "server.py"
FRONTEND_PROCESS = "vite"
BACKEND_URLS = ["https://localhost:8340/api/health", "http://localhost:8340/api/health"]
FRONTEND_URLS = ["http://localhost:5180", "http://localhost:5173"]
RESTART_LOG = "server_restart.log"
MAX_RESTART_ATTEMPTS = 3


def check_process(name):
    try:
        result = subprocess.run(["pgrep", "-fl", name], capture_output=True, text=True)
        return result.stdout.strip() != ""
    except Exception:
        return False

def check_url(url):
    try:
        resp = requests.get(url, timeout=3, verify=False)
        return resp.status_code == 200
    except Exception:
        return False

def first_responsive(urls):
    for url in urls:
        if check_url(url):
            return url
    return None

def restart_backend():
    # Try to start backend using launchctl
    try:
        subprocess.run(["launchctl", "unload", os.path.expanduser("~/Library/LaunchAgents/com.jarvis.server.plist")], capture_output=True)
        subprocess.run(["launchctl", "load", os.path.expanduser("~/Library/LaunchAgents/com.jarvis.server.plist")], capture_output=True)
        time.sleep(3)
        return check_process(BACKEND_PROCESS)
    except Exception as e:
        return False

def restart_frontend():
    try:
        subprocess.run(["launchctl", "unload", os.path.expanduser("~/Library/LaunchAgents/com.jarvis.frontend.plist")], capture_output=True)
        subprocess.run(["launchctl", "load", os.path.expanduser("~/Library/LaunchAgents/com.jarvis.frontend.plist")], capture_output=True)
        time.sleep(3)
        return check_process(FRONTEND_PROCESS)
    except Exception as e:
        return False

def log_alert(message):
    with open(RESTART_LOG, "a") as f:
        f.write(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {message}\n")
    print(f"ALERT: {message}")

def main():
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n--- JARVIS Server Status Report: {now} ---")
    backend_running = check_process(BACKEND_PROCESS)
    frontend_running = check_process(FRONTEND_PROCESS)
    print(f"Backend (server.py): {'RUNNING' if backend_running else 'NOT RUNNING'}")
    print(f"Frontend (Vite): {'RUNNING' if frontend_running else 'NOT RUNNING'}")
    backend_live_url = first_responsive(BACKEND_URLS) if backend_running else None
    frontend_live_url = first_responsive(FRONTEND_URLS) if frontend_running else None
    backend_ok = backend_live_url is not None
    frontend_ok = frontend_live_url is not None
    print(f"Backend API: {'RESPONSIVE' if backend_ok else 'NO RESPONSE'}")
    print(f"Frontend UI: {'RESPONSIVE' if frontend_ok else 'NO RESPONSE'}")
    if backend_live_url:
        print(f"Backend URL: {backend_live_url}")
    if frontend_live_url:
        print(f"Frontend URL: {frontend_live_url}")

    # Auto-restart logic
    if not backend_running:
        print("Attempting to restart backend...")
        for attempt in range(1, MAX_RESTART_ATTEMPTS+1):
            if restart_backend():
                print(f"Backend restarted successfully (attempt {attempt}).")
                break
            else:
                log_alert(f"Backend restart attempt {attempt} failed.")
        else:
            log_alert("Backend could not be restarted after multiple attempts!")

    if not frontend_running:
        print("Attempting to restart frontend...")
        for attempt in range(1, MAX_RESTART_ATTEMPTS+1):
            if restart_frontend():
                print(f"Frontend restarted successfully (attempt {attempt}).")
                break
            else:
                log_alert(f"Frontend restart attempt {attempt} failed.")
        else:
            log_alert("Frontend could not be restarted after multiple attempts!")

    print("--- End of Report ---\n")

if __name__ == "__main__":
    main()
