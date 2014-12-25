/*------------------------------------------------------------------------------
 * 1. DEPENDENCIES
------------------------------------------------------------------------------*/
var gulp = require('gulp'),
  $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
  }),
  browserSync = require('browser-sync'),
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
  'dest':       './'
, 'prodDest':   '../build'
// html
, 'htmlFiles':  'src/html/*.html'
, 'htmlDest':   'src/html'
// images
, 'imgDir':     'src/images'
, 'imgDest':    'shared/images'
// jade
, 'jadeFiles':  ['src/jade/*.jade', 'src/jade/**/*.jade']
, 'jadeDir':    'src/jade/*.jade'
// JavaScript
, 'jsDir':      'src/js'
, 'jsFiles':    'src/js/**/*.js'
, 'jsDest':     'shared/js'
// others
, 'phpFiles':   ['*.php', './**/*.php']
// scss
, 'scssFiles':  ['src/scss/**/*.scss', 'src/scss/**/*.sass']
, 'scssDir':    'src/scss'
// css
, 'cssFiles':  'bower_components/tmp/css/*.css'
, 'cssDest':   'shared/css'
};

/*------------------------------------------------------------------------------
 * 3. initialize browser-sync && bower_components
------------------------------------------------------------------------------*/
gulp.task('bower-init', function(){
  gulp.src(mainBowerFiles(), {base: './bower_components'})
    .pipe($.bowerNormalize())
    .pipe(gulp.dest(paths.dest));
  gulp.src(paths.cssFiles)
    .pipe($.rename({ prefix: '_m-', extname: '.scss' }))
    .pipe(gulp.dest(paths.scssDir + '/module'));
});

gulp.task('foundation-init', function() {
  var bfDir = 'bower_components/foundation/scss';
  gulp.src([bfDir + '/foundation.scss', bfDir + '/normalize.scss'])
    .pipe($.rename({ prefix: '_' }))
    .pipe(gulp.dest(paths.scssDir + '/core'))
  gulp.src(bfDir + '/**/_*.scss')
    .pipe(gulp.dest(paths.scssDir + '/core'));
});

gulp.task('browser-sync', function() {
  var args = {};
  if (bsOpt.proxy == false) {
    args.server = { baseDir: paths.dest };
    args.startPath = paths.htmlDest;
  } else {
    args.proxy = bsOpt.proxy;
    args.open = 'external';
  }
  if (bsOpt.tunnel != false) {
    args.tunnel = bsOpt.tunnel
  }
  browserSync(args);
});

gulp.task('bs-reload', function() {
  browserSync.reload()
});

/*------------------------------------------------------------------------------
 * 4. Jade Tasks
------------------------------------------------------------------------------*/
gulp.task('jade', function() {
  return gulp.src(paths.jadeDir)
    .pipe($.data(function(file) {
      return require('./setting.json');
    }))
    // .pipe($.changed(paths.htmlDest, { extension: '.html' }))
    .pipe($.plumber())
    .pipe($.jade({ pretty: true }))
    .pipe(gulp.dest(paths.htmlDest))
    .pipe(browserSync.reload({ stream: true }));
});

/*------------------------------------------------------------------------------
 * 5. js Tasks
------------------------------------------------------------------------------*/
gulp.task('jsApp', function() {
  return gulp.src(paths.jsDir + '/app/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.concat('script.js'))
    .pipe($.uglify())
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.jsDest))
    .pipe($.sourcemaps.write())
    .pipe($.rename({ suffix: '.dev' }))
    .pipe(gulp.dest(paths.jsDest))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('jsLib', function() {
  return gulp.src(paths.jsDir + '/lib/*.js')
    .pipe($.concat('lib.js'))
    .pipe($.uglify({
      preserveComments: saveLicense
    }))
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.jsDest))
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
  return gulp.src(paths.scssFiles)
    .pipe($.plumber({ errorHandler: handleError }))
    .pipe($.rubySass({
      r: 'sass-globbing',
      'sourcemap=none': true
      // sourcemap: none // #113 "Try updating to master. A fix for this went in but I won't be releasing anything until 1.0."
    }))
    .pipe($.filter('*.css'))
    .pipe($.pleeease({
      autoprefixer: {
        browsers: ['last 2 versions']
      },
      sourcemaps: true
    }))
    .pipe($.filter('*.css').restore())
    .pipe(gulp.dest(paths.cssDest))
    .pipe(browserSync.reload({ stream: true }));
});

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

/*------------------------------------------------------------------------------
 * 7. Image file tasks
------------------------------------------------------------------------------*/
gulp.task('image-min', function() {
  return gulp.src(paths.imgDest)
    .pipe($.changed(paths.imgDest))
    .pipe($.imagemin({ optimizationLevel: 3 }))
    .pipe(gulp.dest(paths.imgDest))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('sprite', function () {
  var spriteData = gulp.src(paths.imgDir + '/sprite/*.png')
  .pipe($.spritesmith({
    imgName: paths.imgDest + '/sprite.png',
    cssName: '_m-sprite.scss'
  }));
  spriteData.img.pipe(gulp.dest('./'));
  spriteData.css.pipe(gulp.dest(paths.scssDir + '/module'));
});

/*------------------------------------------------------------------------------
 * 8. gulp Tasks
------------------------------------------------------------------------------*/
gulp.task('watch', function() {
  gulp.watch([paths.jadeFiles], ['jade']);
  gulp.watch([paths.jsFiles], ['jsTasks']);
  gulp.watch([paths.scssFiles], ['scss']);
  gulp.watch([paths.imgDest + '/sprite/*.png'], ['sprite']);
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
  'foundation-init',
  'jsTasks'
]);
