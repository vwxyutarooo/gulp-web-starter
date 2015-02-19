# gulpfile for web development

## Requires
* npm
* bower
* sass
* sass-globbing

## Setup
Install node_modules

    $ npm install; bower install

Or, to initialize project

    $ npm install
    $ npm run gulp -- init

Set hostname at gulpfile.js If you would like to connect "BrowserSync" with local server.

    'proxy'        : false,
    'tunnel'       : false,
    'browser'      : 'google chrome canary'

## foundation

    src/scss/core/_settings.scss
    src/scss/core/_foundation.scss

## browserify

    src/js/app.js

When proxy has false, BrowserSync will run as server mode.

## Use without global gulp
Run gulp with default task.

    $ npm run gulp

Call specified task.

    $ npm run gulp -- taskname

## File structure
Basically source file placed in "src/". It passed to "shared/" as destination through the "gulp".

    .
    ├── README.md
    ├── bower.json
    ├── gulpfile.js
    ├── package.json
    ├── src
    │   ├── html
    │   │   └── index.html
    │   ├── images
    │   │   └── sprite
    │   │       └── _dummy.png
    │   ├── jade
    │   │   ├── inc
    │   │   │   ├── core
    │   │   │   │   ├── _base.jade
    │   │   │   │   ├── _config.jade
    │   │   │   │   └── _mixin.jade
    │   │   │   ├── layout
    │   │   │   │   ├── _l-footer.jade
    │   │   │   │   └── _l-header.jade
    │   │   │   └── module
    │   │   │       └── _m-button.jade
    │   │   └── index.jade
    │   ├── js
    │   │   ├── app
    │   │   │   └── script.js
    │   │   └── app.js
    │   ├── json
    │   │   └── setting.json
    │   ├── scss
    │   │   ├── app.scss
    │   │   ├── core
    │   │   │   ├── _config.scss
    │   │   │   ├── _default.scss
    │   │   │   └── _mixins.scss
    │   │   ├── layout
    │   │   │   ├── _l-common.scss
    │   │   │   ├── _l-footer.scss
    │   │   │   └── _l-header.scss
    │   │   └── module
    │   │       ├── _m-buttons.scss
    │   │       └── _m-grid.scss
    │   └── shell
    │       └── foundation.sh
    └── style.css
