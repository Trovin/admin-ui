#!/usr/bin/env sh

# Go to Application folder
cd client

# Install dependencies
if [ -d "node_modules" ]; then
  rm -rf node_modules
fi
npm i

# Build/Run Admin UI
npm run proxy

# Build/Run Admin API Server
npm run galaxy-ui-dev
