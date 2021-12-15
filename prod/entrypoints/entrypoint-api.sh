#!/bin/bash

echo "[BE-UPP][INFO ] Container be-upp-api started"

# get source files
mkdir -p /be-upp && cd /be-upp
git clone https://github.com/BE-UPP/be-upp-backend.git api && cd api
git checkout "develop"

# install project dependencies
npm install

# start api
if [ $REACT_APP_API_DOMAIN == localhost ]; then
    npm run swagger-autogen
else
    npm run start:dev --prefix $PWD
fi

# lock container
tail -f /dev/null