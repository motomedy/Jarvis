#!/bin/bash
# One-time setup — runs when the dev container is first created (or rebuilt).
set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "🔧 Setting up JARVIS..."

# ── .env ────────────────────────────────────────────────────────────────────
if [ ! -f "$REPO_DIR/.env" ]; then
    cp "$REPO_DIR/.env.example" "$REPO_DIR/.env"
    echo "✅ Created .env from .env.example (edit it to add your Fish Audio key)"
else
    echo "✅ .env already exists"
fi

# ── Python virtualenv + dependencies ────────────────────────────────────────
cd "$REPO_DIR"
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi
source .venv/bin/activate
pip install --quiet -r requirements.txt
echo "✅ Python dependencies installed"

# ── Frontend dependencies ────────────────────────────────────────────────────
cd "$REPO_DIR/frontend"
npm install --silent
echo "✅ Frontend dependencies installed"

# ── Ollama ───────────────────────────────────────────────────────────────────
if ! command -v ollama &>/dev/null; then
    echo "📦 Installing Ollama..."
    sudo apt-get install -y zstd -q
    curl -fsSL https://ollama.com/install.sh | sh
    echo "✅ Ollama installed"
fi

# Pull model defined in .env (defaults to qwen2:0.5b)
OLLAMA_MODEL=$(grep "^OLLAMA_MODEL=" "$REPO_DIR/.env" 2>/dev/null | cut -d= -f2 | tr -d '"' || echo "")
OLLAMA_MODEL="${OLLAMA_MODEL:-qwen2:0.5b}"

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

echo ""
echo "✅ JARVIS setup complete!"
echo "   → Optional: edit .env to add your Fish Audio key for voice TTS"
echo "   → Run 'bash start.sh' to launch (or just reopen the container)"
