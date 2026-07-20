const gulp = require('gulp');
const replace = require('gulp-replace')
const fs = require("fs")
var liveServer = require("live-server");
var merge = require('gulp-merge-json');

var params = {
    port: 8090,
    host: "0.0.0.0",
    root: "./dist",
    open: true, // When false, it won't load your browser by default.
    file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
    logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
};

let toBeMoved;
const asIt = [
    "./src/*",
    "./src/**/*",
    "./src/**/**/*",
    "./src/**/**/**/*",
]
function indexTask() {
    const css = `<link rel="stylesheet" href="css/material-icons.css">
    <link rel="stylesheet" href="css/css/all.css">
    <link rel="stylesheet" href="css/line-awesome.css">
    <link rel="stylesheet" href="css/animate.min.css">
    <link rel="stylesheet" href="css/owl.carousel.min.css">
    <link rel="stylesheet" href="css/owl.theme.default.css">
    <link rel="stylesheet" href="css/angular-material.min.css">
    <link rel="stylesheet" href="css/material-icons.css">
    <link rel="stylesheet" href="css/uikit.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/normalize.css">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/style1.css">
    <link rel="preconnect" href="https://fonts.gstatic.com">
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/bs/jszip-2.5.0/dt-1.12.1/b-2.2.3/b-html5-2.2.3/b-print-2.2.3/r-2.3.0/datatables.min.css"/>`

    const js = `<script src="lib/angular.min.js"></script>
    <script src="lib/angular-animate/angular-animate.js"></script>
    <script src="lib/angular-aria/angular-aria.js"></script>
    <script src="lib/angular-messages/angular-messages.js"></script>
    <script src="lib/angular-sanitize.js"></script>
    <script src="lib/angular-material/angular-material.js"></script>
    <script src="lib/angular-ui-router.min.js"></script>
    <script src="lib/uikit.js"></script>
    <script src="lib/jquery.min.js"></script>
    <script src="lib/jquery.countTo.js"></script>
    <script src="lib/bootstrap.min.js"></script>
    <script src="https://cbs.gov.sd/socket.io/socket.io.js"></script>
    <script src="lib/loadingoverlay.min.js"></script>
    <script src="lib/wow.min.js"></script>
    <script src="lib/chart.js.download"></script>
    <script src="lib/alasql.js"></script>
    <script src="lib/ckeditor.js"></script>
    <script>new WOW().init();</script>
    <script src="js/router.js"></script>
    <script src="js/services.js"></script>
    <script src="js/directives.js"></script>
    <script src="js/filters.js"></script>
    <script src="js/controlles/appCtrl.js"></script>
    <script src="js/controlles/sdjCtrl.js"></script>
    <script src="js/controlles/economyCtrl.js"></script>
    <script src="js/controlles/socialCtrl.js"></script>
    <script src="js/controlles/homeCtrl.js"></script>
    <script src="js/controlles/aboutCtrl.js"></script>
\t<script src="js/controlles/newOneCtrl.js"></script>
    <script src="js/controlles/contactCtrl.js"></script>
    <script src="js/controlles/statisiticsCtrl.js"></script>
    <script src="js/controlles/newsCtrl.js"></script>
    <script src="js/controlles/IndicatorsCtrl.js"></script>
    <script src="js/controlles/PublicationCtrl.js"></script>
    <script src="js/controlles/contactarCtrl.js"></script>
    <script src="js/controlles/aboutarCtrl.js"></script>
    <script src="js/controlles/newsarCtrl.js"></script>
    <script src="js/controlles/publicationsarCtrl.js"></script>
    <script src="js/controlles/homearCtrl.js"></script>
    <script src="js/controlles/app_arCtrl.js"></script>
    <script src="js/controlles/IndicatorsCtrl.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/v/bs/jszip-2.5.0/dt-1.12.1/b-2.2.3/b-html5-2.2.3/b-print-2.2.3/r-2.3.0/datatables.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/select/1.4.0/js/dataTables.select.min.js"></script>
`

    return gulp.src('./src/index.html')
        .pipe(replace('--css--', css))
        .pipe(replace('--js--', js))
        .pipe(gulp.dest('./dist/'))

}
function serviceTask() {
    return gulp.src('./src/js/services.js')
        .pipe(replace('//--en',"="+fs.readFileSync("./dist/lang/en.json",'utf8')))
        .pipe(replace('//--ar',"="+fs.readFileSync("./dist/lang/ar.json",'utf8')))
        .pipe(gulp.dest('./dist/js/'))

}
function asItTask(obj) {
    console.log("changing")
    return gulp.src(toBeMoved?[toBeMoved]:asIt,{ base: "./src/" })
        .pipe(gulp.dest('dist/'))

}
function watchTask() {
    liveServer.start(params);

    gulp.watch(['.src/img/*','.src/img/**/*','.src/assets/*','./src/css/**/*.css','./src/css/**/**/*.css','./src/js/**/*.js','!./src/js/**/services.js','./src/js/**/**/*.js','./src/lib/**/*.js','./src/templates/**/*.html','./src/templates/**/**/*.html'])
        .on("all",function (event,path,stats){
            if(fs.existsSync("./"+path)) {
                toBeMoved = path
                gulp.series(asItTask)()
            }
            else if(fs.existsSync(path.replace("src","dist"))){
                toBeMoved=undefined
                fs.unlinkSync(path.replace("src","dist"))
            }
        })

    gulp.watch(['./src/index.html'], gulp.series(indexTask));
    gulp.watch(['./src/lang/**/*.json','./src/js/**/services.js'], gulp.series(localizationArabic,localizationEnglish,serviceTask));
    gulp.watch(['./src/src/router.js'], gulp.series(routerTask));
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

function routerTask() {
    return gulp.src('./src/js/router.js')
			.pipe(replace('//--env--', `"test"`))
        .pipe(gulp.dest('./dist/js/'))

}

module.exports = gulp.series(localizationArabic,localizationEnglish,asItTask,indexTask,serviceTask,routerTask,watchTask)