import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import {deleteAsync} from 'del';
import squoosh from 'gulp-libsquoosh';
import terser from 'gulp-terser';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import optimize from 'gulp-svgo';
import svgstore from 'gulp-svgstore';
import reload from 'reload';
import Watcher from 'watcher';



// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//html

export const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

//WebP

export const createWebp = () => {
  return gulp.src('source/img/*.{png,jpg,}')
    .pipe(squoosh({
      webp:{}
    }))
    .pipe(gulp.dest('build/img'));
}

//images

export const images = () => {
  return gulp.src('source/img/*.{png,jpg,}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'));
}

export const copyImages = () => {
  return gulp.src('source/img/*.{png,jpg,}')
    .pipe(gulp.dest('build/img'));
}

//Script

export const script = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'));
}

//svg

export const svg = () => {
  return gulp.src('source/img/*.svg')
    .pipe(optimize())
    .pipe(gulp.dest('build/img'));
}

export const sprite = () => {
  return gulp.src('source/sprite.svg')
    .pipe(optimize())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(gulp.dest('build'));
}

//Copy

export const copy = (done) => {
  gulp.src([
    'source/fonts/lato/*.{woff,woff2}',
    'source/fonts/oswald/*.{woff,woff2}',
    'source/*.ico',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

//Clean

export const clean = () => {
  return deleteAsync('build');
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

//Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

  const watcher = () => {
  gulp.watch('source/sass/*.scss', gulp.series(styles));
  gulp.watch('source/js/script.js', gulp.series(script));
  gulp.watch('source/*.html', gulp.series(html, reload));

}

//Build

export const build = gulp.series(
  clean,
  copy,
  images,
  gulp.parallel(
    styles,
    html,
    script,
    svg,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
));

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    script,
    svg,
    sprite,
    createWebp,
  ),
  gulp.series(
    server,
    watcher
  ));
