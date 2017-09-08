'use strict';

import gulp from 'gulp';
import runSequence from 'run-sequence';

import { PATHS } from '../config';


/*------------------------------------------------------------------------------
 * gulp Tasks
------------------------------------------------------------------------------*/
gulp.task('watch', () => {
  gulp.watch([PATHS.srcDir + 'pug/**/*.pug'], { interval: 500 }, ['pug']);
  gulp.watch([PATHS.srcDir + 'js/**/*.js'], { interval: 500 }, ['js:watchify']);
  gulp.watch([PATHS.srcDir + 'css/**/*.css'], { interval: 500 }, ['postcss']);
});


gulp.task('default', ['browser-sync']);

