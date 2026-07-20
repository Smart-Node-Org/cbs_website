
angular.module("myApp")
    .controller("statisiticsCtrl",function ($scope,$mdDialog,$pop,$http,$http2,$rootScope,$element,$timeout ) {
        $scope.deprtData={}
        $scope.selectedStates=[]
        $scope.initDeprt=function(){
            $scope.selectedGdpSub=[];
            $scope.selectedYears=[];
            $scope.selectedCountries=[];
            $scope.selectedProducts=[];
            $scope.selectedGdpMain=''
        }
        $scope.showSector=function(s){
            $rootScope.selectedSector=s
            console.log(s)
        }
        $scope.checkYears=function(years){
            if(years.includes("All")){
                years.forEach(function () {
                    years.pop()
                })
                if($scope.deprtData.deprt=='sectors') {
                    if ($scope.selectedProducts && $scope.selectedProducts.length > 0)
                        Object.assign(years, $scope.sectors.product_annual_years)
                    else
                        Object.assign(years, $scope.sectors.sectors_annual_years)
                }
                else if($scope.deprtData.deprt=='foriegn') {
                    Object.assign(years, $scope.foriegn_general_years)
                }
                else if($scope.deprtData.deprt=='gdp') {
                    if ($scope.selectedGdpSub && $scope.selectedGdpSub.length > 0)
                        Object.assign(years, $scope.sectors.product_annual_years)
                    else
                        Object.assign(years, $scope.sectors.sectors_annual_years)
                }
            }
            $scope.selectedYears=years
        }
        $scope.checkCountries=function(countries){
            if(countries.includes("All")){
                countries.forEach(function () {
                    countries.pop()
                })
                Object.assign(countries, $scope.foriegn_countries)
            }
            if(countries.includes("None")){
                countries.forEach(function () {
                    countries.pop()
                })
            }
        }


        $scope.selectProducts=function(s){
            $rootScope.selectedProducts=s

        }
        $scope.checkStates=function(selectedStates){
            $scope.selectedStates=selectedStates
            if($scope.selectedStates.filter(function (s) {return s.id==0}).length>0){
                console.log("Hi")
                $scope.selectedStates.forEach(function () {
                    $scope.selectedStates.pop()
                })
                $scope.states.forEach(function (state) {
                    if(state.id!=0)
                    $scope.selectedStates.push(state)
                })

            }
        }
        $scope.ExportInteractive=function(type){

            if($scope.deprtData.deprt=='sectors')
                downloadPost('ExportInteractiveSectorial',type+'.xlsx', {
                    selectedYears:angular.toJson($scope.selectedYears),
                    selectedProducts:angular.toJson($scope.selectedProducts),
                    selectedStates:angular.toJson($scope.selectedStates)
                })
            else if($scope.deprtData.deprt=='foriegn'){
                console.log($scope.selectedYears)
                downloadPost('ExportInteractiveForiegn',type+'.xlsx', {
                    selectedYears:$scope.selectedYears,
                    selectedCountries:$scope.selectedCountries,
                    selectedCountries:$scope.selectedProducts,
                    graphType:$scope.graphType
                })
            }
            else if($scope.deprtData.deprt=='gdp'){
                console.log($scope.selectedYears)
                downloadPost('ExportInteractiveGdp',type+'.xlsx', {
                    selectedYears:$scope.selectedYears,
                    selectedGdpMain:$scope.selectedGdpMain.id,
                    selectedGdpMainTitle:$scope.selectedGdpMain.title,
                    selectedGdpSub:$scope.selectedGdpSub,
                    states:$scope.selectedStates
                })
            }
            // datatables
            $timeout(function(){
                $(document).ready(function() {
                    $('#Gdp').DataTable(
                        {
                            responsive: false,
                            dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                            "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                            buttons: [
                                {extend: 'copy', className: 'btn-sm'},
                                // {extend: 'csv', title: 'ExampleFile', className: 'btn-sm btn-primary'},
                                {extend: 'excel', title: 'ExampleFile', className: 'btn-sm', title: 'exportTitle'},
                                {extend: 'pdf', title: 'ExampleFile', className: 'btn-sm'},
                                {extend: 'print', className: 'btn-sm'}
                            ]
                        }
                    );
                } );
            },1);
        }

        $http2.get("getEconomicParams")
            .then(function (resp) {
                console.log(resp)
                $scope.sectors=resp.sectors[0]
                $scope.sectors.sectors=angular.fromJson($scope.sectors.sectors)
                $scope.states=angular.fromJson(resp.states)
                $scope.states.unshift({name:'All',id:0})
                console.log($scope.states)
                $scope.sectors.sectors_annual_years=angular.fromJson($scope.sectors.sectors_annual_years)
                $scope.sectors.product_annual_years=angular.fromJson($scope.sectors.product_annual_years)
                // console.log($scope.states)
                $scope.cpi=resp.cpi

                // Forign Trade Paramaters
                $scope.foriegn_general_years=angular.fromJson(resp.foriegn[0].general_years)
                $scope.foriegn_countries=angular.fromJson(resp.foriegn[0].countries)
                $scope.foriegn_countries_years=angular.fromJson(resp.foriegn[0].countries_years)
                $scope.foriegn_products=angular.fromJson(resp.foriegn[0].products)
                $scope.foriegn_products_years=angular.fromJson(resp.foriegn[0].products_years)

                // GDP Parameters
                $scope.gdp=resp.gdp
                $scope.gdp_main_years=angular.fromJson(resp.gdp[0].main_years)
                $scope.gdp_sub_years=angular.fromJson(resp.gdp[0].sub_years)
                $scope.gdp_main=angular.fromJson(resp.gdp[0].gdp_main)

            })
        $http2.get("getSocialParams")
            .then(function (resp) {
                console.log(resp)
                $scope.states=resp.pop.states
                console.log($scope.states)

            })
        downloadPost = function(url,fileName,data) {
            console.log('fuck')
            function isIE() {
                var myNav = navigator.userAgent.toLowerCase();
                return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
            }
            var animate;
            $rootScope.progressed=0
            var customElement = $("<progress>", {
                "class" : "uk-progress",
                id:"js-progressbar",
                "value"  : 0,
                "max":100
            });
            $.LoadingOverlay("show", {
                image       : "",
                custom      : customElement,
                maxSize:window.innerWidth*0.8
            });
            UIkit.util.ready(function () {

                var bar = document.getElementById('js-progressbar');

                animate = setInterval(function () {

                    bar.value= $rootScope.progressed;

                    console.log("cooking "+$rootScope.progressed)

                }, 200);

            });
            console.log(data)
            serialize = function(obj, prefix) {
                var str = [],
                    p;
                for (p in obj) {
                    if (obj.hasOwnProperty(p)) {
                        var k = prefix ? prefix + "[" + p + "]" : p,
                            v = obj[p];
                        str.push((v !== null && typeof v === "object") ?
                            serialize(v, k) :
                            encodeURIComponent(k) + "=" + encodeURIComponent(v));
                    }
                }
                return str.join("&");
            }
            $http({
                url : $rootScope.url+url ,
                method : 'get',
                eventHandlers: {
                    progress: function (event) {
                        $rootScope.progressed=(event.loaded/event.total)*100
                    }
                },
                params : data,
                responseType : 'arraybuffer'
            }).then(function(data) {
                clearInterval(animate);
                $.LoadingOverlay("hide")
                var D = document;
                var ieVersion =  isIE();
                if ( ieVersion && ieVersion < 10) {
                    var frame = D.createElement('iframe');
                    document.body.appendChild(frame);

                    frame.contentWindow.document.open("text/html", "replace");
                    frame.contentWindow.document.write('sep=,\r\n' + data.data);
                    frame.contentWindow.document.close();
                    frame.contentWindow.focus();
                    console.log('hi 1');
                    if( frame.contentWindow.document.execCommand('SaveAs', true, fileName)){
                        console.log('Bill is saved');
                    } else {
                        alert('Bill cannot be saved. Your browser does not support download bill.');
                    };

                    document.body.removeChild(frame);
                    return true;
                }

                var file = new Blob([ data.data ]);
                if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    window.navigator.msSaveBlob(file, fileName);
                    console.log('hi msSaveBlob');
                } else {
                    //for chrome in IOS
                    if(navigator.userAgent.match('CriOS')) {
                        var file = new Blob([data]);
                        var fileURL = URL.createObjectURL(file);
                        window.open(fileURL);
                    } else {
                        var fileURL = URL.createObjectURL(file);
                        var a         = document.createElement('a');
                        if (typeof a.download === 'undefined') {
                            window.location = fileURL;
                            console.log('hi win 1');
                        } else {
                            a.href        = fileURL;
                            a.target      = '_blank';
                            a.download    = fileName;
                            document.body.appendChild(a);
                            a.click();
                            console.log('hi win 2');
                        }
                    }

                }
            })
        }



        $scope.announceClick = function(index,type) {
            if(index==1){
                var x={type:type}
                downloadPost('getReport',type+'.xlsx',x)

            }
        };




        // get cpiSudanSection Allyears api

        $http2.get("getAllYears",true).then(function (resp) {
            if(resp){
                $scope.cpiSudanSectionYears = resp.data;
                // console.log($scope.cpiSudanSectionYears)
            }
        });
        // get cpi sudan section
        $scope.getSudan=function () {
            $http2.get("getCpiSudanSection",true).then(function (resp) {
                if(resp){
                    resp.data.forEach(function (elem) {
                        elem.overall_rural = elem.rural_standard + elem.rural_ongoing;
                        elem.overall_urban = elem.urban_standard + elem.urban_ongoing
                    });
                    $scope.gCpiSudanSection = resp.data;
                    console.log($scope.gCpiSudanSection)

                    //datatable
                    $timeout(function(){
                        $(document).ready(function() {
                            $('#gCpiSudanSection').DataTable(
                                {
                                    dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                    // "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                                    "autoWidth": true,
                                    buttons: [
                                        'copy','excel','pdf','print'
                                        // {extend: 'copy',className: 'copyButton'},
                                        // {extend: 'excel',className: 'copyExcel'},
                                        // {extend: 'pdf',className: 'copyPdf'},
                                        // {extend: 'print',className: 'copyPrint'}
                                    ]
                                }
                            );
                        } );
                    },1);
                    $scope.$apply();

                }
            });

        };
