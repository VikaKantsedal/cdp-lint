var gulp = require('gulp');
var bower = require('gulp-bower');
var less = require('gulp-less');
var del = require('del');
var util = require('gulp-util');
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var spritesmith = require('gulp.spritesmith');
var htmlreplace = require('gulp-html-replace');
var uglify = require('gulp-uglify');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');
var eslint = require('gulp-eslint');
var stylelint = require('gulp-stylelint');

var argv = require('minimist')(process.argv.slice(2), {
    string: 'env',
    default: {env: process.env.NODE_ENV || 'development'}
});

var conf = {
    less: './src/less/*.less',
    js: './src/js/*.js',
    images: ['./src/images/**/*.{png,svg}', '!src/images/icons/**'],
    icons: './src/images/icons/*.png',
    html: './src/*.html',
    sprite: {
        imgName: './images/build/sprite.png',
        cssName: './less/build/sprite.less',
        imgPath: '../images/build/sprite.png'
    },
    build: {
        folder: './build',
        css: './build/css',
        images: './build/images',
        js: './build/js',
        html: './build'
    }
};

var bootstrap = {
    less: './bower_components/bootstrap/less/bootstrap.less'
};

gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest('bower_components'));
});

gulp.task('images', ['clean', 'bower', 'sprite'], function () {
    return gulp.src(conf.images)
        .pipe(gulpif(argv.env === 'production', imagemin()))
        .pipe(gulp.dest(conf.build.images))
});

gulp.task('sprite', ['clean'], function () {
    return gulp.src(conf.icons)
        .pipe(spritesmith(conf.sprite))
        .pipe(gulp.dest('src/'));
});

gulp.task('html', ['clean'], function () {
    return gulp.src(conf.html)
        .pipe(htmlreplace({
            'css': './css/cdp.css',
            'js': './js/cdp.js',
            'logo': {
                src: './images/logo_gray-blue_80px.svg',
                tpl: '<img src="%s" alt="Epam logo"/>'
            }
        }))
        .pipe(gulp.dest(conf.build.html));
});

gulp.task('bundle', ['clean', 'html', 'images'], function (callback) {
    webpack(webpackConfig, function (err, stats) {
        if (err) throw new util.PluginError("webpack", err);
        util.log("[webpack]", stats.toString());
        callback();
    })
});
gulp.task('bundle-watch', ['clean', 'html', 'images', 'bundle'], function() {
    new WebpackDevServer(webpack(webpackConfig), {
        contentBase: 'build'
    }).listen(3000);
});

gulp.task('clean', function () {
    return del([conf.build.folder]);
});

gulp.task('build', ['images', 'html', 'bundle']);

gulp.task('bundle:prod', ['clean', 'html', 'images'], function(callback) {
    webpackConfig.devtool = false;
    webpackConfig.buildProd();
    webpack(webpackConfig, function (err, stats) {
        if (err) throw new util.PluginError("webpack", err);
        util.log("[webpack]", stats.toString());
        callback();
    })
});

gulp.task('watch', ['bundle-watch'], function () {
    return gulp.watch([conf.less, conf.js], ['bundle']);
});

gulp.task('lint:scripts', function () {
    return gulp
        .src(conf.js)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('lint:styles', function () {
    return gulp
        .src(conf.less)
        .pipe(stylelint({
            reporters: [
                {formatter: 'string', console: true}
            ]
        }));
});

gulp.task('lint', ['lint:scripts', 'lint:styles']);
