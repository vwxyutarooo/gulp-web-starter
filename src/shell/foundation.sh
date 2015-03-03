#!/bin/bash

function copy:foundation() {
  rm -rf ./bower_components/foundation/
  bower install foundation --save
  mv ./bower_components/foundation/scss/foundation/ ./src/scss/core/foundation/
  mv ./src/scss/core/foundation/_settings.scss ./src/scss/core/_settings.scss
  mv ./bower_components/foundation/scss/foundation.scss ./src/scss/core/_foundation.scss
  return
}

if [[ -f ./src/scss/core/_foundation.scss || -f ./src/scss/core/_settings.scss ]]
then
  echo 'foundation files are already exists/'
else
  echo 'start copy foundation files.'
  copy:foundation
fi

