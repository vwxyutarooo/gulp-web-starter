'use strict';

import gulp from 'gulp';
import shell from 'gulp-shell';

import { options } from '../config';


/*------------------------------------------------------------------------------
 * 3. initializing bower_components
------------------------------------------------------------------------------*/
gulp.task('install:cssBase', () => {
  if (options.cssBase) {
    return gulp.src('./tools/shell/', { read: false })
      .pipe(shell(['bash ./tools/shell/' + options.cssBase + '.sh' + ' ' + options.cssBaseVer], { verbose: true }));
  } else {
    console.log('Skip installing css framework');
  }
});


gulp.task('install:_s', () => {
  if (options._s === true) {
    return gulp.src('./tools/shell/_s.sh', { read: false })
      .pipe(shell(['bash ./tools/shell/_s.sh']), { verbose: true });
  } else {
    console.log('Skip installing _s');
  }
});
