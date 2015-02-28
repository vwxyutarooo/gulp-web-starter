#!/bin/bash

function copy:bootstrap() {
  bower install bootstrap-sass-official --save
  cp -nr ./bower_components/bootstrap-sass-official/assets/stylesheets/bootstrap ./src/scss/core/bootstrap
  cp -n ./bower_components/bootstrap-sass-official/assets/stylesheets/_bootstrap.scss ./src/scss/core/_bootstrap.scss
  return
}

if [[ -f ./src/scss/core/_bootstrap.scss || -d ./src/scss/core/bootstrap ]]
then
  echo 'file already exists/'
else
  echo 'start copy bootstrap files.'
  copy:bootstrap
fi

