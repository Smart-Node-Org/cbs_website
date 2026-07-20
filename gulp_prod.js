const gulp = require('gulp');
const cdnizer = require('gulp-cdnizer');
const templateCache = require('gulp-angular-templatecache')
const minifyHtml = require('gulp-minify-html')
const concat = require('gulp-concat')
const replace = require('gulp-replace')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const ngannotate = require('gulp-ng-annotate')
const closure = require('gulp-jsclosure')
const fs = require("fs")
const p = require('path')
const cleanCSS = require('gulp-clean-css');
const clean = require('gulp-clean');
var liveServer = require("live-server");
var merge = require('gulp-merge-json');

var params = {
    port: 8080, // Set the server port. Defaults to 8080.
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: "./dist", // Set root directory that's being served. Defaults to cwd.
    open: true, // When false, it won't load your browser by default.
    file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
    logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
};
let toBeMoved;

const scripts = [
    "./dist/js/router.js",
    "./src/js/directives.js",
    "./src/js/filters.js",
    "./dist/js/services.js",
    "./src/js/controllers/*.js",
]
const lazyLoadedLibs = [
    "./src/lib/lazy/bootstrap.min.js",
    "./src/lib/lazy/moment.js",
    "./src/lib/lazy/wow.min.js",
    "./src/lib/lazy/jquery.keyboard.js",
    "./src/lib/lazy/mediasoupclient.min.js",
    "./src/lib/lazy/video-stream-merger.js",
    "./src/lib/lazy/sharer.min.js",
    "./src/lib/lazy/bootstrap-select.min.js",
    "./src/lib/lazy/intro.js",
    "./src/lib/lazy/jquery.validate.min.js",
    "./src/lib/lazy/alasql.min.js",
    "./src/lib/lazy/chart.min.js",
    "./src/lib/lazy/crypto-js.min.js",
    "./src/lib/lazy/pbkdf2.min.js",
    "./src/lib/lazy/ace.js",
    "./src/lib/lazy/ext-language_tools.js",
    "./src/lib/lazy/hls.min.js",
    "./src/lib/lazy/video.min.js",
    "./src/lib/lazy/videojs-contrib-eme.js",
    "./src/lib/lazy/videojs-landscape-fullscreen.min.js",
    "./src/lib/lazy/videojs-hlsjs.min.js",
    "./src/lib/lazy/videojs-contrib-quality-levels.min.js",
    "./src/lib/lazy/videojs-hls-quality-selector.min.js",
    "./src/lib/lazy/select2.min.js",
]
const libs=[
    "./src/lib/base/jquery-3.6.0.min.js",
    "./src/lib/base/jquery-ui.min.js",
    "./src/lib/base/angular.min.js",
    "./src/lib/base/angular-material.min.js",
    "./src/lib/base/sortable.min.js",
    "./src/lib/base/angular-messages.min.js",
    "./src/lib/base/angular-ui-router.min.js",
    "./src/lib/base/angular-animate.min.js",
    "./src/lib/base/angular-aria.min.js",
    "./src/lib/base/angular-sanitize.min.js",
    "./src/lib/base/loadingoverlay.min.js",
    "./src/lib/base/mdPickers.min.js",
    "./src/lib/base/socket.io.min.js",
    "./src/lib/base/uikit.min.js"
]
const styles = [
    "./src/css/night-mode.css",
    "./src/css/framework.css",
]
const lazyLoadedStyles = [
    "./src/css/icons.css",
    "./src/css/material-icons.css",
    "./src/css/angular-material.min.css",
    "./src/css/animate.css",
    "./src/css/video-js.min.css",
    "./src/css/videojs-fantasy-theme.css",
    "./src/css/jquery-ui.min.css",
    "./src/css/mdPickers.min.css",
    "./src/css/introjs.min.css",
    "./src/css/keyboard.css",
    "./src/css/bootstrap.min.css",
    "./src/css/select2.min.css",
    "./src/css/style.css"
]
const templates = [
    "./src/templates/**/*.html",
    "./src/templates/**/**/*.html",
]
const asIt = [
    "./src/ace/*.js",
    "./src/ace/**/*.js",
    "./src/webfonts/*",
    "./src/css/css/all.min.css",
    "./src/css/css/webfonts/*",
    "./src/assets/*",
    "./src/assets/**/*",
    "./src/assets/**/**/*",
    "./src/images/*",
    "./src/images/**/*",
    "./src/fonts/*",
    "./src/img/*",
    "./src/img/**/*",
    "./src/videos/*",
    "./src/lib/ckeditor.js",
]
const shouldRemoved = ["./dist/lib/libs.js","./dist/lib/libsz.js","./dist/js/main.js","./dist/css/main.css","./dist/css/mainz.css"]

