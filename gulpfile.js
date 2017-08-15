const browserSync = require('browser-sync').create();

const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const child = require('child_process');
const gutil = require('gulp-util');
const site_root = '_site';

// Which browsers should be prefixed
		var browsers = [
			'ie >= 10',
			'ie_mob >= 10',
			'ff >= 30',
			'chrome >= 34',
			'safari >= 7',
			'opera >= 23',
			'ios >= 7',
			'android >= 4.4',
			'bb >= 10'
		];

// Setup theme paths
var paths = {
	src: {
		css: './src/scss',
		images: './src/img',
		js: './src/js',
		includes: './_includes'
	},
	dist: {
		css: './_includes/css',
		images: './img',
		js: './_includes/css'
	}
};


gulp.task('images', function() {
  gulp.src( paths.src.images + '/**/*.{png,jpg,jpeg,gif,svg}')
    .pipe( imagemin( {
        progressive: true,
        interlaced: true
      } ) )
		.pipe( gulp.dest( paths.dist.images ))
});

gulp.task('styles', function() {
  gulp.src( paths.src.css + '/*.scss' )
			.pipe( sass( {
				outputStyle: 'compressed',
				precision: 10
			} ).on( 'error', sass.logError ) )
			.pipe( autoprefixer( browsers ) )
			.pipe( gulp.dest( paths.dist.css ) );
});

gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['build',
					'--incremental'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  // jekyll.stdout.on('data', jekyllLogger);
  // jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('serve', () => {
  browserSync.init({
    files: [site_root + '/**'],
    port: 4000,
		logLevel: "info",
    server: {
      baseDir: site_root
    }
  });

  gulp.watch(paths.src.css + '/*.scss', ['jekyll-rebuild-style']);
	gulp.watch(paths.src.includes + '/**/*.*', ['jekyll-rebuild']);
});

gulp.task('jekyll-rebuild-style', ['styles', 'jekyll'], function () {
    browserSync.reload();
});

gulp.task('jekyll-rebuild', ['jekyll'], function () {
    browserSync.reload();
});

gulp.task('default', ['images', 'styles', 'jekyll', 'serve' ]);
