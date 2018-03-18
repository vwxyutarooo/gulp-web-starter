const gulp = require('gulp');
const gulpEslint = require('gulp-eslint');
const path = require('path');

const { PATHS } = require('../config');


function taskEslint() {
  return gulp.src([
    path.resolve(PATHS.srcDir, 'js/**/*.js'),
    '!node_modules'
  ])
    .pipe(gulpEslint())
    .pipe(gulpEslint.format())
    .pipe(gulpEslint.failAfterError());
}


exports.taskEslint = taskEslint;
