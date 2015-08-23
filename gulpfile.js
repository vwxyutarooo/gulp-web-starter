'use strict';
/*------------------------------------------------------------------------------
 * 1. DEPENDENCIES
------------------------------------------------------------------------------*/
var gulp          = require('gulp'),
  $               = require('gulp-load-plugins')({ pattern: ['gulp-*', 'gulp.*'] }),
  argv            = require('yargs').argv,
  browserify      = require('browserify'),
  browserSync     = require('browser-sync').create(),
  buffer          = require('vinyl-buffer'),
  fs              = require('fs'),
  glob            = require('glob'),
  merge           = require('merge-stream'),
  path            = require('path'),
  runSequence     = require('run-sequence'),
  source          = require('vinyl-source-stream'),
  watchify        = require('watchify')
;


/*------------------------------------------------------------------------------
 * 2. FILE DESTINATIONS (RELATIVE TO ASSSETS FOLDER)
------------------------------------------------------------------------------*/
// @param Choose css framework between foundatino and bootstrap
// @param false or virtual host name of local machine such as . Set false to browser-sync start as server mode.
// @param false or Subdomains which must be between 4 and 20 alphanumeric characters.
var opt = {
  'cssBase'      : 'foundation',
  '_s'           : false,
  'proxy'        : '192.168.33.10',
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
  'srcJson'      : './src/json/',
  'srcScss'      : 'src/scss/',
  'destDir'      : './assets/',
  'destImg'      : 'assets/images/',
  'destCss'      : './assets/css/',
  'destJs'       : './assets/js/',
  'htmlDir'      : './',
  'reloadOnly'   : ['**/*.php']
};

var rubySassConf = {
  loadPath       : [],
  require        : 'sass-globbing',
  sourcemap      : false
};

function getFolders(dir) {
  return fs.readdirSync(dir).filter(function(file) {
    return fs.statSync(path.join(dir, file)).isDirectory();
  });
}


/*------------------------------------------------------------------------------
 * 3. initializing bower_components
------------------------------------------------------------------------------*/
gulp.task('bower:install', $.shell.task(['bower install']));

gulp.task('install:cssBase', function() {
  if(opt.cssBase) {
    return gulp.src('src/shell/', {read: false})
      .pipe($.shell(['bash src/shell/' + opt.cssBase + '.sh']))
  } else {
    console.log('Skip installing css framework');
  }
});

gulp.task('install:_s', function() {
  if (opt._s === true) {
    return gulp.src('src/shell/_s.sh', {read: false})
      .pipe($.shell(['bash src/shell/_s.sh']));
  } else {
    console.log('Skip installing _s');
  }
});


/*------------------------------------------------------------------------------
 * 4. Jade Tasks
------------------------------------------------------------------------------*/
gulp.task('jade', function() {
  return gulp.src(paths.srcJade + '*.jade')
    .pipe($.data(function(file) { return require('./src/json/setting.json'); }))
    .pipe($.plumber())
    .pipe($.jade({ pretty: true }))
    .pipe(gulp.dest(paths.htmlDir));
});


/*------------------------------------------------------------------------------
 * 5. js Tasks
------------------------------------------------------------------------------*/
gulp.task('js:browserify', function() {
  var folders = getFolders(paths.srcJs);
  var tasks = folders.map(function(folder) {
    var bundler = browserify(path.join(paths.srcJs, folder, '/app.js'));
    return jsBundle(bundler, folder);
  });
  return merge(tasks);
});

gulp.task('js:watchify', function() {
  var folders = getFolders(paths.srcJs);
  var tasks = folders.map(function(folder) {
    var bundler = watchify(browserify(path.join(paths.srcJs, folder, '/app.js'), watchify.args));
    bundler.on('update', function() { jsBundle(bundler, folder); });
    bundler.on('log', function(message) { console.log(message); });
    return jsBundle(bundler, folder);
  });
  return merge(tasks);
});

function jsBundle(bundler, folder) {
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


/*------------------------------------------------------------------------------
 * 6. sass Tasks
------------------------------------------------------------------------------*/
switch(opt.cssBase) {
  case 'foundation':
    rubySassConf.loadPath.push('bower_components/foundation/scss');
    break;
  case 'bootstrap':
    rubySassConf.loadPath.push('bower_components/bootstrap-sass-official/assets/stylesheets');
    break;
}

gulp.task('scss', function() {
  return $.rubySass(paths.srcScss, rubySassConf)
    .on('error', function(err) { console.error('Error!', err.message); })
    .pipe($.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'ie 10', 'ie 9'],
      cascade: false
    }))
    .pipe($.csso())
    .pipe(gulp.dest(paths.destCss))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});


