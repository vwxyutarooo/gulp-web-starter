'use strict';

import buffer from 'vinyl-buffer';
import gulp from 'gulp';
import merge from 'merge-stream';
import path from 'path';

import { getFolders } from './functions';
import { paths } from '../config';

import imagemin from 'gulp-imagemin';
import rename from 'gulp-rename';
import spritesmith from 'gulp.spritesmith';
import svgSprite from 'gulp-svg-sprite';


/*------------------------------------------------------------------------------
 * Image file tasks
------------------------------------------------------------------------------*/
gulp.task('imagemin', () => {
  gulp.src(paths.destImg + 'page/**/*.*')
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(gulp.dest(paths.destImg + 'page/'));
});


gulp.task('sprite', () => {
  var folders = getFolders(paths.srcImg + 'sprite');
  var tasks = folders.map((folder) => {
    var spriteData = gulp.src(path.join(paths.srcImg + 'sprite', folder, '/*.png'))
      .pipe(spritesmith({
        imgName: 'sprite-' + folder + '.png',
        imgPath: '/' + paths.destImg + 'sprite-' + folder + '.png',
        cssName: '_sprite-' + folder + '.scss'
      }));
    var streamImg = spriteData.img
      .pipe(buffer())
      .pipe(imagemin({ optimizationLevel: 3 }))
      .pipe(gulp.dest(paths.destImg));
    var streamCss = spriteData.css.pipe(gulp.dest(paths.srcScss + 'base'));
    return merge(streamImg, streamCss);
  });
  return merge(tasks);
});


gulp.task('sprite:inline-svg', () => {
  var folders = getFolders(paths.srcImg + 'sprite-svg');
  var tasks = folders.map((folder) => {
    return gulp.src(path.join(paths.srcImg + 'sprite-svg', folder, '/*.svg'))
      .pipe(svgSprite({
        dest: './',
        mode: { symbol: { dest: './' } }
      }))
      .pipe(rename({
        basename: 'symbol',
        dirname: './',
        prefix: 'sprite-' + folder + '.'
      }))
      .pipe(gulp.dest(paths.destImg));
  });
  return merge(tasks);
});