// get Cpi Sudan Levels Api//
        $scope.getSudanCommunity = function () {
            $http2.get("getCpiSudanCommunity",true).then(function (resp) {
                if(resp){
                    $scope.getCpiSudanLevels = resp.data;
                    console.log($scope.getCpiSudanLevels)
                    //datatable
                    $timeout(function(){
                        $(document).ready(function() {
                            $('#CpiSudanLevels').DataTable(
                                {
                                    dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                    // "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                                    "autoWidth": true,
                                    buttons: [
                                        'copy','excel','pdf','print'
                                        // {extend: 'copy',className: 'copyButton'},
                                        // {extend: 'excel',className: 'copyExcel'},
                                        // {extend: 'pdf',className: 'copyPdf'},
                                        // {extend: 'print',className: 'copyPrint'}
                                    ]
                                }
                            );
                        });
                    },1);
                    $scope.$apply()
                }
            });
        };
        $scope.getSudanCommunity();
        //get gdp total
        $http2.get("getGdpTotal",true).then(function(resp){
                if(resp.data){
                    resp.data.forEach(function (t) {t.sub =angular.fromJson(t.sub);t.years =angular.fromJson(t.years)})
                    $scope.gdps=resp.data;
                    console.log( $scope.gdps);// why this  console array same as after for each
                    $scope.gdps.forEach(function(g){g.years=g.years.slice(-1.-4)});
                    console.log($scope.gdps);
                    //gdps.forEach(function(g){g.years=g.years.slice(1,4)}) but why undefined on console
                    $scope.Gdps=$scope.gdps;

                    $scope.$apply();}});
        $scope.ShowTableGdp=function (ev) {
            $mdDialog.show({
                scope: $scope,
                templateUrl: 'templates/DialogGdpSudan.html',
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                preserveScope:true,
                multiple: true
            });
            //sub Gdp
        };
        $scope.showSubsectors = function (Gdp,ev,index) {
            $rootScope.indexState=index
            $scope.SubGdp= Object.assign({},Gdp);
            console.log( $scope.SubGdp);
            $mdDialog.show({
                scope: $scope,
                templateUrl: 'templates/DialogGdpSubsectors.html',
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                preserveScope: true,
                multiple: true
            })

        };

        $scope.ShowTableForeignCountries=function (ev) {
            $mdDialog.show({
                scope: $scope,
                templateUrl: 'templates/ForeignModals/foriegnCountries.html',
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                preserveScope:true,
                multiple: true
            });

            $scope.newYear = {};
            // $scope.selectedYear = 2020;

            // get new year
            $scope.getCountries = function() {
                $http2.post("getForiCountriesForYear",{year:$scope.selectedYear}, true)
                    .then(function (resp) {
                        if (resp.data) {
                            $scope.allCountries = resp.data;
                            console.log($scope.allCountries);//
                            // datatables
                            $timeout(function(){
                                $(document).ready(function() {
                                    $('#allCountries').DataTable(
                                        {
                                            responsive: false,
                                            dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                            "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                                            buttons: [
                                                {extend: 'copy', className: 'btn-sm'},
                                                // {extend: 'csv', title: 'ExampleFile', className: 'btn-sm btn-primary'},
                                                {extend: 'excel', title: 'ExampleFile', className: 'btn-sm', title: 'exportTitle'},
                                                {extend: 'pdf', title: 'ExampleFile', className: 'btn-sm'},
                                                {extend: 'print', className: 'btn-sm'}
                                            ]
                                        }
                                    );
                                } );
                            },1);

                            $scope.$apply();
                        }
                    })
            }

            $scope.getCountries();

            $http2.get("getCountriesYears",true).then(function(resp){

                $scope.AllForeignYears = resp.data;
                console.log($scope.AllForeignYears);
                $scope.$apply();
            });
            $scope.country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
            $scope.searchTerm = '';
            $scope.clearSearchTerm = function () {
                $scope.searchTerm = '';
            };
            $scope.searchTermForAdd = '';
            $scope.clearSearchTermForAdd = function () {
                $scope.searchTermForAdd = '';
            };
            // The md-select directive eats keydown events for some quick select
            // logic. Since we have a search input here, we don't need that logic.
            $element.find('input.demo-header-searchbox.md-text.uk-display-block.uk-width-1-1').on('keydown', function (ev) {
                ev.stopPropagation();
            });

        };
        $scope.ShowTableForeignProducts=function (ev) {
            $mdDialog.show({
                scope: $scope,
                templateUrl: 'templates/ForeignModals/foriegnProducts.html',
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                preserveScope:true,
                multiple: true
            });
            // get new year
            $http2.get("getAllForiProducts", true)
                .then(function (resp) {
                        if (resp.data) {
                            $scope.AllProducts = resp.data;
                            console.log($scope.AllProducts);
                            $scope.$apply();


                        }

                    })
            var getAllForiProdAnnual =function(){
                $http2.get("getAllForiProdAnnual",true).then(resp=>{
                    if(resp){
                        $scope.AllForiProdAnnual = resp.data;
                        console.log($scope.AllForiProdAnnual);
                        if($scope.AllForiProdAnnual.length>0){
                            // $scope.uniqueProducts = alasql('SELECT * , sum(value_SDG) sum_SDG ,sum(value_unit) as sum_unit FROM ? GROUP BY product_id,year',[$scope.AllForiProdAnnual]);
                            $scope.uniqueExportYears = alasql('SELECT year FROM ? where export_import = 1 GROUP BY year  order by year desc limit 5',[$scope.AllForiProdAnnual]);
                            $scope.uniqueImportYears = alasql('SELECT year FROM ?  where export_import = 0 GROUP BY year order by year desc limit 5',[$scope.AllForiProdAnnual]);
                            $scope.uniqueExportYears.sort(function(a,b){
                                return a.year-b.year;
                            });
                            $scope.uniqueImportYears.sort(function(a,b){
                                return a.year-b.year;
                            });

                            console.log($scope.uniqueImportYears);


                            $scope.productsExportNames = alasql('SELECT title From ?  where export_import = 1 group by title',[$scope.AllForiProdAnnual]);
                            $scope.productsImportNames = alasql('SELECT title From ?  where export_import = 0 group by title',[$scope.AllForiProdAnnual]);

                            $scope.productsExportNames.forEach(function(p){
                                p.years = alasql(`select * from ? where title = '${p.title}' order by year ASC`,[$scope.AllForiProdAnnual]);
                            })
                            $scope.productsImportNames.forEach(function(p){
                                p.years = alasql(`select * from ? where title = '${p.title}' order by year ASC`,[$scope.AllForiProdAnnual]);
                            })

                            console.log($scope.productsExportNames);
                            console.log($scope.productsImportNames);

                            $timeout(function() {
                                $scope.productsExportNames.forEach(function(p,productIndex){
                                    $scope.uniqueExportYears.forEach(function(uniqueYear,yearIndex_var){
                                        var found=false
                                        var yearVar
                                        p.years.forEach(function(year) {
                                            if(uniqueYear.year==year.year) {
                                                found=true
                                                yearVar=year
                                            }
                                        })
                                        if(found) {
                                            $(`.alExport${productIndex} td:eq(${1 + (yearIndex_var) * 2}) p`).text(yearVar.value_unit+' '+yearVar.unit);
                                            $(`.alExport${productIndex} td:eq(${2 + (yearIndex_var) * 2}) p`).text(yearVar.value_SDG);
                                            // $(`.alExport${productIndex} td:eq(${1 + (yearIndex_var) * 2}) input`).val(yearVar.value_unit);
                                            // $(`.alExport${productIndex} td:eq(${2 + (yearIndex_var) * 2}) input`).val(yearVar.value_SDG);
                                        }
                                        else{
                                            $scope.productsExportNames[productIndex].years.splice(yearIndex_var, 0,{});
                                            $(`.alExport${productIndex} td:eq(${1 + (yearIndex_var) * 2}) p`).text("-");
                                            $(`.alExport${productIndex} td:eq(${2 + (yearIndex_var) * 2}) p`).text("-");
                                        }
                                    })

                                })
                            },1);

                            $timeout(function() {
                                $scope.productsImportNames.forEach(function(p,productIndex){
                                    $scope.uniqueImportYears.forEach(function(uniqueYear,yearIndex_var){
                                        var found=false
                                        var yearVar
                                        console.log(yearVar)
                                        p.years.forEach(function(year) {
                                            if(uniqueYear.year==year.year) {
                                                found=true
                                                yearVar=year
                                            }
                                        })
                                        if(found) {
                                            $(`.alImport${productIndex} td:eq(${1 + (yearIndex_var) * 2}) p`).text(yearVar.value_unit+' '+yearVar.unit);
                                            $(`.alImport${productIndex} td:eq(${2 + (yearIndex_var) * 2}) p`).text(yearVar.value_SDG);
                                            // $(`.alImport${productIndex} td:eq(${1 + (yearIndex_var) * 2}) input`).val(yearVar.value_unit+' '+yearVar.unit);
                                            // $(`.alImport${productIndex} td:eq(${2 + (yearIndex_var) * 2}) input`).val(yearVar.value_SDG);
                                        }
                                        else{
                                            $scope.productsImportNames[productIndex].years.splice(yearIndex_var, 0,{});
                                            $(`.alImport${productIndex} td:eq(${1 + (yearIndex_var) * 2}) p`).text("-");
                                            $(`.alImport${productIndex} td:eq(${2 + (yearIndex_var) * 2}) p`).text("-");
                                        }
                                    })

                                })
                            },1);


                            console.log($scope.productsExportNames);
                            console.log($scope.productsImportNames);

                        }else if($scope.AllForiProdAnnual.length==0){
                            $scope.uniqueExportYears = []
                            $scope.uniqueImportYears = []
                            // $scope.AllForiProdAnnual = []
                        }
                        console.log($scope.uniqueExportYears);//

                        console.log($scope.uniqueExportYears)
                        // datatables
                        $timeout(function(){
                            $(document).ready(function() {
                                $('#uniqueImportYears').DataTable(
                                    {
                                        responsive: false,
                                        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                        "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                                        buttons: [
                                            {extend: 'copy', className: 'btn-sm'},
                                            // {extend: 'csv', title: 'ExampleFile', className: 'btn-sm btn-primary'},
                                            {extend: 'excel', title: 'ExampleFile', className: 'btn-sm', title: 'exportTitle'},
                                            {extend: 'pdf', title: 'ExampleFile', className: 'btn-sm'},
                                            {extend: 'print', className: 'btn-sm'}
                                        ]
                                    }
                                );
                            } );
                        },1);
                        //datatables2
                        $timeout(function(){
                            $(document).ready(function() {
                                $('#uniqueExportYears').DataTable(
                                    {
                                        responsive: false,
                                        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                        "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                                        buttons: [
                                            {extend: 'copy', className: 'btn-sm'},
                                            // {extend: 'csv', title: 'ExampleFile', className: 'btn-sm btn-primary'},
                                            {extend: 'excel', title: 'ExampleFile', className: 'btn-sm', title: 'exportTitle'},
                                            {extend: 'pdf', title: 'ExampleFile', className: 'btn-sm'},
                                            {extend: 'print', className: 'btn-sm'}
                                        ]
                                    }
                                );
                            } );
                        },1);


                        // console.log($scope.reducedYears);
                        $scope.$apply();
                    }
                })
            }
            getAllForiProdAnnual();

        };
        $scope.ShowTableForeignYear=function (ev) {
            $mdDialog.show({
                scope: $scope,
                templateUrl: 'templates/ForeignModals/foriegnYears.html',
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                preserveScope:true,
                multiple: true
            });
            $http2.get("getAllForiengTradeYear",true).then(function(resp){
                resp.data.forEach(function(data){
                    data.balance = ((data.export + data.re_export) - data.import);
                })
                $scope.AllForeignYears = resp.data;
                $scope.$apply();
            });
        };
        $scope.initDataTables=function (last,id){
            if(last){
                $('#'+id).DataTable(
                    {
                        responsive: false,
                        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                        "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                        buttons: [
                            {extend: 'copy', className: 'btn-sm btn-light'},
                            // {extend: 'csv', title: 'ExampleFile', className: 'btn-sm btn-primary'},
                            {extend: 'excelHtml5', title: 'ExampleFile', className: 'btn-sm btn-light', title: 'Foreign Trade Per Years',customize: function ( xlsx ){
                                    var sheet = xlsx.xl.worksheets['sheet1.xml'];
                                    // jQuery selector to add a border
                                    //  $('row c[r*="1"]', sheet).attr( 's', '25' );
                                    $('row:eq(1) c', sheet).attr( 's', '32' );
                                }},
                            {extend: 'pdf', title: 'ExampleFile', className: 'btn-sm btn-light'},
                            {extend: 'print', className: 'btn-sm btn-light'}
                        ],
                        select: true
                    }
                );
            }
        }
        $scope.ShowTablePopulation=function (ev) {
            $mdDialog.show({
                scope: $scope,
                templateUrl: 'templates/PopulationModals/population.html',
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                preserveScope:true,
                multiple: true
            });
            $http2.get("getAgeGroup",true)
                .then(function(resp){
                    if(resp.data){
                        $scope.age_group=resp.data;
                        console.log($scope.age_group);
                        $scope.$apply();
                    }});

            $http2.get("getAllStates",true)
                .then(function(resp){
                    if(resp.data){
                        $scope.AllStates=resp.data;
                        console.log( $scope.AllStates);
                        $http2.get("getAgeGroup",true)
                            .then(function(resp){
                                if(resp.data){
                                    $scope.age_group=resp.data;
                                    console.log($scope.age_group);
                                    $scope.$apply();
                                }});
                        console.log($scope.AllStates)

                        $scope.addPopulation = function () {
                            $scope.AllStates.forEach(function (state,stateIndex) {
                                state.ageGroups = []
                                // console.log(stateIndex)
                                $scope.age_group.forEach(function (age,ageIndex) {
                                    // console.log(stateIndex)
                                    console.log(ageIndex)
                                    age.ageGroup = {}
                                    age.ageGroup.rural_male_value=$(`tr.al${stateIndex} td input:eq(${0+(ageIndex)*4})`).val()
                                    age.ageGroup.rural_female_value=$(`tr.al${stateIndex} td input:eq(${1+(ageIndex)*4})`).val()
                                    age.ageGroup.urban_male_value=$(`tr.al${stateIndex} td input:eq(${2+(ageIndex)*4})`).val()
                                    age.ageGroup.urban_female_value=$(`tr.al${stateIndex} td input:eq(${3+(ageIndex)*4})`).val()
                                    age.ageGroup.title = age.title
                                    age.ageGroup.id = age.id;
                                    age.ageGroup.year = $scope.AllStates.year;
                                    console.log($scope.age_group)
                                    state.ageGroups.push(age.ageGroup);
                                })
                                delete state.email
                                delete state.lat_itude
                                delete state.long_itude
                                delete state.tell
                                delete state.address
                            })
                            delete $scope.AllStates.year
                            console.log($scope.AllStates)
                            $http2.post("addPopulation", $scope.AllStates, true)
                                .then(function (resp) {
                                    if (resp) {
                                        $pop.alert("Success", "Data Inserted Successfully..!!")
                                        $scope.AllStates.push($scope.AllStates)
                                        $scope.cancel = function () {
                                            $mdDialog.cancel();
                                        };
                                    }
                                    else {
                                        $pop.alert("failure", "Something wrong..!!")
                                    }
                                })
                            console.log($scope.AllStates)
                        }

                        $scope.$apply();
                    }});
            $http2.get("getYearsForPop",true)
                .then(function (resp) {
                    if(resp.data){
                        $scope.yearsOfPop=resp.data ;
                        console.log($scope.yearsOfPop);
                        $scope.yearsOfPop.year = 2020
                        $scope.$apply()
                        $scope.changeYear();
                    }})
            $scope.changeYear = function () {
                // get  yearPOP
                $http2.post("getPopulation",{year:$scope.yearsOfPop.year},true)
                    .then(function (resp) {
                        if(resp.data){
                            console.log(resp.data)
                            $scope.States = []
                            $scope.AllStates.forEach(function (state,index) {
                                var state1 = {}
                                var ageGroups = []
                                resp.data.forEach(function (gg) {
                                    if(gg.state_id == state.id){
                                        var ageGroup = {}
                                        state1.state_id = gg.state_id
                                        state1.name = gg.name
                                        ageGroup.id = gg.id
                                        ageGroup.age_group_id = gg.age_group_id
                                        ageGroup.title = gg.title
                                        ageGroup.rural_male_value = gg.rural_male_value
                                        ageGroup.rural_female_value = gg.rural_female_value
                                        ageGroup.urban_male_value = gg.urban_male_value
                                        ageGroup.urban_female_value = gg.urban_female_value
                                        ageGroups.push(ageGroup)
                                    }
                                })
                                state1.ageGroup = ageGroups
                                $scope.States.push(state1)
                            })
                            console.log($scope.States)
                            $timeout(function () {
                                $scope.States.forEach(function (state, stateIndex) {
                                    state.ageGroup.forEach(function (age, ageIndex) {
                                        console.log(age.urban_female_value)
                                        // document.querySelector(`tr.al${stateIndex} td p:eq(${0+(ageIndex)*4})`).innerHTML = age.rural_male_value;
                                        // document.querySelector(`tr.al${stateIndex} td p:eq(${0+(ageIndex)*4})`).innerHTML = age.rural_female_value;
                                        // document.querySelector(`tr.al${stateIndex} td p:eq(${0+(ageIndex)*4})`).innerHTML = age.urban_male_value;
                                        // document.querySelector(`tr.al${stateIndex} td p:eq(${0+(ageIndex)*4})`).innerHTML = age.urban_female_value;
                                        $(`tr.al${stateIndex} td p:eq(${0+(ageIndex)*4})`).text(age.rural_male_value)
                                        $(`tr.al${stateIndex} td p:eq(${1+(ageIndex)*4})`).text(age.rural_female_value)
                                        $(`tr.al${stateIndex} td p:eq(${2+(ageIndex)*4})`).text(age.urban_male_value)
                                        $(`tr.al${stateIndex} td p:eq(${3+(ageIndex)*4})`).text(age.urban_female_value)

                                        $(`tr.al${stateIndex} td input:eq(${0+(ageIndex)*4})`).val(age.rural_male_value)
                                        $(`tr.al${stateIndex} td input:eq(${1+(ageIndex)*4})`).val(age.rural_female_value)
                                        $(`tr.al${stateIndex} td input:eq(${2+(ageIndex)*4})`).val(age.urban_male_value)
                                        $(`tr.al${stateIndex} td input:eq(${3+(ageIndex)*4})`).val(age.urban_female_value)
                                    })
                                })
                            },1);
                            console.log($scope.AllStates);

                            $scope.$apply()
                        }
                    })
            };
        };
        $scope.ShowTablePopulationData=function (ev) {
            $mdDialog.show({
                scope: $scope,
                templateUrl: 'templates/PopulationModals/populationData.html',
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                preserveScope:true,
                multiple: true
            });
            $http2.get("getPopulationData", true)
                .then(function (resp) {
                    if (resp.data) {
                        $scope.PopulationsData = resp.data;
                        console.log($scope.PopulationsData);
                        $scope.$apply()

                    }
                })
        };
        $scope.ShowTableProductAnnual=function (ev) {
            $mdDialog.show({
                scope: $scope,
                templateUrl: 'templates/SectorsModals/ProductAnnual.html',
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                preserveScope:true,
                multiple: true
            });

            $http2.get("getYears",true)
                .then(function(resp){
                    if(resp.data){
                        $scope.YearsOFState=resp.data;
                        console.log($scope.YearsOFState);
                        $scope.$apply();
                    }});


            // $scope.States = []
            // $scope.values = {}
            $scope.changeProductAnnualForState = function () {
                $http2.post("getproductAnnualforState",{year:$scope.YearsOFState.year},true)
                    .then(function (resp) {
                        if(resp.data){

                            $scope.AllProductAnnualForState = resp.data

                            console.log($scope.AllProductAnnualForState);
                            $scope.uniqueStates = alasql("select state_id, LAST(state_name) as state_name from ? group by state_id",[$scope.AllProductAnnualForState])
                            $scope.uniqueProducts = alasql("select product_id, LAST(product_title) as product_title from ? group by product_id",[$scope.AllProductAnnualForState])
                            console.log($scope.uniqueStates)
                            console.log($scope.uniqueProducts)

                            $scope.uniqueStates.forEach(function(elem){
                                elem.products = []
                                $scope.AllProductAnnualForState.forEach(function (product) {
                                    console.log(product.main_valueTitle)
                                    if(elem.state_id == product.state_id){
                                        elem.products.push(product)
                                    }
                                })
                                // datatables
                                $timeout(function(){
                                    $(document).ready(function() {
                                        $('#uniqueProducts').DataTable(
                                            {
                                                responsive: false,
                                                dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                                "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                                                buttons: [
                                                    {extend: 'copy', className: 'btn-sm'},
                                                    // {extend: 'csv', title: 'ExampleFile', className: 'btn-sm btn-primary'},
                                                    {extend: 'excel', title: 'ExampleFile', className: 'btn-sm', title: 'exportTitle'},
                                                    {extend: 'pdf', title: 'ExampleFile', className: 'btn-sm'},
                                                    {extend: 'print', className: 'btn-sm'}
                                                ]
                                            }
                                        );
                                    } );
                                },1);



                            })
                            console.log($scope.uniqueStates)
                            $timeout(function () {
                                $scope.uniqueStates.forEach(function(elem,stateIndex) {
                                    elem.products.forEach(function (product,productIndex) {

                                        $(`tr.pro${stateIndex} td:eq(${1+(productIndex)*4}) p`).text(product.main_valueTitle)
                                        $(`tr.pro${stateIndex} td:eq(${2+(productIndex)*4}) p`).text(product.sub_valueTiltle)
                                        $(`tr.pro${stateIndex} td:eq(${3+(productIndex)*4}) p`).text(product.production)
                                        $(`tr.pro${stateIndex} td:eq(${4+(productIndex)*4}) p`).text(product.productivity)


                                        $(`tr.pro${stateIndex} td:eq(${1+(productIndex)*4}) input`).val(product.main_valueTitle)
                                        $(`tr.pro${stateIndex} td:eq(${2+(productIndex)*4}) input`).val(product.sub_valueTiltle)
                                        $(`tr.pro${stateIndex} td:eq(${3+(productIndex)*4}) input`).val(product.production)
                                        $(`tr.pro${stateIndex} td:eq(${4+(productIndex)*4}) input`).val(product.productivity)


                                    })
                                })
                            },1000)
                            $scope.$apply();
                        }
                    })

            };

        };
        $scope.ShowTableSectorsAnnualSector=function (ev) {
            $mdDialog.show({
                scope: $scope,
                templateUrl: 'templates/SectorsModals/SectorsAnnualSector.html',
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                preserveScope:true,
                multiple: true
            });
            $http2.get("getSectorsAnnualYear",true)
                .then(function(resp){
                    if(resp.data){
                        $scope.YearsOfSectorAnnual=resp.data;
                        console.log($scope.YearsOfSectorAnnual);
                        $scope.$apply();
                        $scope.changeSectorAnnualYear()
                    }
                })




            $scope.changeSectorAnnualYear = function () {
                $http2.post("getAllyearsforSector",{sector_id:$scope.YearsOfSectorAnnual.sector_id},true)
                    .then(function (resp) {
                        if(resp.data){
                            $scope.AllSectorAnnualSector = resp.data
                            console.log($scope.AllSectorAnnualSector);//
                            // datatables
                            $timeout(function(){
                                $(document).ready(function() {
                                    $('#AllSectorAnnualSector').DataTable(
                                        {
                                            responsive: false,
                                            dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                            "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                                            buttons: [
                                                {extend: 'copy', className: 'btn-sm'},
                                                // {extend: 'csv', title: 'ExampleFile', className: 'btn-sm btn-primary'},
                                                {extend: 'excel', title: 'ExampleFile', className: 'btn-sm', title: 'exportTitle'},
                                                {extend: 'pdf', title: 'ExampleFile', className: 'btn-sm'},
                                                {extend: 'print', className: 'btn-sm'}
                                            ]
                                        }
                                    );
                                } );
                            },1);

                            $scope.$apply()

                        }
                    })
            }


        };
        $scope.ShowTableSectorsAnnualYears=function (ev) {
            $mdDialog.show({
                scope: $scope,
                templateUrl: 'templates/SectorsModals/SectorsAnnualYears.html',
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                preserveScope:true,
                multiple: true
            });
            $http2.get("getSectorsAnnualYear",true)
                .then(function(resp){
                    if(resp.data){
                        $scope.YearsOfSectorAnnual=resp.data;
                        console.log($scope.YearsOfSectorAnnual);
                        $scope.$apply();
                        $scope.changeSectorAnnualYear()
                    }
                })




            $scope.changeSectorAnnualYear = function () {
                $http2.post("getYearSectorsAnnual",{year:$scope.YearsOfSectorAnnual.year},true)
                    .then(function (resp) {
                        if(resp.data){
                            resp.data.forEach(function (t) {
                                t.value = angular.fromJson(t.value)
                                t.value.forEach(function (t1) {
                                    t1.id = t.id
                                    t1.title = t.title
                                    t1.year = t.year
                                    t1.sector_id = t.sector_id
                                    console.log(t1)
                                })
                            })
                            $scope.AllSectorAnnualYears = resp.data
                            console.log($scope.AllSectorAnnualYears);//AllSectorAnnualYears
                            // datatables
                            $timeout(function(){
                                $(document).ready(function() {
                                    $('#AllSectorAnnualYears').DataTable(
                                        {
                                            responsive: false,
                                            dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                            "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                                            buttons: [
                                                {extend: 'copy', className: 'btn-sm'},
                                                // {extend: 'csv', title: 'ExampleFile', className: 'btn-sm btn-primary'},
                                                {extend: 'excel', title: 'ExampleFile', className: 'btn-sm', title: 'exportTitle'},
                                                {extend: 'pdf', title: 'ExampleFile', className: 'btn-sm'},
                                                {extend: 'print', className: 'btn-sm'}
                                            ]
                                        }
                                    );
                                } );
                            },1);

                            $scope.$apply()
                        }
                    })
            };


        };
        $http2.get("getAllSectors",true)
            .then(function(resp){
                if(resp.data){
                    $scope.AllSectorsData=resp.data;
                    console.log($scope.AllSectorsData);
                }
            });
        $http2.get("getAllStates",true)
            .then(function(resp){
                if(resp.data){
                    $scope.AllStates=resp.data;
                    console.log( $scope.AllStates);
                    $scope.$apply();
                }});
        // cpi
        $scope.ShowTableCpi=function (ev) {
            $mdDialog.show({
                scope: $scope,
                templateUrl: 'templates/cpiModals/DialogCpiSudan.html',
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                preserveScope:true,
                multiple: true
            })

        };
        $scope.ShowTableCpiProducts=function (ev) {
            $mdDialog.show({
                scope: $scope,
                templateUrl: 'templates/cpiModals/cpiProducts.html',
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                preserveScope:true,
                multiple: true
            });
            $http2.get("getAllProducts",true).then(function (resp)  {
                if(resp){
                    $scope.getCpiProduct = resp.data;
                    console.log($scope.getCpiProduct);
                }
            });
            $http2.get("getAllYears",true).then(function (resp) {
                if(resp){
                    $scope.cpiProductYears = resp.data;
                }
            });
            $http2.get("getAllProducts",true).then(function (resp) {
                if(resp){
                    $scope.allProducts = resp.data;
                    console.log($scope.allProducts)
                }
            });
            $scope.productSection = function () {
                $http2.get("getCpiProductSection",true).then(function (resp) {
                    if(resp){
                        resp.data.forEach(function (elem) {
                            elem.overall_rural = elem.rural_standard + elem.rural_ongoing;
                            elem.overall_urban = elem.urban_standard + elem.urban_ongoing;
                        });
                        $scope.getCpiProductSection = resp.data;
                        console.log($scope.getCpiProductSection);
                        // datatables
                        $timeout(function(){
                            $(document).ready(function() {
                                $('#cpiProduct').DataTable(
                                    {
                                        responsive: false,
                                        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                        "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                                        buttons: [
                                            {extend: 'copy', className: 'btn-sm'},
                                            // {extend: 'csv', title: 'ExampleFile', className: 'btn-sm btn-primary'},
                                            {extend: 'excel', title: 'ExampleFile', className: 'btn-sm', title: 'exportTitle'},
                                            {extend: 'pdf', title: 'ExampleFile', className: 'btn-sm'},
                                            {extend: 'print', className: 'btn-sm'}
                                        ]
                                    }
                                );
                            } );
                        },1);
                    }
                });
            };
            $scope.productSection();
            $scope.getProductSectionYearInfo = function (year, id) {
                $http2.post("getCpiProductSectionYear",{year:year,product_id:id},true).then(function (resp) {
                    if(resp){
                        resp.data.forEach(function (elem) {
                            elem.overall_rural = elem.rural_standard + elem.rural_ongoing;
                            elem.overall_urban = elem.urban_standard + elem.urban_ongoing
                        });
                        $scope.productSectionYearInfo = resp.data;
                        console.log($scope.productSectionYearInfo);
                    }
                })
            }
            $scope.productCommunity = function () {
                $http2.get("getCpiProductCommunity",true).then(function (resp) {
                    if(resp){
                        $scope.getCpiProductLevel = resp.data;
                        console.log($scope.getCpiProductLevel);
                        // datatables
                        $timeout(function(){
                            $(document).ready(function() {
                                $('#cpiProductLevel').DataTable(
                                    {
                                        responsive: false,
                                        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                        "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                                        buttons: [
                                            {extend: 'copy', className: 'btn-sm'},
                                            // {extend: 'csv', title: 'ExampleFile', className: 'btn-sm btn-primary'},
                                            {extend: 'excel', title: 'ExampleFile', className: 'btn-sm', title: 'exportTitle'},
                                            {extend: 'pdf', title: 'ExampleFile', className: 'btn-sm'},
                                            {extend: 'print', className: 'btn-sm'}
                                        ]
                                    }
                                );
                            } );
                        },1);


                    }
                });
            };
            $scope.productCommunity();
            $scope.getProductLevelYearInfo = function (year,id) {
                $http2.post("getCpiProductCommunityYear",{year:year,product_id:id},true).then(function (resp) {
                    if(resp){
                        $scope.productCommunityYearInfo = resp.data;
                        console.log($scope.productCommunityYearInfo);
                    }
                })

            };
        };
        $scope.ShowTableCpiStates=function (ev) {
            $mdDialog.show({
                scope: $scope,
                templateUrl: 'templates/cpiModals/cpiState.html',
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                preserveScope:true,
                multiple: true
            });
            $http2.get("getAllYears",true).then(function (resp) {
                if(resp){
                    $scope.cpiSudanStateYears = resp.data;
                }
            });
            $http2.get("getAllStates",true).then(function (resp) {
                if(resp){
                    $scope.allStates = resp.data;
                    console.log($scope.allStates)
                }
            });
            //datatablecpistatesection
            $scope.cpiState = function () {
                $http2.get("getCpiStatesSection",true).then(function (resp) {
                    if(resp){
                        resp.data.forEach(function (elem) {
                            elem.overall_rural = elem.rural_standard + elem.rural_ongoing;
                            elem.overall_urban = elem.urban_standard + elem.urban_ongoing;
                        });
                        $scope.getCpiStateSection = resp.data;
                        console.log($scope.getCpiStateSection);
                        //datatable
                        $timeout(function(){
                            $(document).ready(function() {
                                $('#datatablecpistatesection').DataTable(
                                    {
                                        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                        // "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                                        // "autoWidth": true,
                                        buttons: [
                                            'copy','excel','pdf','print'
                                            // {extend: 'copy',className: 'copyButton'},
                                            // {extend: 'excel',className: 'copyExcel'},
                                            // {extend: 'pdf',className: 'copyPdf'},
                                            // {extend: 'print',className: 'copyPrint'}
                                        ]
                                    }
                                );
                            });
                        },1);
                        $scope.$apply();
                    }
                });
            };
            $scope.cpiState();
            $scope.getYearInformation = function (year,id) {
                $http2.post("getCpiStatesSectionYear",{year:year,state_id:id},true).then(function (resp) {
                    if(resp){
                        resp.data.forEach(function (elem) {
                            elem.overall_rural = elem.rural_standard + elem.rural_ongoing;
                            elem.overall_urban = elem.urban_standard + elem.urban_ongoing
                        });
                        $scope.CpiStateSectionYearInformation = resp.data;
                        console.log(  $scope.CpiStateSectionYearInformation)

                    }
                })
            };
            //CpiStateLevel
            $scope.StateCommunity = function () {
                $http2.get("getCpiStateCommunity",true).then(function (resp) {
                    $scope. getCpiStateLevel = resp.data;
                    console.log($scope.getCpiStateLevel);
                    // datatables this need review
                    $timeout(function(){
                        $(document).ready(function() {
                            $('#CpiStateLevel').DataTable(
                                // {
                                //     responsive: false,
                                //     dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                //     "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                                //     buttons: [
                                //         {extend: 'copy', className: 'btn-sm'},
                                //         // {extend: 'csv', title: 'ExampleFile', className: 'btn-sm btn-primary'},
                                //         {extend: 'excel', title: 'ExampleFile', className: 'btn-sm', title: 'exportTitle'},
                                //         {extend: 'pdf', title: 'ExampleFile', className: 'btn-sm'},
                                //         {extend: 'print', className: 'btn-sm'}
                                //     ]
                                // }
                            );
                        } );
                    },1);
                    console.log("cpi")

                });
            };
            $scope.StateCommunity();
            $scope.getYearInformationLevel = function (year,id) {
                $http2.post("getCpiStateCommunityYear",{year:year,state_id:id},true).then(function (resp) {
                    if(resp){
                        $scope.CpiStateLevelYearInformation = resp.data;
                        console.log(  $scope.CpiStateLevelYearInformation)
                    }
                })
            };

        };
