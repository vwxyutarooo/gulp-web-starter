const gulp = require('gulp');

const { taskBrowserSync, watchWithReload } = require('./tools/gulp/browser-sync');
const { taskBrowserify } = require('./tools/gulp/bundlejs');
const { taskEslint } = require('./tools/gulp/eslint');
const { taskPostcss } = require('./tools/gulp/postcss');
const { taskPug } = require('./tools/gulp/pug');


gulp.task('build', gulp.parallel(gulp.series(taskEslint, taskBrowserify), taskPostcss, taskPug));
gulp.task('taskTest', gulp.parallel(taskEslint, taskBrowserify, taskPostcss, taskPug));
gulp.task('default', gulp.series('build', taskBrowserSync, watchWithReload));


exports.taskBrowserify = taskBrowserify;
exports.taskEslint = taskEslint;
exports.taskPostcss = taskPostcss;
exports.taskPug = taskPug;
