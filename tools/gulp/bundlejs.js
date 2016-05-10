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
import { paths } from '../config';

import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';


/*------------------------------------------------------------------------------
 * js Tasks
------------------------------------------------------------------------------*/
var jsBundle = (bundler, folder) => {
  return bundler.transform(babelify.configure({
      presets: ['react', 'es2015'],
      ignore: ['node_modules'],
      sourceMaps: true
    })).bundle().on('error', function(err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(source('bundle_' + folder + '.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.destDir + 'js'));
};


gulp.task('js:browserify', () => {
  var folders = getFolders(paths.srcJs);
  var tasks = folders.map((folder) => {
    var bundler = browserify({
      entries: [path.join(paths.srcJs, folder, '/app.js')],
      debug: true,
      cache: {},
      packageCache: {}
    });
    return jsBundle(bundler, folder);
  });
  return merge(tasks);
});


gulp.task('js:watchify', () => {
  var folders = getFolders(paths.srcJs);
  var tasks = folders.map((folder) => {
    var bundler = browserify({
      entries: [path.join(paths.srcJs, folder, '/app.js')],
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
