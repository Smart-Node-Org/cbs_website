angular.module("myApp")
    .controller("appCtrl",function ($scope,$interval,$window,$rootScope) {
        $rootScope.lang =  $rootScope.lang || 'en'
    
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        $rootScope.data='GDP';
        $rootScope.changeStatistics=function(department){
            $rootScope.data=department;
        }
        console.log('hi')
        // var counter=40000000
        // var val = numberWithCommas(counter);
        // var element = localStorage['lang'] == 'en'? document.getElementById("counter"):document.getElementById("counter_ar");
        // // var element=document.getElementById("counter")
        // // $interval(function () {
        // //     counter++
        // //     var val = numberWithCommas(counter);
        // //     element.innerHTML= val +"<br>Population Now"
        // // },2000)
        // // var elements=document.getElementById("counter_ar")
        // $interval(function () {
        //     counter++
        //     var val = numberWithCommas(counter);
        //     element.innerHTML= $rootScope.lang=='ar'?(val +"<br>عدد السكان الان"):(val +"<br>Population Now")
        // },2000)

//Use the code in the answer above to replace the commas.
        $scope.langShiftToAr = function(){
            console.log("clicked")
            $scope.langs='ar'
            $rootScope.lang = 'ar'
            console.log($scope.lang);
            localStorage['lang'] = 'ar';
            // window.location.reload();
        }
        $scope.langShiftToEn = function(){
            $rootScope.lang = 'en'
            localStorage['lang'] = 'en';
             $scope.langs='en'
            console.log($scope.lang);  
            // $window.location.reload();
        }

        function getMonth(num){
            switch (parseInt(num)){
                case 1:
                    return $rootScope.lang=='en'?'January':'يناير'
                case 2:
                    return $rootScope.lang=='en'?'February':'فبراير'
                case 3:
                    return $rootScope.lang=='en'?'March':'مارس'
                case 4:
                    return $rootScope.lang=='en'?'April':'أبريل'
                case 5:
                    return $rootScope.lang=='en'?'May':'مايو'
                case 6:
                    return $rootScope.lang=='en'?'June':'يونيو'
                case 7:
                    return $rootScope.lang=='en'?'July':'يوليو'
                case 8:
                    return $rootScope.lang=='en'?'August':'أغسطس'
                case 9:
                    return $rootScope.lang=='en'?'September':'سبتمبر'
                case 10:
                    return $rootScope.lang=='en'?'October':'أكتوبر'
                case 11:
                    return $rootScope.lang=='en'?'November':'نوفمبر'
                case 12:
                    return $rootScope.lang=='en'?'December':'ديسمبر'
            }
        }

        $scope.processIndicatorCycle=function (ind){
            console.log(ind)
            if(ind.cycle_type==0 || ind.cycle_type==5)
                return ind.value.cycle
            else if(ind.cycle_type==1 && $rootScope.lang=='en')
                return ind.value.cycle[8]+(ind.value.cycle[8]=='1'?'st':ind.value.cycle[8]=='2'?'nd':ind.value.cycle[8]=='3'?'rd':'th')+' week of '+getMonth(ind.value.cycle.split("-")[1])+" "+ind.value.cycle.substring(0,4)
            else if(ind.cycle_type==1 && $rootScope.lang=='ar')
                return "الأسبوع "+(ind.value.cycle[8]=='1'?'الأول':ind.value.cycle[8]=='2'?'الثاني':ind.value.cycle[8]=='3'?'الثالث':'الرابع')+' من '+getMonth(ind.value.cycle.split("-")[1])+" "+ind.value.cycle.substring(0,4)
            else if(ind.cycle_type==2)
                return getMonth(ind.value.cycle.split("-")[1])+' '+ind.value.cycle.split("-")[0]
            else if(ind.cycle_type==3)
                return (ind.value.cycle.substring(0,4)+' '+ind.value.cycle[5]+ind.value.cycle[5]=='1'?'st':ind.value.cycle[5]=='2'?'nd':ind.value.cycle[5]=='3'?'rd':'th')+' quarter'
            else if(ind.cycle_type==4)
                return (ind.value.cycle.substring(0,4)+' '+ind.value.cycle[5]+ind.value.cycle[5]=='1'?'st':'nd')+' half'
        }



    })