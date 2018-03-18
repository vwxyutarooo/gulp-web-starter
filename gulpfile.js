const gulp = require('gulp');

const { taskBrowserSync, watchWithReload } = require('./tools/gulp/browser-sync');
const { taskBrowserify } = require('./tools/gulp/bundlejs');
const { taskEslint } = require('./tools/gulp/eslint');
const { taskPostcss } = require('./tools/gulp/postcss');
const { taskPug } = require('./tools/gulp/pug');


gulp.task('default', gulp.series(taskBrowserSync, watchWithReload));
gulp.task('taskTest', gulp.parallel(taskEslint, taskBrowserify, taskPostcss, taskPug));


exports.taskBrowserify = taskBrowserify;
exports.taskEslint = taskEslint;
exports.taskPostcss = taskPostcss;
exports.taskPug = taskPug;
