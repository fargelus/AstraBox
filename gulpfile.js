const gulp = require('gulp');

// Styles
const sourcemaps = require('gulp-sourcemaps');
const stylus = require('gulp-stylus');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

// Scripts
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

// Other
const browserSync = require('browser-sync').create();
const flatten = require('gulp-flatten');
const del = require('del');

const paths = {
  styles: {
    bundle: './src/styl/all.styl',
    all: './src/styl/*.styl',
  },
  scripts: [
    './src/js/core.js',
  ],
  static: './static/**/*.{html,jpeg}',
  dest: './dist',
};

gulp.task('clean', () => del(paths.dest));

gulp.task('browserSync', () => {
  browserSync.init({
    server: paths.dest,
  });

  browserSync.watch(paths.dest).on('change', browserSync.reload);
});

gulp.task('styles', () => gulp.src(paths.styles.bundle)
  .pipe(sourcemaps.init())
  .pipe(stylus({
    compress: true,
  }))
  .pipe(
    autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false,
    }),
  )
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

gulp.task('watch', () => {
  gulp.watch(paths.static, gulp.series('static'));
  gulp.watch(paths.styles.all, gulp.series('styles'));
  gulp.watch(paths.scripts, gulp.series('scripts'));
});

// CLI
gulp.task('build', gulp.parallel('static', 'styles', 'scripts'));
gulp.task('prod', gulp.series('clean', 'build'));
gulp.task('dev', gulp.parallel('watch', 'browserSync'));
