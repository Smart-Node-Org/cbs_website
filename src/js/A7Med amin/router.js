angular.module("myApp",["ngAnimate","ngSanitize","ngAria","ui.router",'ngMaterial', 'ngMessages',"mdPickers"])

    .run(function ($rootScope,$e,$account,$mdSidenav,$interval,$checker,$transitions,$sockets,$sharerTags) {
        // $rootScope.url="https://atc-edu.com/atc/api/"
        // $rootScope.imgUrl="https://atc-edu.com/"
        // if(localStorage["userData"])
        //     $account.loginUser()
        //
        $rootScope.url="http://104.248.238.177:7077/api/"
        $rootScope.accountData={
            "unseen_notes": [
                {
                    "id": 2,
                    "body": "Welcome students to the course. I promise you it will the most exiting course you do !",
                    "title": "Greeting",
                    "source": 1,
                    "created": "2020-06-27 11:59:07.000000",
                    "gateway": 2,
                    "running_course_id": 31
                },
                {
                    "id": 4,
                    "body": "A new exam has been added to the course be ready",
                    "title": "New Exam",
                    "source": 0,
                    "created": "2020-06-28 13:30:29.000000",
                    "gateway": 2,
                    "running_course_id": 31
                },
                {
                    "id": 5,
                    "body": "Remeber to bring your laptop tommorow",
                    "title": "Laptop Bringing",
                    "source": 1,
                    "created": "2020-07-05 07:37:56.000000",
                    "gateway": 2,
                    "running_course_id": 31
                },
                {
                    "id": 8,
                    "body": "You have to complete your second payment",
                    "title": "Payment",
                    "source": 1,
                    "created": "2020-07-08 06:37:02.000000",
                    "gateway": 2,
                    "running_course_id": 31
                }
            ],
            "usd_card_number": "",
            "usd_card_exp": null,
            "smart_user_id": 18,
            "user_id": 34,
            "name": "Abdullah Ahmed",
            "tel": "0912258407",
            "email": "smartnode.sd@gmail.com",
            "lng": null,
            "lat": null,
            "img": "18.jpg",
            "card_number": null,
            "work": null,
            "speialization": null,
            "courses": [
                {
                    "img": "58.jpg",
                    "name": "Native Client-Side Technologies 1",
                    "paid": 15,
                    "alias": "G1",
                    "price": 15,
                    "stars": null,
                    "state": 1,
                    "degree": 80,
                    "groups": [
                        {
                            "time": "09:00",
                            "letter": "A"
                        },
                        {
                            "time": "16:00",
                            "letter": "B"
                        }
                    ],
                    "points": null,
                    "created": "2020-06-25 18:43:07.000000",
                    "reveiew": null,
                    "trainer": "Abdullah Ahmed",
                    "currency": "d",
                    "reg_type": "2",
                    "completed": 0,
                    "line_descr": "Proffissonal course, gives you deep dive in the topic and opens your mind to more advance techniques",
                    "payment_id": "882593110587846K",
                    "start_time": "2020-07-15 08:00:00.000000",
                    "finish_time": "2020-08-15 23:59:00.000000",
                    "payment_type": "visa",
                    "course_reg_id": 1,
                    "reg_cancelled": 0,
                    "selected_group": "A",
                    "course_cancelled": 0,
                    "payment_confirmed": 1,
                    "running_course_id": 31,
                    "reg_cancelled_time": null,
                    "notification_service": 1,
                    "course_cancelled_time": null,
                    "$$hashKey": "object:45"
                }
            ],
            "speialization_id": null,
            "points": 0,
            "created": "2020-06-18T21:00:32.000Z",
            "gender": "m",
            "sd_balance": 0,
            "usd_balance": 0,
            "certificate_name": null,
            "blocked": 0,
            "university": null,
            "isTrainer": 0
        }
        $rootScope.windowSize=window.innerWidth
        window.onscroll=function(){
            $("#dashb-01-toggle").removeClass("open")
            $("body").removeClass("dashb-01-expanded loaded")
        }
        window.onresize=function(event){
            $rootScope.windowSize=event.target.innerWidth
            if(event.target.innerWidth<=990){
                $("#dashb-01-toggle").removeClass("open")
                $("body").removeClass("dashb-01-expanded loaded")
            }
            // if(event.target.innerWidth>=640)
            //     $("#mobile-search").attr('hidden','')
            $rootScope.$apply()
            console.log($rootScope.windowSize)
        }
        $transitions.onSuccess({}, function($transition){
            $("body,html").animate({scrollTop:0},200)
            $rootScope.previousState = $transition.$from().name;
            x=$transition.$from()
            $rootScope.currentState = $transition.$to().name;
        });
        $rootScope.isMobile=$checker.isMobile()
    })
    .config(function($stateProvider, $urlRouterProvider) {
        var currentCourses
        $stateProvider
            .state("app", {
                url: "/app",
                views: {
                    "main": {
                        templateUrl: "templates/main.html",
                        controller: "appCtrl"
                    }
                }

            })
            .state("app.home", {
                url: "/home",
                views: {
                    "sub": {
                        templateUrl: "templates/home.html",
                        controller: "homeCtrl"
                    }
                },
            })
            .state("app.population", {
                url: "/population",
                views: {
                    "sub": {
                        templateUrl: "templates/population.html",
                        controller: "populationCtrl"
                    }
                }
            })

            .state("app.economic", {
                url: "/economic",
                views: {
                    "sub": {
                        templateUrl: "templates/economy.html",
                        controller: "economicCtrl"

                    }
                }
            })

            .state("app.states", {
                url: "/states",
                views: {
                    "sub": {
                        templateUrl: "templates/states.html",
                        controller: "statesCtrl"

                    }
                }
            })

            .state("app.cities", {
                url: "/cities",
                views: {
                    "sub": {
                        templateUrl: "templates/citiesForYear.html",
                        controller: "citiesForYearCtrl"

                    }
                }
            })

            .state("app.GDP",{
                url:"/GDP",
                view:{
                    "sub":{
                        templatesUrl:"templates/GDP.html",
                        controller:"GDPCtrl"
                    }

                }


            })


            .state("app.foriegn", {
                url: "/foriegn",
                views: {
                    "sub": {
                        templateUrl: "templates/foriegnTrade.html",
                        controller: "foriegnCtrl"

                    }
                }
            })
            .state("app.publication", {
                url: "/publication",
                views: {
                    "sub": {
                        templateUrl: "templates/publication.html",
                        controller: "publicationCtrl"

                    }
                }
            })

            .state("app.slides", {
                url: "/slides",
                views: {
                    "sub": {
                        templateUrl: "templates/slides.html",
                        controller: "slidesCtrl"

                    }
                }
            })


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home')
    })