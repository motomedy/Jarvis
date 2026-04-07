"""
JARVIS Save Agent — Pre-Restart Safety

Checks for uncommitted changes, critical files, and offers a backup before restart.
"""
import os
import subprocess
from pathlib import Path
import shutil
from datetime import datetime

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


def _run_git(args: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(["git", *args], capture_output=True, text=True)


def _get_changed_files() -> list[str]:
    result = _run_git(["status", "--porcelain"])
    if result.returncode != 0:
        return []
    files: list[str] = []
    for line in result.stdout.splitlines():
        if not line.strip():
            continue
        # Porcelain format: XY <path>
        path = line[3:].strip()
        if path:
            files.append(path)
    return files


def generate_commit_message(changed_files: list[str]) -> str:
    if not changed_files:
        return "chore: auto-save workspace"

    buckets = {
        "frontend": 0,
        "backend": 0,
        "config": 0,
        "docs": 0,
        "tests": 0,
        "other": 0,
    }
    for path in changed_files:
        normalized = path.lower()
        if normalized.startswith("frontend/"):
            buckets["frontend"] += 1
        elif normalized.startswith("tests/"):
            buckets["tests"] += 1
        elif normalized.endswith(".md"):
            buckets["docs"] += 1
        elif normalized.endswith((".yml", ".yaml", ".json", ".toml", ".ini")) or normalized in {"requirements.txt", ".env.example"}:
            buckets["config"] += 1
        elif normalized.endswith(".py"):
            buckets["backend"] += 1
        else:
            buckets["other"] += 1

    dominant = max(buckets, key=buckets.get)
    prefix = {
        "frontend": "feat(ui)",
        "backend": "feat(server)",
        "config": "chore(config)",
        "docs": "docs",
        "tests": "test",
        "other": "chore",
    }[dominant]

    short_list = ", ".join(changed_files[:3])
    if len(changed_files) > 3:
        short_list += f", +{len(changed_files) - 3} more"

    stamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    return f"{prefix}: auto-save updates ({stamp}) [{short_list}]"


def auto_commit(dry_run: bool = False) -> str:
    status = _run_git(["status", "--porcelain"])
    if status.returncode != 0:
        return "✗ Auto-commit skipped: not a git repository or git unavailable."

    changed_files = _get_changed_files()
    if not changed_files:
        return "✔ Auto-commit skipped: no changes to commit."

    message = generate_commit_message(changed_files)
    if dry_run:
        return f"[DRY-RUN] Would commit {len(changed_files)} file(s) with message:\n{message}"

    add = _run_git(["add", "-A"])
    if add.returncode != 0:
        return f"✗ Auto-commit failed during git add: {add.stderr.strip() or add.stdout.strip()}"

    commit = _run_git(["commit", "-m", message])
    if commit.returncode != 0:
        # Non-zero could happen if nothing staged after add due to ignore rules.
        output = (commit.stderr or commit.stdout).strip()
        return f"✗ Auto-commit failed: {output or 'unknown git commit error'}"

    return f"✔ Auto-commit complete: {message}"

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

import argparse

COUNTER_FILE = Path.home() / ".jarvis_save_counter"

def get_and_increment_counter():
    count = 0
    if COUNTER_FILE.exists():
        try:
            count = int(COUNTER_FILE.read_text().strip())
        except Exception:
            count = 0
    count += 1
    COUNTER_FILE.write_text(str(count))
    return count

def reset_counter():
    COUNTER_FILE.write_text("0")

def main():
    parser = argparse.ArgumentParser(description="JARVIS Save Agent")
    parser.add_argument("--auto", action="store_true", help="Run in non-interactive auto mode (every 20th run)")
    parser.add_argument("--auto-commit", action="store_true", help="Automatically commit all git changes with a generated message")
    parser.add_argument("--dry-run", action="store_true", help="Preview generated auto-commit message without creating a commit")
    args = parser.parse_args()

    print("\nJARVIS Save Agent — Pre-Restart Checklist\n" + "-"*40)
    print(check_git_status())
    print(check_critical_files())

    if args.auto:
        if args.auto_commit:
            print(auto_commit(dry_run=args.dry_run))

        # Use a counter to only run backup every 20th call
        count = get_and_increment_counter()
        if count % 20 == 0:
            print("[AUTO] 20th run: Performing backup.")
            print(backup_files())
            reset_counter()
        else:
            print(f"[AUTO] Run {count} — backup not triggered.")
        print("[AUTO] Ready for safe restart!\n")
        return

    do_backup = input("Backup critical files to ~/JARVIS_BACKUPS? (y/n): ").strip().lower()
    if do_backup == "y":
        print(backup_files())

    if args.auto_commit:
        print(auto_commit(dry_run=args.dry_run))

    print("\nReady for safe restart!\n")

if __name__ == "__main__":
    main()
