#!/bin/bash

function copy_bootstrap() {
  rm -rf "./${1}bootstrap-sass-official/"
  bower install bootstrap-sass-official#$2 --save
  find $1 -iname "_bootstrap-sprockets.scss" -type f -exec mv {} ./src/scss/core/ \;
  find $1 -iname "_bootstrap.scss" -type f -exec mv {} ./src/scss/core/ \;
  return
}

if [[ -f ./src/scss/core/_bootstrap.scss || -f ./src/scss/core/_bootstrap-sprockets.scss || -d ./src/scss/core/bootstrap/ ]]
then
  echo 'bootstrap files are already exists.'
else
  echo 'start copy bootstrap files.'
  copy_bootstrap $1 $2
fi
