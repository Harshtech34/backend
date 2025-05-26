#!/bin/bash

echo "🚀 Starting deployment process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf out
rm -rf node_modules/.cache

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Type checking
echo "🔍 Running type check..."
npm run type-check

# Linting
echo "🔧 Running linter..."
npm run lint

# Build the application
echo "🏗️ Building application..."
npm run build

echo "✅ Deployment preparation complete!"
