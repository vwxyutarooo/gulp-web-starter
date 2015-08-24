'use strict';

var $             = [];
var browserify    = require('browserify');
var buffer        = require('vinyl-buffer');
var functions     = require('./functions.js');
var gulp          = require('gulp');
var merge         = require('merge-stream');
var path          = require('path');
var paths         = require('./config.js').paths;
var source        = require('vinyl-source-stream');
var watchify      = require('watchify');

$.sourcemaps      = require('gulp-sourcemaps');
$.uglify          = require('gulp-uglify');


/*------------------------------------------------------------------------------
 * js Tasks
------------------------------------------------------------------------------*/
var jsBundle = function(bundler, folder) {
  return bundler.bundle()
    .pipe(source('bundle_' + folder + '.js'))
    .pipe(buffer())
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(paths.destDir + 'js'));
};

gulp.task('js:browserify', function() {
  var folders = functions.getFolders(paths.srcJs);
  var tasks = folders.map(function(folder) {
    var bundler = browserify({ entries: path.join(paths.srcJs, folder, '/app.js'), debug: true });
    return jsBundle(bundler, folder);
  });
  return merge(tasks);
});

gulp.task('js:watchify', function() {
  var folders = functions.getFolders(paths.srcJs);
  var tasks = folders.map(function(folder) {
    var bundler = watchify(browserify(path.join(paths.srcJs, folder, '/app.js'), watchify.args));
    bundler.on('update', function() { jsBundle(bundler, folder); });
    bundler.on('log', function(message) { console.log(message); });
    return _this.jsBundle(bundler, folder);
  });
  return merge(tasks);
});
