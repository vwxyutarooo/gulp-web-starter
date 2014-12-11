# Personal gulpfile.js
First, You will need your own environment of wordpress as development project.

## Requires
* node.js
* npm
* bower
* sass
* sass-globbing

## Setup
Install node_modules

    $ npm install

Set hostname at gulpfile.js If you would like to connect "browser-sync" with local server.

    'vhost': 'wordpress.dev'

Run gulp and there are some options that I was prepared.

    $ npm start

## Use without global gulp
Install bower components and initialize them.

    $ npm run gulp-init

Run gulp with default task.

    $ npm run gulp

Call specified task.

    $ npm run gulp -- taskname
