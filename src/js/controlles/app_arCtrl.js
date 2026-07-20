angular.module("myApp")
    .controller("app_arCtrl",function ($scope,$interval) {
        console.log('hi')
var counter=40000000
        var element=document.getElementById("counter")
        $interval(function () {
            counter++
            element.innerHTML= counter
        },2000)
    })