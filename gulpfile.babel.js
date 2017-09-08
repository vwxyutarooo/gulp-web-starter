'use strict';

/*------------------------------------------------------------------------------
 * Include modules
------------------------------------------------------------------------------*/
import path from 'path';
import './tools/gulp/pug';
import './tools/gulp/bundlejs';
import './tools/gulp/tasks';
import './tools/gulp/test-gulp'

import { PATHS, BROWSERSYNC } from './tools/config';

import browserSync from 'browser-sync';

import gulp from 'gulp';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import cssnano from 'gulp-cssnano';
import sourcemaps from 'gulp-sourcemaps';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';


const PORT = process.env.PORT || null;
const HOST = process.env.HOST || null;


/*------------------------------------------------------------------------------
 * sass Tasks
------------------------------------------------------------------------------*/
gulp.task('postcss', () => {
  const cssDest = path.join(PATHS.destDir, 'css');

  return gulp.src(PATHS.srcDir + 'css/*.css')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(postcss())
    .pipe(sourcemaps.write('maps', {
      includeContent: false,
      sourceRoot: cssDest
    }))
    .pipe(gulp.dest(cssDest))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});


/*------------------------------------------------------------------------------
 * browser-sync
------------------------------------------------------------------------------*/
gulp.task('pug:bs', ['pug'], () => {
  browserSync.reload();
  return;
});
gulp.task('js:bs', ['js:browserify'], () => {
  browserSync.reload();
  return;
});


gulp.task('browser-sync', () => {
  const middleware = [];
  const options = Object.assign({}, BROWSERSYNC, {
    ...(PORT !== null) ? {
      port: PORT
    } : {},
    ...(HOST === null) ? {
      server: {
        baseDir: './',
        startPath: PATHS.destDir,
        middleware
      }
    } : {
      proxy: {
        target: HOST,
        middleware
      }
    }
  });

  browserSync.init(options);

  gulp.watch([PATHS.srcDir + 'pug/**/*.pug'], { interval: 500 }, ['pug:bs']);
  gulp.watch([PATHS.srcDir + 'js/**/*.js'], { interval: 500 }, ['js:bs']);
  gulp.watch([PATHS.srcDir + 'css/**/*.css'], { interval: 500 }, ['postcss']);
});
