const browserSync = require('browser-sync');
const gulp = require('gulp');
const path = require('path');

const { PATHS, BROWSERSYNC } = require('../config');
const { taskBrowserify } = require('./bundlejs');
const { taskEslint } = require('./eslint');
const { taskPostcss } = require('./postcss');
const { taskPug } = require('./pug');


process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || null;
const HOST = process.env.HOST || null;


/*------------------------------------------------------------------------------
 * browser-sync
------------------------------------------------------------------------------*/
const devServer = browserSync.create();


function reload(done) {
  devServer.reload();
  done();
}


function taskBrowserSync(done) {
  const middleware = [];
  const options = Object.assign({}, BROWSERSYNC, {
    ...(PORT !== null) ? {
      port: PORT
    } : {},
    ...(HOST === null) ? {
      server: {
        baseDir: PATHS.root,
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

  devServer.init(options);
  done();
}


function postcssWithStream() {
  return taskPostcss()
    .pipe(devServer.stream({ match: '**/*.css' }));
}


function watchWithReload() {
  gulp.watch(
    [path.resolve(PATHS.srcDir, 'pug/**/*.pug')],
    { interval: 500 },
    gulp.series(taskPug, reload)
  );
  gulp.watch(
    [path.resolve(PATHS.srcDir, 'js/**/*.js')],
    { interval: 500 },
    gulp.series(taskEslint, taskBrowserify, reload)
  );
  gulp.watch(
    [path.resolve(PATHS.srcDir, 'css/**/*.css')],
    { interval: 500 },
    gulp.series(postcssWithStream)
  );
}


exports.reload = reload;
exports.taskBrowserSync = taskBrowserSync;
exports.watchWithReload = watchWithReload;
exports.devServer = devServer;
