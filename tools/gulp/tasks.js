const gulp = require('gulp');

const { PATHS } = require('../config');
const { pug } = require('./pug');
const { taskWatchify } = require('./bundlejs');


/*------------------------------------------------------------------------------
 * gulp Tasks
------------------------------------------------------------------------------*/
function watch() {
  gulp.watch([PATHS.srcDir + 'pug/**/*.pug'], { interval: 500 }, gulp.series(taskPug));
  gulp.watch([PATHS.srcDir + 'js/**/*.js'], { interval: 500 }, gulp.series(taskWatchify));
  gulp.watch([PATHS.srcDir + 'css/**/*.css'], { interval: 500 }, gulp.series(postcssWithStream));
}

exports.watch = watch;

