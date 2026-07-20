angular.module("myApp")
    .controller("IndicatorsCtrl",function ($scope,$mdDialog,$http2,$pop) {
    	$http2.get("getLastIndicators")
	      .then(function(resp){
	      	resp.data.forEach(function (ind) {
				console.log("currn",ind);
					ind.icon=ind.icon.substring(4)
			})
			  $scope.indicators=resp.data
			  console.log(resp.data)
			  $scope.$apply()
		  })
		$http2.get("getAllDepartments",true)
			.then(function(resp){
					if(resp.data){
						$scope.AllDepartment=resp.data;
						console.log($scope.AllDepartment);
						$scope.$apply();

					}

				}

			);
		$http2.get("getWebsiteIndicatorGroups")
			.then(function(resp){
				$scope.groups=angular.fromJson(resp.data)
				console.log($scope.groups)
				$scope.$apply()
			})

	})


