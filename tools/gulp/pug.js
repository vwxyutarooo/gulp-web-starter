'use strict';

import gulp from 'gulp';
import { paths } from '../config';

import data from 'gulp-data';
import pug from 'gulp-pug';
import plumber from 'gulp-plumber';


/*------------------------------------------------------------------------------
 * pug Tasks
------------------------------------------------------------------------------*/
gulp.task('pug', () => {
  return gulp.src(paths.srcpug + '*.pug')
    .pipe(data((file) => require('../../src/json/setting.json')))
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(paths.htmlDir));
});
