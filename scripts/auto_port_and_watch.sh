#!/bin/bash
# Auto-assign free port, update config, and keep project online with auto-restart and bug fix
# Usage: ./auto_port_and_watch.sh <project_dir> <vite_config> <npm_script>

PROJECT_DIR="$1"
VITE_CONFIG="$2"
NPM_SCRIPT="$3"
DEFAULT_PORT=5180
MAX_PORT=5300

find_free_port() {
  local port=$DEFAULT_PORT
  while [ $port -le $MAX_PORT ]; do
    if ! lsof -i :$port >/dev/null 2>&1; then
      echo $port
      return
    fi
    port=$((port+1))
  done
  echo "No free port found in range $DEFAULT_PORT-$MAX_PORT" >&2
  exit 1
}

update_vite_config() {
  local port=$1
  sed -i '' -E "s/(port: )[0-9]+/\1$port/" "$VITE_CONFIG"
}

start_and_watch() {
  local port=$1
  cd "$PROJECT_DIR"
  while true; do
    echo "Starting $PROJECT_DIR on port $port..."
    npm run "$NPM_SCRIPT" -- --port $port &
    PID=$!
    sleep 5
    if ! lsof -i :$port >/dev/null 2>&1; then
      echo "Port $port not in use, trying next free port..."
      kill $PID 2>/dev/null
      port=$(find_free_port)
      update_vite_config $port
      continue
    fi
    wait $PID
    echo "$PROJECT_DIR crashed. Restarting in 3s..."
    sleep 3
  done
}

main() {
  port=$(find_free_port)
  update_vite_config $port
  start_and_watch $port
}

main "$@"
