#!/bin/bash

rm -rf ./src/scss/core/_foundation.scss
rm -rf ./src/scss/core/_settings.scss
rm -rf ./assets
find ./src/scss/ -iname "_sprite-*scss" -type f -exec rm -rf {} \;
