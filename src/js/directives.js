angular.module("myApp")
    .directive('whenScrolled', ['$timeout', function($timeout) {
        return function(scope, elm, attr) {
            var raw = elm[0];

            $timeout(function() {
                raw.scrollTop = raw.scrollHeight;
            });

            elm.bind('scroll', function() {
                if ($(".page").scrollTop()==0) { // load more items before you hit the top
                    scope.$apply(attr.whenScrolled);
                }
            });
        };
    }])
    .directive("hScroll",function ($rootScope,$document,$window,$timeout) {
        return {
            transclude:true,
            template:"<div style='display: flex;flex-direction: row'>" +
                "<button class='btn btn-link' style='padding:5px'>" +
                "<md-icon ng-bind=\"'chevron_left'\"></md-icon>" +
                "</button>" +
                "<div class='fff text-nowrap' style='width:100%;height: 200px !important;overflow:hidden;position:relative' ng-transclude></div>" +
                "<button class='btn btn-link' style='padding:5px'>" +
                "<md-icon ng-bind=\"'chevron_right'\"></md-icon>" +
                "</button>" +
                "</div>",
            link:function (scope,element,attrs) {
                //var scrolled=attrs.vElements?(parseFloat(attrs.vElements)-1):0
                //console.log(attrs.hasOwnProperty('matchHeight'))

                var width = 0
                var currentTouchLoc;
                var startTouchLoc;
                var vChildren=0
                attrs.vStep=attrs.vStep?parseFloat(attrs.vStep):undefined
                attrs.vElements=attrs.vElements?parseFloat(attrs.vElements):undefined
                element.find("button:first").css('visibility','hidden')
                var scrollTimer;
                var startScrollLeft;
                function init() {
                    vChildren=element.find('.fff').children().length>1?element.find('.fff').children():(element.find('.fff').children().children().length>1?element.find('.fff').children().children():element.find('.fff').children().children().children())
                    console.log(vChildren[0].style.width)

                    element.find('.fff').css({
                        display:'flex',
                        'flex-direction':'row',
                        'align-items':'center',
                        height:attrs.vHeight,
                        width:attrs.vElements&&attrs.vElements<vChildren.length?(vChildren.length>0?((vChildren[0].scrollWidth+vChildren[0].offsetLeft)*attrs.vElements+vChildren[0].offsetLeft):''):(attrs.vWidth?attrs.vWidth:'')
                    }).animate({scrollLeft:0},0)
                    var maxWidth=0
                    var shownWidth=0
                    for (var i = 0; i < vChildren.length; i++) {
                        width += vChildren[i].offsetWidth
                        var elementWidth=vChildren[i].offsetWidth
                        console.log(elementWidth)
                        if(elementWidth>maxWidth)
                            maxWidth=vChildren[i].offsetWidth
                        if(attrs.vElements && i<=(parseFloat(attrs.vElements)-1))
                            shownWidth+=vChildren[i].offsetWidth

                    }
                    // element.find('.fff').css({
                    //     'width':attrs.vElements?shownWidth:'100%'
                    // })
                    console.log(vChildren[0].clientWidth)
                    vChildren.css({
                        'width':maxWidth
                    })
                    element.find(".fff").css("width",attrs.vElements&&attrs.vElements<vChildren.length?(vChildren.length>0?((vChildren[1].offsetLeft-vChildren[0].offsetLeft)*(attrs.vElements)):''):(attrs.vWidth?attrs.vWidth:''))
                    if(element.find('.fff')[0].clientWidth>=width)
                        element.find("button:last").css('visibility','hidden')
                }
                scope.inited=function(last) {
                    console.log(last)
                    if(last)
                        $timeout(init)
                }

                if(!attrs.hasOwnProperty('hasNgRepeat')){
                    console.log("normal")
                    setTimeout(init,300)
                }
                element.find("button:last").on('click',function () {
                    if(!scrollTimer)
                        scrollTimer=setTimeout(function () {
                            scrollTimer=undefined;
                        },300)
                    else{
                        console.log("!")
                        return
                    }
                    element.find("button:first").css('visibility','visible')
                    var clientWidth=element.find('.fff')[0].clientWidth
                    var scrolled=attrs.vStep?(attrs.vStep*element.find(".fff")[0].scrollWidth/vChildren.length+0*attrs.vStep):(clientWidth/2)
                    var scroll= element.find('.fff').prop('scrollLeft') + scrolled
                    element.find('.fff').animate({scrollLeft: scroll},300)
                    if(scroll+clientWidth>=element.find('.fff')[0].scrollWidth)
                        element.find("button:last").css('visibility','hidden')

                })
                element.find("button:first").on('click',function () {
                    console.log("clicked")
                    if(!scrollTimer)
                        scrollTimer=setTimeout(function () {
                            scrollTimer=undefined;
                        },300)
                    else{
                        console.log("!")
                        return
                    }
                    element.find("button:last").css('visibility','visible')

                    var clientWidth=element.find('.fff')[0].clientWidth
                    var scrolled=attrs.vStep?(attrs.vStep*element.find(".fff")[0].scrollWidth/vChildren.length+0*attrs.vStep):(clientWidth/2)
                    var scroll= element.find('.fff').prop('scrollLeft') - scrolled
                    element.find('.fff').animate({scrollLeft: scroll},300)
                    if(scroll<=0)
                        element.find("button:first").css('visibility','hidden')
                })
                element.on("touchstart",function (event) {
                    startTouchLoc=currentTouchLoc=event.touches[0].pageX
                    startScrollLeft=element.find('.fff').prop('scrollLeft')

                })
                element.on("touchmove",function (event) {

                        var scroll= element.find('.fff').prop('scrollLeft') + (currentTouchLoc-event.touches[0].pageX)
                        element.find('.fff').animate({scrollLeft: scroll},1)
                         currentTouchLoc=event.touches[0].pageX
                })
                element.on("touchend",function (event) {

                    var scroll= Math.round((element.find('.fff')[0].scrollLeft/element.find('.fff')[0].scrollWidth)*vChildren.length)*(element.find('.fff')[0].scrollWidth/vChildren.length)
                    element.find('.fff').animate({scrollLeft: scroll},300,function () {
                        var scroll= element.find('.fff')[0].scrollLeft
                        var clientWidth=element.find('.fff')[0].clientWidth

                        if(element.find('.fff')[0].clientWidth>=width || scroll+clientWidth>=element.find('.fff')[0].scrollWidth )
                            element.find("button:last").css('visibility','hidden')
                        else
                            element.find("button:last").css('visibility','visible')
                        if(scroll<=0){
                            element.find("button:first").css('visibility','hidden')
                            element.find('.fff').animate({scrollLeft: 0},0)
                        }
                        else
                            element.find("button:first").css('visibility','visible')
                    })
                    console.log(scroll)

                })

                angular.element($window).on("resize", function() {
                    console.log('resized h')
                    var clientWidth=element.find('.fff')[0].clientWidth
                    var scrollLeft= element.find('.fff')[0].scrollLeft
                    var scrollWidth=element.find('.fff')[0].scrollWidth
                    console.log("clientWidth",clientWidth)
                    console.log("scrollLeft",scrollLeft)
                    console.log("scrollWidth",scrollWidth)
                    if(clientWidth>=scrollWidth || scrollLeft+clientWidth>=scrollWidth)
                        element.find("button:last").css('visibility','hidden')
                    else
                        element.find("button:last").css('visibility','visible')
                    if(scroll<=0)
                        element.find("button:first").css('visibility','hidden')
                });
                element.on('$destroy',function () {
                    angular.element($window).off("resize")
                    element.off("touchstart")
                    element.off("touchmove")
                    element.off("touchend")
                    element.find("button:first").off('click')
                    element.find("button:last").off('click')
                })
            }
        }
    })
    .directive("vScroll",function ($rootScope,$document,$window,$timeout) {
        return {
            transclude:true,
            template:"<div style='display: flex;flex-direction: column'>" +
                "<button class='btn btn-link'>" +
                "<md-icon ng-bind=\"'expand_less'\"></md-icon>" +
                "</button>" +
                "<div class='fff' style='width:100%;overflow:hidden;position:relative;display:flex;flex-direction: column;' ng-transclude></div>" +
                "<button class='btn btn-link'>" +
                "<md-icon ng-bind=\"'expand_more'\"></md-icon>" +
                "</button>" +
                "</div>",
            link:function (scope,element,attrs) {
                var height = 0
                var scrollTimer
                function init () {
                    vChildren = element.find('.fff').children().length > 1 ? element.find('.fff').children() : element.find('.fff').children().children()

                    element.find('.fff').css({
                        display: 'flex',
                        'flex-direction': 'column',
                        'align-items': 'center',
                        height: attrs.vElements && attrs.vElements < vChildren.length ? (vChildren.length > 0 ? element.find(".fff")[0].scrollHeight / vChildren.length * attrs.vElements + 0 * attrs.vElements : '') : (attrs.vHeight ? attrs.vHeight : '')
                    })
                    var maxWidth = 0
                    var maxHeight = 0
                    for (i = 0; i < vChildren.length; i++) {
                        height += vChildren[i].offsetHeight
                        if (vChildren[i].offsetWidth > maxWidth)
                            maxWidth = vChildren[i].offsetWidth
                        if (vChildren[i].offsetHeight > maxHeight)
                            maxHeight = vChildren[i].offsetHeight

                    }
                    vChildren.css('width', maxWidth)
                    if(attrs.hasOwnProperty('matchHeight'))
                        vChildren.css('hieght', maxHeight)
                    if (element.find('.fff')[0].clientHeight >= element.find('.fff')[0].scrollHeight)
                        element.find("button:last").css('visibility', 'hidden')
                    else
                        element.find("button:last").css('visibility', 'visible')
                }
                if(element.html().includes("ngRepeat")){
                    var timer
                    scope.$watch(function () {
                        return element.html()
                    },function (oldVal,newVal) {
                        if(timer) clearTimeout(timer)
                        timer=setTimeout(function () {
                            init()
                        },70)
                    },true)
                }
                else {
                    setTimeout(init, 200)
                }
                attrs.vElements=attrs.vElements?parseFloat(attrs.vElements):undefined
                attrs.vStep=attrs.vStep?parseFloat(attrs.vStep):undefined
                var vChildren;
                element.find("button:first").css('visibility','hidden')
                element.find("button:last").on('click',function () {
                    if(!scrollTimer)
                        scrollTimer=setTimeout(function () {
                            scrollTimer=undefined;
                        },300)
                    else{
                        return
                    }
                    element.find("button:first").css('visibility','visible')
                    var clientHeight=element.find('.fff')[0].clientHeight
                    var scrolled=attrs.vStep?(attrs.vStep*element.find(".fff")[0].scrollHeight/vChildren.length+0*attrs.vStep):(clientHeight/2)

                    var scroll= element.find('.fff').prop('scrollTop') + scrolled
                    element.find('.fff').animate({scrollTop: scroll},300)
                    if(scroll+clientHeight>=element.find(".fff")[0].scrollHeight)
                        element.find("button:last").css('visibility','hidden')
                })
                element.find("button:first").on('click',function () {
                    if(!scrollTimer)
                        scrollTimer=setTimeout(function () {
                            scrollTimer=undefined;
                        },300)
                    else{
                        console.log("!")
                        return
                    }
                    element.find("button:last").css('visibility','visible')
                    var scrolled=attrs.vStep?(attrs.vStep*element.find(".fff")[0].scrollHeight/vChildren.length+0*attrs.vStep):(clientHeight/2)

                    var scroll= element.find('.fff').prop('scrollTop') - scrolled
                    console.log(scroll)

                    element.find('.fff').animate({scrollTop: scroll},300)
                    if(scroll<=0)
                        element.find("button:first").css('visibility','hidden')
                })
                angular.element($window).on("resize", function() {
                    console.log('resized v')
                    var clientHeight=element.find('.fff')[0].clientHeight
                    var scroll= element.find('.fff').prop('scrollTop')
                    if(element.find('.fff')[0].clientHeight>=height || scroll+clientHeight>=height )
                        element.find("button:last").css('visibility','hidden')
                    else
                        element.find("button:last").css('visibility','visible')
                    if(scroll==0)
                        element.find("button:first").css('visibility','hidden')
                });
                element.on('$destroy',function () {
                    angular.element($window).off("resize")
                    element.find("button:first").off('click')
                    element.find("button:last").off('click')
                })
            }
        }
    })
    .directive("mdsFile",function(){
        return {
            scope:{
                x:"=file",
                y:"=base64",
                z:"&mdsChange",
                v:'=size'
            },
            link:function(scope,element,attrs){
                element.on("change",function(event){
                    if(attrs['file'])
                        scope.x=event.target.files[0]
                    var files=event.target.files
                    var size
                    if(files[0].size>=1024*1024*1024)
                        size=(files[0].size/(1024*1024*1024)).toFixed(2)+" GB"
                    else if(files[0].size>=1024*1024)
                        size=(files[0].size/(1024*1024)).toFixed(2)+" MB"
                    else if(files[0].size>=1024)
                        size=(files[0].size/(1024)).toFixed(2)+" KB"
                    else
                        size=(files[0].size).toFixed(2)+" B"
                    scope.v=size

                    if(attrs['base64']){
                        var reader=new FileReader()
                        reader.onload=function(event){
                            scope.y=event.target.result
                            window.g=event.target.result
                            scope.$apply()
                        }

                        reader.readAsDataURL(scope.x)
                    }
                    if(attrs['mdsChange']){
                        var data={file:event.target.files[0]}
                        if(attrs['base64'])
                            data.image=scope.y
                        scope.z(data)
                    }


                })
            }
        }
    })
    .directive('chooseFile', function() {
        return {
            scope: {
                x: "=file",
                z:"&mdsChange",
                y:'=size'
            },
            template:function (element,attrs) {
                return " <div layout='row'><input id=\"fileInput1\" type=\"file\" accept="+attrs.accept+" class=\"ng-hide\">\n" +
                    "                        <md-input-container flex class=\"md-block\">\n" +
                    "                            <input type=\"text\" value='"+(attrs.placeholder?attrs.placeholder:'Choose File')+"'  disabled>\n" +
                    "                            <div class=\"hint\"></div>\n" +
                    "                        </md-input-container>\n" +
                    "                        <div>\n" +
                    "                            <md-button class=\"md-fab md-mini\">\n" +
                    "                                <md-icon class=\"material-icons\">attach_file</md-icon>\n" +
                    "                            </md-button>\n" +
                    "                        </div></div>"
            },
            link: function (scope, elem, attrs) {
                var button = elem.find('button');
                var input = angular.element(elem[0].querySelector('input[type=file]'));
                if(attrs.hasOwnProperty('required'))
                    input.prop('required','required')
                var textIn = angular.element(elem[0].querySelector('input[type=text]'));
                textIn.val(attrs['placeholder'])
                button.bind('click', function() {
                    input[0].click();
                });
                var changed
                input.bind('change', function(e) {
                    scope.$apply(function() {
                        console.log("hi there")
                        var files = e.target.files;
                        if(attrs.accept && attrs.accept.startsWith('image')){
                            var reader=new FileReader()
                            reader.onload=function(event){
                                var img=`<img src='${event.target.result}' width="128px" class="z-depth-1 zoomIn">`
                                if(!changed)
                                    elem.after(img)
                                else{
                                    elem.next().prop("outerHTML",img)

                                }

                                changed=true
                            }


                            reader.readAsDataURL(files[0])
                        }
                        if(attrs['mdsChange']){
                            var data={file:files[0]}
                            scope.z(data)
                        }
                        if (files[0]) {
                            textIn.val(files[0].name)
                            scope.x=files[0]
                            var size
                            if(files[0].size>=1024*1024*1024)
                                size=(files[0].size/(1024*1024*1024)).toFixed(2)+" GB"
                            else if(files[0].size>=1024*1024)
                                size=(files[0].size/(1024*1024)).toFixed(2)+" MB"
                            else if(files[0].size>=1024)
                                size=(files[0].size/(1024)).toFixed(2)+" KB"
                            else
                                size=(files[0].size).toFixed(2)+" B"
                            scope.y=size
                            angular.element(elem[0].querySelector('.hint')).text(size)
                        } else {
                            textIn.val('')
                        }
                    });
                });
            }
        };
    })
    .directive('mdsDate',function () {
        return {
            scope:{
                mdsDate:'='
            },
            link:function (scope,element,attrs) {
                if(scope.mdsDate){
                    try{
                        scope.mdsDate=scope.mdsDate.substring(0,10)
                    }catch(e){console.error(e)}
                }
                element.val(scope.mdsDate)
                element.on('change',function (event) {
                    console.log(event.target.value)
                    scope.mdsDate=event.target.value
                })
            }
        }
    })
    .directive("mdsRating",function ($rootScope,$document) {
        function genStars(stars) {
            return " <a href=\"#!\">\n" +
                "                        <ul class=\"rating\">\n" +
                "                            <li index='1'>\n" +
                "                                <i class=\" "+(stars>0?'fas':'far')+" fa-star fa-sm text-primary\"></i>\n" +
                "                            </li>\n" +
                "                            <li index='2'>\n" +
                "                                <i class=\" "+(stars>1?'fas':'far')+" fa-star fa-sm text-primary\"></i>\n" +
                "                            </li>\n" +
                "                            <li index='3'>\n" +
                "                                <i class=\" "+(stars>2?'fas':'far')+" fa-star fa-sm text-primary\"></i>\n" +
                "                            </li>\n" +
                "                            <li index='4'>\n" +
                "                                <i class=\" "+(stars>3?'fas':'far')+" fa-star fa-sm text-primary\"></i>\n" +
                "                            </li>\n" +
                "                            <li index='5'>\n" +
                "                                <i class=\" "+(stars>4?'fas':'far')+" fa-star fa-sm text-primary\"></i>\n" +
                "                            </li>\n" +
                "                        </ul>\n" +
                "                    </a>"
        }

        function setStars(element,stars) {
            console.log(stars)

            for(var i=0;i<5;i++){
                if(i<stars)
                    $("#myRating").find("i:eq("+i+")").removeClass("far").addClass("fas")
                else
                    $("#myRating").find("i:eq("+i+")").removeClass("fas").addClass("far")
            }
        }
        return {
            scope:{
                hover:"=hoverRate",
                rate:"=actualRate",
            },
            template:function (element,attrs) {
                var stars
                if(attrs['actual-rate'] && typeof(attrs['actual-rate'])){
                    if(attrs['actual-rate']>5)
                        stars=5
                    else if(attrs['actual-rate']>=0 && attrs['actual-rate']<=5)
                        stars=attrs['actual-rate']
                    else
                        stars=0
                }
                else
                    stars=0
                return genStars(stars)
            },
            link:function (scope,element,attrs) {
              var rate
                if(!scope.rate)
                  scope.rate=0
                rate=scope.rate
                element.on("click",function (event) {
                    event.preventDefault()
                })
                element.on("mouseout",function () {
                    console.log(rate)
                    setStars(element,rate)
                    console.log("left")
                    scope.hover=null
                    scope.$apply()
                })
                    element.find("li").on("mouseover",function () {
                        var stars=$(this).attr("index")-0
                        setStars(element,stars)
                        scope.hover=stars
                        scope.$apply()
                    })

                    element.find("li").on("click",function () {
                        var stars=$(this).attr("index")-0
                        setStars(element,stars)
                        scope.rate=stars
                        rate=stars
                        scope.$apply()
                    })

            }
        }
    })
    .directive('matchHeight', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                function init() {
                    var vChildren = element.children().length > 1 ? element.children() : element.find('.fff').children().children()
                    var maxHeight = 0
                    for (i = 0; i < vChildren.length; i++) {
                        if (vChildren[i].offsetHeight > maxHeight)
                            maxHeight = vChildren[i].offsetHeight

                    }
                    console.log(maxHeight)
                    vChildren.css('hieght', maxHeight)
                }
                if(element.html().includes("ngRepeat")){
                    var timer
                    scope.$watch(function () {
                        return element.html()
                    },function (oldVal,newVal) {
                        if(timer) clearTimeout(timer)
                        timer=setTimeout(function () {
                            init()
                        },70)
                    },true)
                }
                else {
                    setTimeout(init, 100)
                }
            }
        }
    })
    .directive('mdsFileMultiple', function ($rootScope) {
        return {
            scope:{
                images:'=',
                files:'='
            },
            link:function (scope,element,attrs) {
                if(!attrs.hasOwnProperty('files'))
                    return
                if(!scope.files)
                    scope.files=[]
                if(attrs.hasOwnProperty('images')) {
                    element.prop("accept","image/*")
                    if(!scope.images)
                         scope.images = []
                }
                element.prop("multiple","multiple")
                function readImage(file){
                    return new Promise(function (resolve,rejeact) {
                        var reader = new FileReader()
                        reader.onload = function (event) {
                            resolve(event.target.result)
                        }
                        reader.readAsDataURL(file)
                    })
                }
                element.on("change",function (event) {
                    var tempImages=[]
                    for(var i=0;i<event.target.files.length;i++){
                        if(scope.files.filter(function(f){return f.name==event.target.files[i].name}).length==0){
                            console.log(event.target.files[i].name+" is good")
                            scope.files.push(event.target.files[i])
                            if(scope.images)
                                tempImages.push(event.target.files[i])
                        }
                    }
                    if(scope.images) {
                        console.log("start processing")
                        console.log(tempImages)
                        var z = tempImages.map(readImage)
                        console.log(z)
                        Promise.all(z).then(function (resp) {
                            scope.images=scope.images.concat(resp)
                        })
                    }

                })

            }
        }
    })
    .directive('stopPropagation', function () {
        return {
            restrict: 'A',
            scope:{
                x:"&mdsClick"
            },
            link: function (scope, element) {
                element.bind('click', function (e) {
                    e.stopPropagation()
                    e.preventDefault()
                    scope.x()
                    return false
                });
            }
        };
    })
    .directive("mdsModal",function($rootScope){
        return {
            transclude:true,
            scope:{
                closable:"@",
                onClose:"&"
            },
            template:function(element,attrs){
                return `<div class="mds-overlay">
  <div class="mds-popup ${$rootScope.lang=='en'?'':'text-right'}">
        ${attrs.hasOwnProperty("closable")||attrs.hasOwnProperty("onClose")?'<a class="mds-close">&times;</a>':''}
        <div ng-transclude></div>
</div>
</div>`
            },
            link: function(scope, element,attrs) {
                if(attrs.hasOwnProperty("onClose")){
                    element.find(".mds-close").on("click",function(event){
                        scope.onClose()
                    })
                    document.on("click",function (){
                        scope.onClose()
                    })
                    element.find(".mds-popup").on("click",function (event){
                        event.stopPropagation()
                    })
                }
            }
        }
    })
    .directive("mdsModalHeader",function(){
        return {
            transclude:true,
            template:function(element,attrs){
                return `<div class="popup-header" ng-transclude></div>`
            }
        }
    })
    .directive("mdsModalTitle",function(){
        return {
            transclude:true,
            template:function(element,attrs){
                return `<h2><span ng-transclude></span></h2>`
            }
        }
    })
    .directive("mdsModalBody",function(){
        return {
            transclude:true,
            template:function(element,attrs){
                return `<div class="popup-content" ng-transclude></div>`
            }
        }
    })
    .directive("mdsModalFooter",function(){
        return {
            transclude:true,
            scope:{
                alignText:"@"
            },
            template:function(element,attrs){
                return `<div class="uk-modal-footer ${attrs.hasOwnProperty('alignText')?('uk-text-'+attrs.alignText):''}" ng-transclude></div>`
            }
        }
    })
    .directive("mdsPagination",function(){
        return {
            scope:{
                pageCount:"=",
                onPageClicked:"&",
                page:"="
            },
            template:function(element,attrs){

                return `<ul class="uk-pagination filter my-5 uk-flex-center" uk-margin>
    <li style="visibility: hidden"><a style="cursor: pointer;"><span uk-pagination-previous></span></a> </li>
    <li><a style="cursor: pointer;"><span uk-pagination-next></span></a></li>
</ul>`
            },
            link:function (scope, element,attrs) {
                function checkNextPrev(el){
                    console.log(el)
                    console.log(el.index())
                    if(el.index()==1)
                        $(element).find("li:first").css("visibility","hidden")
                    else
                        $(element).find("li:first").css("visibility","visible")
                    if($(el).index()==scope.pageCount)
                        $(element).find("li:last").css("visibility","hidden")
                    else
                        $(element).find("li:last").css("visibility","visible")
                }
                function init(){
                    $(element).find(".page").remove()
                    var pages = ''
                    for(var i=0;i<scope.pageCount;i++){
                        pages+=`<li class="page${i==0?' uk-active':''}"><span>${i+1}</span></li>`
                    }
                    if(scope.pageCount<=1){
                        $(element).css("visbilty","hidden")
                    }
                    $(element).find("li:first").after(pages)
                    setTimeout(()=>{
                        $(element).find(".page").on("click",function (){
                            console.log($(this).index())
                            $(element).find(".page").removeClass("uk-active")
                            $(this).addClass("uk-active")
                            scope.onPageClicked({page:$(this).index()})
                            checkNextPrev($(this))
                        })
                        $(element).find("li:last>a").on("click",function (){
                            var index = $(element).find("li.uk-active").index()
                            console.log(index)
                            scope.onPageClicked({page:$("li.uk-active").index()})
                            $(element).find("li.uk-active").next().addClass("uk-active")
                            $(element).find(`li:eq(${index})`).removeClass("uk-active")
                            checkNextPrev($(element).find("li.uk-active"))
                            scope.onPageClicked({page:$(element).find("li.uk-active").index()})

                        })
                        $(element).find("li:first>a").on("click",function (){
                            var index = $(element).find("li.uk-active").index()
                            console.log(index)
                            $(element).find("li.uk-active").prev().addClass("uk-active")
                            $(element).find(`li:eq(${index})`).removeClass("uk-active")
                            checkNextPrev($(element).find("li.uk-active"))
                            scope.onPageClicked({page:$(element).find("li.uk-active").index()})
                        })
                    },20)
                }
                var watch1 = scope.$watch("pageCount",function (){
                    $(element).find(".page").off("click")
                    $(element).find("li:last>a").off("click")
                    $(element).find("li:first>a").off("click")
                    init()
                })
                var watch2 = scope.$watch("page",function (){
                    $(element).find(`li`).removeClass("uk-active")
                    $(element).find(`li:eq(${scope.page})`).addClass("uk-active")
                    checkNextPrev($(element).find("li.uk-active"))
                })
                scope.$on("$destroy",function (){
                    $(element).find(".page").off("click")
                    $(element).find("li:last>a").off("click")
                    $(element).find("li:first>a").off("click")
                    watch1()
                    watch2()
                })

            }
        }
    })
    .directive("tr",function ($rootScope,$tr){
        return {
            restrict:"A",
            link: function (scope, element, attrs) {
                $(element).html($tr.translate(attrs.tr))
                let cleanup = $rootScope.$watch("lang",()=>$(element).html($tr.translate(attrs.tr)))
                scope.$on('$destroy',cleanup)
            }
        }
    })
    .directive("trPlaceholder",function ($rootScope,$tr){
        return {
            link: function (scope, element, attrs) {
                $(element).attr("placeholder",$tr.translate(attrs.trPlaceholder))
                let cleanup = $rootScope.$watch("lang",()=>$(element).attr("placeholder",$tr.translate(attrs.trPlaceholder)))
                scope.$on('$destroy',cleanup)
            }
        }
    })