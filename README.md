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
- PostCSS


## Setup
Edit `src/gulp/config.js` as you want.

```
$ yarn install
```


## How to run gulp tasks
You don't need gulp global install anyway. To run gulp with default task.

```
$ npm run gulp
```


To call specified task.

```
$ npm run gulp -- taskname
```


## browserify entry point
```
src/js/name/app.js

// Thil result will
dist/js/bundle.name.js
```

## Options
|Task|Option|Require|Description|Sample command|
|---|---|---|---|
|gulp|||||
||PORT||BrowserSync port|PORT=3002 npm run gulp|
||HOST||BrowserSync proxy host|HOST=localhost:8080 npm run gulp|

