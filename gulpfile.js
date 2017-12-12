'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');

var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream')

var browserify = require('browserify');
var watchify = require('watchify');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var minify = require('gulp-minify');

const isProd = process.env.NODE_ENV === 'production';

// JS
var bundler = isProd ?
	browserify('./src/scripts/main.js', watchify.args) :
	watchify(browserify('./src/scripts/main.js', watchify.args));

bundler.on('update', bundle);

function logError(msg) {
	console.log( msg.toString() );
}

function bundle() {
	var b = bundler.bundle()
		.on('error', logError)
		.pipe(source('main.js'))
		.pipe(buffer())
		.pipe(isProd ? minify({ ext: { min: '.min.js' }}) : gutil.noop())
		.pipe(gulp.dest('./dist/scripts/'))
		.pipe(reload({stream: true, once: true}));
	return b;
}

gulp.task('browserify', bundle);

// CSS
gulp.task('watch', function() {
	gulp.watch('./src/scss/*.scss', ['sass']);
});

gulp.task('sass', function() {
	return sass('./src/scss/main.scss')
	.on('error', function (err) {
		console.error('Error!', err.message);
	})
	.pipe(prefix({
			browsers: ['last 2 versions'],
			cascade: false
		}))
	.pipe(gulp.dest('./dist/css'))
	.pipe(reload({stream:true}));
});

// Server
gulp.task('serve', function() {
	browserSync.init({
		server: {
			baseDir: './dist/'
		},
		reloadDebounce: 500
	});
});

// Default
let tasks = [];
if (isProd) {
	tasks = ['browserify'];
} else {
	tasks = ['browserify', 'serve', 'watch'];
}

gulp.task('default', tasks);
