angular.module("myApp")
    .controller("newOneCtrl",function ($scope,$stateParams,$http2) {
        var news_id = $stateParams.news_id;
        console.log(news_id);
        $http2.post('getOneNews',{id:news_id},true).then(function(response) {
            if(response){
                $scope.News = response.data[0];
                console.log(response.data);
            }
        })

    })