angular.module("myApp")
    .controller("aboutarCtrl",function ($scope,$http2,$pop,$mdDialog) {
        $(document).ready(function() {
            // Get media - with autoplay disabled (audio or video)
            var media = $(' #video4');
            var tolerancePixel = 10;
            var hasPlayMap = {};
            function checkMedia(){
                // Get current browser top and bottom
                var scrollTop = $(window).scrollTop() + tolerancePixel;
                var scrollBottom = $(window).scrollTop() + $(window).height() - tolerancePixel;

                //if ($(window).scrollTop() > $(window).height() - 100) {
                media.each(function(index, el) {
                    var yTopMedia = $(this).offset().top;
                    var yBottomMedia = $(this).height() + yTopMedia;

                    if(scrollTop < yBottomMedia && scrollBottom > yTopMedia){
                        var thisId = $(this).attr("id");
                        if (hasPlayMap[thisId]){
                            return;
                        }
                        hasPlayMap[thisId] = true;
                        $(this).get(0).play();
                    } else {
                        $(this).get(0).pause();
                    }
                });

                //}
            }
            $(document).on('scroll', checkMedia);
        }); //autoplay the video at about us
        console.log("hi")

        $(document).ready(function () {

            $('.timer').countTo();
        })
        $http2.get("getOrganiztionChart", true)
            .then(function (resp) {
                if (resp.data) {
                    $scope.OrganiztionChart = resp.data;
                    console.log($scope.OrganiztionChart);
                    $scope.organ= [...$scope.OrganiztionChart];
                    $scope.organ.forEach(function(organ, index, arr){
                        if(organ.position_job=='AL Manager'){
                            arr.splice(index,1)
                        }
                        $scope.organ=arr;
                    });
                    console.log($scope.organ);

                    $scope.$apply()

                }
            });
        $http2.get("getOurMission", true)
            .then(function (resp) {
                if (resp.data) {
                    $scope.ourMissions = resp.data;
                    console.log($scope.ourMissions);
                    $scope.$apply()

                }
            })

        $http2.get("getOurVision", true)
            .then(function (resp) {
                if (resp.data) {
                    $scope.ourVision = resp.data;
                    console.log($scope.ourVision);
                    $scope.$apply()

                }
            })

        $http2.get("getOurGoal", true)
            .then(function (resp) {
                if (resp.data) {
                    $scope.ourGoal = angular.fromJson(resp.data[0]);
                    console.log($scope.ourGoal);
                    $scope.goal=angular.fromJson(resp.data[0].goal)
                    $scope.goalar=angular.fromJson(resp.data[0].goalar)
                    console.log($scope.goal);
                    console.log($scope.goalar);
                    $scope.$apply()

                }
            })

    })