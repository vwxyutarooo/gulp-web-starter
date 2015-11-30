'use strict';

/*------------------------------------------------------------------------------
 * Include modules
------------------------------------------------------------------------------*/
require('./src/gulp/install.js');
require('./src/gulp/jade.js');
require('./src/gulp/bundlejs.js');
require('./src/gulp/image.js');
require('./src/gulp/tasks.js');

var $             = [];
var argv          = require('yargs').argv;
var browserSync   = require('browser-sync').create();
var gulp          = require('gulp');
var opt           = require('./src/gulp/config.js').opt;
var paths         = require('./src/gulp/config.js').paths;
var nodeSassConf  = require('./src/gulp/config.js').nodeSassConf;

$.autoprefixer    = require('gulp-autoprefixer');
$.cssGlobbing     = require('gulp-css-globbing');
$.minifyCss       = require('gulp-minify-css');
$.sass            = require('gulp-sass');
$.sourcemaps      = require('gulp-sourcemaps');


/*------------------------------------------------------------------------------
 * sass Tasks
------------------------------------------------------------------------------*/
switch(opt.cssBase) {
  case 'foundation':
    nodeSassConf.includePaths.push(paths.srcBower + 'foundation/scss');
    break;
  case 'bootstrap':
    nodeSassConf.includePaths.push(paths.srcBower + 'bootstrap-sass-official/assets/stylesheets');
    break;
}

gulp.task('sass:node', function() {
  return gulp.src(paths.srcScss + '*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.cssGlobbing({ extensions: ['.scss'] }))
    .pipe($.sass(nodeSassConf).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'ie 10', 'ie 9'],
      cascade: false
    }))
    .pipe($.minifyCss())
    .pipe($.sourcemaps.write('maps', {
      includeContent: false,
      sourceRoot: paths.srcScss
    }))
    .pipe(gulp.dest(paths.destCss))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});


/*------------------------------------------------------------------------------
 * browser-sync
------------------------------------------------------------------------------*/
gulp.task('jade:bs', ['jade'], function() {
  browserSync.reload();
  return;
});
gulp.task('js:bs', ['js:browserify'], function() {
  browserSync.reload();
  return;
});
gulp.task('sprite:bs', ['sprite'], function() {
  browserSync.reload();
  return;
});
gulp.task('inline-svg:bs', ['sprite:inline-svg'], function() {
  browserSync.reload();
  return;
});

gulp.task('browser-sync', function() {
  var args = {};
  args = opt.bs;

  if (argv.mode == 'server' ) {
    args.server = { baseDir: paths.root };
    args.startPath = paths.htmlDir;
  } else {
    args.proxy = opt.proxy;
    args.open = 'external';
  }

  if (opt.tunnel != false) args.tunnel = opt.tunnel;

  browserSync.init(args);

  gulp.watch([paths.srcJade + '**/*.jade'], { interval: 500 }, ['jade:bs']);
  gulp.watch([paths.srcJs   + '**/*.js'], { interval: 500 }, ['js:bs']);
  gulp.watch([paths.srcScss + '**/*.scss'], { interval: 500 }, ['sass:node']);
  gulp.watch([paths.srcImg  + 'sprite/**/*.png'], { interval: 500 }, ['sprite:bs']);
  gulp.watch([paths.srcImg  + 'sprite-svg/**/*.svg'], { interval: 500 }, ['inline-svg:bs']);
  gulp.watch([paths.reloadOnly], { interval: 500 }).on('change', browserSync.reload);
});
