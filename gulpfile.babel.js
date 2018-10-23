/* eslint-disable no-process-env */
const del = require('del');
const gulp = require('gulp');
const gulpLivereload = require('gulp-livereload');
const gutil = require('gulp-util');
const logger = require('global/console');
const nodemon = require('gulp-nodemon');
const process = require('global/process');
const sass = require('gulp-sass');
const webpack = require('webpack');
const webpackDev = require('./webpack.dev');
const webpackProd = require('./webpack.prod');

gulp.task('clean', () => {
  return del(['dist']);
});

gulp.task('watch-server', () => {
  nodemon({
    exec: 'npm',
    ext: 'js json jsx yaml jade',
    script: 'start',
    ignore: ['node_modules/', 'dist/', '*translations/'],
  });
});

gulp.task('watch-javascripts', () => {
  gulp.watch(
    [
      'src/client/javascripts/**/*.js',
      'src/client/javascripts/**/*.jsx',
      'src/client/javascripts/**/*.json',
      'src/shared/**/*.js',
      'src/shared/**/*.jsx',
      'src/shared/**/*.json',
    ],
    ['compile-javascripts']
  );
});

gulp.task('compile-javascripts', () => {
  const config = process.env.NODE_ENV === 'production' ? webpackProd : webpackDev;
  webpack(config, (err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }
    gutil.log('[webpack]', stats.toString({}));
  });
});

gulp.task('watch-livereload', () => {
  gulp.watch(['dist/**/*'], function onChange(e) {
    gulpLivereload.changed(e.path);
  });
});

gulp.task('compile-stylesheets', () => {
  return gulp.src('src/client/stylesheets/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/stylesheets'));
});

gulp.task('watch-stylesheets', () => {
  gulp.watch('src/client/**/*.scss', ['compile-stylesheets']);
});

gulp.task('compile-static', () => {
  return gulp.src('src/client/static/**/*')
    .on('error', function onError(err) {
      logger.error(err);
    })
    .pipe(gulp.dest('dist'));
});

gulp.task('watch-static', () => {
  gulp.watch('src/client/static/**/*', ['compile-static']);
});

gulp.task('build', ['compile-javascripts', 'compile-stylesheets', 'compile-static']);
gulp.task('watch', ['build', 'watch-javascripts', 'watch-server', 'watch-stylesheets', 'watch-static']);
gulp.task('default', ['watch']);
/* eslint-enable */
