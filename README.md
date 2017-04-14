# gulpfile for web development
[![Build Status](https://travis-ci.org/vwxyutarooo/gulp-web-starter.svg?branch=master)](https://travis-ci.org/vwxyutarooo/gulp-web-starter)

## Requires
- Node.js
  - 4
  - 5
  - 6
- npm (Tested on 3.9.3)


## gulp-web-starter
Web development environment using
- gulp
- browserSync
- browserify
- foundation / bootstrap


## Setup
Edit `src/gulp/config.js`
Choose css framework at the

```
'cssBase'      : 'foundation'
'cssBase'      : 'bootstrap'
'cssBase'      : false
```

Enable/Disable installing \_s for Wordpress

```
'_s'           : true
'_s'           : false
```

After that, Once you initializing project with css framework and \_s

```
$ npm install && npm run gulp -- init
```


## How to run gulp tasks
You don't need gulp global install anyway. To run gulp with default task.

```
$ npm run gulp
```

Normally browserSync runs as with proxy option. To avoid proxy option, use server mode.

```
$ npm run gulp -- default --mode server
or
$ npm run gulp-server
```

If tunnel option has strings instead of false, gulp-web-starter is automatically enable it.

```
'tunnel'       : 'randomstring23232',
```

To call specified task.

```
$ npm run gulp -- taskname
```


## foundation

```
src/scss/core/_settings.scss
src/scss/core/_foundation.scss
```


## bootstrap

```
src/scss/core/_bootstrap.scss
```

## browserify

```
src/js/app.js
```

## File structure
Basically source file placed in "src/". It passed to "shared/" as destination through the "gulp".

```
.
├── README.md
├── gulpfile.babel.js
├── index.html
├── package.json
├── src
│   ├── images
│   │   ├── sprite
│   │   │   ├── pc
│   │   │   │   └── _dummy.png
│   │   │   └── sp
│   │   │       └── _dummy.png
│   │   └── sprite-svg
│   │       ├── pc
│   │       │   └── dummy.svg
│   │       └── sp
│   │           └── dummy.svg
│   ├── js
│   │   ├── pc
│   │   │   ├── app.js
│   │   │   └── classes
│   │   │       └── Foundation_Control.js
│   │   └── sp
│   │       ├── app.js
│   │       └── classes
│   │           └── Foundation_Control.js
│   ├── json
│   │   └── setting.json
│   ├── pug
│   │   ├── inc
│   │   │   ├── core
│   │   │   │   ├── _base.pug
│   │   │   │   ├── _config.pug
│   │   │   │   └── _mixin.pug
│   │   │   ├── layout
│   │   │   │   ├── _l-footer.pug
│   │   │   │   └── _l-header.pug
│   │   │   └── module
│   │   │       └── _m-button.pug
│   │   └── index.pug
│   └── scss
│       ├── app.scss
│       ├── base
│       │   ├── _grid.scss
│       │   └── _partials.scss
│       ├── core
│       │   ├── _config.scss
│       │   ├── _default.scss
│       │   ├── _mixins.scss
│       │   └── _util.scss
│       ├── layout
│       │   ├── _footer.scss
│       │   ├── _header.scss
│       │   └── _layout.scss
│       ├── module
│       │   └── _buttons.scss
│       └── style
│           └── _stylePost.scss
├── style.css
├── tools
│   ├── config.js
│   ├── gulp
│   │   ├── bundlejs.js
│   │   ├── functions.js
│   │   ├── image.js
│   │   ├── install.js
│   │   ├── pug.js
│   │   ├── tasks.js
│   │   └── test-gulp.js
│   └── shell
│       ├── _s.sh
│       ├── bootstrap.sh
│       ├── foundation.sh
│       └── testclean.sh
└── yarn.lock
```
