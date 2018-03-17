const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const gulp = require('gulp');
const merge = require('merge-stream');
const path = require('path');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const watchify = require('watchify');

const { getFolders } = require('./functions');
const { PATHS } = require('../config');



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


function taskBrowserify() {
  const folders = getFolders(jsSrc);
  const tasks = folders.map((folder) => {
    const bundler = browserify({
      entries: [path.join(jsSrc, folder, '/app.js')],
      debug: true,
      cache: {},
      packageCache: {}
    });
    return jsBundle(bundler, folder);
  });
  return merge(tasks);
}


function taskWatchify() {
  const folders = getFolders(jsSrc);
  const tasks = folders.map((folder) => {
    const bundler = browserify({
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
}


exports.taskBrowserify = taskBrowserify;
exports.taskWatchify = taskWatchify;
