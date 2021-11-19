#!/bin/bash

echo "[BE-UPP][INFO ] Container be-upp-app started"

# get source files
mkdir -p /be-upp && cd /be-upp
git clone https://github.com/BE-UPP/be-upp-frontend.git app && cd app/frontend

if test -f "/be-upp/app/frontend/.env"; then
    rm /be-upp/app/frontend/.env
fi

# install project dependencies
npm install

# start app
npm start

tail -f /dev/null