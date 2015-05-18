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

    22: 'cssBase'      : 'foundation'
    or
    22: 'cssBase'      : 'bootstrap'
    or
    22: 'cssBase'      : false

Enable/Disable installing _s

    23: '_s'           : true
    or
    23: '_s'           : false

Once you to build whole of project with css framework and _s

    $ npm install; npm run gulp -- init



## How to run gulp tasks
You don't need gulp global install anyway. To run gulp with default task.

    $ npm run gulp

Normally browserSync runs as with proxy option. To avoid proxy and use as server mode.

    $ npm run gulp -- default --mode server
    or
    $ npm run gulp-server

If tunnel option has strings instead of false, gulp-web-starter is automatically enable it.

    25: 'tunnel'       : 'randomstring23232',

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

    ├── README.md
    ├── bower.json
    ├── gulpfile.js
    ├── package.json
    ├── src
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
    │   │   ├── base
    │   │   │   ├── _grid.scss
    │   │   │   └── _partials.scss
    │   │   ├── core
    │   │   │   ├── _config.scss
    │   │   │   ├── _default.scss
    │   │   │   └── _mixins.scss
    │   │   ├── layout
    │   │   │   ├── _footer.scss
    │   │   │   ├── _header.scss
    │   │   │   └── _layout.scss
    │   │   └── module
    │   │       └── _buttons.scss
    │   └── shell
    │       ├── _s.sh
    │       ├── bootstrap.sh
    │       └── foundation.sh
    └── style.css
