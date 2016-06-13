#!/bin/bash

rm -rf ./src/scss/core/_foundation.scss
rm -rf ./src/scss/core/_settings.scss
rm -rf ./assets
rm -f ./index.html
find ./src/scss/ -iname "_sprite-*scss" -type f -exec rm -rf {} \;

echo 'testclean.sh has completed'
