const addModuleExports = require('babel-plugin-add-module-exports');
const babelify = require('babelify');
const browserify = require('browserify');
const browserSync = require('browser-sync').create();
const buffer = require('vinyl-buffer');
const env = require('babel-preset-env');
const glslify = require('glslify');
const gulp = require('gulp');
const gutil = require('gulp-util');
const minify = require('gulp-minify');
const reload = browserSync.reload;
const source = require('vinyl-source-stream')
const watchify = require('watchify');

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
	var b = bundler
		.transform(babelify, { presets: [env], plugins: [addModuleExports] })
		.transform(glslify)
		.bundle()
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
