const gulp = require('gulp');
const gulpPlumber = require('gulp-plumber');
const gulpPostcss = require('gulp-postcss');
const gulpSourcemaps = require('gulp-sourcemaps');
const path = require('path');

const { PATHS } = require('../config');


/*------------------------------------------------------------------------------
 * PostCSS Tasks
------------------------------------------------------------------------------*/
function taskPostcss() {
  const cssDest = path.join(PATHS.destDir, 'css');

  return gulp.src(path.resolve(PATHS.srcDir, 'css/*.css'))
    .pipe(gulpPlumber())
    .pipe(gulpSourcemaps.init())
    .pipe(gulpPostcss())
    .pipe(gulpSourcemaps.write('maps', {
      includeContent: false,
      sourceRoot: cssDest
    }))
    .pipe(gulp.dest(cssDest));
}


exports.taskPostcss = taskPostcss;
