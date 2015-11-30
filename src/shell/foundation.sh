#!/bin/bash

function copy_foundation() {
  rm -rf "./${1}foundation/"
  bower install foundation#$2 --save
  find $1 -iname "_settings.scss" -type f -exec mv {} ./src/scss/core/ \;
  find $1 -iname "foundation.scss" -type f -exec mv {} ./src/scss/core/_foundation.scss \;
  return
}

if [[ -f ./src/scss/core/_foundation.scss || -f ./src/scss/core/_settings.scss ]]; then
  echo "foundation files are already exists."
else
  echo "start copy foundation files."
  copy_foundation $1 $2
fi
