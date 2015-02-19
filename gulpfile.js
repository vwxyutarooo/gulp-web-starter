'use strict';
/*------------------------------------------------------------------------------
 * 1. DEPENDENCIES
------------------------------------------------------------------------------*/
var gulp          = require('gulp'),
  $               = require('gulp-load-plugins')({ pattern: ['gulp-*', 'gulp.*'], replaceString: /\bgulp[\-.]/ }),
  browserify      = require('browserify'),
  browserSync     = require('browser-sync'),
  buffer          = require('vinyl-buffer'),
  del             = require('del'),
  runSequence     = require('run-sequence'),
  source          = require('vinyl-source-stream')
;

/*------------------------------------------------------------------------------
 * 2. FILE DESTINATIONS (RELATIVE TO ASSSETS FOLDER)
------------------------------------------------------------------------------*/
// @param false or virtual host name of local machine such as . Set false to browser-sync start as server mode.
// @param false or Subdomains which must be between 4 and 20 alphanumeric characters.
var bsOpt = {
  // 'proxy'        : 'wordpress.dev',
  'proxy'        : false,
  // 'tunnel'       : 'randomstring23232',
  'tunnel'       : false,
  'browser'      : 'google chrome canary'
};
// basic locations
var paths = {
  'root'         : './',
  'srcDir'       : 'src/',
  'srcImg'       : 'src/images/',
  'srcJade'      : 'src/jade/',
  'srcJs'        : 'src/js/',
  'srcJson'      : 'src/json/',
  'srcScss'      : 'src/scss/',
  'destDir'      : 'assets/',
  'destImg'      : 'assets/images/',
  'destCss'      : 'assets/css/',
  'destJs'       : 'assets/js/',
  'htmlDir'      : 'src/html',
  'phpFiles'     : ['*.php', './**/*.php']
};

/*------------------------------------------------------------------------------
 * 3. initializing bower_components
------------------------------------------------------------------------------*/
gulp.task('clean:bower', function(cb) {
  del('./bower_components', cb);
});

gulp.task('bower:install', $.shell.task(['bower install']));

gulp.task('copy:foundation', $.shell.task([
  'bash src/shell/foundation.sh'
]));

/*------------------------------------------------------------------------------
 * 4. browser-sync
------------------------------------------------------------------------------*/
gulp.task('browser-sync', function() {
  var args = {};
  if (bsOpt.proxy == false) {
    args.server = { baseDir: paths.root };
    args.startPath = paths.htmlDir;
  } else {
    args.proxy = bsOpt.proxy;
    args.open = 'external';
  }
  if (bsOpt.tunnel != false) {
    args.tunnel = bsOpt.tunnel;
  }
  args.browser = bsOpt.browser;
  browserSync(args);
});

gulp.task('bs-reload', function() {
  browserSync.reload()
});

/*------------------------------------------------------------------------------
 * 5. Jade Tasks
------------------------------------------------------------------------------*/
gulp.task('jade', function() {
  gulp.src(paths.srcJade + '*.jade')
    .pipe($.data(function(file) { return require(paths.srcDir + 'json/setting.json'); }))
    .pipe($.plumber())
    .pipe($.jade({ pretty: true }))
    .pipe(gulp.dest(paths.htmlDir))
    .pipe(browserSync.reload({ stream: true }));
});

/*------------------------------------------------------------------------------
 * 6. js Tasks
------------------------------------------------------------------------------*/
gulp.task('js', function() {
  browserify('./src/js/app.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe($.uglify())
    .pipe(gulp.dest(paths.destDir + 'js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js:hint', function() {});

/*------------------------------------------------------------------------------
 * 7. sass Tasks
------------------------------------------------------------------------------*/
gulp.task('scss', function() {
    return $.rubySass(paths.srcScss, {
      require: 'sass-globbing',
      sourcemap: true
    })
    .on('error', function(err) { console.error('Error!', err.message); })
    .pipe($.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'ie 10', 'ie 9'],
      cascade: false
    }))
    .pipe($.csso())
    .pipe($.sourcemaps.write('maps', { includeContent: false }))
    .pipe(gulp.dest(paths.destCss))
    .pipe($.filter('**/*.css'))
    .pipe(browserSync.reload({ stream: true }));
});

/*------------------------------------------------------------------------------
 * 8. Image file tasks
------------------------------------------------------------------------------*/
gulp.task('image-min', function() {
  gulp.src(paths.destImg + 'page/{*.png, **/*.png}')
    .pipe($.imagemin({ optimizationLevel: 3 }))
    .pipe(gulp.dest(paths.destImg + 'page/'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('sprite', function() {
  var spriteData = gulp.src(paths.srcImg + 'sprite/*.png')
  .pipe($.spritesmith({
    imgName: 'sprite.png',
    imgPath: '/' + paths.destImg + '/sprite.png',
    cssName: '_m-a-sprite.scss'
  }));
  spriteData.img
    .pipe($.imagemin({ optimizationLevel: 3 }))
    .pipe(gulp.dest(paths.destImg));
  spriteData.css.pipe(gulp.dest(paths.srcScss + 'module'));
});

/*------------------------------------------------------------------------------
 * 9. gulp Tasks
------------------------------------------------------------------------------*/
gulp.task('watch', function() {
  gulp.watch([paths.srcJade + '**/*.jade'], ['jade']);
  gulp.watch([paths.srcJs + '**/*.js'], ['js']);
  gulp.watch([paths.srcScss + '**/*.scss'], ['scss']);
  gulp.watch([paths.srcImg + 'sprite/*.png'], ['sprite']);
  gulp.watch([paths.phpFiles], ['bs-reload']);
});

gulp.task('default', [
  'browser-sync',
  'scss',
  'jade',
  'js',
  'sprite',
  'watch'
]);

gulp.task('init', function(cb) {
  runSequence('bower:install', ['copy:foundation'], cb);
});
