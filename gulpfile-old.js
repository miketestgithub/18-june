const gulp = require('gulp');

// Files(html, etc.) and server
const fileInclude = require('gulp-file-include');
const clean = require('gulp-clean');
const fs = require('fs');
const server = require('gulp-server-livereload');
const htmlclean = require('gulp-htmlclean');

// CSS
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');

// IMAGES
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');



gulp.task('clean', function(done) {
    if(fs.existsSync('./dist/')){
        return gulp
        .src('./dist/', { read: false })
        .pipe(clean({ force: true }));
    }
    done();
})


const fileIncludeSetting = {
    prefix: '@@',
    basepath: '@file'
}


gulp.task('html', function() {
    return gulp.src('./src/*.html')
        .pipe(fileInclude(fileIncludeSetting))
        .pipe(htmlclean())
        .pipe(gulp.dest('./dist'))
});


gulp.task('sass', function(){
    return gulp.src('./src/scss/*.scss')
    .pipe(autoprefixer())
    .pipe(sass())
    .pipe(csso())
    .pipe(gulp.dest('./dist/css/'))
});



gulp.task('images', function(){
    return gulp
        .src('./src/img/**/*', {
            encoding: false
        })
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img/'))
});

gulp.task('fonts', function(){
    return gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts/'))
});

const serverOptions = {
    livereload: true,
    open: true,
    start: true
}
gulp.task('server', function() {
    return gulp.src('./dist/').pipe(server(serverOptions));
});

gulp.task('watch', function(){
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass'));
    gulp.watch('./src/**/*.html', gulp.parallel('html'));
    gulp.watch('./src/img/**/*', gulp.parallel('images'));
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts'));
});

gulp.task('default', gulp.series(
    'clean', 
    gulp.parallel('html', 'sass', 'images', 'fonts'),
    gulp.parallel('server', 'watch')
))