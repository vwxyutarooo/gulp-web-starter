'use strict';

import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import gulp from 'gulp';
import merge from 'merge-stream';
import path from 'path';
import source from 'vinyl-source-stream';
import watchify from 'watchify';

import { getFolders } from './functions';
import { PATHS } from '../config';

import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';


/*------------------------------------------------------------------------------
 * js Tasks
------------------------------------------------------------------------------*/
const jsSrc = path.join(PATHS.srcDir, 'js');
const jsBundle = (bundler, folder) => {
  return bundler.transform(babelify.configure({
      ignore: ['node_modules'],
      sourceMaps: true
    })).bundle().on('error', function(err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(source('bundle.' + folder + '.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(PATHS.destDir + 'js'));
};


gulp.task('js:browserify', () => {
  var folders = getFolders(jsSrc);
  var tasks = folders.map((folder) => {
    var bundler = browserify({
      entries: [path.join(jsSrc, folder, '/app.js')],
      debug: true,
      cache: {},
      packageCache: {}
    });
    return jsBundle(bundler, folder);
  });
  return merge(tasks);
});


gulp.task('js:watchify', () => {
  var folders = getFolders(jsSrc);
  var tasks = folders.map((folder) => {
    var bundler = browserify({
      entries: [path.join(jsSrc, folder, '/app.js')],
      debug: true,
      cache: {},
      packageCache: {},
      plugin: [watchify]
    });
    bundler.on('update', () => jsBundle(bundler, folder));
    bundler.on('log', (message) => console.log(message));
    return jsBundle(bundler, folder);
  });
  return merge(tasks);
});
