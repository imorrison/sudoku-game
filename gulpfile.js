'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var connect = require('gulp-connect');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var karma = require('karma');
var argv = require('yargs').argv;
var path = require('path');
var ghPages = require('gulp-gh-pages');

gulp.task('buildjs', function() {
  return browserify('./src/js/index.js')
    .bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest('build/sudoku/js/'));
});


gulp.task('buildcss', function() {
  return gulp.src('src/less/index.less')
    .pipe(less())
    .pipe(gulp.dest('build/sudoku/css/'));
});

gulp.task('buildhtml', function() {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('build/sudoku/'));
});

gulp.task('robots', function() {
  return gulp.src('src/robots.txt')
    .pipe(gulp.dest('build/sudoku/'));
});

gulp.task('connect', function() {
  return connect.server({
    root: ['build/sudoku/'],
    port: argv.serverport || 8000,
    livereload: true
   });
});

gulp.task('reload', ['build'], function() {
  return gulp.src('./build/sudoku/index.html')
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  return gulp.watch(['./src/**/*'], ['reload']);
});

gulp.task('unit', function(done) {
  karma.server.start({
    configFile: path.join(__dirname, '/karma.unit.conf.js'),
  }, done);
});

gulp.task('deploy', function() {
  gulp.src('./build/sudoku/**/*')
    .pipe(ghPages());
});


gulp.task('build', ['buildjs', 'buildcss', 'buildhtml', 'robots']);
gulp.task('default', ['build', 'connect', 'watch']);

