let gulp        = require('gulp');
let $           = require('gulp-load-plugins')({ lazy: true });
let browserSync = require('browser-sync').create();
let path        = require('path');
let runSequence = require('run-sequence');

let autoprefixerOptions = {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

const SASS_INCLUDES = [
    path.join(__dirname, '/node_modules/bootstrap-sass/assets/stylesheets/'),
    path.join(__dirname, '/node_modules/normalize-scss/fork-versions/default/')
];
const SRC_FILES = {
    pug: path.join(__dirname, '/src/pug/'),
    sass: path.join(__dirname, '/src/scss/'),
    scripts: path.join(__dirname, '/src/scripts/')
};
const BUILD = {
    html: path.join(__dirname, '/src/build/'),
    css: path.join(__dirname, '/src/build/css/'),
    js: path.join(__dirname, '/src/build/js/')
};
const SERVER = path.join(__dirname, '/src/build/');

gulp.task('server', () => {
    browserSync.init({
        server: BUILD.html,
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

gulp.task('watch', () => {
    gulp.watch(SRC_FILES.pug + '**/*.pug', ['pug']);
    gulp.watch(SRC_FILES.sass + '**/*.+(scss|sass)', ['sass']);
});

gulp.task('default', (cb) => {
    runSequence(['pug', 'sass'], 'server', 'watch');
});
