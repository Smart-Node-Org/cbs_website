
angular.module("myApp")
    .controller("publicationsarCtrl",function ($scope,$http2) {
console.log("hi publications");
        $http2.get("getAllPublications",true)
            .then(function(resp){
                // $scope.shownFilter2 = function (show){return show.shown==1;}
                if(resp.data){$scope.Allpublications=resp.data;console.log( $scope.Allpublications);$scope.$apply();}});

    });
