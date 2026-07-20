angular.module("myApp",["ui.router","ngMaterial","ngMessages"])
    .run(function ($rootScope,$http2,$sockets,$transitions) {
        // $rootScope.url="https://atc-edu.com/atc/api/"
        // $rootScope.imgUrl="https://atc-edu.com/"
        // if(localStorage["userData"])
        //     $account.loginUser()
        //
        if(!localStorage['lang']){
            localStorage['lang'] = 'en';
        }
        $rootScope.lang = localStorage['lang'];
        console.log($rootScope.lang);
        $rootScope.url="https://cbs.gov.sd/api/"
        $transitions.onSuccess({}, function($transition){
            $("body,html").animate({scrollTop:0},0)
            $rootScope.previousState = $transition.$from().name;
            x=$transition.$from()
            $rootScope.currentState = $transition.$to().name;
            if($rootScope.currentState == "app.student_workshop_dashboard"){
                $rootScope.inWorkshop=true
                console.log("in")
            }
            else{
                $rootScope.inWorkshop=false
                console.log("out")
            }
        });
        $sockets.init()

        //creating session
        $http2.get("getuserinfo").then(function(resp){
            socket.emit("connectUser",0,resp);
        });
    })

.config(function ($stateProvider,$urlRouterProvider) {
    $stateProvider
            .state("app",{
                url:"/app",
                views:{
                    main:{
                        templateUrl:`templates/main.html`,
                        controller:"appCtrl"
                    }
                }
            })
    //     .state("app",{
    //         url:"/app",
    //         views:{
    //             main:{
    //                 templateUrl:"templates/main_ar.html",
    //                 controller:"app_arCtrl"
    //             }
    //         }
    //     })
        .state("app.home",{
            url:"/home",
            views:{
                sub:{
                    templateUrl:`templates/home.html`,
                    controller:"homeCtrl"
                }
            }
        })
        // .state("app.homear",{
        //     url:"/homear",
        //     views:{
        //         sub:{
        //             templateUrl:"templates/homear.html",
        //             controller:"homearCtrl"
        //         }
        //     }
        // })
        .state("app.social",{
            url:"/social/{tab}",
            views:{
                sub:{
                    templateUrl:"templates/social.html",
                    controller:"socialCtrl"
                }
            },
            parms:{
                tab:null
            }
        })
        .state("app.economy",{
            url:"/economy/{tab}",
            views:{
                sub:{
                    templateUrl:"templates/economy.html",
                    controller:"economyCtrl"
                }
            },
			parms:{
				tab:null
			}
        })

        .state("app.sdj",{
            url:"/sdj",
            views:{
                sub:{
                    templateUrl:"templates/sdj.html",
                    controller:"sdjCtrl"
                }
            }
        })
        .state("app.contact",{
            url:"/contact",
            views:{
                sub:{
                    templateUrl:`templates/contacus.html`,
                    controller:"contactCtrl"
                }
            }
        })
        // .state("app.contactar",{
        //     url:"/contactar",
        //     views:{
        //         sub:{
        //             templateUrl:"templates/contacarus.html",
        //             controller:"contactarCtrl"
        //         }
        //     }
        // })
        .state("app.about",{
            url:`/about`,
            views:{
                sub:{
                    templateUrl:`templates/about.html`,
                    controller:"aboutCtrl"
                }
            }
        })
        // .state("app.aboutar",{
        //     url:"/aboutar",
        //     views:{
        //         sub:{
        //             templateUrl:"templates/aboutar.html",
        //             controller:"aboutarCtrl"
        //         }
        //     }
        // })
        .state("app.news",{
            url:`/news`,
            views:{
                sub:{
                    templateUrl:`templates/news.html`,
                    controller:"newsCtrl"
                }
            }
        })
        // .state("app.newsar",{
        //     url:"/newsar",
        //     views:{
        //         sub:{
        //             templateUrl:"templates/newsar.html",
        //             controller:"newsarCtrl"
        //         }
        //     }
        // })
        .state("app.image",{
            url:"/image",
            views:{
                sub:{
                    templateUrl:"templates/image.html",
                    controller:"imageCtrl"
                }
            }
        })
        .state("app.newOne",{
            url:"/newOne/:news_id",
            views:{
                sub:{
                    templateUrl:"templates/newOne.html",
                    controller:"newOneCtrl"
                }
            }
        })
        .state("app.metadata",{
            url:"/metadata",
            views:{
                sub:{
                    templateUrl:"templates/metadata.html",
                    controller:"metadataCtrl"
                }
            }
        })

        .state("app.Indicators",{
            url:"/Indicators",
            views:{
                sub:{
                    templateUrl:"templates/Indicators.html",
                    controller:"IndicatorsCtrl"
                }
            }
        })
        .state("app.Publications",{
            url:"/Publications",
            views:{
                sub:{
                    templateUrl:"templates/Publications.html",
                    controller:"publicationsCtrl"
                }
            }
        })
        // .state("app.Publicationsar",{
        //     url:"/Publicationsar",
        //     views:{
        //         sub:{
        //             templateUrl:"templates/Publicationsar.html",
        //             controller:"publicationsarCtrl"
        //         }
        //     }
        // }) 
        .state("app.statisitics",{
            url:"/statisitics",
            views:{
                sub:{
                    templateUrl:"templates/statisitics.html",
                    controller:"statisiticsCtrl"
                }
            }
        })
        // .state("app.statisiticsar",{
        //     url:"/statisiticsar",
        //     views:{
        //         sub:{
        //             templateUrl:"templates/statisiticsar.html",
        //             controller:"statisiticsarCtrl"
        //         }
        //     }
        // })


    $urlRouterProvider.otherwise("/app/home")
})
