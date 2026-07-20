
angular.module("myApp")
    .controller("socialCtrl",function ($scope,$assets,$mdDialog,$stateParams) {
        console.log('socialCtrl')
        var originatorEv;
        var tab=$stateParams.tab
        $scope.tab=tab

// switcher

        $scope.goToTab = function (tab) {
            location.href = '#!/app/social/'
        }
        switch (tab) {
            case 'population':
                UIkit.switcher("#nat-switcher").show(0);
                //$utils.setTitle("national")

                break
            case 'health':
                UIkit.switcher("#nat-switcher").show(1);
                //$utils.setTitle("price")

                break
				 case 'family':
                UIkit.switcher("#nat-switcher").show(2);
                //$utils.setTitle("price")

                break
				 case 'immegration':
                UIkit.switcher("#nat-switcher").show(3);
                //$utils.setTitle("price")

                break 

        }

    })
