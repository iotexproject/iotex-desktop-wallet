/* eslint-disable no-process-env,no-unused-vars */
const del = require('del');
const gulp = require('gulp');
const gulpLivereload = require('gulp-livereload');
const logger = require('global/console');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const webpack = require('webpack');
const PluginError = require('plugin-error');
const log = require('fancy-log');
const less = require('gulp-less');
const webpackConfig = require('./webpack');

const clean = () => {
  return del(['dist']);
};

const watchServer = done => {
  nodemon({
    exec: 'npm',
    ext: 'js json jsx yaml jade md',
    script: 'start',
    ignore: ['node_modules/', 'dist/', '*translations/'],
  });
  done();
};

const compileJavascripts = done => {
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      throw new PluginError('webpack', err);
    }
    log.info('[webpack]', stats.toString({}));
    done();
  });
};

const watchJavascripts = done => {
  gulp.watch(
    [
      'src/client/javascripts/**/*.js',
      'src/client/javascripts/**/*.jsx',
      'src/client/javascripts/**/*.json',
      'src/shared/**/*.js',
      'src/shared/**/*.jsx',
      'src/shared/**/*.json',
    ],
    compileJavascripts,
  );
  done();
};

const watchLivereload = done => {
  gulp.watch(['dist/**/*'], function onChange(e) {
    gulpLivereload.changed(e.path);
  });
  done();
};

const compileStylesheets = done => {
  gulp.src('src/client/stylesheets/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/stylesheets'));
  done();
};

const watchStylesheets = done => {
  gulp.watch('src/**/*.scss', compileStylesheets);
  done();
};

const compileLess = () => {
  return gulp.src('src/client/stylesheets/*.less')
    .pipe(less({
      javascriptEnabled: true,
      paths: ['./node_modules/antd/dist/antd.less'],
    }))
    .pipe(gulp.dest('dist/stylesheets'));
};

const compileStatic = done => {
  gulp.src('src/client/static/**/*')
    .on('error', function onError(err) {
      logger.error(err);
    })
    .pipe(gulp.dest('dist'));
  done();
};

const watchStatic = done => {
  gulp.watch('src/client/static/**/*', compileStatic, compileLess);
  done();
};

const build = gulp.parallel(compileJavascripts, compileStylesheets, compileStatic, compileLess);
const watch = gulp.series(gulp.parallel(build, watchJavascripts, watchStylesheets, watchStatic, compileLess), watchServer);

export {
  build,
  watch,
};

export default watch;
/* eslint-enable */