var devMode = false;
// function templatesTask() {
//     return gulp.src(templates)
//         .pipe(minifyHtml({
//             empty: true,
//             spare: true,
//             quotes: true
//         }))
//         .pipe(templateCache({
//             module: 'myApp.templates',
//             standalone: true,
//             /**
//              * Here, I'm removing .html so that `$templateCache` holds
//              * the template in `views/home` instead of `views/home.html`.
//              * I'm keeping the directory structure for the template's name
//              */
//             transformUrl: function(url) {
//                 return url.replace(url, `templates${url}`)
//             }
//         }))
//         //put all those to our javascript file
//         .pipe(concat('templates.js'))
//         .pipe(gulp.dest('./dist/js'))
// }
function cssTask() {
    return gulp.src(styles)
        .pipe(concat('main.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('dist/css'))

}
function lazyLoadedCssTask() {
    return gulp.src(lazyLoadedStyles)
        .pipe(concat('mainz.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename('mainz.min.css'))
        .pipe(gulp.dest('dist/css'))

}
function scriptsTask(){
    return gulp.src(scripts)
        //first, I'm building a clean 'main.js' file
        .pipe(concat('main.js'))
        .pipe(closure({angular: true}))
        .pipe(ngannotate())
        .pipe(gulp.dest('./dist/js'))
        .pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest('./dist/js'))
}
// function scriptsAndTemplatesTask(){
//     return gulp.src(["./dist/js/main.min.js","./dist/js/templates.js"])
//         //first, I'm building a clean 'main.js' file
//         .pipe(concat('main.js'))
//         .pipe(gulp.dest('./dist/js'))
//         //then, uglify the `main.js` and rename it to `main.min.js`
//         //mangling might cause issues with angular
//         .pipe(uglify({mangle: false}))
//         .pipe(rename('main.min.js'))
//         .pipe(gulp.dest('./dist/js'))
// }
function lazyLoadedLibsTask(){
    return gulp.src(lazyLoadedLibs)
        //first, I'm building a clean 'main.js' file
        .pipe(concat('libsz.js'))
        .pipe(gulp.dest('./dist/lib'))
        //then, uglify the `main.js` and rename it to `main.min.js`
        //mangling might cause issues with angular
        .pipe(uglify({mangle: true}))
        .pipe(rename('libsz.min.js'))
        .pipe(gulp.dest('./dist/lib'))
}
function libsTask(){
    return gulp.src(libs)
        //first, I'm building a clean 'main.js' file
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('./dist/lib'))
        //then, uglify the `main.js` and rename it to `main.min.js`
        //mangling might cause issues with angular
        .pipe(uglify({mangle: true}))
        .pipe(rename('libs.min.js'))
        .pipe(gulp.dest('./dist/lib'))
}
function indexTask() {
    const css = `<link rel="stylesheet" href="css/main.min.css?cb=${Date.now()}">
          <link rel="stylesheet" href="css/css/all.min.css">`
    const js = `<script src="lib/libs.min.js"></script>
                <script src="js/main.min.js?cb=${Date.now()}"></script>`

    return gulp.src('./src/index.html')
        .pipe(replace('--css--', css))
        .pipe(replace('--js--', js))
        // .pipe(minifyHtml({
        //     empty: true,
        //     spare: true,
        //     quotes: true
        // }))
        .pipe(gulp.dest('./dist/'))

}
function routerTask() {
    return gulp.src('./src/js/router.js')
        .pipe(replace('//--loadStyle--', ` $utils.loadStyle([
            "css/mainz.min.css",
        ])`))
        .pipe(replace('//--loadScript--', `"a lib/ckeditor.js",
            "lib/libsz.min.js"`))
			.pipe(replace('//--env--', `"prod"`))
        .pipe(gulp.dest('./dist/js/'))

}
function asItTask() {
    return gulp.src(asIt,{ base: "./src/" })
        .pipe(gulp.dest('dist/'))

}
function templatesTask() {
    console.log("templatesTask")
    return gulp.src(toBeMoved?[toBeMoved]:templates,{ base: "./src/templates/" })
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(gulp.dest('dist/templates/'))
}

function cleanTask(){
    var updatedShouldRemoved = []
    for(let i = 0 ; i<shouldRemoved.length ; i++){
        if(fs.existsSync(shouldRemoved[i]))
            updatedShouldRemoved.push(shouldRemoved[i])
    }
    return gulp.src(updatedShouldRemoved, {read: false})
        .pipe(clean());
}

function browserRun() {
    liveServer.start(params);
    gulp.watch(['./src/css/**/*.css','./src/css/**/**/*.css'], gulp.series(cssTask,cleanTask));
    gulp.watch(['./src/lang/**/*.json','./src/js/**/*.js','./src/js/**/**/*.js'], gulp.series(routerTask,localizationArabic,localizationEnglish,serviceTask,scriptsTask,cleanTask));
    gulp.watch(['./src/lib/base/*.js'], gulp.series(libsTask,cleanTask));
    gulp.watch(['./src/lib/lazy/*.js'], gulp.series(lazyLoadedLibsTask,cleanTask));
    gulp.watch(['./src/templates/**/*.html','./src/templates/**/**/*.html'])
        .on("all",function (event,path,stats){
        if(fs.existsSync("./"+path)) {
            toBeMoved = path
            gulp.series(templatesTask)()
        }
        else if(fs.existsSync(path.replace("src","dist"))){
            toBeMoved=undefined
            fs.unlinkSync(path.replace("src","dist"))
        }
    })
    gulp.watch(['./src/index.html'], gulp.series(indexTask));


}

function localizationArabic(){
    return gulp.src('./src/lang/ar/*.json')
        .pipe(merge({
            fileName: 'ar.json',
            edit: (parsedJson, file) => {
                var key = file.path.split("\\").slice(-1)[0].split(".json")[0]
                console.log(key)
                return {[key]:parsedJson};
            },
        }))
        .pipe(gulp.dest('./dist/lang'));
}
function localizationEnglish(){
    return gulp.src('./src/lang/en/*.json')
        .pipe(merge({
            fileName: 'en.json',
            edit: (parsedJson, file) => {
                var key = file.path.split("\\").slice(-1)[0].split(".json")[0]
                console.log(key)
                return {[key]:parsedJson};
            },
        }))
        .pipe(gulp.dest('./dist/lang'));
}
function serviceTask() {
    return gulp.src('./src/js/services.js')
        .pipe(replace('//--en',"="+fs.readFileSync("./dist/lang/en.json",'utf8')))
        .pipe(replace('//--ar',"="+fs.readFileSync("./dist/lang/ar.json",'utf8')))
        .pipe(gulp.dest('./dist/js/'))

}

module.exports = gulp.series(localizationArabic,localizationEnglish,cssTask,templatesTask,lazyLoadedCssTask,routerTask,serviceTask,scriptsTask,lazyLoadedLibsTask,libsTask,indexTask,asItTask,cleanTask,browserRun)