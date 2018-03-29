const gulp = require('gulp');
const path = require('path');

const data = require('gulp-data');
const gulpPug = require('gulp-pug');
const plumber = require('gulp-plumber');

const { PATHS } = require('../config');
const { requireUncached } = require('./functions');


/*------------------------------------------------------------------------------
 * pug Tasks
------------------------------------------------------------------------------*/
function taskPug() {
  return gulp.src(path.resolve(PATHS.srcDir, 'pug/**/!(_)*.pug'))
    .pipe(data(() => { return requireUncached('../../src/json/data.json'); }))
    .pipe(plumber())
    .pipe(gulpPug({ pretty: true }))
    .pipe(gulp.dest(PATHS.htmlDir));
}


exports.taskPug = taskPug;
