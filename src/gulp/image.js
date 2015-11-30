'use strict';

var $             = [];
var buffer        = require('vinyl-buffer');
var functions     = require('./functions.js');
var gulp          = require('gulp');
var merge         = require('merge-stream');
var path          = require('path');
var paths         = require('./config.js').paths;

$.imagemin        = require('gulp-imagemin');
$.rename          = require('gulp-rename');
$.spritesmith     = require('gulp.spritesmith');
$.svgSprite       = require('gulp-svg-sprite');


/*------------------------------------------------------------------------------
 * Image file tasks
------------------------------------------------------------------------------*/
gulp.task('imagemin', function() {
  gulp.src(paths.destImg + 'page/**/*.*')
    .pipe($.imagemin({ optimizationLevel: 3 }))
    .pipe(gulp.dest(paths.destImg + 'page/'));
});

var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');

gulp.task('sprite', function () {
  var spriteData = gulp.src('images/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  }));
  return spriteData.pipe(gulp.dest('path/to/output/'));
});

gulp.task('sprite', function() {
  var folders = functions.getFolders(paths.srcImg + 'sprite');
  var tasks = folders.map(function(folder) {
    var spriteData = gulp.src(path.join(paths.srcImg + 'sprite', folder, '/*.png'))
      .pipe($.spritesmith({
        imgName: 'sprite-' + folder + '.png',
        imgPath: '/' + paths.destImg + 'sprite-' + folder + '.png',
        cssName: '_sprite-' + folder + '.scss'
      }));
    var streamImg = spriteData.img
      .pipe(buffer())
      .pipe($.imagemin({ optimizationLevel: 3 }))
      .pipe(gulp.dest(paths.destImg));
    var streamCss = spriteData.css.pipe(gulp.dest(paths.srcScss + 'base'));
    return merge(streamImg, streamCss);
  });
  return merge(tasks);
});

gulp.task('sprite:inline-svg', function() {
  var folders = functions.getFolders(paths.srcImg + 'sprite-svg');
  var tasks = folders.map(function(folder) {
    return gulp.src(path.join(paths.srcImg + 'sprite-svg', folder, '/*.svg'))
      .pipe($.svgSprite({
        dest: './',
        mode: { symbol: { dest: './' } }
      }))
      .pipe($.rename({
        basename: 'symbol',
        dirname: './',
        prefix: 'sprite-' + folder + '.'
      }))
      .pipe(gulp.dest(paths.destImg));
  });
  return merge(tasks);
});
