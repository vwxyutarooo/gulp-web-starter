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
  'srcJson'      : 'src/json/',
  'srcScss'      : 'src/scss/',
  'destDir'      : 'assets/',
  'destImg'      : 'assets/images/',
  'destCss'      : 'assets/css/',
  'destJs'       : 'assets/js/',
  'htmlDir'      : '',
  'reloadOnly'   : ['*.php', '**/*.php']
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
 * 4. browser-sync
------------------------------------------------------------------------------*/
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
});

gulp.task('bs-reload', function() {
  browserSync.reload()
});

/*------------------------------------------------------------------------------
 * 5. Jade Tasks
------------------------------------------------------------------------------*/
gulp.task('jade', function() {
  return gulp.src(paths.srcJade + '*.jade')
    .pipe($.data(function(file) { return require('./src/json/setting.json'); }))
    .pipe($.plumber())
    .pipe($.jade({ pretty: true }))
    .pipe(gulp.dest(paths.htmlDir));
});

/*------------------------------------------------------------------------------
 * 6. js Tasks
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
  return bundler
    .bundle()
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(source('bundle_' + folder + '.js'))
    .pipe(buffer())
    .pipe($.uglify())
    .pipe(gulp.dest(paths.destDir + 'js'));
};

/*------------------------------------------------------------------------------
 * 7. sass Tasks
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
    .pipe(browserSync.stream());
});

/*------------------------------------------------------------------------------
 * 8. Image file tasks
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
 * 9. gulp Tasks
------------------------------------------------------------------------------*/
gulp.task('watch', function() {
  gulp.watch([paths.srcJade + '**/*.jade'],       ['jade', browserSync.reload]);
  gulp.watch([paths.srcJs   + '**/*.js'],         ['js:watchify', browserSync.reload]);
  gulp.watch([paths.srcScss + '**/*.scss'],       ['scss']);
  gulp.watch([paths.srcImg  + 'sprite/**/*.png'], ['sprite']);
  gulp.watch([paths.srcImg  + 'sprite-svg/**/*.svg'], ['sprite:inline-svg', browserSync.reload]);
  gulp.watch([paths.reloadOnly]).on('change', browserSync.reload);
});

gulp.task('default', [
  'browser-sync',
  'sprite',
  'sprite:inline-svg',
  'watch'
]);

gulp.task('init', function(cb) {
  runSequence('bower:install', ['install:cssBase'], 'install:_s', cb);
});
