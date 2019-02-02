const gulp = require('gulp');

const del = require('del');

const sourcemaps = require('gulp-sourcemaps');
const stylus = require('gulp-stylus');
const rename = require('gulp-rename');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

const browserSync = require('browser-sync').create();
const flatten = require('gulp-flatten');

const paths = {
  styles: './src/styl/*.styl',
  scripts: './src/js/*.js',
  static: './static/**/*.{html,jpeg}',
  dest: './dist',
};

gulp.task('clean', () => del(paths.dest));

gulp.task('browserSync', () => {
  browserSync.init({
    server: paths.dest,
  });
});

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

gulp.task('static', () => gulp.src(paths.static)
  .pipe(flatten())
  .pipe(gulp.dest(paths.dest)));

// CLI
gulp.task('build', gulp.parallel('static', 'styles', 'scripts'));
gulp.task('prod', gulp.series('clean', 'build'));
