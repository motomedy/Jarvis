"""JARVIS runtime status and launchd-backed recovery helper."""

from __future__ import annotations

import os
import subprocess
import time
from pathlib import Path
from dataclasses import dataclass
from datetime import datetime

import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

RESTART_LOG = "server_restart.log"
MAX_RESTART_ATTEMPTS = 3
RESTART_WAIT_SECONDS = 12
USER_DOMAIN = f"gui/{os.getuid()}"
PORTS_ENV_FILE = Path(__file__).with_name("ports.env")


def _load_ports_env() -> None:
    if not PORTS_ENV_FILE.exists():
        return

    for raw_line in PORTS_ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and value and key not in os.environ:
            os.environ[key] = value


def _env_int(name: str, default: int) -> int:
    raw = os.getenv(name, "").strip()
    if not raw:
        return default
    try:
        return int(raw)
    except ValueError:
        log_alert(f"Invalid {name}={raw!r}; using {default}")
        return default


_load_ports_env()
BACKEND_PORT = _env_int("JARVIS_BACKEND_PORT", 8340)
FRONTEND_PORT = _env_int("JARVIS_FRONTEND_PORT", 5180)
FRONTEND_FALLBACK_PORT = _env_int("JARVIS_FRONTEND_FALLBACK_PORT", 5173)


@dataclass(frozen=True)
class Service:
    name: str
    process_pattern: str
    urls: list[str]
    label: str
    plist_path: str


BACKEND = Service(
    name="Backend",
    process_pattern="server.py",
    urls=[
        f"https://localhost:{BACKEND_PORT}/api/health",
        f"http://localhost:{BACKEND_PORT}/api/health",
    ],
    label="com.jarvis.backend",
    plist_path=os.path.expanduser("~/Library/LaunchAgents/com.jarvis.backend.plist"),
)

_frontend_urls = [f"http://localhost:{FRONTEND_PORT}"]
if FRONTEND_FALLBACK_PORT != FRONTEND_PORT:
    _frontend_urls.append(f"http://localhost:{FRONTEND_FALLBACK_PORT}")

FRONTEND = Service(
    name="Frontend",
    process_pattern="vite|npm run dev|node.*vite",
    urls=_frontend_urls,
    label="com.jarvis.frontend",
    plist_path=os.path.expanduser("~/Library/LaunchAgents/com.jarvis.frontend.plist"),
)


def run_command(args: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, capture_output=True, text=True)


def check_process(pattern: str) -> bool:
    try:
        result = run_command(["pgrep", "-fl", pattern])
        return result.returncode == 0 and result.stdout.strip() != ""
    except Exception:
        return False


def check_url(url: str) -> bool:
    try:
        resp = requests.get(url, timeout=3, verify=False)
        return resp.status_code == 200
    except Exception:
        return False


def first_responsive(urls: list[str]) -> str | None:
    for url in urls:
        if check_url(url):
            return url
    return None


def log_alert(message: str) -> None:
    with open(RESTART_LOG, "a", encoding="utf-8") as handle:
        handle.write(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {message}\n")
    print(f"ALERT: {message}")


def launchctl_target(label: str) -> str:
    return f"{USER_DOMAIN}/{label}"


def ensure_loaded(service: Service) -> bool:
    target = launchctl_target(service.label)

    if not os.path.exists(service.plist_path):
        log_alert(f"{service.name} plist missing: {service.plist_path}")
        return False

    print(f"Recycling LaunchAgent for {service.name.lower()} via {target}...")
    run_command(["launchctl", "bootout", target])

    bootstrap = run_command(["launchctl", "bootstrap", USER_DOMAIN, service.plist_path])
    if bootstrap.returncode != 0 and "already bootstrapped" not in bootstrap.stderr.lower():
        # launchctl domain commands can fail in some sessions; fallback to load/unload path.
        unload = run_command(["launchctl", "unload", service.plist_path])
        load = run_command(["launchctl", "load", service.plist_path])
        if load.returncode != 0:
            log_alert(
                f"{service.name} bootstrap failed ({bootstrap.stderr.strip() or bootstrap.stdout.strip()}); "
                f"fallback load failed ({load.stderr.strip() or load.stdout.strip()})"
            )
            return False

    enable = run_command(["launchctl", "enable", target])
    if enable.returncode != 0:
        print(f"Warning: enable failed for {service.name.lower()}: {enable.stderr.strip() or enable.stdout.strip()}")

    kickstart = run_command(["launchctl", "kickstart", "-k", target])
    if kickstart.returncode != 0:
        # Fallback to label-only kickstart for sessions where explicit domain target fails.
        kickstart = run_command(["launchctl", "kickstart", "-k", service.label])
        if kickstart.returncode != 0:
            log_alert(f"{service.name} kickstart failed: {kickstart.stderr.strip() or kickstart.stdout.strip()}")
            return False

    deadline = time.time() + RESTART_WAIT_SECONDS
    while time.time() < deadline:
        if first_responsive(service.urls):
            return True
        time.sleep(1)

    return False


def restart_service(service: Service) -> bool:
    for attempt in range(1, MAX_RESTART_ATTEMPTS + 1):
        print(f"Attempting to restart {service.name.lower()} (attempt {attempt})...")
        if ensure_loaded(service):
            live_url = first_responsive(service.urls)
            print(f"{service.name} recovered on {live_url}.")
            return True
        log_alert(f"{service.name} restart attempt {attempt} failed.")
    log_alert(f"{service.name} could not be restarted after multiple attempts!")
    return False


def report_service(service: Service) -> tuple[bool, bool, str | None]:
    process_running = check_process(service.process_pattern)
    live_url = first_responsive(service.urls)
    reachable = live_url is not None
    print(f"{service.name}: {'RUNNING' if process_running else 'NOT RUNNING'}")
    print(f"{service.name} URL: {live_url or 'NO RESPONSE'}")
    return process_running, reachable, live_url


def main() -> None:
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n--- JARVIS Server Status Report: {now} ---")

    backend_running, backend_ok, _ = report_service(BACKEND)
    frontend_running, frontend_ok, _ = report_service(FRONTEND)

    if not backend_running or not backend_ok:
        restart_service(BACKEND)

    if not frontend_running or not frontend_ok:
        restart_service(FRONTEND)

    print("--- End of Report ---\n")

if __name__ == "__main__":
    main()
