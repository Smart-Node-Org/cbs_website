angular.module("myApp")
    .controller("newsCtrl",function ($scope,$http2) {
        console.log('hi news');

        $http2.get("getAllNews",true).then(function(resp){if(resp.data){
            $scope.AllNews=resp.data;
            console.log($scope.AllNews);
            $scope.reverseAllNews=[];
            $scope.AllNews.forEach(function(item) {
                $scope.reverseAllNews.unshift(item)
            });
            console.log($scope.reverseAllNews);
            // var L =$scope.All;News.length
            // $scope.Allnews1=$scope.AllNews.slice(0,L/3);
            // $scope.Allnews2=$scope.AllNews.slice(L/2,L);
            // console.log($scope.Allnews1);
            // console.log($scope.Allnews2)

            // $scope.Allnews1=$scope.AllNews.slice(0,L/3);
            // $scope.Allnews2=$scope.AllNews.slice(L/3,2*L/3);
            // $scope.Allnews3=$scope.AllNews.slice(2*L/3,L);
            // console.log($scope.Allnews1);
            // console.log($scope.Allnews2);
            // console.log($scope.Allnews3);
        }})

    })
