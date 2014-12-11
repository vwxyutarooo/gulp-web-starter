# gulpfile for web development

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

    20:  'vhost': 'wordpress.dev'
    216: 'browser-sync' → 'browser-sync-proxy'


## Use without global gulp
Install bower components and initialize them.

    $ npm run gulp-init

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
    ├── setting.json
    ├── shared
    │   ├── css
    │   │   └── app.css
    │   ├── images
    │   │   └── global
    │   └── js
    │       ├── lib.min.js
    │       ├── script.min.dev.js
    │       └── script.min.js
    ├── src
    │   ├── html
    │   │   └── index.html
    │   ├── images
    │   │   └── sprite
    │   ├── jade
    │   │   ├── inc
    │   │   │   ├── core
    │   │   │   │   ├── _base.jade
    │   │   │   │   ├── _config.jade
    │   │   │   │   └── _mixin.jade
    │   │   │   ├── layout
    │   │   │   │   ├── _layout_footer.jade
    │   │   │   │   └── _layout_header.jade
    │   │   │   └── module
    │   │   │       └── _sns.jade
    │   │   └── index.jade
    │   ├── js
    │   │   ├── app
    │   │   │   └── script.js
    │   │   └── lib
    │   └── scss
    │       ├── app.scss
    │       ├── core
    │       │   ├── _config.scss
    │       │   ├── _default.scss
    │       │   └── _mixins.scss
    │       ├── layout
    │       │   ├── _l-common.scss
    │       │   ├── _l-footer.scss
    │       │   ├── _l-header.scss
    │       │   └── _mediaqueries.scss
    │       └── module
    │           ├── _m-buttons.scss
    │           └── _m-grid.scss
    └── style.css
