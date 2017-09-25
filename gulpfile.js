'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var util = require('gulp-util');
var cache = require('gulp-cached');
var concat = require('gulp-concat');
var ggf = require('gulp-google-fonts');
var validateCss = require('gulp-w3c-css');
var path = require('path');
var color = require('gulp-color');
var htmlhint = require("gulp-htmlhint");
const babel = require('gulp-babel');
var beautify = require('gulp-beautify');
var htmlify = require('gulp-angular-htmlify');
var assets = require("gulp-assets");

var config = {
    srcSass: './assets/sass/**/*.scss',
    production: !!util.env.production
};

gulp.task('sass', function() {
  return gulp.src(config.srcSass)
    .pipe(cache('sass-processing'))
    .pipe(sass(config.production ? {outputStyle: 'compressed'} : {}).on('error', sass.logError))
    .pipe(config.production ? concat('main.min.css') : util.noop())
    .pipe(gulp.dest('./assets/css/'));
});

gulp.task('watch', function () {
  gulp.watch(config.srcSass, ['sass']);
});


gulp.task('getFonts', function () {
  return gulp.src('./assets/fonts/config.neon')
    .pipe(ggf())
    .pipe(gulp.dest('./assets/fonts/googleFonts'));
});

gulp.task('validateCss', function() {
    return gulp.src('./assets/css/*.css')
    .pipe(validateCss())
    .pipe(gulp.dest('./logs/css'));
})

gulp.task('colorConsole', function() {
        console.log(color('ERROR MESSAGE IS PRINTED', 'RED'));
        console.log(color('WARNING MESSAGE', 'YELLOW'))
        console.log(color('SUCCESS MESSAGE', 'GREEN'));
})

gulp.task('validateHTML', function() {
    gulp.src("./*.html")
    .pipe(htmlhint())
    .pipe(htmlhint.reporter())
    .pipe(gulp.dest('./logs/html'))
})
 
gulp.task('babelStuff', () =>
    gulp.src('./assets/js/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('./logs/js/babel'))
);

gulp.task('beautify', function() {
 gulp.src('./assets/js/*.js')
   .pipe(beautify({indent_size: 2}))
   .pipe(gulp.dest('./logs/js/beautify'))
});

gulp.task('concat', function() {
 return gulp.src('./assets/js/*.js')
   .pipe(concat('all.js'))
   .pipe(gulp.dest('./logs/js/concat/'));
});


 
//simple usage 
gulp.task('htmlify', function() {
    gulp.src('./*.html')
        .pipe(htmlify())
        .pipe(gulp.dest('logs/html/htmlify'));
});


gulp.task('htmlAssets', function() {
    gulp.src("./*.html")
    .pipe(assets({
        js: true,
        css: false
    }))
    .pipe(gulp.dest("'logs/html/assets'"));
})


gulp.task('htmlTasks', ['validateHTML', 'htmlify', 'htmlAssets']);
gulp.task('cssTasks', ['colorConsole', 'sass', 'watch', 'getFonts', 'validateCss']);
gulp.task('jsTasks', ['babelStuff', 'beautify', 'concat']);
gulp.task('default', ['cssTasks', 'jsTasks', 'htmlTasks']);
