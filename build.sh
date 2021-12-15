#!/bin/bash
DIR=build
rm -rf $DIR

cp -r . ../$DIR
mv ../$DIR $DIR