#!/bin/bash
DIR=build
rm -rf $DIR

mkdir $DIR

cp -r node_modules $DIR
cp -r prod $DIR
cp -r src $DIR
cp package.json $DIR
cp docker-compose.yml $DIR
