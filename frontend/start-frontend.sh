#!/bin/zsh

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export HOME="$HOME"

cd "$ROOT_DIR/frontend"
exec npm run dev -- --host 0.0.0.0 --port 5180
