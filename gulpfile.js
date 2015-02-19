'use strict';
/*------------------------------------------------------------------------------
 * 1. DEPENDENCIES
------------------------------------------------------------------------------*/
var gulp          = require('gulp'),
  $               = require('gulp-load-plugins')({ pattern: ['gulp-*', 'gulp.*'], replaceString: /\bgulp[\-.]/ }),
  browserSync     = require('browser-sync'),
  del             = require('del'),
  fs              = require('fs'),
  mainBowerFiles  = require('main-bower-files'),
  merge           = require('merge-stream'),
  saveLicense     = require('uglify-save-license'),
  runSequence     = require('run-sequence')
;

/*------------------------------------------------------------------------------
 * 2. FILE DESTINATIONS (RELATIVE TO ASSSETS FOLDER)
------------------------------------------------------------------------------*/
// @param foundation or bootstrap
var opt = {
  'cssBase'      : 'bootstrap'
}
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
  'srcDir'    : 'src/',
  'srcImg'    : 'src/images/',
  'srcJade'   : 'src/jade/',
  'srcJs'     : 'src/js/',
  'srcJson'   : 'src/json/',
  'srcScss'   : 'src/scss/',
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
gulp.task('bower-init', function() {
  var $_filterCss = $.filter('**/src/scss/module/*.*');
  gulp.src(mainBowerFiles(), {base: paths.root + 'bower_components' })
    .pipe($.bowerNormalize())
    .pipe($_filterCss)
    .pipe($.rename({ prefix: '_m-', extname: '.scss' }))
    .pipe($_filterCss.restore())
    .pipe(gulp.dest(paths.root));
});

gulp.task('clean:bower', function(cb) {
  del('./bower_components', cb);
});

gulp.task('bower:cssFramework', function() {
  return $.bower({ directory: './bower_components', cwd: paths.srcJson + opt.cssBase })
    .pipe(gulp.dest('./bower_components'));
});
gulp.task('override:cssFramework', function() {
  var jsonFile = paths.srcDir + 'json/' + opt.cssBase + '/bower.json';
  gulp.src(mainBowerFiles({ patsh: { bowerJson: jsonFile } }), { base: paths.root + 'bower_components' })
    .pipe($.bowerNormalize({
      bowerJson: jsonFile,
      flatten: true
    }))
    .pipe(gulp.dest(paths.root));
});

gulp.task('copy:cssFramework', function(cb) {
  if (opt.cssBase === 'foundation') {
    var bowerFoundationDir = 'bower_components/foundation/scss/';
    fs.open(paths.srcScss + 'core/_foundation.scss', 'r', function(err, fd) {
      if (err) {
        fs.open(paths.srcScss + 'core/_settings.scss', 'r', function(err, fd) {
          if (err) {
            runSequence('copy:foundation', cb);
          } else {
            console.log('"_settings.scss" is already exists.');
          }
        });
      } else {
        console.log('"_foundation.scss" is already exists.');
      }
      fd && fs.close(fd, function(err) {});
    });
  } else if (opt.cssBase === 'bootstrap') {
    var boerBootstrapDir = 'bower_components/bootstrap-sass-official/assets/stylesheets/**'
    fs.open(paths.srcScss + 'core/_bootstrap.scss', 'r', function(err, fd) {
      if (err) {
        runSequence('copy:bootstrap', cb);
      } else {
        console.log('bootstrap-sass is already exists.');
      }
      fd && fs.close(fd, function(err) {});
    });
    console.log('bootstrap');
  }
});

gulp.task('copy:foundation', function(cb) {
  var bowerFoundationDir = 'bower_components/foundation/scss/';
  var $_filter = $.filter('foundation.scss');
  var core = gulp.src([bowerFoundationDir + 'foundation.scss', bowerFoundationDir + 'foundation/_settings.scss'])
    .pipe($_filter)
    .pipe($.rename({ prefix: '_' }))
    .pipe($_filter.restore())
    .pipe(gulp.dest(paths.srcScss + 'core'));
  var files = gulp.src(bowerFoundationDir + '/**/_*.scss')
    .pipe(gulp.dest(paths.srcScss + 'core'));
  return merge(core, files);
});

gulp.task('copy:bootstrap', function() {
  var bowerBootstrapDir = 'bower_components/bootstrap-sass-official/assets/stylesheets/**';
  return gulp.src(bowerBootstrapDir)
    .pipe(gulp.dest(paths.srcScss + 'core'));
});


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
gulp.task('jsApp', function() {
  gulp.src(paths.srcJs + 'app/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'))
    .pipe($.concat('script.js'))
    .pipe($.uglify())
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.destDir + 'js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('jsLib', function() {
  gulp.src(paths.srcJs + 'lib/*.js')
    .pipe($.concat('lib.js'))
    .pipe($.uglify({ preserveComments: saveLicense }))
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.destDir + 'js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('jsTasks', [
  'jsApp',
  'jsLib'
]);

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
  gulp.watch([paths.srcJs + '**/*.js'], ['jsTasks']);
  gulp.watch([paths.srcScss + '**/*.scss'], ['scss']);
  gulp.watch([paths.srcImg + 'sprite/*.png'], ['sprite']);
  gulp.watch([paths.phpFiles], ['bs-reload']);
});

gulp.task('default', [
  'browser-sync',
  'scss',
  'jade',
  'jsTasks',
  'sprite',
  'watch'
]);

gulp.task('init', function(cb) {
  runSequence('bower:cssFramework', ['copy:cssFramework', 'override:cssFramework'], ['clean:bower'], cb);
});

gulp.task('init:base')
