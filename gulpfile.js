var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');
var rename = require("gulp-rename");
var ignore = require("gulp-ignore");
var banner = require("gulp-banner");
var githubStylePage = require('gulp-github-style-page');
var shelljs = require('shelljs');
var ghPages = require("gh-pages");
var pkg = require('./package.json');

var cwd = process.cwd();

var comment = '/*\n' +
    ' * <%= pkg.name %> <%= pkg.version %>\n' +
    ' * <%= pkg.description %>\n' +
    ' * <%= pkg.homepage %>\n' +
    ' *\n' +
    ' * Copyright 2015, <%= pkg.author %>\n' +
    ' * Released under the <%= pkg.license %> license.\n' +
    '*/\n\n';

function getHtmlFile(dir) {
    var exampleDir = path.join(cwd, dir);
    var files = fs.readdirSync(exampleDir);
    var entry = [];

    files.forEach(function(file) {
        var extname = path.extname(file);
        var name = path.basename(file, extname);
        if (extname === '.html') {
            entry.push(name);
        }
    });

    return entry;
}

gulp.task('default', function() {
    gulp.start(['browserify', 'gh-pages']);
});

gulp.task('cleanBuild', function() {
    shelljs.rm('-rf', path.join(cwd, 'build'));
});

gulp.task('before-gh-pages', function() {
    gulp.start(['copy-example', 'example-browserify', 'readme']);
});

gulp.task('copy-example', function() {
    gulp.src('example/**/*')
        .pipe(ignore.exclude('*.js'))
        .pipe(gulp.dest('build/example'));
});

gulp.task('readme', function() {
    gulp.src('./README.md')
        .pipe(githubStylePage({
            template: 'project',
            vars: {
                pkg: pkg,
                examples: getHtmlFile('./build/example')
            }
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('build'));
});

gulp.task('browserify', function() {
    gulp.src('lib/index.js')
        .pipe(browserify({
            ignore: ['fs', 'Buffer']
        }))
        .pipe(uglify())
        .pipe(banner(comment, {
            pkg: pkg
        }))
        .pipe(rename('image-to-slices.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('example-browserify', function() {
    var exampleComment = '/*\n' +
        ' * <%= pkg.name %>@<%= pkg.version %> example\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright 2015, <%= pkg.author %>\n' +
        '*/\n\n';

    gulp.src('example/*.js')
        .pipe(browserify({
            ignore: ['fs', 'Buffer']
        }))
        .pipe(uglify())
        .pipe(banner(exampleComment, {
            pkg: pkg
        }))
        .pipe(gulp.dest('build/example'));
});

gulp.task('gh-pages', ['before-gh-pages'], function(done) {
    console.log('gh-pages start');
    if (fs.existsSync(path.join(cwd, './example/'))) {
        ghPages.publish(path.join(cwd, 'build'), {
            logger: function(message) {
                console.log(message);
            }
        }, function() {
            console.log('gh-pages end');
            done();
        });
    } else {
        done();
    }
});
