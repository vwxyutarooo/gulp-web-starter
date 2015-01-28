/*------------------------------------------------------------------------------
 * 1. DEPENDENCIES
------------------------------------------------------------------------------*/
var gulp = require('gulp'),
  $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
  }),
  browserSync = require('browser-sync'),
  del = require('del'),
  mainBowerFiles = require('main-bower-files'),
  saveLicense = require('uglify-save-license')
;

/*------------------------------------------------------------------------------
 * 2. FILE DESTINATIONS (RELATIVE TO ASSSETS FOLDER)
------------------------------------------------------------------------------*/
var bsOpt = {
  'port':       3000
, 'proxy':      'wordpress.dev'
, 'proxy':      false
, 'tunnel':     'randomstring23232'  // Subdomains must be between 4 and 20 alphanumeric characters.
, 'tunnel':     false
};
var paths = {
// based paths
  'root':       './'
, 'sourceDir':  'src/'
, 'destDir':    'assets/'
// others
, 'htmlDir':    'src/html'
, 'phpFiles':   ['*.php', './**/*.php']
};

/*------------------------------------------------------------------------------
 * 3. initialize browser-sync && bower_components
------------------------------------------------------------------------------*/
gulp.task('bower-init', function() {
  var $_filterCss = $.filter('**/src/scss/module/*.*');
  gulp.src(mainBowerFiles(), {base: './bower_components'})
    .pipe($.bowerNormalize())
    .pipe($_filterCss)
    .pipe($.rename({ prefix: '_m-', extname: '.scss' }))
    .pipe($_filterCss.restore())
    .pipe(gulp.dest(paths.root));
});

gulp.task('bower-clean', function() {
  del('bower_components/');
});

gulp.task('foundation-init', function() {
  var bfDir = 'bower_components/foundation/scss';
  gulp.src([bfDir + '/foundation.scss', bfDir + '/normalize.scss'])
    .pipe($.rename({ prefix: '_' }))
    .pipe(gulp.dest(paths.sourceDir + 'scss/core'))
  gulp.src(bfDir + '/**/_*.scss')
    .pipe(gulp.dest(paths.sourceDir + 'scss/core'));
});

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
  args.browser = "google chrome canary";
  browserSync(args);
});

gulp.task('bs-reload', function() {
  browserSync.reload()
});

/*------------------------------------------------------------------------------
 * 4. Jade Tasks
------------------------------------------------------------------------------*/
gulp.task('jade', function() {
  return gulp.src(paths.sourceDir + 'jade/*.jade')
    .pipe($.data(function(file) {
      return require('./setting.json');
    }))
    .pipe($.plumber())
    .pipe($.jade({ pretty: true }))
    .pipe(gulp.dest(paths.htmlDir))
    .pipe(browserSync.reload({ stream: true }));
});

/*------------------------------------------------------------------------------
 * 5. js Tasks
------------------------------------------------------------------------------*/
gulp.task('jsApp', function() {
  return gulp.src(paths.sourceDir + 'js/app/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.concat('script.js'))
    .pipe($.uglify())
    .pipe($.rename({ suffix: '.min' }))
    .pipe($.sourcemaps.write(paths.destDir + 'js/maps'))
    .pipe(gulp.dest(paths.destDir + 'js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('jsLib', function() {
  return gulp.src(paths.sourceDir + 'js/lib/*.js')
    .pipe($.concat('lib.js'))
    .pipe($.uglify({
      preserveComments: saveLicense
    }))
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.destDir + 'js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('jsTasks', [
  'jsApp',
  'jsLib'
]);

/*------------------------------------------------------------------------------
 * 6. sass Tasks
------------------------------------------------------------------------------*/
gulp.task('scss', function() {
    return $.rubySass(paths.sourceDir + 'scss', {
      require: 'sass-globbing',
      sourcemap: true
    })
    .on('error', function (err) { console.error('Error!', err.message); })
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe($.csso())
    .pipe($.sourcemaps.write('maps', {
      includeContent: false,
      sourceRoot: paths.destDir + 'css'
    }))
    .pipe(gulp.dest(paths.destDir + 'css'))
    .pipe(browserSync.reload({ stream: true }));
});

/*------------------------------------------------------------------------------
 * 7. Image file tasks
------------------------------------------------------------------------------*/
gulp.task('image-min', function() {
  return gulp.src(paths.sourceDir + 'images/page/{*.png, **/*.png}')
    .pipe($.imagemin({ optimizationLevel: 3 }))
    .pipe(gulp.dest(paths.destDir + 'images/page'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('sprite', function () {
  var spriteData = gulp.src(paths.sourceDir + 'images/sprite/*.png')
  .pipe($.spritesmith({
    imgName: 'sprite.png',
    imgPath: '/' + paths.destDir + 'images/sprite.png',
    cssName: '_m-sprite.scss'
  }));
  spriteData.img
    .pipe($.imagemin({ optimizationLevel: 3 }))
    .pipe(gulp.dest(paths.destDir + 'images'));
  spriteData.css.pipe(gulp.dest(paths.sourceDir + 'scss/module'));
});

/*------------------------------------------------------------------------------
 * 8. gulp Tasks
------------------------------------------------------------------------------*/
gulp.task('watch', function() {
  gulp.watch([paths.sourceDir + 'jade/**/*.jade'], ['jade']);
  gulp.watch([paths.sourceDir + 'js/**/*.js'], ['jsTasks']);
  gulp.watch([paths.sourceDir + 'scss/**/*.scss'], ['scss']);
  gulp.watch([paths.sourceDir + 'images/sprite/*.png'], ['sprite']);
  gulp.watch([paths.sourceDir + 'images/page/**/*.png'], ['image-min']);
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

gulp.task('init', [
  'bower-init',
  'foundation-init'
]);
