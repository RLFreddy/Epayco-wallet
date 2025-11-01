#!/bin/sh
set -e

echo "Running migrations..."
pnpm migration:run

echo "Starting application..."
pnpm start:prod