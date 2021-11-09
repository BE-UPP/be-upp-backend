#!/bin/bash 

function _main 
{
    path=$(pwd)
    env_file_path=${path}/.env

    if [ ! -f "${env_file_path}" ]; then
        cp ${path}/.env-example .env
    fi

    sed -i 's/\r$//' $env_file_path
    source $env_file_path

    docker-compose stop

    image_name="be-upp/mongo:latest"
    if [[ "$(docker images -q $image_name 2> /dev/null)" == "" ]]; then
        docker-compose build mongo
    fi 

    image_name="be-upp/mongo-express:latest"
    if [[ "$(docker images -q $image_name 2> /dev/null)" == "" ]]; then
        docker-compose build mongo-express
    fi 

    docker-compose up -d mongo 
    docker-compose up -d mongo-express
    npm install
    npm run start:dev --prefix ${path}
    docker-compose logs -f
}

_main