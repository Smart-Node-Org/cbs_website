angular.module("myApp")
    .controller("contactarCtrl",function ($scope) {
        console.log('hi')
        $scope.changeMap=function () {
            $(document).ready(function () {
                $("#map").attr("src",`https://maps.google.com/maps?q=${$scope.selectedTab.lat},${$scope.selectedTab.lng}&z=16&output=embed`)

            })
        }
        $scope.Addrs=[
            {name:"Khartoum",lat:15.542042,lng:32.582184, Address:"60 Street, AlKHARTOUM, KH 535022",Email:"Khartoum@gmail.com",Call:"011111111",location:"",img:""},
            {name:"portsudan",lat:15.582042,lng:32.582184, Address:"16 Street, AlKHARTOUM, KH 535022",Email:"bahree@gmail.com",Call:"0222222222",location:"",img:"3"},
            {name:"kasaala",lat:15.642042,lng:32.582184, Address:"12 Street, portsudan, KH 535022",Email:"portsudan@gmail.com",Call:"03333333",location:"",img:"2"}
        ]
        $scope.selectedTab=$scope.Addrs[0]
        $scope.changeMap()



    })

