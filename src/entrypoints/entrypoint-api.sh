#!/bin/bash

echo "[BE-UPP][INFO ] Container be-upp-api started"

# get source files
mkdir -p /be-upp && cd /be-upp
git clone https://github.com/BE-UPP/be-upp-backend.git api && cd api

# install project dependencies
npm install

# start api
npm run start:dev --prefix /be-upp/api
