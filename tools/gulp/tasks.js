'use strict';

import gulp from 'gulp';
import runSequence from 'run-sequence';

import { paths } from '../config.js';


/*------------------------------------------------------------------------------
 * gulp Tasks
------------------------------------------------------------------------------*/
gulp.task('watch', () => {
  gulp.watch([paths.srcJade + '**/*.jade'], { interval: 500 }, ['jade']);
  gulp.watch([paths.srcJs   + '**/*.js'], { interval: 500 }, ['js:watchify']);
  gulp.watch([paths.srcScss + '**/*.scss'], { interval: 500 }, ['sass:node']);
  gulp.watch([paths.srcImg  + 'sprite/**/*.png'], { interval: 500 }, ['sprite']);
  gulp.watch([paths.srcImg  + 'sprite-svg/**/*.svg'], { interval: 500 }, ['sprite:inline-svg']);
});


gulp.task('default', ['browser-sync']);


gulp.task('init', (cb) => {
  runSequence(['install:cssBase'], 'install:_s', cb);
});