/*------------------------------------------------------------------------------
 * 7. Image file tasks
------------------------------------------------------------------------------*/
gulp.task('image-min', function() {
  gulp.src(paths.destImg + 'page/**/*.*')
    .pipe($.imagemin({ optimizationLevel: 3 }))
    .pipe(gulp.dest(paths.destImg + 'page/'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('sprite', function() {
  var folders = getFolders(paths.srcImg + 'sprite');
  var tasks = folders.map(function(folder) {
    var spriteData = gulp.src(path.join(paths.srcImg + 'sprite', folder, '/*.png'))
    .pipe($.spritesmith({
      imgName: 'sprite-' + folder + '.png',
      imgPath: '/' + paths.destImg + 'sprite-' + folder + '.png',
      cssName: '_sprite-' + folder + '.scss'
    }));
    spriteData.img
      .pipe($.imagemin({ optimizationLevel: 3 }))
      .pipe(gulp.dest(paths.destImg));
    spriteData.css.pipe(gulp.dest(paths.srcScss + 'base'));
  });
});

gulp.task('sprite:inline-svg', function() {
  var folders = getFolders(paths.srcImg + 'sprite-svg');
  var tasks = folders.map(function(folder) {
    return gulp.src(path.join(paths.srcImg + 'sprite-svg', folder, '/*.svg'))
      .pipe($.svgSprite({
        dest: './',
        mode: { symbol: { dest: './' } }
      }))
      .pipe($.rename({
        basename: 'symbol',
        dirname: './',
        prefix: 'sprite-' + folder + '.'
      }))
      .pipe(gulp.dest(paths.destImg));
  });
  return merge(tasks);
});


/*------------------------------------------------------------------------------
 * 8. browser-sync
------------------------------------------------------------------------------*/
gulp.task('jade:bs', ['jade'], function() {
  browserSync.reload();
  return;
});
gulp.task('js:bs', ['js:browserify'], function() {
  browserSync.reload();
  return;
});
gulp.task('sprite:bs', ['sprite'], function() {
  browserSync.reload();
  return;
});
gulp.task('inline-svg:bs', ['sprite:inlin-svg'], function() {
  browserSync.reload();
  return;
});

gulp.task('browser-sync', function() {
  var args = {};
  if (argv.mode == 'server' ) {
    args.server = { baseDir: paths.root };
    args.startPath = paths.htmlDir;
  } else {
    args.proxy = opt.proxy;
    args.open = 'external';
  }
  if (opt.tunnel != false) args.tunnel = opt.tunnel;
  args.browser = opt.browser;
  browserSync.init(args);

  gulp.watch([paths.srcJade + '**/*.jade'], {interval: 500}, ['jade:bs']);
  gulp.watch([paths.srcJs   + '**/*.js'], {interval: 500}, ['js:bs']);
  gulp.watch([paths.srcScss + '**/*.scss'], {interval: 500}, ['scss']);
  gulp.watch([paths.srcImg  + 'sprite/**/*.png'], {interval: 500}, ['sprite:bs']);
  gulp.watch([paths.srcImg  + 'sprite-svg/**/*.svg'], {interval: 500}, ['inline-svg:bs']);
  gulp.watch([paths.reloadOnly], {interval: 500}).on('change', browserSync.reload);
});


/*------------------------------------------------------------------------------
 * 9. gulp Tasks
------------------------------------------------------------------------------*/
gulp.task('watch', function() {
  gulp.watch([paths.srcJade + '**/*.jade'], {interval: 500}, ['jade']);
  gulp.watch([paths.srcJs   + '**/*.js'], {interval: 500}, ['js:watchify']);
  gulp.watch([paths.srcScss + '**/*.scss'], {interval: 500}, ['scss']);
  gulp.watch([paths.srcImg  + 'sprite/**/*.png'], {interval: 500}, ['sprite']);
  gulp.watch([paths.srcImg  + 'sprite-svg/**/*.svg'], {interval: 500}, ['sprite:inline-svg']);
});

gulp.task('default', [
  'browser-sync',
  'sprite',
  'sprite:inline-svg',
]);

gulp.task('init', function(cb) {
  runSequence('bower:install', ['install:cssBase'], 'install:_s', cb);
});
