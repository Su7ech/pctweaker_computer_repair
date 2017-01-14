/* */

let gulp        = require('gulp');
let $           = require('gulp-load-plugins')({ lazy: true });
let browserSync = require('browser-sync').create();
let path        = require('path');
let runSequence = require('run-sequence');

let autoprefixerOptions = {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

const SASS_INCLUDES = [
    path.join(__dirname, '/src/vendors/bootstrap/stylesheets/'),
    path.join(__dirname, '/node_modules/normalize-scss/fork-versions/default/')
];
const SRC_FILES = {
    pug: path.join(__dirname, '/src/pug/'),
    sass: path.join(__dirname, '/src/scss/'),
    scripts: path.join(__dirname, '/src/scripts/'),
    images: path.join(__dirname, '/src/images/'),
    vendor: path.join(__dirname, '/src/vendors/')
};
const BUILD = {
    html: path.join(__dirname, '/src/build/'),
    css: path.join(__dirname, '/src/build/css/'),
    js: path.join(__dirname, '/src/build/js/'),
    images: path.join(__dirname, '/src/build/img/'),
    fonts: path.join(__dirname, '/src/build/fonts/')
};
const SERVER = path.join(__dirname, '/src/build/');

gulp.task('server', () => {
    browserSync.init({
        server: SERVER,
        notify: false
    });
});

gulp.task('sass', () => {
    return gulp.src(SRC_FILES.sass + '**/*.+(scss|sass)')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            includePaths: SASS_INCLUDES
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer(autoprefixerOptions))
        .pipe($.sourcemaps.write(BUILD.css))
        .pipe(gulp.dest(BUILD.css))
        .pipe(browserSync.stream());
});

gulp.task('pug', () => {
    return gulp.src(SRC_FILES.pug + '**/!(_)*.pug')
        .pipe($.pug({
            pretty: true
        }))
        .pipe(gulp.dest(BUILD.html))
        .pipe(browserSync.stream());
});

gulp.task('concat', () => {
    return gulp
        .src([
            SRC_FILES.vendor + 'jquery/jquery.js',
            SRC_FILES.vendor + 'bootstrap/javascripts/bootstrap.js'
        ])
        .pipe($.newer(BUILD.js + 'script.js'))
        .pipe($.sourcemaps.init())
        .pipe($.concat('script.js'))
        .pipe($.sourcemaps.write(BUILD.js))
        .pipe(gulp.dest(BUILD.js));
});

gulp.task('images', () => {
    return gulp.src([SRC_FILES.images + '**/*.+(png|jpg|jpeg|gif|svg)'])
        .pipe($.cache($.imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest(BUILD.images));
});

gulp.task('fonts', () => {
    return gulp.src(SRC_FILES.vendor + 'bootstrap/fonts/**')
        .pipe($.newer(BUILD.fonts))
        .pipe(gulp.dest(BUILD.fonts));
});

gulp.task('watch', () => {
    gulp.watch(SRC_FILES.pug + '**/*.pug', ['pug']);
    gulp.watch(SRC_FILES.sass + '**/*.+(scss|sass)', ['sass']);
    gulp.watch([SRC_FILES.scripts + '**/*.js', 
        BUILD.js + 'script.js'
    ], ['concat', browserSync.reload]);
    gulp.watch(SRC_FILES.images + '**/*.+(png|jpg|jpeg|gif|svg)', ['images', browserSync.reload]);
});

gulp.task('default', (cb) => {
    runSequence(['pug', 'concat', 'sass', 'images', 'fonts'], 'server', 'watch', cb);
});
