"""
JARVIS Save Agent — Pre-Restart Safety

Checks for uncommitted changes, critical files, and offers a backup before restart.
"""
import os
import subprocess
from pathlib import Path
import shutil

CRITICAL_FILES = [
    ".env",
    "requirements.txt",
    "cert.pem",
    "key.pem",
    "README.md",
    "frontend/package.json",
    "frontend/package-lock.json",
    "frontend/vite.config.ts",
    "frontend/tsconfig.json",
]

BACKUP_DIR = Path.home() / "JARVIS_BACKUPS"


def check_git_status():
    try:
        result = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if result.returncode != 0:
            return "✗ Not a git repository or git not installed."
        if result.stdout.strip():
            return "⚠️  You have uncommitted changes! Please commit or stash before restart."
        return "✔ All changes committed."
    except Exception as e:
        return f"✗ Git check failed: {e}"

def check_critical_files():
    missing = []
    for f in CRITICAL_FILES:
        if not Path(f).exists():
            missing.append(f)
    if missing:
        return f"✗ Missing critical files: {', '.join(missing)}"
    return "✔ All critical files present."

def backup_files():
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    for f in CRITICAL_FILES:
        src = Path(f)
        if src.exists():
            dest = BACKUP_DIR / src.name
            shutil.copy2(src, dest)
    return f"✔ Backup complete: {BACKUP_DIR}"

def main():
    print("\nJARVIS Save Agent — Pre-Restart Checklist\n" + "-"*40)
    print(check_git_status())
    print(check_critical_files())
    do_backup = input("Backup critical files to ~/JARVIS_BACKUPS? (y/n): ").strip().lower()
    if do_backup == "y":
        print(backup_files())
    print("\nReady for safe restart!\n")

if __name__ == "__main__":
    main()
