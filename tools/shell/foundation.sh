#!/bin/bash

function copy_foundation() {
  rm -rf "./node_modules/foundation-sites/"
  npm install foundation-sites@$1 --save
  find "./node_modules" -iname "_settings.scss" -type f -exec mv {} ./src/scss/core/ \;
  find "./node_modules" -iname "foundation.scss" -type f -exec mv {} ./src/scss/core/_foundation.scss \;
  return
}

if [[ -f ./src/scss/core/_foundation.scss || -f ./src/scss/core/_settings.scss ]]; then
  echo "foundation files are already exists."
else
  echo "start copy foundation files."
  copy_foundation $1
fi