//inflation
        $scope.ShowTableInflationSudan=function (ev) {
            $mdDialog.show({
                scope: $scope,
                templateUrl: 'templates/InflationModals/inflationSudan.html',
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                preserveScope:true,
                multiple: true
            })
            $http2.get("getAllYears",true).then(function (resp) {
                if(resp){
                    $scope.inflationSudanSectionYears = resp.data;
                    console.log($scope.cpiSudanSectionYears)
                }
            });
            // get cInflationpi sudan section
            $scope.inflationSudan = function () {
                $http2.get("getInflationSudanSection",true).then(function (resp) {
                    if(resp){
                        resp.data.forEach(function (elem) {
                            elem.overall_rural = elem.rural_standard + elem.rural_ongoing;
                            elem.overall_urban = elem.urban_standard + elem.urban_ongoing
                        });
                        $scope.getInflationSudanSection = resp.data;
                        console.log($scope.getInflationSudanSection);
                        // datatables
                        $timeout(function(){
                            $(document).ready(function() {
                                $('#InflationSudanSection').DataTable(
                                    {
                                        responsive: false,
                                        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                        "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                                        buttons: [
                                            {extend: 'copy', className: 'btn-sm'},
                                            // {extend: 'csv', title: 'ExampleFile', className: 'btn-sm btn-primary'},
                                            {extend: 'excel', title: 'ExampleFile', className: 'btn-sm', title: 'exportTitle'},
                                            {extend: 'pdf', title: 'ExampleFile', className: 'btn-sm'},
                                            {extend: 'print', className: 'btn-sm'}
                                        ]
                                    }
                                );
                            } );
                        },1);

                    }
                });
            };
            $scope.inflationSudan();
            $scope.getYearInformation = function (year) {
                $http2.post("getInflationSudanSectionYear",{year:year},true).then(function (resp) {
                    if(resp){
                        resp.data.forEach(function (elem) {
                            elem.overall_rural = elem.rural_standard + elem.rural_ongoing;
                            elem.overall_urban = elem.urban_standard + elem.urban_ongoing
                        });
                        $scope.inflationSudanSectionYearInformation = resp.data;
                        console.log($scope.inflationSudanSectionYearInformation);
                        $scope.$apply()

                    }
                })
            };
            $scope.inflationCommunity = function () {
                $http2.get("getInflationSudanCommunity",true).then(function (resp) {
                    if(resp){
                        $scope.getInflationSudanLevels = resp.data;
                        console.log($scope.getInflationSudanLevels)
                        // datatables
                        $timeout(function(){
                            $(document).ready(function() {
                                $('#InflationSudanLevels').DataTable(
                                    {
                                        responsive: false,
                                        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                        "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                                        buttons: [
                                            {extend: 'copy', className: 'btn-sm'},
                                            // {extend: 'csv', title: 'ExampleFile', className: 'btn-sm btn-primary'},
                                            {extend: 'excel', title: 'ExampleFile', className: 'btn-sm', title: 'exportTitle'},
                                            {extend: 'pdf', title: 'ExampleFile', className: 'btn-sm'},
                                            {extend: 'print', className: 'btn-sm'}
                                        ]
                                    }
                                );
                            } );
                        },1);

                    }
                });
            };
            $scope.inflationCommunity();
            $scope.getYearInformationLevel = function (year) {
                $http2.post("getInflationSudanCommunityYear",{year:year},true).then(function (resp) {
                    if(resp){
                        $scope.InflationSudanLevelYearInformation = resp.data;
                        console.log($scope.InflationSudanLevelYearInformation);
                    }
                })
            };
        };
        $scope.ShowTableInflationStates=function (ev) {
            $mdDialog.show({
                scope: $scope,
                templateUrl: 'templates/InflationModals/inflationState.html',
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                preserveScope: true,
                multiple: true
            })
            $http2.get("getAllYears", true).then(function (resp) {
                if (resp) {
                    $scope.inflationStateYears = resp.data;
                }
            });
            $http2.get("getAllStates", true).then(function (resp) {
                if (resp) {
                    $scope.allStates = resp.data;
                    console.log($scope.allStates)
                }
            });
            $scope.inflationState = function () {
                $http2.get("getInflationStateSection",true).then(function (resp) {
                    if(resp){
                        resp.data.forEach(function (elem) {
                            elem.overall_rural = elem.rural_standard + elem.rural_ongoing;
                            elem.overall_urban = elem.urban_standard + elem.urban_ongoing;
                        });
                        $scope.getInflationStateSection = resp.data;
                        console.log($scope.getInflationStateSection);
                        // datatables
                        $timeout(function(){
                            $(document).ready(function() {
                                $('#InflationStateSection').DataTable(
                                    {
                                        responsive: false,
                                        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                        "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                                        buttons: [
                                            {extend: 'copy', className: 'btn-sm'},
                                            // {extend: 'csv', title: 'ExampleFile', className: 'btn-sm btn-primary'},
                                            {extend: 'excel', title: 'ExampleFile', className: 'btn-sm', title: 'exportTitle'},
                                            {extend: 'pdf', title: 'ExampleFile', className: 'btn-sm'},
                                            {extend: 'print', className: 'btn-sm'}
                                        ]
                                    }
                                );
                            } );
                        },1);
                    }
                });
            };
            $scope.inflationState();
            $scope.getYearInformation = function (year, id) {
                $http2.post("getInflationStateSectionYear", {year: year, state_id: id}, true).then(function (resp) {
                    if (resp) {
                        resp.data.forEach(function (elem) {
                            elem.overall_rural = elem.rural_standard + elem.rural_ongoing;
                            elem.overall_urban = elem.urban_standard + elem.urban_ongoing
                        });
                        $scope.InflationStateSectionYearInformation = resp.data;
                        console.log($scope.InflationStateSectionYearInformation)
                    }
                })
                $scope.inflationCommunity = function () {
                    $http2.get("getInflationStateCommunity", true).then(function (resp) {
                        $scope.getInflationStateLevel = resp.data;
                        console.log($scope.getInflationStateLevel);
                        // datatables
                        $timeout(function(){
                            $(document).ready(function() {
                                $('#InflationStateLevel').DataTable(
                                    {
                                        responsive: false,
                                        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                        "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                                        buttons: [
                                            {extend: 'copy', className: 'btn-sm'},
                                            // {extend: 'csv', title: 'ExampleFile', className: 'btn-sm btn-primary'},
                                            {extend: 'excel', title: 'ExampleFile', className: 'btn-sm', title: 'exportTitle'},
                                            {extend: 'pdf', title: 'ExampleFile', className: 'btn-sm'},
                                            {extend: 'print', className: 'btn-sm'}
                                        ]
                                    }
                                );
                            } );
                        },1);

                    });
                };
                $scope.inflationCommunity();
                $scope.getYearInformationLevel = function (year, id) {
                    $http2.post("getInflationStateCommunityYear", {
                        year: year,
                        state_id: id
                    }, true).then(function (resp) {
                        if (resp) {
                            $scope.InflationStateLevelYearInformation = resp.data;
                            console.log($scope.InflationStateLevelYearInformation)
                        }
                    })
                };
            };
            $scope.inflationCommunity = function () {
            };
            $scope.inflationCommunity();
            $scope.getYearInformationLevel = function (year,id) {
                $http2.post("getInflationStateCommunityYear",{year:year,state_id:id},true).then(function (resp) {
                    if(resp){
                        $scope.InflationStateLevelYearInformation = resp.data;
                        console.log(  $scope.InflationStateLevelYearInformation)
                    }
                })
            };
            $http2.get("getInflationStateCommunity",true).then(function (resp) {
                $scope.getInflationStateLevel = resp.data;
                console.log($scope.getInflationStateLevel);
            });
        }
        $scope.ShowTableInflationProduct=function (ev) {
            $mdDialog.show({
                scope: $scope,
                templateUrl: 'templates/InflationModals/inflationProduct.html',
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                preserveScope:true,
                multiple: true
            })
            $http2.get("getAllProducts",true).then(function (resp)  {
                if(resp){
                    $scope.getInflationProduct = resp.data;
                    console.log($scope.getInflationProduct);
                }
            });

            $http2.get("getAllYears",true).then(function (resp) {
                if(resp){
                    $scope.inflationProductYears = resp.data;
                    console.log($scope.inflationProductYears)
                }
            });
            $scope.inflationProduct = function () {
                $http2.get("getInflationProductSection",true).then(function (resp) {
                    if(resp){
                        resp.data.forEach(function (elem) {
                            elem.overall_rural = elem.rural_standard + elem.rural_ongoing;
                            elem.overall_urban = elem.urban_standard + elem.urban_ongoing;
                        });
                        $scope.getInflationProductSection = resp.data;
                        console.log($scope.getInflationProductSection);//
                        // datatables
                        $timeout(function(){
                            $(document).ready(function() {
                                $('#InflationProductSection').DataTable(
                                    {
                                        responsive: false,
                                        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                        "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                                        buttons: [
                                            {extend: 'copy', className: 'btn-sm'},
                                            // {extend: 'csv', title: 'ExampleFile', className: 'btn-sm btn-primary'},
                                            {extend: 'excel', title: 'ExampleFile', className: 'btn-sm', title: 'exportTitle'},
                                            {extend: 'pdf', title: 'ExampleFile', className: 'btn-sm'},
                                            {extend: 'print', className: 'btn-sm'}
                                        ]
                                    }
                                );
                            } );
                        },1);

                    }
                });
            };
            $scope.inflationProduct();
            $scope.getProductSectionYearInfo = function (year,id) {
                $http2.post("getInflationProductSectionYear",{year:year,product_id:id},true).then(function (resp) {
                    if(resp){
                        resp.data.forEach(function (elem) {
                            elem.overall_rural = elem.rural_standard + elem.rural_ongoing;
                            elem.overall_urban = elem.urban_standard + elem.urban_ongoing
                        });
                        $scope.productSectionYearInfo = resp.data;
                        console.log($scope.productSectionYearInfo);
                    }
                })
            };
            $scope.inflationProduct = function () {
                $http2.get("getInflationProductCommunity",true).then(function (resp) {
                    if(resp){
                        $scope.getInflationProductLevel = resp.data;
                        console.log($scope.getInflationProductLevel);
                        // datatables
                        $timeout(function(){
                            $(document).ready(function() {
                                $('#InflationProductLevel').DataTable(
                                    {
                                        responsive: false,
                                        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
                                        "lengthMenu": [[ 25, 50, 100, 150, 200, 500, -1], [ 25, 50, 100, 150, 200, 500, "All"]],
                                        buttons: [
                                            {extend: 'copy', className: 'btn-sm'},
                                            // {extend: 'csv', title: 'ExampleFile', className: 'btn-sm btn-primary'},
                                            {extend: 'excel', title: 'ExampleFile', className: 'btn-sm', title: 'exportTitle'},
                                            {extend: 'pdf', title: 'ExampleFile', className: 'btn-sm'},
                                            {extend: 'print', className: 'btn-sm'}
                                        ]
                                    }
                                );
                            } );
                        },1);
                    }
                });
            }
            $scope.inflationProduct();
            $scope.getProductLevelYearInfo = function (year,id) {
                $http2.post("getInflationProductCommunityYear",{year:year,product_id:id},true).then(function (resp) {
                    if(resp){
                        $scope.InflationProductLevelYearInformation = resp.data;
                        console.log($scope.InflationProductLevelYearInformation);
                    }
                })

            };
        };



        //city for year  Gdp
        // $scope.ShowTableGdpStates=function (ev) {
        //     $mdDialog.show({
        //         scope: $scope,
        //         templateUrl: 'templates/GdpModals/DialogGdpStates.html',
        //         // Appending dialog to document.body to cover sidenav in docs app
        //         // Modal dialogs should fully cover application to prevent interaction outside of dialog
        //         parent: angular.element(document.body),
        //         targetEvent: ev,
        //         clickOutsideToClose: true,
        //         fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
        //         preserveScope:true,
        //         multiple: true
        //     });
        //     $http2.get("getGdpTotal",true)
        //         .then(function(resp){
        //             if(resp.data){
        //                 resp.data.forEach(function (t) {t.sub =angular.fromJson(t.sub);t.years =angular.fromJson(t.years)});
        //                 $scope.gdps=resp.data;
        //
        //                 // console.log( $scope.gdps);// why this  console array same as after for each
        //                 $scope.gdpsFew= $scope.gdps;
        //                 $scope.gdpsFew.forEach(function(g){g.years=g.years.slice(-1.-4)});
        //                 $scope.Gdps=$scope.gdpsFew;
        //
        //
        //                 console.log($scope.gdps);
        //                 console.log($scope.Gdps);
        //                 $scope.year = $scope.gdps[$scope.index].years[$scope.yearIndex].years;
        //
        //                 $scope.$apply();}});
        //     $http2.get("getAllStates",true)
        //         .then(function(resp){if(resp.data){
        //             $scope.AllStates=resp.data;
        //             $scope.AllStates.forEach(function (elem) {
        //                 elem.sub = $scope.gdps[$scope.index].sub;
        //             });
        //             console.log( $scope.AllStates);
        //             $scope.$apply();
        //         }
        //         });
        //     $scope.changeYear = function () {
        //         console.log($scope.year);
        //         console.log($scope.id);
        //         $http2.post("getGdbYearMain",{year:$scope.year,main_id:$scope.id},true)
        //             .then(function (resp) {
        //                 if(resp.data){
        //                     resp.data.forEach(function (t) {
        //                         t.sub=angular.fromJson(t.sub)
        //                     });
        //                     $scope.StateSubValue=resp.data;
        //                     console.log($scope.StateSubValue);
        //                     $scope.$apply()
        //                 }
        //             })
        //     };
        // };


    });


