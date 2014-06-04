/*******************************************************************************
 * 1. DEPENDENCIES
*******************************************************************************/
var gulp		=	require('gulp')
,	browserSync	=	require('browser-sync')
,	changed		=	require('gulp-changed')
,	cmq			=	require('gulp-combine-media-queries')
,	concat		=	require('gulp-concat')
,	filter		=	require('gulp-filter')
,	forEach		=	require('gulp-foreach')
,	gulpif		=	require('gulp-if')
,	imagemin	=	require('gulp-imagemin')
,	jade		=	require('gulp-jade')
,	minifycss	=	require('gulp-csso')
,	plumber		=	require('gulp-plumber')
,	prefix		=	require('gulp-autoprefixer')
,	prettify	=	require('gulp-prettify')
,	rename		=	require('gulp-rename')
,	sass		=	require('gulp-ruby-sass')
,	spritesmith	=	require('gulp.spritesmith')
;

/*******************************************************************************
 * 2. FILE DESTINATIONS (RELATIVE TO ASSSETS FOLDER)
*******************************************************************************/
var paths = {
	'dest':			''
,	'htmlDest':		'src/html'
,	'htmlDir':		'src/html/*.html'
,	'imgDest':		'files'
,	'imgDir':		'src/img/**'
,	'jadeDir':		'src/jade/*.jade'
,	'jsConcat':		'src/js/_*.js'
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
var bowerJS = [
	{ name: 'jQuery', dir: 'jquery/dist/jquery.js', prefix: false },
	{ name: 'bxSlider', dir: 'bxSlider/jquery.bxslider.min.js', prefix: true }
];
var bowerCSS = [
	{ name: 'foundation', dir: 'foundation/css/foundation.css', prefix: true }
];

gulp.task('init', function() {
	bowerJS.forEach(function(bowerjs){
		gulp.src('bower_components/' + bowerjs['dir'])
			.pipe(gulpif(bowerjs['prefix'], rename({ prefix: '_' })))
			.pipe(gulp.dest(paths.jsDest))
	});
	bowerCSS.forEach(function(bowercss){
		gulp.src('bower_components/' + bowercss['dir'])
			.pipe(gulpif(bowercss['prefix'],
				rename({ prefix: '_', extname: '.scss' }),
				rename({ extname: '.scss' })
			))
			.pipe(gulp.dest(paths.scssDest))
	});
});

gulp.task('browser-sync', function() {
	browserSync.init(null, {
		server: {
			baseDir: './'
		}
	});
});

gulp.task('browser-sync-vhost', function() {
	browserSync.init(null, {
		proxy: paths.vhost,
		port: 8080
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
gulp.task('concat', function() {
	return gulp.src(paths.jsConcat)
		.pipe(concat('jquery.plugins.js'))
		.pipe(gulp.dest('./js'))
		.pipe(gulp.src('src/js/scripts.js'))
		.pipe(gulp.dest('./js'));
});

/*******************************************************************************
 * 6. sass Tasks
*******************************************************************************/
gulp.task('scss', function() {
	return gulp.src(paths.scssDir)
		.pipe(plumber({ errorHandler: handleError }))
		.pipe(sass({ style: 'expanded' }))
		.pipe(prefix('last 2 version'))
		.pipe(gulp.dest(paths.dest));
});

gulp.task('scssProd', function() {
	return gulp.src(paths.scssDir)
		.pipe(plumber({ errorHandler: handleError }))
		// .pipe(sass({ style: 'expanded' }))
		.pipe(sass())
		.pipe(prefix('last 2 version'))
		//.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest(paths.dest));
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
		.pipe(gulp.dest(paths.imgDest));
});

gulp.task('sprite', function () {
	var spriteData = gulp.src('images/sprite/*.png')
	.pipe(spritesmith({
		imgName: 'images/sprite.png',
		cssName: '_sprite.scss'
	}));
	spriteData.img.pipe(gulp.dest("./"));
	spriteData.css.pipe(gulp.dest(paths.scssDest));
});

/*******************************************************************************
 * 8. gulp Tasks
*******************************************************************************/
gulp.task('watch', function() {
	gulp.watch([paths.jadeDir], ['jade']);
	gulp.watch([paths.imgDir], ['image']);
	gulp.watch([paths.imgDest + '/sprite/*.png'], ['sprite']);
	gulp.watch(['index.html']), ['html'];
	gulp.watch([paths.jsDir], ['concat']);
	gulp.watch([paths.scssDir], ['scss']);
	gulp.watch(['./*.php', './*.css'], ['bs-reload']);
});

gulp.task('default', [
	'browser-sync',
	'scss',
	'jade',
	'concat',
	'image',
	'sprite',
	'watch'
]);

gulp.task('vhost', [
	'browser-sync-vhost',
	'scss',
	'jade',
	'concat',
	'image',
	'sprite',
	'watch'
]);

gulp.task('prod', [
	'scssProd',
	'image',
	'jade'
]);