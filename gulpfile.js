var gulp   = require('gulp'),
	uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    insert = require('gulp-insert'),
    del    = require('del');

var licenseHeader = "/*\n * MetaJS - MetaPlatform project\n *\n * @author Jiri Hybek <jiri.hybek@cryonix.cz> / Cryonix Innovations <www.cryonix.cz>\n * @license MIT\n */\n";

var compress = function(name, src, output){

	return src.pipe(concat(output))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(insert.prepend(licenseHeader))
		.pipe(gulp.dest('dist/'));

};

gulp.task('default', function() {
	gulp.start('utils');
	gulp.start('template');
	gulp.start('view');
	gulp.start('fragment');
	gulp.start('activity');
	gulp.start('providers');
	gulp.start('channel');
	gulp.start('all');
});

gulp.task('utils', function() {
	
	var src = gulp.src('lib/utils.js');
	return compress("Utils", src, "utils.js");

});

gulp.task('template', function() {
	
	var src = gulp.src([
		'lib/utils.js',
		'lib/template.js'
	]);

	return compress("Template", src, "template.js");

});

gulp.task('view', function() {
	
	var src = gulp.src([
		'lib/utils.js',
		'lib/template.js',
		'lib/view.js'
	]);
	
	return compress("View", src, "view.js");

});

gulp.task('fragment', function() {
	
	var src = gulp.src([
		'lib/utils.js',
		'lib/template.js',
		'lib/view.js',
		'lib/fragment.js'
	]);
	
	return compress("Fragment", src, "fragment.js");

});

gulp.task('activity', function() {
	
	var src = gulp.src([
		'lib/utils.js',
		'lib/template.js',
		'lib/view.js',
		'lib/fragment.js',
		'lib/activity.js'
	]);
	
	return compress("Activity", src, "activity.js");

});

gulp.task('providers', function() {
	
	var src = gulp.src('lib/providers.js');
	return compress("Providers", src, "providers.js");

});

gulp.task('channel', function() {
	
	var src = gulp.src('lib/channel.js');
	return compress("Channel", src, "channel.js");

});

gulp.task('all', function() {
	return gulp.src('lib/*.js')
		.pipe(concat('metajs.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(insert.prepend(licenseHeader))
		.pipe(gulp.dest('dist/'))
		.pipe(notify({ message: 'Build complete' }));
});

gulp.task('clean', function(cb) {
    del([
    	'dist/template.min.js',
    	'dist/view.min.js',
    	'dist/fragment.min.js',
    	'dist/activity.min.js',
    	'dist/utils.min.js',
    	'dist/providers.min.js',
    	'dist/channel.min.js',
    	'dist/metajs.min.js'
    ], cb)
});