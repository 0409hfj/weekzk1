var gulp = require("gulp");
var sass = require("gulp-sass");
var yscss = require("gulp-clean-css");
var ysjs = require("gulp-uglify");
var concat = require("gulp-concat");
var server = require("gulp-webserver");

var path = require("path");
var url = require("url");
var fs = require("fs");
gulp.task("sass", function() {
    return gulp.src("./src/sass/*.scss")
        .pipe(sass()) //编译scss
        .pipe(yscss()) //压缩
        .pipe(gulp.dest("./src/css"))
})

gulp.task('js', function() {
    return gulp.src('./src/js/*.js')
        .pipe(concat("all.js")) //合并
        .pipe(ysjs()) //压缩
        .pipe(gulp.dest('./src/js'))
})
gulp.task("build", function() {
    return gulp.src("./src/js/*js", "./src/sass/*.scss")
        .pipe(gulp.dest("./src/dist"))
})

//起服务
gulp.task("server", function() {
        return gulp.src("src")
            .pipe(server({
                port: 8989,
                open: true,
                livereload: true,
                middleware: function(req, res, next) {
                    var pathname = url.parse(req.url).pathname;
                    if (pathname === '/favicon.ico') {
                        res.end('');
                        return;
                    }
                    if (pathname === '/list') {
                        res.end(JSON.stringify({
                            code: 0,
                            data: list
                        }))
                    } else {
                        pathname = pathname === '/' ? 'index.html' : decodeURI(pathname);
                        res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                    }
                }
            }))
    })
    //监听
gulp.task("watch", function() {
        return gulp.watch("./src/sass/*.scss", gulp.series("sass"))
    })
    //默认打开
gulp.task("default", gulp.series("sass", "js", "server", "watch"))