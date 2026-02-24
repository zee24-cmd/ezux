#!/bin/bash
set -e

echo "🚀 Starting ezux-showcase with LOCAL ezux source..."
echo "   (ezux imports will resolve from ../ezux/src via Vite alias)"
echo ""

cd /Users/zed/Documents/ezux-showcase
EZUX_LOCAL=true npm run dev
