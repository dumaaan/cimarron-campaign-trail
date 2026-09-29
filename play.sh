#!/usr/bin/env bash
# Start the local server and open the game in the default browser.
# Usage: ./play.sh [port]
set -euo pipefail
cd "$(dirname "$0")"
PORT="${1:-8765}"
( sleep 1 && open "http://localhost:${PORT}" 2>/dev/null || xdg-open "http://localhost:${PORT}" 2>/dev/null || true ) &
exec python3 serve.py "$PORT"
