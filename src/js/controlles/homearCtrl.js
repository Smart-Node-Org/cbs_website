angular.module("myApp")
    .controller("homearCtrl",function ($scope,$mdDialog,$http2,$pop,$state,$interval,$compile) {
        console.log('hi home')
        $http2.get("getAllPublications",true)
            .then(function(resp){
                // $scope.shownFilter2 = function (show){return show.shown==1;}
                if(resp.data){$scope.Allpublications=resp.data;console.log( $scope.Allpublications);$scope.$apply();}});
        $http2.get("getAllNews",true).then(function(resp){
            if(resp.data){
                // var index1;
                // var index2;
                $scope.AllNews=resp.data;
                function shownFilter(show){return show.shown==1;}
                $scope.NewsShown =$scope.AllNews.filter(shownFilter);
                var L =$scope.NewsShown.length;
                console.log(L);
                console.log($scope.NewsShown);

                // $scope.AllNews.concat(resp.data)
                x= "<ul class=\"uk-slideshow-items\" style=\"width: 100%;height: 1000px!important;\">\n"

                main=" <div>\n" +
                    "\n"+
                    " <div  class=\"uk-position-relative uk-visible-toggle uk-light uk-position-relative uk-visible-toggle uk-light\" data-uk-observe  tabindex=\"-1\" uk-slideshow=\"animation: scale\" autoplay=\"true\" tabindex=\"-1\" uk-slideshow=\"min-height: 300; max-height: 600; animation: push\">\n" +
                    "\n"
                $scope.Allnews1=$scope.NewsShown.slice(0,L/2);
                console.log( $scope.Allnews1);
                $scope.Allnews1.forEach(function (t,index) {
                    
                    var li=" <li class=\"uk-active uk-transition-active\" >\n" +
                        "<!-- src=\"http://smart-node.net/data/cbs/news/{{news.img}}\"\n" +
                        "{{news.title_en}}\n" +
                        "{{news.body_en}}-->\n" +
                        "<div class=\"uk-card-default\">\n" +
                        "<div class=\"uk-card-media-top\">\n" +
                        "<img src='https://smart-node.net/data/cbs/news/"+t.img+"' alt=\"\" style=\"height: 400px;width: 100%; border-radius:0 0 15px 15px\">\n" +
                        "</div>\n" +
                        "<div class=\"uk-card-body\" style=\"width: 100%;height: 260px!important; background-color: #eeeeee\">\n" +
                        "<h3 class=\"uk-card-title\" style=\"font-size:25px; font-weight: bold; color: #3e4095\">"+t.title_en+"</h3>\n" +
                        "<p style=\"color: #888888;text-align: left\">"+t.body_en.substr(0,100)+" ..."+"</p>\n" +
                        "<p uk-margin>\n" +
                        "\n" +
                        "<button id=\"index\" ng-click=\"oneNews("+t.id+")\" class=\"uk-button news uk-button-danger\"  style=\"border-radius: 50px;background-color: #2d3669\">قراءة المزيد</button>\n" +
                        "\n"+
                        "</p>\n" +
                        "</div>\n" +
                        "</div>\n" +
                        "\n" +
                        "</li>\n";
                    x+=li

                });

                x+="</ul>"
                main+=x+"</div>"
                console.log(main)
                main = $compile(main)($scope)
                $("#news-container1").html(main)
                // $interval(function(){
                //         index1 = $('ul.uk-slideshow-items')[0].indexOf()
                // },1000);

                // $('button#index').on('click', function(){
                //     $state.go('app.newOne',{news_id:$scope.Allnews1[news1Index].id})
                // })


                y= "<ul class=\"uk-slideshow-items\" style=\"width: 100%;height: 1000px!important;\">\n"

                main2=" <div>\n" +
                    "\n"+
                    " <div  class=\"uk-position-relative uk-visible-toggle uk-light uk-position-relative uk-visible-toggle uk-light\" data-uk-observe  tabindex=\"-1\" uk-slideshow=\"animation: scale\" autoplay=\"true\" tabindex=\"-1\" uk-slideshow=\"min-height: 300; max-height: 600; animation: push\">\n" +
                    "\n"
                $scope.Allnews2=$scope.NewsShown.slice(L/2,L);
                console.log( $scope.Allnews2);
                $scope.Allnews2.forEach(function (t,index) {
                    var li=" <li class=\"uk-active uk-transition-active\" >\n" +
                        "<!-- src=\"http://smart-node.net/data/cbs/news/{{news.img}}\"\n" +
                        "{{news.title_en}}\n" +
                        "{{news.body_en}}-->\n" +
                        "<div class=\"uk-card-default\">\n" +
                        "<div class=\"uk-card-media-top\">\n" +
                        "<img src='https://smart-node.net/data/cbs/news/"+t.img+"' alt=\"\" style=\"height: 400px;width: 100%;border-radius:0 0 15px 15px\">\n" +
                        "</div>\n" +
                        "<div class=\"uk-card-body\" style=\"width: 100%;height: 260px!important; background-color: #eeeeee\">\n" +
                        "<h3 class=\"uk-card-title\" style=\"font-size:25px; font-weight: bold; color: #3e4095\" >"+t.title_en+ "</h3>\n" +
                        "<p style=\" color: #888888;text-align: left \"  >"+t.body_en.substr(0,100)+" ..."+"</p>\n" +
                        "<p uk-margin>\n" +
                        "\n" +
                        "<button id=\"index\" ng-click=\"oneNews("+t.id+")\" class=\"uk-button news2 uk-button-danger\" style=\"border-radius: 50px;background-color: #2d3669\" >قراءة المزيد</button>\n" +
                        "\n"+
                        "</p>\n" +
                        "</div>\n" +
                        "</div>\n" +
                        "\n" +
                        "</li>\n";
                    y+=li
                });
                y+="</ul>";
                main2+=y+"</div>";
                console.log(main2);
                main2 = $compile(main2)($scope)
                $("#news-container2").html(main2)
                // $('button#index').on('click', function(){
                //     $state.go('app.newOne',{news_id:$scope.Allnews2[news2Index].id})
                // })


            }


        })
        $scope.oneNews = function(id){
            console.log('clicked!')
            $state.go('app.newOne',{news_id:id})
        }
        console.log($scope);

    })