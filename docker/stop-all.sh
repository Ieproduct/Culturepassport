#!/bin/bash
# Stop all CulturePassport environments
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "Stopping CulturePassport DEV environment..."
docker compose -f docker-compose.yml -f docker-compose.dev.yml --env-file .env.dev -p cp-dev down 2>/dev/null || true

echo "Stopping CulturePassport UAT environment..."
docker compose -f docker-compose.yml -f docker-compose.uat.yml --env-file .env.uat -p cp-uat down 2>/dev/null || true

echo ""
echo "All environments stopped."
