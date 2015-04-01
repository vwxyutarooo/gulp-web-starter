#!/bin/bash

function copy_bootstrap() {
  rm -rf ./bower_components/bootstrap-sass-official/
  bower install bootstrap-sass-official --save
  mv ./bower_components/bootstrap-sass-official/assets/stylesheets/_bootstrap-sprockets.scss ./src/scss/core/_bootstrap-sprockets.scss
  mv ./bower_components/bootstrap-sass-official/assets/stylesheets/_bootstrap.scss ./src/scss/core/_bootstrap.scss
  return
}

if [[ -f ./src/scss/core/_bootstrap.scss || -f ./src/scss/core/_bootstrap-sprockets.scss || -d ./src/scss/core/bootstrap/ ]]
then
  echo 'bootstrap files are already exists/'
else
  echo 'start copy bootstrap files.'
  copy_bootstrap
fi

