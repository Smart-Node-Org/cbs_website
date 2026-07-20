angular.module("myApp")
    .controller("contactCtrl",function ($scope,$http2) {
        console.log('hi')
        $scope.info;
        $http2.get("getAllStates",true)
            .then(function(resp){
                if(resp.data) {
                    $scope.AllStates = resp.data;
                    console.log($scope.AllStates);
                    // $scope.Addrs=[
                    //     {name:"Khartoum",lat:15.542042,lng:32.582184, Address:"60 Street, AlKHARTOUM, KH 535022",Email:"Khartoum@gmail.com",Call:"011111111",location:"",img:""},
                    //     {name:"portsudan",lat:15.582042,lng:32.582184, Address:"16 Street, AlKHARTOUM, KH 535022",Email:"bahree@gmail.com",Call:"0222222222",location:"",img:"3"},
                    //     {name:"kasaala",lat:15.642042,lng:32.582184, Address:"12 Street, portsudan, KH 535022",Email:"portsudan@gmail.com",Call:"03333333",location:"",img:"2"}
                    // ];
                    $scope.Addrs =$scope.AllStates;
                    console.log($scope.Addrs);
                    $scope.selectedTab=$scope.Addrs[0];
                    console.log($scope.selectedTab);
                    $scope.changeMap()
                }});
        $scope.changeMap=function () {
            console.log($scope.selectedTab)
            $scope.info=$scope.selectedTab
            $(document).ready(function () {
                $("#map").attr("src",`https://maps.google.com/maps?q=${$scope.selectedTab.lat_itude},${$scope.selectedTab.long_itude}&z=16&output=embed`)

            })
        }

   $scope.contact = function (event) {
            event.preventDefault()
            console.log($scope.info.id)
            $http2.post("insertContactUs",{
                id:$scope.info.id,
                name:$scope.name,
                subject:$scope.subject,
                email:$scope.email,
                message:$scope.message
            },true).then(function (resp) {
                if(resp.status){
                    $pop.alert($rootScope.$tr.translate('msg.doneTitle'), $rootScope.$tr.translate('msg.thanks_contacting'));
                    $scope.name = '';
                    $scope.subject = '';
                    $scope.email = '';
                    $scope.message = '';

                }
            })
        }


    })

