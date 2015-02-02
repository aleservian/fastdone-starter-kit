var gulp = require('gulp'),
    jade = require('gulp-jade'),
    browserSync = require('browser-sync'),
    stylus = require('gulp-stylus'),
    koutoSwiss  = require('kouto-swiss'),
    minifyCSS = require('gulp-minify-css'),
    uncss = require('gulp-uncss'),
    glob = require('glob'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    reload = browserSync.reload;


/*********BROWSER SYNC*************/
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "app"
        }
    });
});
/*******JADE***********/
gulp.task('templates', function() {
  gulp.src(['!views/layout.jade','views/*.jade'])
    .pipe(jade({
        pretty: true
    }))
    .pipe(gulp.dest('app/'))
});
/********STYLUS**********/
gulp.task('css', function(){
    gulp.src('src/styl/sty.styl')
    .pipe(stylus({
        use:[koutoSwiss()]
    }))
    .pipe(uncss({
            html: glob.sync('app/*.html')
    }))
    .pipe(minifyCSS())
    .pipe(reload({stream:true, once: true}))
    .pipe(gulp.dest('app/assets/css'))
});
/***********IMAGE***************/
gulp.task('imagemin', function() {
         gulp.src('src/img/**/*')
        .pipe(imagemin({progressive: true, interlaced: true }))
        .pipe(gulp.dest('app/assets/img'));
});
/***********CLEAN***********/
gulp.task('clean', del.bind(null, ['.tmp', 'app/*'], {dot: true}));
/*********WATCH AND DEFAULT************/
gulp.task('watch', function () {
    gulp.watch('src/styl/*.styl', ['css']);
    gulp.watch('views/*.jade', ['templates']);
    gulp.watch(['app/*.html'], reload);
    gulp.watch('src/img/*.{jpg,png,gif}', ['imagemin']);
});
gulp.task('default', ['imagemin','clean','css','templates','browser-sync','watch']);