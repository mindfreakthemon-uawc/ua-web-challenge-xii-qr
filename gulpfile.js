const gulp = require('gulp');
const CustomRegistry = require('gulp-angular2-project-registry');

gulp.registry(new CustomRegistry());

gulp.task('default', gulp.task('dev'));

