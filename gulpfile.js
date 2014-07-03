/*******************************************************************************
 * 1. DEPENDENCIES
*******************************************************************************/
var gulp		=	require('gulp')
,	bower		=	require('gulp-bower-files')
,	browserSync	=	require('browser-sync')
,	changed		=	require('gulp-changed')
,	concat		=	require('gulp-concat')
,	csscomb		=	require('gulp-csscomb')
,	flatten		=	require('gulp-flatten')
,	gulpFilter	=	require('gulp-filter')
,	imagemin	=	require('gulp-imagemin')
,	jade		=	require('gulp-jade')
,	minifycss	=	require('gulp-csso')
,	plumber		=	require('gulp-plumber')
,	prefix		=	require('gulp-autoprefixer')
,	prettify	=	require('gulp-prettify')
,	rename		=	require('gulp-rename')
,	sass		=	require('gulp-ruby-sass')
,	sourcemaps	=	require('gulp-sourcemaps')
,	spritesmith	=	require('gulp.spritesmith')
,	uglify		=	require('gulp-uglify')
;

/*******************************************************************************
 * 2. FILE DESTINATIONS (RELATIVE TO ASSSETS FOLDER)
*******************************************************************************/
var paths = {
	'dest':			''
,	'htmlDest':		'src/html'
,	'imgDest':		'images'
,	'imgDir':		'src/img/**'
,	'jadeDir':		'src/jade/*.jade'
,	'jsLib':		'src/lib/*.js'
,	'jsDest':		'src/js'
,	'jsDir':		'src/js/*.js'
,	'scssDest':		'src/scss'
,	'scssDir':		['src/scss/*.scss', 'src/scss/*.sass']
,	'vhost':		'wordpress.dev'
,	'port':			8080
}

/*******************************************************************************
 * 3. initialize browser-sync && bower_components
*******************************************************************************/
gulp.task('bower-init', function(){
	var filterJs = gulpFilter('*.js');
	var filterCss = gulpFilter('*.css');
	bower().pipe(gulp.dest('src/lib'))
	gulp.src('src/lib/**')
		.pipe(filterJs)
		.pipe(concat('lib.js'))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('js'))
		.pipe(filterJs.restore())
		.pipe(filterCss)
		.pipe(rename({ prefix: '_module-', extname: '.scss' }))
		.pipe(flatten())
		.pipe(gulp.dest(paths.scssDest + '/module'));
});

gulp.task('foundation-init', function() {
	var filter = gulpFilter(['foundation.scss', 'normalize.scss']);
	gulp.src('src/lib/foundation/scss/**')
		.pipe(filter)
		.pipe(rename({ prefix: '_' }))
		.pipe(filter.restore())
		.pipe(gulp.dest(paths.scssDest + '/core'));
});

gulp.task('browser-sync', function() {
	browserSync.init(null, {
		server: {
			baseDir: './'
		},
		startPath: 'src/html'
	});
});

gulp.task('browser-sync-vhost', function() {
	browserSync.init(null, {
		proxy: paths.vhost
	});
});

gulp.task('bs-reload', function() {
	browserSync.reload()
});

/*******************************************************************************
 * 4. Jade Tasks
*******************************************************************************/
gulp.task('jade', function() {
	return gulp.src(paths.jadeDir)
		.pipe(jade())
		.pipe(gulp.dest(paths.htmlDest))
		.pipe(prettify())
		.pipe(gulp.dest(paths.htmlDest))
		.pipe(browserSync.reload({stream:true}));
});

/*******************************************************************************
 * 5. js Tasks
*******************************************************************************/
gulp.task('js', function() {
	return gulp.src('src/lib/app/*.js')
		.pipe(sourcemaps.init())
		.pipe(concat('script.js'))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('js'))
		.pipe(browserSync.reload({stream: true}));
});

/*******************************************************************************
 * 6. sass Tasks
*******************************************************************************/
gulp.task('scss', function() {
	return gulp.src(paths.scssDir)
		.pipe(plumber({ errorHandler: handleError }))
		.pipe(sass())
		.pipe(prefix('last 2 version'))
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.reload({stream: true}));
});

function handleError(err) {
	console.log(err.toString());
	this.emit('end');
}

/*******************************************************************************
 * 7. Image file tasks
*******************************************************************************/
gulp.task('image', function() {
	return gulp.src(paths.imgDir)
		.pipe(changed(paths.imgDest))
		.pipe(imagemin({optimizationLevel: 3}))
		.pipe(gulp.dest(paths.imgDest))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('sprite', function () {
	var spriteData = gulp.src(paths.imgDest + '/sprite/*.png')
	.pipe(spritesmith({
		imgName: paths.imgDest + '/sprite.png',
		cssName: '_module-sprite.scss'
	}));
	spriteData.img.pipe(gulp.dest("./"));
	spriteData.css.pipe(gulp.dest(paths.scssDest + '/module'));
});

/*******************************************************************************
 * 8. gulp Tasks
*******************************************************************************/
gulp.task('watch', function() {
	gulp.watch([paths.jadeDir], ['jade']);
	gulp.watch([paths.imgDir], ['image']);
	gulp.watch([paths.imgDest + '/sprite/*.png'], ['sprite']);
	gulp.watch([paths.jsDir], ['js']);
	gulp.watch([paths.scssDir], ['scss']);
	gulp.watch(['./*.php'], ['bs-reload']);
});

gulp.task('default', [
	'browser-sync',
	'scss',
	'jade',
	'js',
	'image',
	'sprite',
	'watch'
]);

gulp.task('vhost', [
	'browser-sync-vhost',
	'scss',
	'jade',
	'js',
	'image',
	'sprite',
	'watch'
]);

gulp.task('init', [
	'bower-init',
	'foundation-init'
]);