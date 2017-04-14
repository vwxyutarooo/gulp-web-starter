'use strict';

import gulp from 'gulp';
import runSequence from 'run-sequence';
import shell from 'gulp-shell';


gulp.task('test:gulp:before', shell.task(['cp ./package.json .package.json.bak']));
gulp.task('test:gulp:after', shell.task(['rm -f package.json && mv .package.json.bak package.json']));

gulp.task('test:gulp', (cb) => {
  runSequence(
    'test:gulp:before',
    'install:cssBase',
    ['pug', 'js:browserify', 'sass:node'],
    'clean:test',
    'test:gulp:after',
    cb
  );
});

gulp.task('clean:test', shell.task(['bash ./tools/shell/testclean.sh'], { verbose: true }));
