#!/bin/bash
set -e

echo "🔨 Building ezux package..."
cd /Users/zed/Documents/ezux/packages/ezux
npm run build

echo "📦 Pushing to yalc..."
yalc push

echo "🚀 Starting showcase dev server..."
cd /Users/zed/Documents/ezux-showcase
npm run dev
