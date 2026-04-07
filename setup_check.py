"""
JARVIS Setup Check Agent

Checks for all critical files and setup steps required for auto-launch and recovery.
"""
import os
from pathlib import Path
import sys

REQUIRED_FILES = [
    (".env", "Environment variables file"),
    ("requirements.txt", "Python dependencies"),
    ("frontend/package.json", "Frontend dependencies"),
    ("frontend/package-lock.json", "Frontend lock file (npm)"),
    ("key.pem", "SSL private key"),
    ("cert.pem", "SSL certificate"),
    ("README.md", "Project documentation"),
]

LAUNCH_AGENTS = [
    os.path.expanduser("~/Library/LaunchAgents/com.jarvis.backend.plist"),
    os.path.expanduser("~/Library/LaunchAgents/com.jarvis.frontend.plist"),
    os.path.expanduser("~/Library/LaunchAgents/com.jarvis.pm2.plist"),
]


def check_file(path, description):
    if Path(path).exists():
        return f"✔ {description}: {path}"
    else:
        return f"✗ MISSING: {description}: {path}"

def check_git():
    if Path(".git").exists():
        return "✔ Git repository initialized"
    else:
        return "✗ MISSING: .git repository"

def check_launch_agents():
    statuses = []
    for agent in LAUNCH_AGENTS:
        if Path(agent).exists():
            statuses.append(f"✔ Launch agent present: {agent}")
        else:
            statuses.append(f"✗ MISSING: Launch agent plist at {agent}")
    return statuses

def main():
    print("JARVIS Setup Check Results:\n")
    for path, desc in REQUIRED_FILES:
        print(check_file(path, desc))
    print(check_git())
    for line in check_launch_agents():
        print(line)
    print("\nNext steps:")
    print("- Fill in .env with your API keys if not done.")
    print("- Run 'pip install -r requirements.txt' and 'npm install' in frontend/ if needed.")
    print("- Generate SSL certs if missing: openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes -subj '/CN=localhost'")
    print("- Install LaunchAgents for auto-start: ./scripts/install_autostart.sh")
    print("- Commit your work to git for backup.")

if __name__ == "__main__":
    main()
