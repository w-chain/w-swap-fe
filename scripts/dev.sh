#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ] && [ -f .nvmrc ]; then
  # shellcheck source=/dev/null
  . "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
  WANT="$(tr -d '[:space:]' < .nvmrc)"
  CURRENT="$(node -v | sed 's/^v//' | cut -d. -f1)"
  if [ "$CURRENT" != "$WANT" ]; then
    echo "[dev] Switching to Node $(cat .nvmrc).x per .nvmrc (was Node v${CURRENT})"
    nvm use
  fi
fi

npm run build:sdk
exec npm run start:3002 --workspace=uniswap-2-interface
