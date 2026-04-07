#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"
LOG_DIR="$HOME/Library/Logs/JARVIS/launchd"
PORTS_FILE="$ROOT_DIR/ports.env"

BACKEND_LABEL="com.jarvis.backend"
FRONTEND_LABEL="com.jarvis.frontend"
PM2_LABEL="com.jarvis.pm2"
LEGACY_LABEL="com.jarvis.server"

BACKEND_PLIST="$LAUNCH_AGENTS_DIR/$BACKEND_LABEL.plist"
FRONTEND_PLIST="$LAUNCH_AGENTS_DIR/$FRONTEND_LABEL.plist"
PM2_PLIST="$LAUNCH_AGENTS_DIR/$PM2_LABEL.plist"
LEGACY_PLIST="$LAUNCH_AGENTS_DIR/$LEGACY_LABEL.plist"

PYTHON_BIN="$ROOT_DIR/.venv/bin/python"
NPM_BIN="$(command -v npm || true)"
PM2_BIN="$(command -v pm2 || true)"
PYTHON_REAL_BIN="$($PYTHON_BIN -c 'import os, sys; print(os.path.realpath(sys.executable))' 2>/dev/null || true)"
PYTHON_SITE_PACKAGES="$($PYTHON_BIN -c 'import site; print(site.getsitepackages()[0])' 2>/dev/null || true)"

JARVIS_BACKEND_PORT="8340"
JARVIS_FRONTEND_PORT="5180"

