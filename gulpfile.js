var gulp = require('gulp');
var babel = require('gulp-babel');
var watch = require('gulp-watch');
var rimraf = require('rimraf');
var mocha = require('gulp-mocha');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');

var buildPath = 'dist';
var srcGlob = 'lib/**/*.js';
var testGlob = 'tests/rally-manager/*.js';
var watchGlob = [srcGlob, testGlob];

gulp.task('clean', function(cb) {
  rimraf('dist/*', cb);
});

gulp.task('build', ['clean'], function() {
  return gulp.src(srcGlob)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .on('error', function(e) {
      console.log(e);
    })
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(buildPath));
});

gulp.task('watch', function() {
  return gulp.watch(watchGlob, ['build', 'test-cli']);
});

gulp.task('test-cli', ['build'], function() {
  return gulp.src(testGlob, {read: false})
    .pipe(mocha());
});

gulp.task('default', ['watch']);