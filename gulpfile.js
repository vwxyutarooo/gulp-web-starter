const gulp = require('gulp');

const { taskBrowserSync, watchWithReload } = require('./tools/gulp/browser-sync');
const { taskBrowserify } = require('./tools/gulp/bundlejs');
const { taskPostcss } = require('./tools/gulp/postcss');
const { taskPug } = require('./tools/gulp/pug');


gulp.task('default', gulp.series(taskBrowserSync, watchWithReload));
gulp.task('taskTest', gulp.parallel(taskBrowserify, taskPostcss, taskPug));
