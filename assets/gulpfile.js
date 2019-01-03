'use strict';

const $            = require('gulp-load-plugins')();
const gulp         = require('gulp');
const browserSync  = require('browser-sync').create();
const del 		   = require('del');
const cssnano 	   = require('cssnano');
const cssnext 	   = require('postcss-cssnext');
const vinylPaths   = require('vinyl-paths');
const tableFlip    = $.message.logger({
    prefix: $.util.colors.magenta.bold('   (╯°□°）╯彡┻━┻ ')
})

let debug = true;
let proxy = 'instance.local';
let staticSrc = 'src/**/*.{webm,svg,eot,ttf,woff,woff2,otf,mp4,json,pdf,ico}';

//////  Clean

gulp.task('clean', () => {

	return gulp.src('dist', {read: false})
		.pipe($.clean());
});


//================================================================================
// CSS
//================================================================================

//////  SCSS compiling & Maps Generation

gulp.task('sass', () => {

	let out = gulp.src('src/scss/base.scss')
		.pipe( $.cssGlobbing({
			extensions: ['.scss']
		}));

	return out.pipe($.sourcemaps.init())
		.pipe($.sass({ style: 'compressed', sourcemap: true}))
		.on('error', $.sass.logError)
		.on('error', (err) => {
			$.notify().write(err);
		})
		.pipe($.rename('site.min.css'))
		.pipe($.sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream({match: '**/*.css'}));

});


//////  CSS autoprefixing and minifying

gulp.task('postcss',['sass'], () => {
    var plugins = [
        cssnext({
				browsers: ['last 5 versions','ie >= 9'],
				cascade: false
		}),
        cssnano({
            preset: ['default', {
                discardComments: {
                    removeAll: true,
                },
            }]
        })
    ];
    return gulp.src('dist/css/site.min.css')
        .pipe($.postcss(plugins))
        .pipe(gulp.dest('dist/css'))    
});

gulp.task('map',['sass'], () => {
    var plugins = [
        cssnext({
				browsers: ['last 1 versions','ie >= 10'],
				cascade: false
		})
    ];
    return gulp.src('dist/css/site.min.css')
    	.pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.postcss(plugins))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('dist/css'))
});


//////  SCSS Linting

gulp.task('sass-lint', () => {
	return gulp.src(['src/scss/**/*.s+(a|c)ss','!src/scss/vendor/*.s+(a|c)ss'])
		.pipe($.sassLint({
			configFile: './src/config/sass-lint.yml'
		}))
		.pipe($.sassLint.format())
		.pipe($.sassLint.failOnError())
});


//================================================================================
// JS
//================================================================================

//////  JS Linting

gulp.task('js-lint',['sass-lint'], () => {
    return gulp.src(['src/js/**/*.js','!node_modules/**','!src/js/vendor/**'])
        .pipe($.eslint({
        	extends: 'eslint:recommended',
        	configFile: 'src/config/eslint.yml'
        }))
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());
});


//////  Process JS after CSS, Starting with Linting, Including inline Source Maps

gulp.task('js', () => {

	return gulp.src(['src/js/site.js'])
		.pipe($.sourcemaps.init())
		.pipe($.browserify({
			insertGlobals : true,
			debug : debug
		}))
		.on('error', (err) => {
			$.notify().write(err);
		})
		.pipe($.babel({
			'presets': [
				['env', {
					'targets': {
						'browsers': ['last 5 versions', 'ie >= 9']
					}
				}]
			]

		}))
		.pipe($.rename('bundle.js'))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest('dist/js'));


});


//////  Bundle vendor scripts with our working file

gulp.task('js-bundle',['js'], () => {
	return gulp.src(['src/js/vendor/*','dist/js/bundle.js'])
		.pipe($.concat('bundle.js'))
		.pipe(gulp.dest('dist/js'));
});


//////  Minify and Delete the uncompressed bundle.js

gulp.task('js-compress', ['js-bundle'], () => {
    return gulp.src(['dist/js/bundle.js'])
    	.pipe($.stripDebug())
		.pipe($.uglify())
		.pipe(gulp.dest('dist/js/'));
});


gulp.task('js-watch', ['js'], (done) => {
	
	browserSync.reload();
	done();
});

//================================================================================
// Dev and Production runners
//================================================================================

//////  Dev

gulp.task( "dev", ['sass-lint', 'sass', 'map', 'js-lint', 'js', 'js-bundle'], () => {


	//////  Start browser sync

	$.message.info(' ');
	$.message.info($.util.colors.white.bold('   DEV MODE!  Watching SCSS and JS! Browsersync starting...'))
	$.message.info(' ');

	browserSync.init({
		proxy: proxy,
		ghostMode: false,
		https: {
		    "key": "/etc/apache2/ssl/localhost.key",
		    "cert": "/etc/apache2/ssl/localhost.crt"
		},		
	});


	//////  Watch

	gulp.watch('src/scss/**/*.scss', ['sass', 'sass-lint']);
	gulp.watch('src/js/**/*.js', ['js','js-bundle']);
	gulp.watch('src/js/**/*.js', ['js-watch']);
	gulp.watch().on('change', browserSync.reload);

	gulp.watch([
		'dist/**/*.js',
		'dist/**/*.css'
	]);
});


//////  Production

gulp.task('release', ['sass', 'postcss', 'js', 'js-compress'], () => {
	$.message.info(' ');
	tableFlip($.util.colors.magenta.bold(' Released for production!'))
	$.message.info(' ');
});
