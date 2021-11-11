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
    docker-compose build  
    docker-compose up -d    
    docker-compose logs -f
}

_main