#!/bin/bash

echo 'Start install _s files without override.'
bower install https://github.com/Automattic/_s.git https://github.com/vwxyutarooo/wp-theme-ja.git
cp -n ./bower_components/_s/*.php ./
cp -nr ./bower_components/_s/inc/ ./inc/
cp -nr ./bower_components/_s/languages/ ./languages/
cp -rf ./bower_components/wp-theme-ja/ja.* ./languages/
rm -rf ./bower_components/_s
rm -rf ./bower_compoentns/wp-theme-ja
echo '_s were successfully Installed.'
