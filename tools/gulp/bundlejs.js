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

const { PATHS } = require('../config');
const { getFiles } = require('./functions');


/*------------------------------------------------------------------------------
 * js Tasks
------------------------------------------------------------------------------*/
const jsSrc = path.join(PATHS.srcDir, 'js');
const jsBundle = (bundler, file) => {
  console.log(file);
  return bundler.transform(babelify.configure({
    ignore: ['node_modules'],
    sourceMaps: true
  }))
    .bundle()
    .pipe(source(`bundle.${file}`))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.resolve(PATHS.destDir, 'js')));
};


function taskBrowserify() {
  const tasks = getFiles(path.resolve(PATHS.srcDir, 'js')).map((file) => {
    const bundler = browserify({
      entries: [path.join(jsSrc, file)],
      debug: true,
      cache: {},
      packageCache: {}
    });
    return jsBundle(bundler, file);
  });
  return merge(tasks);
}


function taskWatchify() {
  const tasks = getFiles(path.resolve(PATHS.srcDir, 'js')).map((file) => {
    const bundler = browserify({
      entries: [path.join(jsSrc, file, '/app.js')],
      debug: true,
      cache: {},
      packageCache: {},
      plugin: [watchify]
    });
    bundler.on('update', () => { return jsBundle(bundler, file); });
    bundler.on('log', (message) => { console.log(message); });
    return jsBundle(bundler, file);
  });
  return merge(tasks);
}


exports.taskBrowserify = taskBrowserify;
exports.taskWatchify = taskWatchify;
