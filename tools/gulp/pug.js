const gulp = require('gulp');
const { PATHS } = require('../config');

const data = require('gulp-data');
const gulpPug = require('gulp-pug');
const plumber = require('gulp-plumber');


/*------------------------------------------------------------------------------
 * pug Tasks
------------------------------------------------------------------------------*/
function taskPug() {
  return gulp.src(PATHS.srcDir + 'pug/' + '*.pug')
    .pipe(data((file) => require('../../src/json/setting.json')))
    .pipe(plumber())
    .pipe(gulpPug({ pretty: true }))
    .pipe(gulp.dest(PATHS.htmlDir));
}


exports.taskPug = taskPug;
