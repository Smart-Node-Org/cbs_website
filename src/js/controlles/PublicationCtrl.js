
angular.module("myApp")
    .controller("publicationsCtrl",function ($rootScope,$scope,$http2) {
console.log("hi publications");
        $http2.get("getAllDepartments",true)
            .then(function(resp){
                if(resp.data){
                    $scope.AllDepartment=resp.data;
                    console.log($scope.AllDepartment);
                    $scope.$apply();

                }

            })
        $http2.get("getAllPublications",true)
            .then(function(resp){
                // $scope.shownFilter2 = function (show){return show.shown==1;}
                if(resp.data){$scope.Allpublications=resp.data;console.log( $scope.Allpublications);$scope.$apply();}});
        $scope.download=function(publication) {
            console.log(publication);
            publicationName=publication.file;
            console.log(publicationName);
            publicationData={};
            publicationData.file=publication.file;
            publicationData.id=publication.department ;
            publicationData.title=publication.title;
            publicationData.visit_id =$rootScope.visit_id;
            // publicationData.file=publication.file;
            // publicationData.file=publication.file;
            console.log(publicationData);
            $http2.download(`https://smart-node.net/data/cbs/publications/${publicationName}`, publicationData.title)
            $http2.post("downloadPublication",publicationData,true)
                .then(function (resp) {
                    if (resp) {
                        $pop.alert("Success", "data downloaded successful");
                        $scope.Allpublications.push($scope.newPublication);
                        console.log($scope.Allpublications);
                    }
                    else {
                        $pop.alert("failure", "something wrong")

                    }


                })};

    });