if [[ -f "$PORTS_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$PORTS_FILE"
fi

if [[ ! "$JARVIS_BACKEND_PORT" =~ ^[0-9]+$ ]]; then
  echo "Error: JARVIS_BACKEND_PORT must be numeric in $PORTS_FILE"
  exit 1
fi

if [[ ! "$JARVIS_FRONTEND_PORT" =~ ^[0-9]+$ ]]; then
  echo "Error: JARVIS_FRONTEND_PORT must be numeric in $PORTS_FILE"
  exit 1
fi

if [[ ! -x "$PYTHON_BIN" ]]; then
  echo "Error: Python executable not found at $PYTHON_BIN"
  echo "Create your venv first, then rerun this script."
  exit 1
fi

if [[ -z "$NPM_BIN" ]]; then
  echo "Error: npm was not found in PATH"
  echo "Install Node.js/npm, then rerun this script."
  exit 1
fi

if [[ -z "$PYTHON_REAL_BIN" || ! -x "$PYTHON_REAL_BIN" ]]; then
  echo "Error: Could not resolve a launchd-safe Python executable from $PYTHON_BIN"
  exit 1
fi

if [[ -z "$PYTHON_SITE_PACKAGES" || ! -d "$PYTHON_SITE_PACKAGES" ]]; then
  echo "Error: Could not resolve virtualenv site-packages for $PYTHON_BIN"
  exit 1
fi

mkdir -p "$LAUNCH_AGENTS_DIR" "$LOG_DIR"

PATH_VALUE="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

cat > "$BACKEND_PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$BACKEND_LABEL</string>

  <key>ProgramArguments</key>
  <array>
    <string>$PYTHON_REAL_BIN</string>
    <string>$ROOT_DIR/server.py</string>
  </array>

  <key>WorkingDirectory</key>
  <string>$HOME</string>

  <key>EnvironmentVariables</key>
  <dict>
    <key>HOME</key>
    <string>$HOME</string>
    <key>PATH</key>
    <string>$PATH_VALUE</string>
    <key>PYTHONPATH</key>
    <string>$PYTHON_SITE_PACKAGES:$ROOT_DIR</string>
    <key>PYTHONUNBUFFERED</key>
    <string>1</string>
    <key>JARVIS_BACKEND_PORT</key>
    <string>$JARVIS_BACKEND_PORT</string>
    <key>VIRTUAL_ENV</key>
    <string>$ROOT_DIR/.venv</string>
  </dict>

  <key>RunAtLoad</key>
  <true/>

  <key>KeepAlive</key>
  <true/>

  <key>StandardOutPath</key>
  <string>$LOG_DIR/backend.out.log</string>

  <key>StandardErrorPath</key>
  <string>$LOG_DIR/backend.err.log</string>
</dict>
</plist>
PLIST

cat > "$FRONTEND_PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$FRONTEND_LABEL</string>

  <key>ProgramArguments</key>
  <array>
    <string>$NPM_BIN</string>
    <string>--prefix</string>
    <string>$ROOT_DIR/frontend</string>
    <string>run</string>
    <string>dev</string>
    <string>--</string>
    <string>--host</string>
    <string>0.0.0.0</string>
    <string>--port</string>
    <string>$JARVIS_FRONTEND_PORT</string>
  </array>

  <key>WorkingDirectory</key>
  <string>$HOME</string>

  <key>EnvironmentVariables</key>
  <dict>
    <key>HOME</key>
    <string>$HOME</string>
    <key>PATH</key>
    <string>$PATH_VALUE</string>
  </dict>

  <key>RunAtLoad</key>
  <true/>

  <key>KeepAlive</key>
  <true/>

  <key>StandardOutPath</key>
  <string>$LOG_DIR/frontend.out.log</string>

  <key>StandardErrorPath</key>
  <string>$LOG_DIR/frontend.err.log</string>
</dict>
</plist>
PLIST

if [[ -n "$PM2_BIN" ]]; then
  PM2_TARGET_APPS="calendar-backend,calendar-frontend,todo-backend,tiktok-backend"

  "$PM2_BIN" start "$ROOT_DIR/ecosystem.config.js" --only "$PM2_TARGET_APPS" >/dev/null 2>&1 || true
  "$PM2_BIN" save --force >/dev/null 2>&1 || true

  cat > "$PM2_PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$PM2_LABEL</string>

  <key>ProgramArguments</key>
  <array>
    <string>$PM2_BIN</string>
    <string>resurrect</string>
  </array>

  <key>WorkingDirectory</key>
  <string>$HOME</string>

  <key>EnvironmentVariables</key>
  <dict>
    <key>HOME</key>
    <string>$HOME</string>
    <key>PATH</key>
    <string>$PATH_VALUE</string>
    <key>PM2_HOME</key>
    <string>$HOME/.pm2</string>
  </dict>

  <key>RunAtLoad</key>
  <true/>

  <key>KeepAlive</key>
  <true/>

  <key>StandardOutPath</key>
  <string>$LOG_DIR/pm2.out.log</string>

  <key>StandardErrorPath</key>
  <string>$LOG_DIR/pm2.err.log</string>
</dict>
</plist>
PLIST
fi

USER_DOMAIN="gui/$(id -u)"

launchctl bootout "$USER_DOMAIN/$LEGACY_LABEL" >/dev/null 2>&1 || true
launchctl bootout "$USER_DOMAIN/$BACKEND_LABEL" >/dev/null 2>&1 || true
launchctl bootout "$USER_DOMAIN/$FRONTEND_LABEL" >/dev/null 2>&1 || true
launchctl bootout "$USER_DOMAIN/$PM2_LABEL" >/dev/null 2>&1 || true
launchctl unload "$LEGACY_PLIST" >/dev/null 2>&1 || true
launchctl unload "$BACKEND_PLIST" >/dev/null 2>&1 || true
launchctl unload "$FRONTEND_PLIST" >/dev/null 2>&1 || true
launchctl unload "$PM2_PLIST" >/dev/null 2>&1 || true

rm -f "$LEGACY_PLIST"

launchctl bootstrap "$USER_DOMAIN" "$BACKEND_PLIST" >/dev/null 2>&1 || launchctl load "$BACKEND_PLIST"
launchctl bootstrap "$USER_DOMAIN" "$FRONTEND_PLIST" >/dev/null 2>&1 || launchctl load "$FRONTEND_PLIST"
if [[ -n "$PM2_BIN" && -f "$PM2_PLIST" ]]; then
  launchctl bootstrap "$USER_DOMAIN" "$PM2_PLIST" >/dev/null 2>&1 || launchctl load "$PM2_PLIST"
fi

launchctl enable "$USER_DOMAIN/$BACKEND_LABEL" >/dev/null 2>&1 || true
launchctl enable "$USER_DOMAIN/$FRONTEND_LABEL" >/dev/null 2>&1 || true
if [[ -n "$PM2_BIN" && -f "$PM2_PLIST" ]]; then
  launchctl enable "$USER_DOMAIN/$PM2_LABEL" >/dev/null 2>&1 || true
fi

launchctl kickstart -k "$USER_DOMAIN/$BACKEND_LABEL" >/dev/null 2>&1 || launchctl kickstart -k "$BACKEND_LABEL"
launchctl kickstart -k "$USER_DOMAIN/$FRONTEND_LABEL" >/dev/null 2>&1 || launchctl kickstart -k "$FRONTEND_LABEL"
if [[ -n "$PM2_BIN" && -f "$PM2_PLIST" ]]; then
  launchctl kickstart -k "$USER_DOMAIN/$PM2_LABEL" >/dev/null 2>&1 || launchctl kickstart -k "$PM2_LABEL"
fi

echo "Installed and started LaunchAgents:"
echo "- $BACKEND_LABEL"
echo "- $FRONTEND_LABEL"
if [[ -n "$PM2_BIN" && -f "$PM2_PLIST" ]]; then
  echo "- $PM2_LABEL"
else
  echo "- PM2 LaunchAgent skipped (pm2 not found in PATH)"
fi
echo "Removed legacy LaunchAgent: $LEGACY_LABEL"
echo
echo "Check status:"
echo "  launchctl print $USER_DOMAIN/$BACKEND_LABEL | head -n 40"
echo "  launchctl print $USER_DOMAIN/$FRONTEND_LABEL | head -n 40"
if [[ -n "$PM2_BIN" && -f "$PM2_PLIST" ]]; then
  echo "  launchctl print $USER_DOMAIN/$PM2_LABEL | head -n 40"
fi
echo
echo "Logs:"
echo "  $LOG_DIR/backend.out.log"
echo "  $LOG_DIR/backend.err.log"
echo "  $LOG_DIR/frontend.out.log"
echo "  $LOG_DIR/frontend.err.log"
if [[ -n "$PM2_BIN" && -f "$PM2_PLIST" ]]; then
  echo "  $LOG_DIR/pm2.out.log"
  echo "  $LOG_DIR/pm2.err.log"
fi