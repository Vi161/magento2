/* ==========================================================================
   Installation and how to use
   ========================================================================== */
/*
 * 1. Copy gulpfile and package.json in to the root directory
 * 3. If you are using Magento 2.2.2 or heigher height Un-comment line number 50 - 51in the gulpfile.js
 * 2. Install node.js for your OS: https://nodejs.org/en/
 * 3. Install modules: run a command in a root directory of your project "npm install"
	  (If you alrady instaled Grunt please remove node_module directory)
*/

/* ==========================================================================
   How to use
   ========================================================================== */
/*
* 1. Run : php bin\magento dev:source-theme:deploy --locale="en_AU" --area="Frontend" --theme="Netstarter/YOURTHEMENAME"
* 2. Run : php bin\magento setup:static-content:deploy en_AU
* 3. Run gulp command in the root directory with arguments or without. Examples:<br/>
* 3.a. Compilation of all themes: gulp<br/>
* 3.b. Compilation of certain theme: gulp less --luma<br/>
* 3.c. Watcher of certain theme: gulp watch --luma<br/>
* 3.d. Compilation of certain theme with minification (+~2.5s): gulp less --luma --min<br/>
* 3.e. Compilation of certain theme with sourcemap(+~1.5s), can't be used with minification: gulp less --luma --map<br/>
* 3.f. Compilation with live reload: gulp less --luma --live<br/>
* 3.g. Watcher with liveReload: gulp watch --luma --live<br/>
* 4. For using liveReload install extension for your browser: http://livereload.com/
* 5. For clear the magento cache: gulp cache-flush
* 6. For clear the magento static files cache: gulp clean --luma
<br/>4.a. Turn on the extension on the page of project.
 */


/* ==========================================================================
   Required modules
   ========================================================================== */
var gulp = require('gulp'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-cssmin'),
    livereload = require('gulp-livereload'),
    gulpif = require('gulp-if'),
    colors = require('colors'),
    exec = require('child_process').exec;


/* ==========================================================================
   Global configs of Magento2
   ========================================================================== */
var themesConfig = require('./dev/tools/grunt/configs/themes'),
    lessConfig = require('./dev/tools/grunt/configs/less').options;


/* ==========================================================================
   Variables
   ========================================================================== */

// Get all arguments
var devArguments = [];
for (i=3; i <= process.argv.length - 1; i++) {

    if (!process.argv[i]) {
        return false;
    }

    else {
        var argument = process.argv[i].toString().replace('--','');
        devArguments.push(argument);
    }
}

// Get theme name from Array of arguments
var themeName = devArguments[0];
var sourceMapArg = devArguments.indexOf("map");
var minCssArg = devArguments.indexOf("min");
var liveReload = devArguments.indexOf("live");

// Array with less files of the theme
var lessFiles = [];

/*
 * If no arguments in command
 * Get all themes, create paths for less files and push them to the Array.
 */
if (!themeName) {
    for (i in themesConfig) {
        // Create path
        var path = './pub/static/' + themesConfig[i].area + '/' + themesConfig[i].name + '/' + themesConfig[i].locale + '/';

        // Push names of less files to the Array
        for (j in themesConfig[i].files) {
            lessFiles.push(path + themesConfig[i].files[j] + '.' + themesConfig[i].dsl);
        }
    }
}

// Get certain theme, create paths for less files and push them to the Array.
else {
    // Create path
    var path = './pub/static/' + themesConfig[themeName].area + '/' + themesConfig[themeName].name + '/' + themesConfig[themeName].locale + '/';

    // Push names of less files to the Array
    for (i in themesConfig[themeName].files) {
        lessFiles.push(path + themesConfig[themeName].files[i] + '.' + themesConfig[themeName].dsl)
    }
}

/* ==========================================================================
   Gulp tasks
   ========================================================================== */

// Default task. Run compilation for all themes
gulp.task('default', ['less']);

// Less task
gulp.task('less', function() {
    // Console info
    console.log('\x1b[32m', '====================================' ,'\x1b[0m');
    console.log('Running \x1b[36mLess\x1b[0m compilation for \x1b[36m' + lessFiles.length + ' files:\x1b[0m');

    for (i in lessFiles) {
        console.log('\x1b[32m',lessFiles[i],'\x1b[0m');
    }
    // Get Array with files
    return gulp.src(lessFiles)

    // Source map
        .pipe(gulpif(sourceMapArg >= 0, sourcemaps.init()))

        // Less compilation
        .pipe(less().on('error', function(err) {
            console.log(err);
        }))

        // Minify css
        .pipe(gulpif(minCssArg >= 0, cssmin()))

        .pipe(gulpif(sourceMapArg >= 0, sourcemaps.write('.')))

        // Destination folder
        .pipe(gulp.dest( path + 'css/'))

        // Live reload
        .pipe(gulpif(liveReload >= 0, livereload()))
});

// Watcher task
gulp.task('watch', function() {
    console.log('\x1b[32m', '====================================' ,'\x1b[0m');
    console.log(' Watching:\x1b[32m', themesConfig[themeName].area + '/' + themesConfig[themeName].name ,'\x1b[0m');

    if (liveReload > 0) {
        console.log(' LiveReload:\x1b[32m', ' enabled','\x1b[0m');
        livereload.listen();
    }

    console.log('\x1b[32m', '====================================' ,'\x1b[0m');

    gulp.watch([path + '**/*.less'],['less']);
});

// Exec task
gulp.task('exec', function (cb) {
    if (themeName) {
        exec('php bin/magento dev:source-theme:deploy --locale="' + themesConfig[themeName].locale + '" --area="' + themesConfig[themeName].area + '" --theme="' + themesConfig[themeName].name + '"', function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    }

    else {
        console.log('Please add your defined Theme  ex: --luma'.red);
    }
})

// Static content deploy task
gulp.task('deploy', function (cb) {
    if (themeName) {
        exec('php bin/magento setup:static-content:deploy ' + themesConfig[themeName].locale + '', function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    }

    else {
        console.log('Please add your defined Theme  ex: --luma'.red);
    }
})


// cache flush task
gulp.task('cache-flush', function (cb) {
    exec('php bin/magento cache:flush', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
})



//svg sprite
var basePaths = {
    src: 'app/design/frontend/Magento/newizze/web/sprite_svg/build/',
    dest: 'app/design/frontend/Magento/newizze/web/sprite_svg/html/assets/',
};
var paths = {
    images: {
        src: basePaths.src + 'img/',
        dest: basePaths.dest + 'img/'
    },
    sprite: {
        src: basePaths.src + 'sprite/*',
        svg: 'img/sprite.svg',
        css: '../../' + basePaths.src + 'sass/src/_sprite.scss'
    },
    templates: {
        src: basePaths.src + 'tpl/'
    }
};

/*
	Let the magic begin
*/
var gulp = require('gulp');
var $ = {
    gutil: require('gulp-util'),
    svgmin: require('gulp-svgmin'),
    svgSprite: require('gulp-svg-sprite'),
    size: require('gulp-size'),
    cheerio: require('gulp-cheerio'),
};

var changeEvent = function (evt) {
    $.gutil.log('File', $.gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', $.gutil.colors.magenta(evt.type));
};

var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var pathSvgNewizze = require('path');

gulp.task('svgstore', function () {
    return gulp
        .src('app/design/frontend/Magento/newizze/web/sprite/*.svg')
        .pipe(svgmin(function (file) {
            var prefix = pathSvgNewizze.basename(file.relative, pathSvgNewizze.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(gulp.dest('app/design/frontend/Magento/newizze/web/images'));
});