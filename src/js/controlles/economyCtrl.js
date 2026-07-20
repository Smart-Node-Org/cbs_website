angular.module("myApp")
    .controller("economyCtrl",function ($scope,$assets,$mdDialog,$stateParams) {

        var originatorEv;
		var tab=$stateParams.tab
         $scope.tab=tab
        $scope. openMenu = function($mdMenu, ev) {
            originatorEv = ev;
            $mdMenu.open(ev);
        };

        this.notificationsEnabled = true;
        this.toggleNotifications = function() {
            this.notificationsEnabled = !this.notificationsEnabled;
        };

        this.redial = function() {
            $mdDialog.show(
                $mdDialog.alert()
                    .targetEvent(originatorEv)
                    .clickOutsideToClose(true)
                    .parent('body')
                    .title('Suddenly, a redial')
                    .textContent('You just called a friend; who told you the most amazing story. Have a cookie!')
                    .ok('That was easy')
            );

            originatorEv = null;
        };

        this.checkVoicemail = function() {
            // This never happens.
        };















$scope.showAdvanced = function (ev) {

    $mdDialog.show({
        controller: DialogController,
        templateUrl: 'templates/da.html',
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application to prevent interaction outside of dialog
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    function DialogController($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide(angular.element(document.querySelector('#bascket')));
        }
    }
};


// switcher



        $scope.goToTab = function (tab) {
            location.href = `#!/app/economy/`
        }
        switch (tab) {
            case 'nat':
                UIkit.switcher("#nat-switcher").show(0);
                //$utils.setTitle("national")

                break
            case 'price':
                UIkit.switcher("#nat-switcher").show(1);
                //$utils.setTitle("price")

                break
            case 'trade':
                UIkit.switcher("#nat-switcher").show(2);
                //$utils.setTitle("foreign")

                break
            case 'sectoral':
                UIkit.switcher("#nat-switcher").show(2);
                //$utils.setTitle("Sectoral")

                break

        }

})
