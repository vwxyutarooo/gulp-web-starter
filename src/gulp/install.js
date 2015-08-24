'use strict';

var $             = [];
var gulp          = require('gulp');
var paths         = require('./config.js').paths;
var opt           = require('./config.js').opt;

$.shell           = require('gulp-shell');


/*------------------------------------------------------------------------------
 * 3. initializing bower_components
------------------------------------------------------------------------------*/
gulp.task('bower:install', $.shell.task(['bower install']));

gulp.task('install:cssBase', function() {
  if(opt.cssBase) {
    return gulp.src('./src/shell/', {read: false})
      .pipe($.shell(['bash ./src/shell/' + opt.cssBase + '.sh']))
  } else {
    console.log('Skip installing css framework');
  }
});

gulp.task('install:_s', function() {
  if (opt._s === true) {
    return gulp.src('./src/shell/_s.sh', {read: false})
      .pipe($.shell(['bash ./src/shell/_s.sh']));
  } else {
    console.log('Skip installing _s');
  }
});
