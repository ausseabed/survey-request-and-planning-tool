var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var merge = require('merge-stream');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('default', function () {
    runSequence('build_node', 'copy_config');
});

gulp.task('copy_config', function () {
    var copies = [];

    copies.push(gulp.src(['./config/' + (process.env.NODE_ENV === 'production' ? 'production' : 'staging') + '.json'])
        .pipe(rename('config/default.json'))
        .pipe(gulp.dest('../dist')));

    copies.push(gulp.src(['./ssh/private'])
        .pipe(gulp.dest('../dist')));

    del(['../dist/config/production.json'], { force: true });
    del(['../dist/config/staging.json'], { force: true });
    del(['../dist/config/development.json'], { force: true });
    del(['../dist/config/default.json.sample'], { force: true });

    return merge(copies);
});

gulp.task('build_node', function () {
    return gulp.src(['**/*/',
        '!node_modules', '!node_modules/**',
        '!bower_components', '!bower_components/**',
        '!obj', '!obj/**',
        '!gulpfile.js',
        '!build/**/*',
        '!build',
        '!bower.json'])
        .pipe(gulp.dest('../dist/'));
});
