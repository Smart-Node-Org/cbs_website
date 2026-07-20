angular.module("myApp")
    .controller("sdjCtrl",function ($scope,$assets) {
        console.log('hi')

        $(document).ready(function () {
          $assets.doughnutChart();
        })

    })