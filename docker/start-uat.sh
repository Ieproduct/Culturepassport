#!/bin/bash
# Start CulturePassport UAT environment
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "Starting CulturePassport UAT environment..."
docker compose -f docker-compose.yml -f docker-compose.uat.yml --env-file .env.uat -p cp-uat up -d --build

echo ""
echo "UAT environment is running:"
echo "  Backend API:    http://localhost:9000/api"
echo "  PostgreSQL:     localhost:5441"
echo "  MinIO Console:  http://localhost:9021"
echo "  MinIO API:      http://localhost:9020"
