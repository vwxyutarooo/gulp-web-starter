'use strict';

/*------------------------------------------------------------------------------
 * Include modules
------------------------------------------------------------------------------*/
import './tools/gulp/install';
import './tools/gulp/jade';
import './tools/gulp/bundlejs';
import './tools/gulp/image';
import './tools/gulp/tasks';

import { options, paths, sass_conf } from './tools/config.js';

import { argv } from 'yargs';
import browserSync from 'browser-sync';

import gulp from 'gulp';
import cssGlobbing from 'gulp-css-globbing';
import cssnano from 'gulp-cssnano';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';


/*------------------------------------------------------------------------------
 * sass Tasks
------------------------------------------------------------------------------*/
switch(options.cssBase) {
  case 'foundation':
    sass_conf.includePaths.push('./node_modules/foundation-sites/scss');
    break;
  case 'bootstrap':
    sass_conf.includePaths.push('./node_modules/bootstrap-sass-official/assets/stylesheets');
    break;
}

gulp.task('sass:node', () => {
  return gulp.src(paths.srcScss + '*.scss')
    .pipe(sourcemaps.init())
    .pipe(cssGlobbing({ extensions: ['.scss'] }))
    .pipe(sass(sass_conf).on('error', sass.logError))
    .pipe(cssnano({
      autoprefixer: {
        add: true,
        browsers: options.autoprefix
      },
      postcssReduceTransforms: false
    }))
    .pipe(sourcemaps.write('maps', {
      includeContent: false,
      sourceRoot: paths.srcScss
    }))
    .pipe(gulp.dest(paths.destCss))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});


/*------------------------------------------------------------------------------
 * browser-sync
------------------------------------------------------------------------------*/
gulp.task('jade:bs', ['jade'], () => {
  browserSync.reload();
  return;
});
gulp.task('js:bs', ['js:browserify'], () => {
  browserSync.reload();
  return;
});
gulp.task('sprite:bs', ['sprite'], () => {
  browserSync.reload();
  return;
});
gulp.task('inline-svg:bs', ['sprite:inline-svg'], () => {
  browserSync.reload();
  return;
});


gulp.task('browser-sync', () => {
  var args = options.bs;
  var middle_ware = [];

  if (argv.mode == 'server') {
    Object.assign(args, {
      server: Object.assign({}, args.server, {
        baseDir: paths.root,
        startPath: paths.htmlDir,
        middleware: middle_ware
      })
    });
  } else {
    Object.assign(args, {
      proxy: {
        target: argv.vhost ? argv.vhost : options.proxy,
        middleware: middle_ware
      }
    });
  }

  if (options.tunnel != false) args.tunnel = options.tunnel;

  browserSync.init(args);

  gulp.watch([paths.srcJade + '**/*.jade'], { interval: 500 }, ['jade:bs']);
  gulp.watch([paths.srcJs   + '**/*.js'], { interval: 500 }, ['js:bs']);
  gulp.watch([paths.srcScss + '**/*.scss'], { interval: 500 }, ['sass:node']);
  gulp.watch([paths.srcImg  + 'sprite/**/*.png'], { interval: 500 }, ['sprite:bs']);
  gulp.watch([paths.srcImg  + 'sprite-svg/**/*.svg'], { interval: 500 }, ['inline-svg:bs']);
  gulp.watch([paths.reloadOnly], { interval: 500 }).on('change', browserSync.reload);
});
