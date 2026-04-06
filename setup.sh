#!/bin/bash
# One-time setup — runs when the dev container is first created (or rebuilt).
set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "🔧 Setting up JARVIS..."

# Python virtual environment + dependencies
cd "$REPO_DIR"
python3 -m venv .venv
source .venv/bin/activate
pip install --quiet -r requirements.txt
echo "✅ Python dependencies installed"

# Frontend dependencies
cd "$REPO_DIR/frontend"
npm install --silent
echo "✅ Frontend dependencies installed"

# Ollama
if ! command -v ollama &>/dev/null; then
    echo "📦 Installing Ollama..."
    sudo apt-get install -y zstd -q
    curl -fsSL https://ollama.com/install.sh | sh
    echo "✅ Ollama installed"
fi

# Pull model (reads OLLAMA_MODEL from .env, defaults to qwen2:0.5b)
OLLAMA_MODEL=$(grep "^OLLAMA_MODEL=" "$REPO_DIR/.env" 2>/dev/null | cut -d= -f2 | tr -d '"' || echo "qwen2:0.5b")
OLLAMA_MODEL="${OLLAMA_MODEL:-qwen2:0.5b}"

# Start ollama temporarily to pull the model
ollama serve &>/tmp/ollama-setup.log &
OLLAMA_PID=$!
sleep 3

if ! ollama list 2>/dev/null | grep -q "$OLLAMA_MODEL"; then
    echo "📥 Pulling model: $OLLAMA_MODEL"
    ollama pull "$OLLAMA_MODEL"
    echo "✅ Model $OLLAMA_MODEL ready"
else
    echo "✅ Model $OLLAMA_MODEL already present"
fi

kill $OLLAMA_PID 2>/dev/null || true

echo "✅ JARVIS setup complete — run 'bash start.sh' to launch"
