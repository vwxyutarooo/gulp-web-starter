# gulpfile for web development
## Requires
* npm
* bower
* sass
* sass-globbing


## gulp-web-starter
Web development environment using
* gulp
* browserSync
* browserify
* foundation / bootstrap
* _s


## Setup
Choose css framework at the gulpfile.js

    'cssBase'      : 'foundation'
or

    'cssBase'      : 'bootstrap'

Disable installing _s if you want

    '_s'           : false

To build hole of project with foundation and _s

    $ npm install; npm run gulp -- init

Normal setup for your project members

    $ npm install; bower install


## How to run gulp tasks
You don't need gulp global install anyway. To run gulp with default task.

    $ npm run gulp

Normally browserSync runs as with proxy option. To avoid proxy and use as server mode.

    $ npm run gulp --mode server

If tunnel option has strings instead of false, gulp-web-starter is automatically enable it.

    'tunnel'       : 'randomstring23232',

To call specified task.

    $ npm run gulp -- taskname


## foundation

    src/scss/core/_settings.scss
    src/scss/core/_foundation.scss


## bootstrap

    src/scss/core/_bootstrap.scss


## browserify

    src/js/app.js


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
