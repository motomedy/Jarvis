#!/bin/zsh

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORTS_FILE="$ROOT_DIR/ports.env"

JARVIS_FRONTEND_PORT="5180"

if [[ -f "$PORTS_FILE" ]]; then
	source "$PORTS_FILE"
fi

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export HOME="$HOME"

cd "$ROOT_DIR/frontend"
exec npm run dev -- --host 0.0.0.0 --port "$JARVIS_FRONTEND_PORT"
