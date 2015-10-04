'use strict';

var gulp          = require('gulp');
var runSequence   = require('run-sequence');


/*------------------------------------------------------------------------------
 * gulp Tasks
------------------------------------------------------------------------------*/
gulp.task('watch', function() {
  gulp.watch([paths.srcJade + '**/*.jade'], { interval: 500 }, ['jade']);
  gulp.watch([paths.srcJs   + '**/*.js'], { interval: 500 }, ['js:watchify']);
  gulp.watch([paths.srcScss + '**/*.scss'], { interval: 500 }, ['sass:node']);
  gulp.watch([paths.srcImg  + 'sprite/**/*.png'], { interval: 500 }, ['sprite']);
  gulp.watch([paths.srcImg  + 'sprite-svg/**/*.svg'], { interval: 500 }, ['sprite:inline-svg']);
});

gulp.task('default', [
  'browser-sync',
  'sprite',
  'sprite:inline-svg',
]);

gulp.task('init', function(cb) {
  runSequence('bower:install', ['install:cssBase'], 'install:_s', cb);
});
