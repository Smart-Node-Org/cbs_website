const gulp = require('gulp');
const test_series = require("./gulp_test")
const prod_series = require("./gulp_prod")
const fs = require("fs");
// const del = require('del')
// console.log(fs.readdirSync('./src/js'))
// console.log(fs.readdirSync('./src/js/controllers'))
if(fs.existsSync("./dist"))
    fs.rmdirSync("./dist",{recursive:true})

exports.serve = test_series
exports.build = prod_series
