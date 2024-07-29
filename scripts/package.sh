#!/bin/bash

export LANG=en_US.UTF-8
set -e

BASE_DIR=`dirname $0`
echo "$BASEDIR"
ROOT_DIR=$BASE_DIR/..
ZIP_FILE_NAME=print-forms

mkdir -p $ROOT_DIR/target
rm -rf $ROOT_DIR/target/${ZIP_FILE_NAME}*.zip

cd $ROOT_DIR
npm install
ng build

cd dist && zip -r ../target/${ZIP_FILE_NAME}.zip *
