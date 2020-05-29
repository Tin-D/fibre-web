#!/bin/bash

publish_dir=/usr/share/jy/www


echo 'update project ...'
git pull

echo 'build project ...'
yarn run build

echo "start deploy to $publish_dir"
rm -rf $publish_dir/*
cp -rf dist/* $$publish_dir

echo "done!"
