#!/bin/bash
# Start CulturePassport DEV environment
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "Starting CulturePassport DEV environment..."
docker compose -f docker-compose.yml -f docker-compose.dev.yml --env-file .env.dev -p cp-dev up -d --build

echo ""
echo "DEV environment is running:"
echo "  Backend API:    http://localhost:8000/api"
echo "  PostgreSQL:     localhost:5440"
echo "  MinIO Console:  http://localhost:9011"
echo "  MinIO API:      http://localhost:9010"
