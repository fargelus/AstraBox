const gulp = require('gulp');

const del = require('del');

const sourcemaps = require('gulp-sourcemaps');
const stylus = require('gulp-stylus');
const rename = require('gulp-rename');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

const paths = {
  styles: './src/styl/*.styl',
  scripts: './src/js/*.js',
  dest: './dist',
};

gulp.task('clean', () => del(paths.dest));

gulp.task('styles', () => gulp.src(paths.styles)
  .pipe(sourcemaps.init())
  .pipe(stylus({
    compress: true,
  }))
  .pipe(rename('jquery.astrabox.min.css'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.dest)));

gulp.task('scripts', () => gulp.src(paths.scripts)
  .pipe(concat('jquery.astrabox.min.js'))
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.dest)));

gulp.task('default', gulp.series('clean', gulp.parallel('styles', 'scripts')));
