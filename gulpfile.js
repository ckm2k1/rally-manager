var babel = require('gulp-babel');
var watch = require('gulp-watch');kjj

var buildDir = 'build';
var srcDir = "src/**/*.js";

var paths = {
  src: srcDir
}

//basic babel task
gulp.task('babel', function() {
  return gulp.src(paths.src)
  .pipe(babel())
  .pipe(gulp.dest('./'))
})

gulp.task('default', ['babel']);

//the watch task
gulp.task('watch', function() {
  gulp.watch(paths.babel, ['babel', 'pm2'])
});