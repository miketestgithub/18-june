import gulp from 'gulp';


// SCSS/CSS
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import autoprefixer from 'gulp-autoprefixer';
import csso from 'gulp-csso';

// FILES and Server
import fs from 'fs';
import server from 'gulp-server-livereload';
import clean from 'gulp-clean';
import fileInclude from 'gulp-file-include';
import htmlclean from 'gulp-htmlclean';

// IMAGES
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import webpHTML from 'gulp-webp-html';
import webpCSS from 'gulp-webp-css';


export const cleanall = () => {
    if(fs.existsSync('./dist/')){
        return gulp
            .src('./dist/', { read: false })
            .pipe(clean({ force: true }));
    }
}


const fileIncludeSetting = {
    prefix: '@@',
    basepath: '@file'
}

export const managehtml = () => {
    return gulp
        .src('./src/*.html')
        .pipe(fileInclude(fileIncludeSetting))
        .pipe(webpHTML())
        .pipe(htmlclean())
        .pipe(gulp.dest('./dist'))
}



export const buildCss = () => {
    return gulp
        .src('./src/scss/*.scss')
        .pipe(autoprefixer())
        .pipe(webpCSS())
        .pipe(sass())
        .pipe(csso())
        .pipe(gulp.dest('./dist/css/'))
}


export const images = () => {
    return gulp
        .src('src/img/**/*', {
            encoding: false
        })
        .pipe(webp())
        .pipe(gulp.dest('./dist/img/'))
        .pipe(gulp.src('src/img/**/*', {
            encoding: false
        }))
        .pipe(imagemin({ verbose: true }))
        .pipe(gulp.dest('./dist/img/'))
}

export const movefonts = () => {
    return gulp
        .src('./src/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts/'))
}


const serverOptions = {
    livereload: true,
    open: true,
    start: true
}

export const webserver = () => {
    return gulp
        .src('./dist/').pipe(server(serverOptions));
}

export const watch = () => {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel(buildCss));
    gulp.watch('./src/**/*.html', gulp.parallel(managehtml));
    gulp.watch('./src/img/**/*', gulp.parallel(images));
    gulp.watch('./src/fonts/**/*', gulp.parallel(movefonts));
}



export default gulp.series(
    gulp.parallel(managehtml, buildCss, images, movefonts),
    gulp.parallel(webserver, watch)
)
