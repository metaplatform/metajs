var gulp   = require('gulp'),
	uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    insert = require('gulp-insert'),
    del    = require('del');

var licenseHeader = "/*\n * MetaJS - MetaPlatform project\n *\n * @author Jiri Hybek <jiri.hybek@cryonix.cz> / Cryonix Innovations <www.cryonix.cz>\n * @license MIT\n */\n";

gulp.task('default', function() {
	gulp.start('lib');
});

gulp.task('lib', function() {
	return gulp.src('lib/*.js')
		.pipe(concat('metajs.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(insert.prepend(licenseHeader))
		.pipe(gulp.dest('dist/'))
		.pipe(notify({ message: 'Build complete' }));
});

gulp.task('clean', function(cb) {
    del(['dist/metajs.min.js'], cb)
});