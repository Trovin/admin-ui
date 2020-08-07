#!/usr/bin/env sh

# Go to root application folder
cd client

# Install dependencies
if [ -d "node_modules" ]; then
  rm -rf node_modules
fi
npm i

# Build Application
npm run production
