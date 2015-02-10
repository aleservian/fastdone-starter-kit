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
    gulpif = require('gulp-if'),
    sprite = require('css-sprite').stream,
    reload = browserSync.reload,
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    bootstrap = require('bootstrap-styl');


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
    gulp.src('src/styl/main.styl')
    .pipe(stylus({
        use:[koutoSwiss(),bootstrap()]
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
/*********SPRITES*************/
gulp.task('sprites', function () {
    return gulp.src('src/sprites/*.png')
    .pipe(sprite({
      name: 'img-sprites',
      style: 'sprites.styl',
      prefix: 'ic',
      orientation : 'vertical',
      margin: 0,
      cssPath: '../img',
      processor: 'stylus'
    }))
    .pipe(gulpif('*.png', gulp.dest('src/img/')))
    .pipe(gulpif('*.styl', gulp.dest('src/styl/')));  
});
/***********JAVASCRIPT*************/
gulp.task('js', function() {
  gulp.src('src/js/**/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/assets/js'))
});
/*********WATCH AND DEFAULT************/
gulp.task('watch', function () {
    gulp.watch('src/styl/*.styl', ['css']);
    gulp.watch('views/*.jade', ['templates','css']);
    gulp.watch(['app/*.html'], reload);
    gulp.watch('src/img/*.{jpg,png,gif}', ['imagemin']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/sprites/*.png', ['sprites']);
});
gulp.task('default', ['js','sprites','imagemin'/*,'clean'*/,'css','templates','browser-sync','watch']);