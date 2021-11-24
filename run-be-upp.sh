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

    docker-compose down

    image_name="be-upp/mongo:latest"
    if [[ "$(docker images -q $image_name 2> /dev/null)" == "" ]]; then
        docker-compose build mongo
    fi

    image_name="be-upp/mongo-express:latest"
    if [[ "$(docker images -q $image_name 2> /dev/null)" == "" ]]; then
        docker-compose build mongo-express
    fi

    image_name="be-upp/api:latest"
    if [[ "$(docker images -q $image_name 2> /dev/null)" == "" ]]; then
        docker-compose build api
    fi

    image_name="be-upp/app:latest"
    if [[ "$(docker images -q $image_name 2> /dev/null)" == "" ]]; then
        docker-compose build app
    fi

    docker-compose up -d
    docker-compose logs -f api app
}

_main