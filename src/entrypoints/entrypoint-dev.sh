#!/bin/bash

mkdir -p /be-upp

# backend tasks
cd /be-upp
git clone https://github.com/BE-UPP/be-upp-backend.git
cd /be-upp/be-upp-backend
npm install

# frontend tasks
cd /be-upp
git clone https://github.com/BE-UPP/be-upp-frontend.git
cd be-upp-frontend/frontend
npm install

echo "Container be-upp/dev started"
tail -f /dev/null
