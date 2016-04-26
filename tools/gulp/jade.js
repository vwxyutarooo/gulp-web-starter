'use strict';

import gulp from 'gulp';
import { paths } from '../config';

import data from 'gulp-data';
import jade from 'gulp-jade';
import plumber from 'gulp-plumber';


/*------------------------------------------------------------------------------
 * Jade Tasks
------------------------------------------------------------------------------*/
gulp.task('jade', () => {
  return gulp.src(paths.srcJade + '*.jade')
    .pipe(data((file) => require('../json/setting.json')))
    .pipe(plumber())
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest(paths.htmlDir));
});
