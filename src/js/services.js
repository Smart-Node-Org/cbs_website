angular.module("myApp")

    .service("$http2",function ($http,$rootScope,$pop) {
        var self=this;
        this.blobSlice =
            File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
        this.chunkSize = 1 * 1024 * 1024; // The size of each chunk, set to 1 Megabyte
        this.setChunkSize=function (mb) {
            self.chunkSize = mb * 1024 * 1024
        }
        this.do=function(url,cc,multiple,loading){
            return new Promise(function (resolve,reject) {
                $rootScope.progressed=0
                var animate;
               if(loading){
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
                       }, 200)

                   });
               }
                $http({
                    method  : 'POST',
                    url     :$rootScope.url+url,
                    processData: false,
                    transformRequest: function (data) {
                        var formData = new FormData();
                        console.log(cc)
                        for(key in cc){
                            formData.append(key, cc[key]);
                        }
                        if($rootScope.accountData)
                            formData.append("user_id", $rootScope.accountData.user_id);
                        if(multiple){
                            for(key in multiple){
                                formData.append("files", multiple[key]);
                            }
                        }
                        return formData;
                    },
                    data : "",
                    headers: {
                        'Content-Type': undefined
                    },uploadEventHandlers: {
                        progress: function(event) {
                            console.log("progress");

                            $rootScope.progressed=(event.loaded/event.total)*100
                            console.log($rootScope.progressed);
                        }
                    }
                }).then(function (resp){
                    clearInterval(animate);
                    $.LoadingOverlay("hide")
                    if(resp.data.status)
                        resolve(resp.data)
                    else {
                        $pop.alert("Error",resp.data.msg)
                        resolve(false)
                    }
                },function (err) {
                    $.LoadingOverlay("hide")
                    reject(err)
                })
            })
        }
        this.doBlob=function(url,cc,blob,loading){
            return new Promise(function (resolve,reject) {
                $rootScope.progressed=0
                var animate;
                if(loading){
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
                }
                $http({
                    method  : 'POST',
                    url     :$rootScope.url+url,
                    processData: false,
                    transformRequest: function (data) {
                        var formData = new FormData();
                        console.log(cc)
                        for(key in cc){
                            formData.append(key, cc[key]);
                        }
                        if($rootScope.accountData)
                            formData.append("user_id", $rootScope.accountData.user_id);
                        formData.append("blob",blob,'file' );

                        return formData;
                    },
                    data : "",
                    headers: {
                        'Content-Type': undefined
                    },uploadEventHandlers: {
                        progress: function(event) {
                            console.log("progress");

                            $rootScope.progressed=(event.loaded/event.total)*100
                            console.log($rootScope.progressed);
                        }
                    }
                }).then(function (resp){
                    clearInterval(animate);
                    $.LoadingOverlay("hide")
                    if(resp.data.status)
                        resolve(resp.data)
                    else {
                        $pop.alert("Error",resp.data.msg)
                        resolve(false)
                    }
                },function (err) {
                    $.LoadingOverlay("hide")
                    reject(err)
                })
            })
        }
        this.post=function (url,data,loading) {
            return new Promise(function (resolve,reject) {
                if(loading){
                    console.log(`${url} with loading`)
                    $.LoadingOverlay("show", {
                        image       : "",
                        fontawesome : "fa fa-cog fa-spin"
                    });
                }

                if($rootScope.accountData)
                    data.user_id=$rootScope.accountData.user_id
                $http.post($rootScope.url+url,data).then(function (resp) {
                    $.LoadingOverlay("hide")
                    if(resp.data.status)
                        resolve(resp.data)
                    else {
                        $pop.alert("Error",resp.data.msg)
                        reject(false)
                    }
                },function (err) {
                    $.LoadingOverlay("hide")
                    reject(err)
                })
            })

        }
        this.get=function (url,loading) {
            return new Promise(function (resolve,reject) {
                if(loading)
                    $.LoadingOverlay("show", {
                    image: "",
                    fontawesome: "fa fa-cog fa-spin"
                });
                $http.get($rootScope.url+url).then(function (resp) {
                    setTimeout(function () {
                        $.LoadingOverlay("hide")
                    },250)
                    if(resp.data.status)
                        resolve(resp.data)
                    else {
                        $pop.alert("Error",resp.data.msg)
                        resolve(false)
                    }
                },function (err) {
                    $.LoadingOverlay("hide")
                    reject(err)
                })
            })


        }
        this.download = function(url,fileName) {
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
            $http({
                url : url ,
                method : 'GET',
                eventHandlers: {
                    progress: function (event) {
                        $rootScope.progressed=(event.loaded/event.total)*100
                    }
                },
                params : {},
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
        this.hash=function (file) {
            // Use the Blob.slice method to split the file.
            // This method is also used differently in different browsers.

            return new Promise((resolve, reject) => {

                const chunks = Math.ceil(file.size / self.chunkSize);
                let currentChunk = 0;
                const spark = new SparkMD5.ArrayBuffer();
                const fileReader = new FileReader();
                function loadNext() {
                    const start = currentChunk * self.chunkSize;
                    const end = start + self.chunkSize >= file.size ? file.size : start + self.chunkSize;
                    fileReader.readAsArrayBuffer(self.blobSlice.call(file, start, end));
                }
                fileReader.onload = e => {
                    spark.append(e.target.result); // Append array buffer
                    currentChunk += 1;
                    if (currentChunk < chunks) {
                        loadNext();
                    } else {
                        console.log('finished loading');
                        const result = spark.end();
                        // If result s are used as hash values only, if the contents of the file are the same and the names are different
                        // You cannot keep two files if you want to.So add the file name.
                        const sparkMd5 = new SparkMD5();
                        sparkMd5.append(result);
                        sparkMd5.append(file.name);
                        const hexHash = sparkMd5.end();
                        resolve(hexHash);
                    }
                };
                fileReader.onerror = () => {
                    console.warn('File reading failed!');
                };
                loadNext();
            }).catch(err => {
                console.log(err);
            });
        }
        this.uploadPart=function (url,file,data) {
            self.hash(file).then(function (hash) {
                var total_parts= Math.ceil(file.size / self.chunkSize);
                var completed;
                data.tot_parts=total_parts
                var errorCount=0
                function tmpSend(){
                    const start = completed * self.chunkSize;
                    const end = Math.min(file.size, start + self.chunkSize);
                    data.file=self.blobSlice.call(file, start, end)
                    data.part_num=completed
                    setTimeout(``)
                    $rootScope.progressed=0
                    var animate;
                    if(loading){
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

                                bar.value= $rootScope.tot_progressed;

                                console.log("cooking "+$rootScope.tot_progressed)

                            }, 200);

                        });
                    }
                    $http({
                        method  : 'POST',
                        url     :$rootScope.url+url,
                        processData: false,
                        transformRequest: function (data2) {
                            var formData = new FormData();
                            console.log(data)
                            for(key in data){
                                formData.append(key, data[key]);
                            }
                            if($rootScope.accountData)
                                formData.append("user_id", $rootScope.accountData.user_id);
                            return formData;
                        },
                        data : "",
                        headers: {
                            'Content-Type': undefined
                        },uploadEventHandlers: {
                            progress: function(event) {
                                console.log("progress");
                                $rootScope.progressed=(event.loaded/event.total)*100
                                console.log($rootScope.progressed);
                            }
                        }
                    }).then(function (resp) {
                        errorCount=0
                        completed++
                        if(completed>=total_parts){
                            $pop.alert("Success !","File upload completed successfully")
                            resolve(true)
                        }
                        else
                            tmpSend()
                    })
                        .catch(function (err) {
                            errorCount++
                            if(errorCount<10) {
                                $pop.alert("Error " +errorCount, "Error uploading part of the file we will try again")
                                setTimeout(function () {
                                    tmpSend()
                                },100)
                            }
                            else{
                                $pop.alert("Maximum Errors Reached", "We think you have network problem. try again later")
                                reject(true)
                            }
                        })
                }
                self.post(url,{id:data.id,has:hash}).then(function (resp) {
                    if(resp.status){
                        completed=resp.completed_parts
                        tmpSend()       
                    }
                })

            })
        }
    })
    .service("$pop",function ($rootScope,$mdDialog) {
        this.alert=function (title,body) {
            return $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(body)
                    .multiple(true)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
            );
        }
        this.confirm=function (title,body,ev) {
            return new Promise(function (resolve,reject) {
                if(ev)
                    var confirm=$mdDialog.confirm()
                        .title(title)
                        .textContent(body)
                        .ariaLabel('Lucky day')
                        .targetEvent(ev)
                        .multiple(true)
                        .ok('Yes')
                        .cancel('Cancel');
                else
                    var confirm=$mdDialog.confirm()
                        .title(title)
                        .textContent(body)
                        .ariaLabel('Lucky day')
                        .targetEvent(ev)
                        .ok('Yes')
                        .multiple(true)
                        .cancel('Cancel');
                $mdDialog.show(confirm).then(function() {
                    resolve(true)
                }, function() {
                    resolve(false)
                });
            })
        }
        this.prompt=function (title,body,ev,initialValue) {
            return new Promise(function (resolve,reject) {
                if (ev)
                    var confirm = $mdDialog.prompt()
                        .title(title)
                        .textContent(body)
                        .ariaLabel('Dog name')
                        .initialValue(initialValue)
                        .targetEvent(ev)
                        .required(true)
                        .multiple(true)
                        .ok('OK')
                        .cancel('Cancel');
                else
                    var confirm = $mdDialog.prompt()
                        .title(title)
                        .textContent(body)
                        .ariaLabel('Dog name')
                        .initialValue(initialValue)
                        .required(true)
                        .ok('OK')
                        .cancel('Cancel');
                $mdDialog.show(confirm).then(function (result) {
                    resolve(result)
                }, function () {
                    resolve(false)
                });
            })
        }
    })
    .service("$md2",function ($mdDialog) {
        this.alert=function(ev,msg,title){
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .clickOutsideToClose(true)
                    .title(title||'Alert')
                    .textContent(msg)
                    .ariaLabel(title||'Alert')
                    .ok('OK')
                    .targetEvent(ev)
            );
        }
        this.cancel=function () {
            $mdDialog.cancel()
        }
    })
    .service("$timer",function ($interval,$timeout) {
        this.setInterval=function (callback,time) {
            console.log(time)
            setInterval(function () {
                console.log("fuck 1")
            },1000)
            var x=setInterval(callback,time)
            return x
        }
        this.clearInterval=function (timer) {
            clearInterval(timer)
        }
        this.setTimeout=function (callback,time) {
            return setTimeout(callback,time)
        }
        this.clearTimeout=function (timer) {
            clearTimeout(timer)
        }
    })
    .service('$checker',function ($rootScope,$state) {
        this.isMobile=function () {
            var check = false;
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
            return check;
        }
        this.isLogined=function () {
            if(!$rootScope.accountData)
                $state.go("app.login")
        }
    })
    .service("$course",function ($rootScope,$http2) {
        var specs;
        this.getSpecs=function () {
            return new Promise(function (resolve,reject) {
                $http2.get("getSpecilizations").then(function (resp) {
                    if (resp) {
                        specs=resp.data;
                        resolve(resp.data)
                    }
                    else
                        resolve(false)
                }).catch(function (err) {
                    console.log("361 "+err)
                    resolve(false)
                })
            })
        }
        this.getCurrentCourses = function (default_) {
            return new Promise(function (resolve,reject) {
                $http2.get("getCurrentRunningCourses",default_).then(function (resp) {
                    if (resp) {
                        console.log(resp.data)
                        resp.data.forEach(function (course) {
                            course.course_outcome=course.course_outcome?angular.fromJson(course.course_outcome):[]
                            course.specs=course.spec?angular.fromJson(course.spec):[]
                            delete course.spec
                        })
                        resolve(resp.data)
                    }
                    else
                        resolve(false)
                }).catch(function (err) {
                    console.log("378 "+err)
                    resolve(false)
                })
            })
        }
        this.getCurrentCourse=function (course_id) {
            return new Promise(function (resolve,reject) {
                $http2.post("getCurrentRunningCourse",{id:course_id}).then(function (resp) {
                    if(resp.data){
                        resp.data.course_outcome=angular.fromJson(resp.data.course_outcome)
                        console.log(1)
                        resp.data.spec=angular.fromJson(resp.data.spec)
                        console.log(2)
                        console.log(resp.data.pre_req)
                        resp.data.pre_req=angular.fromJson(resp.data.pre_req)
                        console.log(3)
                        if(resp.data.lectures)
                            resp.data.lectures=angular.fromJson(resp.data.lectures)
                        console.log(4)
                        if(resp.data.groups)
                            resp.data.groups=angular.fromJson(resp.data.groups)
                        console.log(5)
                        if(resp.data.reviews)
                            resp.data.reviews=angular.fromJson(resp.data.reviews)
                        console.log(6)
                        console.log(resp.data)
                        resolve(resp.data)
                    }
                    else resolve(false)
                }).catch(function (err) {
                    console.log("415 "+err)
                    resolve(false)

                })
            })
        }
        this.searchCurrentCourses=function (keyword) {
            return new Promise(function (resolve,reject) {
                $http2.post("searchCurrentRunningCourses",{keyword:keyword}).then(function (resp) {
                    if (resp) {
                        console.log(resp.data)
                        resp.data.forEach(function (course) {
                            course.course_outcome=course.course_outcome?angular.fromJson(course.course_outcome):[]
                            course.specs=course.spec?angular.fromJson(course.spec):[]
                            delete course.spec
                        })
                        $rootScope.current_courses=resp.data
                        resolve(resp.data)
                    }
                    else
                        resolve(false)
                }).catch(function (err) {
                    console.log("436 "+err)
                    resolve(false)
                })
            })
        }
        this.getTrainers = function () {
            $http2.get("getTrainers")
                .then(function (resp) {
                    if (resp) {
                        resp.data.forEach(function (trainer) {
                            for(var i=0;i<specs.length;i++){
                                if(trainer.speialization_id==specs[i].speialization_id){
                                    trainer.spec=specs[i].name
                                    break
                                }
                            }
                        })
                        console.log(resp.data)
                        resolve(resp.data)
                    }
                    else resolve(false)
                }).catch(function (err) {
                console.log("423 "+err)
                resolve(false)
            })
        }
        this.getCourses = function () {
            $http2.get("getCourses").then(function (resp) {
                if (resp) {
                    resp.data.forEach(function (course) {
                        course.specs=angular.fromJson(course.specs)
                        course.specss=[]
                        if(course.specs)
                            course.specs.forEach(function (spec_id) {
                                for(var j=0;j<$scope.specs.length;j++){
                                    if(spec_id==specs[j].speialization_id){
                                        course.specss.push(specs[j].name)
                                        break
                                    }
                                }
                                course.specs=course.specss
                                delete course.specss
                            })
                    })
                    console.log(resp.data)
                    resolve(resp.data)
                }
                else resolve(false)
            }).catch(function (err) {
                console.log("450 "+err)
                resolve(false)
            })
        }
        this.getReadySpecs=function () {
            return specs
        }
        this.getSpecs()
    })
    .service("$hexConverter",function ($rootScope) {
        var tableStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var table = tableStr.split("");

        window.atob = function (base64) {
            if (/(=[^=]+|={3,})$/.test(base64)) throw new Error("String contains an invalid character");
            base64 = base64.replace(/=/g, "");
            var n = base64.length & 3;
            if (n === 1) throw new Error("String contains an invalid character");
            for (var i = 0, j = 0, len = base64.length / 4, bin = []; i < len; ++i) {
                var a = tableStr.indexOf(base64[j++] || "A"), b = tableStr.indexOf(base64[j++] || "A");
                var c = tableStr.indexOf(base64[j++] || "A"), d = tableStr.indexOf(base64[j++] || "A");
                if ((a | b | c | d) < 0) throw new Error("String contains an invalid character");
                bin[bin.length] = ((a << 2) | (b >> 4)) & 255;
                bin[bin.length] = ((b << 4) | (c >> 2)) & 255;
                bin[bin.length] = ((c << 6) | d) & 255;
            };
            return String.fromCharCode.apply(null, bin).substr(0, bin.length + n - 4);
        };

        window.btoa = function (bin) {
            for (var i = 0, j = 0, len = bin.length / 3, base64 = []; i < len; ++i) {
                var a = bin.charCodeAt(j++), b = bin.charCodeAt(j++), c = bin.charCodeAt(j++);
                if ((a | b | c) > 255) throw new Error("String contains an invalid character");
                base64[base64.length] = table[a >> 2] + table[((a << 4) & 63) | (b >> 4)] +
                    (isNaN(b) ? "=" : table[((b << 2) & 63) | (c >> 6)]) +
                    (isNaN(b + c) ? "=" : table[c & 63]);
            }
            return base64.join("");
        };



        this.hexToBase64=function(str) {
            var x=btoa(String.fromCharCode.apply(null,
                str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
            );
            x=x.substring(0,x.length-2)
            return x
        }

        this.base64ToHex=function(str) {
            for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
                var tmp = bin.charCodeAt(i).toString(16);
                if (tmp.length === 1) tmp = "0" + tmp;
                hex[hex.length] = tmp;
            }

            return hex.join(" ");
        }
    })
    .service("$account",function ($rootScope,$e,$http2,$pop) {
        var self=this
        this.register=function (data) {
            return new Promise(function (resolve,reject) {
                if(data.img){
                    $http2.do("createAccountWithImg",data).then(function (resp) {
                        if(resp){
                            $pop.alert("Congratulation !","It is our honor that you become one of our familty")
                            resolve({smart_user_id:resp.smart_user_id,user_id:resp.user_id})
                        }
                        else{
                            $pop.alert("Error","Username,Email or Telephone may be already exists. try again")
                            data.pass=""
                            data.repass=""
                            resolve(false)
                        }
                    }).catch(function (err) {
                        console.log("553 "+err)
                        resolve(false)
                    })
                }else{
                    delete data.img;
                    $http2.post("createAccount",data).then(function (resp) {
                        if(resp){
                            $pop.alert("Congratulation !","It is our honor that you become one of our familty")
                            resolve({smart_user_id:resp.smart_user_id,user_id:resp.user_id})
                        }
                        else{
                            $pop.alert("Error","Username,Email or Telephone may be already exists. try again")
                            data.pass=""
                            data.repass=""
                            resolve(false)
                        }
                    }).catch(function (err) {
                        console.log("553 "+err)
                        resolve(false)
                    })
                }

            })
        }
        this.login=function (data) {
            return new Promise(function (resolve,reject) {
                $http2.post("loginStudent",data,true).then(function (resp) {
                    if(resp){
                        $rootScope.accountData=resp.data
                        // socket.emit("connectUser",$rootScope.accountData.user_id)
                        console.log($rootScope.accountData)
                        self._processAccount()
                        $rootScope.accountData.pp=$e.encrypt(data.pass)
                        $rootScope.accountData.user=data.user
                        localStorage["userData"]=angular.toJson($rootScope.accountData)
                        $pop.alert("Good to see you again !","Welcome Back "+resp.data.name)
                        resolve(resp.data)
                    }
                    else{
                        $pop.alert("Error","Wrong Username or Password. try again")
                        resolve(false)
                    }
                }).catch(function (err) {
                    console.log("553 "+err)
                    resolve(false)
                })
            })
        }
        this._processAccount=function () {
            if(typeof $rootScope.accountData=='string'){
                $rootScope.accountData=angular.fromJson($rootScope.accountData)
                console.log('string')
            }
            if($rootScope.accountData.blogs)
                $rootScope.accountData.blogs=angular.fromJson($rootScope.accountData.blogs)
            if($rootScope.accountData.courses)
                $rootScope.accountData.courses=angular.fromJson($rootScope.accountData.courses)
            if($rootScope.accountData.transactions)
                $rootScope.accountData.transactions=angular.fromJson($rootScope.accountData.transactions)
            if($rootScope.accountData.blog_deprts)
                $rootScope.accountData.blog_deprts=angular.fromJson($rootScope.accountData.blog_deprts)
            if($rootScope.accountData.fav_courses)
                $rootScope.accountData.fav_courses=angular.fromJson($rootScope.accountData.fav_courses)
            else
                $rootScope.accountData.fav_courses=[]
            if($rootScope.accountData.unseen_notes)
                $rootScope.accountData.unseen_notes=angular.fromJson($rootScope.accountData.unseen_notes)
            if($rootScope.accountData.blogs)
                $rootScope.accountData.blogs.forEach(function (blog) {
                    $rootScope.accountData.blog_deprts.forEach(function (deprt) {
                        if(blog.blog_department_id==deprt.deprt_id)
                            blog.deprt_title=deprt.title
                    })
                })
            else
                $rootScope.accountData.blogs=[]

            $rootScope.transactions=$rootScope.accountData.transactions
            console.log($rootScope.accountData)
        }
        this.loginUser=function (dontShow) {
            return new Promise(function (resolve,reject) {
                $rootScope.accountData=localStorage["userData"]
                if($rootScope.accountData){
                    self._processAccount()
                    console.log($rootScope.accountData)
                    var pass=$e.decrypt($rootScope.accountData.pp)
                    console.log($rootScope.accountData)
                    console.log(pass)
                    $http2.post("loginStudent",{user:$rootScope.accountData.user,pass:pass},true).then(function (resp) {
                        if(resp){
                            var user=$rootScope.accountData.user
                            $rootScope.accountData=resp.data
                            console.log($rootScope.accountData)
                            self._processAccount()
                            $rootScope.accountData.pp=$e.encrypt(pass)
                            $rootScope.accountData.user=user
                            localStorage["userData"]=angular.toJson($rootScope.accountData)
                            if(!dontShow)
                                $pop.alert("Good to see you again !","Welcome Back "+resp.data.name)
                            resolve()
                        }
                        else{
                            $pop.alert("Error","A problem occured")
                        }
                    }).catch(function (err) {
                        console.log("553 "+err)
                    })
                }
            })

        }
    })
    .service("$pay",function ($rootScope,$http2,$pop) {
      this.paypal_course=function (running_course_id,reg_type,group) {
          return new Promise(function (resolve,reject) {
              $http2.post("pay_course_paypal",{
                  user_id:$rootScope.accountData.user_id,
                  running_course_id:running_course_id,
                  reg_type:reg_type,
                  selected_group:group
              }).then(function (resp) {
                   if(resp){
                       resolve(resp.url)
                   }
                   else resolve(false)
              }).catch(function (err) {
                   console.log("597 "+err)
                  resolve(false)
              })
          })
      }
      this.paypal_pay_complete_reg=function (course_reg_id) {
            return new Promise(function (resolve,reject) {
                $http2.post("paypal_pay_complete_reg",{
                    course_reg_id:course_reg_id
                }).then(function (resp) {
                    if(resp){
                        resolve(resp.url)
                    }
                    else resolve(false)
                }).catch(function (err) {
                    console.log("597 "+err)
                    resolve(false)
                })
            })
        }
      this.creditcard_course=function (running_course_id,reg_type,group,cardData,cardType) {
            return new Promise(function (resolve,reject) {
                if(cardType=='mc') cardType='MasterCard'
                else if(cardType=='amex') cardType='American Express'
                $http2.post("pay_course_creditCard",{
                    user_id:$rootScope.accountData.user_id,
                    running_course_id:running_course_id,
                    reg_type:reg_type,
                    selected_group:group,
                    cardData:cardData,
                    cardType:cardType
                },true).then(function (resp) {
                    if(resp){
                      //  $("#paypal_button").attr("href",resp.url).css("display","block")
                        resolve(true)
                    }
                    else {
                        resolve(false)
                    }
                }).catch(function (err) {
                    console.log("597 "+err)
                    resolve(false)
                })
            })
        }
        this.creditcard_complete_reg=function (course_reg_id,cardData,cardType) {
            return new Promise(function (resolve,reject) {
                if(cardType=='mc') cardType='MasterCard'
                else if(cardType=='amex') cardType='American Express'
                $http2.post("pay_course_complete_reg_creditCard",{
                    course_reg_id:course_reg_id,
                    cardData:cardData,
                    cardType:cardType
                },true).then(function (resp) {
                    if(resp){
                        //  $("#paypal_button").attr("href",resp.url).css("display","block")
                        resolve(true)
                    }
                    else {
                        resolve(false)
                    }
                }).catch(function (err) {
                    console.log("597 "+err)
                    resolve(false)
                })
            })
        }

        this.initCard=function (yourdata) {
          function handleOnChange(state) {
              yourdata.cardData=state.data.paymentMethod
              console.log(state.isValid) // True or false. Specifies if all the information that the shopper provided is valid.
              yourdata.showCardButton=state.isValid
          }

          const configuration = {
              locale: "en_US",
              environment: "test",
              originKey: "pub.v2.8015926807131225.aHR0cDovLzEyNy4wLjAuMTo4MDgw.2OwEaLRmuZ3b475OE9drbUtrnsJ8TpUt-CgHHeP_LXA",
              onChange: handleOnChange,
              onLoad:function (data) {
                  console.log(data)
              },
              onBrand:function (brand) {
                  if(yourdata){
                      yourdata.brand=brand.brandImageUrl
                      yourdata.cardType=brand.brand
                  }

                  console.log(brand)
              }
          };
          const checkout = new AdyenCheckout(configuration);
          const customCard = checkout.create('securedfields', {
              // Optional configuration
              type: 'card',
              brands: ['mc', 'visa', 'amex', 'bcmc', 'maestro'],
              styles: {
                  base:{
                      borderStyle:"solid",
                      borderColor:"#eceff5",
                      borderWidth:"1px",
                      borderRadius:"7px",
                      background:"#fff",
                      color:"#666",
                      font:"inherit",
                      margin:"0",
                      webkitTransition:"0.2s ease-in-out"
                  },
                  error: {
                      color: 'red'
                  },
                  validated: {
                      color: 'green'
                  },
                  placeholder: {
                      color: '#d8d8d8'
                  }
              },
              ariaLabels: {
                  lang: 'en-GB',
                  encryptedCardNumber: {
                      label: 'Credit or debit card number field'
                  }
              },
          }).mount('#customCard-container');
      }
      this.payEBS=function (regData,url,running_course_id) {
          return new Promise(function(resolve,reject) {
              if (!regData.pin || (!regData.useMyCard && !regData.expYear && !!regData.expMonth)) {
                  UIkit.notification("<span class='icon-line-awesome-warning'></span> Fill all the fields", {
                      status: 'warning',
                      pos: "bottom-center"
                  })
                  return
              } // 2305
              if(!regData.useMyCard)
              regData.expDate = regData.expYear.toString() + (regData.expMonth < 10 ? ('0' + regData.expMonth) : regData.expMonth).toString()
              var x = angular.copy(regData)
              $pop.confirm("Confirmation", "Your are about to pay using your card. Continue ?")
                  .then(function (resp) {
                      if (resp) {
                          x.running_course_id = running_course_id
                          $http2.post(url, x,true).then(function (resp) {
                              resolve(true)
                          }).catch(function (e) {
                            resolve(false)
                          })
                      }
                  })

          })
      }
    })
    .service("$sockets",function ($rootScope,$timeout,$pop) {
        var timeout=3000
        var maxRetries=5
        var self=this
        this.tried=false
        this.init=function(){
            if(!self.tried){
                self.tried=true
                socket = io.connect('https://cbs.gov.sd');
                socket.on('connect', function(){
                    console.log("Connected !")
                    socket.on("visit_id",function (data) {
                        $rootScope.visit_id=data.session_id;
                        console.log($rootScope.visit_id);
                    })
                    socket.on("paypal_paid",function (data) {
                        $("#paypal-payment").LoadingOverlay("hide",true)
                        if(data.status){
                            $pop.alert("Success","Payment Completed")
                            var x=new CustomEvent("paypal_paid",{detail:data})
                            window.dispatchEvent(x)
                        }
                        else
                            $pop.alert("Error",data.msg)

                    })
                    socket.on("newNotification",function (data) {
                        var player = new Tone.Player("./assets/note2.mp3").toMaster();
                        player.autostart = true;
                        $rootScope.accountData.unseen_notes.unshift({
                            id:data.id,
                            course_name:data.course_name,
                            title: data.title,
                            body: data.body,
                            source:data.source,
                            gateway:data.gateway,
                            created:data.created
                        })
                        $rootScope.accountData.courses.forEach(function (course) {
                            if(course.id==data.running_course_id){
                                if(course.notes){
                                    course.notes.push({
                                        id:data.id,
                                        title: data.title,
                                        body: data.body,
                                        source:data.source,
                                        gateway:data.gateway,
                                        created:data.created
                                    })
                                }
                            }
                        })
                        $rootScope.$apply()
                    })
                    socket.on('disconnect', function(){
                        console.log("Disconnected !")
                    })
                })
            }

        }

        this.emit=function (event,data) {
            var tries=0
            var timer
            return new Promise(function (resolve,reject) {
                function temp() {
                    socket.emit(event,data)
                    socket.once(event+"_ack",function (data) {
                        console.log("Acknowledgement of "+event+" has been received")
                        $timeout.cancel(timer)
                        resolve(data)
                    })
                    timer=$timeout(function () {
                        //socket.removeAllListeners(event+"_ack");
                        console.log("Acknowledgement of "+event+" has not been received. trial number"+(tries+1))

                        if(tries<maxRetries)
                            self.emit(event,data,++tries)
                        else
                            reject(false)
                    },timeout)
                }
            })


        }
        this.on=function (event,callback,a) {
            socket.on(event,function (data) {
                callback(data)
                socket.emit(event+"_ack",a)
            })
        }
    })
    .service("$editor",function ($rootScope,$mdDialog,$http2,$compile) {
        this.getImageClass=function () {
            class SimpleImage {
                static get toolbox() {
                    return {
                        title: 'Select from my images',
                        icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
                    };
                }
                static get sanitize(){
                    return {
                        url: {},
                        caption: {
                            b: true,
                            a: {
                                href: true
                            },
                            i: true
                        }
                    }
                }
                constructor({data, api, config}){
                    this.api = api;
                    this.config = config || {};
                    this.data = {
                        url: data.url || '',
                        caption: data.caption || '',
                        withBorder: data.withBorder !== undefined ? data.withBorder : false,
                        withBackground: data.withBackground !== undefined ? data.withBackground : false,
                        stretched: data.stretched !== undefined ? data.stretched : false,
                    };
                    this.wrapper = undefined;
                    this.settings = [
                        {
                            name: 'withBorder',
                            icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`
                        },
                        {
                            name: 'stretched',
                            icon: `<svg width="17" height="10" viewBox="0 0 17 10" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.511L4.084 3.787h9.606l-1.85-1.85a1.069 1.069 0 1 1 1.512-1.51l3.792 3.791a1.069 1.069 0 0 1-.475 1.788L13.514 9.16a1.125 1.125 0 0 1-1.59-1.591l1.644-1.644z"/></svg>`
                        },
                        {
                            name: 'withBackground',
                            icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.043 8.265l3.183-3.183h-2.924L4.75 10.636v2.923l4.15-4.15v2.351l-2.158 2.159H8.9v2.137H4.7c-1.215 0-2.2-.936-2.2-2.09v-8.93c0-1.154.985-2.09 2.2-2.09h10.663l.033-.033.034.034c1.178.04 2.12.96 2.12 2.089v3.23H15.3V5.359l-2.906 2.906h-2.35zM7.951 5.082H4.75v3.201l3.201-3.2zm5.099 7.078v3.04h4.15v-3.04h-4.15zm-1.1-2.137h6.35c.635 0 1.15.489 1.15 1.092v5.13c0 .603-.515 1.092-1.15 1.092h-6.35c-.635 0-1.15-.489-1.15-1.092v-5.13c0-.603.515-1.092 1.15-1.092z"/></svg>`
                        }
                    ];
                }
                render(){
                    var self=this
                    this.wrapper = document.createElement('div');
                    this.wrapper.classList.add('simple-image');
                    if(this.data && this.data.url){
                        this._createImage(this.data.url, this.data.caption);
                        return this.wrapper;
                    }
                    $http2.post("getMyBlogImages",{user_id:$rootScope.accountData.user_id}).then(function (resp) {
                        $rootScope.blogImages=resp.data
                        $mdDialog.show({
                            templateUrl: 'templates/modals/selectBlogImage.html',
                            parent: angular.element(document.body),
                            clickOutsideToClose: true,
                            scope:$rootScope,
                            multiple:true,
                            preserveScope:true
                        })
                    })
                    $rootScope.selectImage=function (img) {
                        self._createImage(img, '');
                        $mdDialog.cancel()
                    }
                    return this.wrapper;
                }
                _createImage(url, captionText){
                    const image = document.createElement('img');
                    var caption = document.createElement('div');
                    var c="<div contenteditable='true' placeholder='Enter Caption'>"+(captionText?captionText:'')+"</div>"
                    c=$compile(c)($rootScope)
                    image.src = url;

                    this.wrapper.innerHTML = '';
                    this.wrapper.appendChild(image);
                    angular.element(this.wrapper).append(c)
                    this._acceptTuneView();
                }
                save(blockContent){
                    const image = blockContent.querySelector('img');
                    const caption = blockContent.querySelector('[contenteditable]');
                    return Object.assign(this.data, {
                        url: image.src,
                        caption: caption.innerHTML || ''
                    });
                }
                validate(savedData){0
                    if (!savedData.url.trim()){
                        return false;
                    }
                    return true;
                }
                renderSettings(){
                    const wrapper = document.createElement('div');
                    this.settings.forEach( tune => {
                        let button = document.createElement('div');
                        button.classList.add(this.api.styles.settingsButton);
                        button.classList.toggle(this.api.styles.settingsButtonActive, this.data[tune.name]);
                        button.innerHTML = tune.icon;
                        wrapper.appendChild(button);
                        button.addEventListener('click', () => {
                            this._toggleTune(tune.name);
                            button.classList.toggle(this.api.styles.settingsButtonActive);
                        });

                    });

                    return wrapper;
                }

                /**
                 * @private
                 * Click on the Settings Button
                 * @param {string} tune — tune name from this.settings
                 */
                _toggleTune(tune) {
                    this.data[tune] = !this.data[tune];
                    this._acceptTuneView();
                }
                _acceptTuneView() {
                    this.settings.forEach( tune => {
                        this.wrapper.classList.toggle(tune.name, !!this.data[tune.name]);

                        if (tune.name === 'stretched') {
                            this.api.blocks.stretchBlock(this.api.blocks.getCurrentBlockIndex(), !!this.data.stretched);
                        }
                    });
                }
            }
            return SimpleImage
        }

    })
    .service("$e",function ($rootScope) {
        self=this
        var getKeyAndIV = function(password) {
            var keyBitLength = 256;
            var ivBitLength = 128;
            var iterations = 234;
            var bytesInSalt = 128 / 8;//
            var text=z.os.name
            while(text.length<22)
               text=text+"0"
            console.log(text)
            var salt = CryptoJS.enc.Base64.parse(text);
            var iv128Bits = CryptoJS.PBKDF2(password, salt, { keySize: 128 / 32, iterations: iterations });
            var key256Bits = CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32, iterations: iterations });

            return {
                iv: iv128Bits,
                key: key256Bits
            };
        };
        var parser = new UAParser();
        var z=parser.getResult()
        var pass=z.ua
        var skey = getKeyAndIV(pass);
        this.encrypt=function (message) {
            return CryptoJS.AES.encrypt(message, skey.key, { iv: skey.iv }).ciphertext.toString(CryptoJS.enc.Base64);
        }
        this.decrypt=function(message){
            var params = {
                ciphertext: CryptoJS.enc.Base64.parse(message),
                salt: ""
            };
            return CryptoJS.AES.decrypt(params, skey.key, { iv: skey.iv }).toString(CryptoJS.enc.Utf8)
        }
    })
    .service("$utils",function ($rootScope) {
        var self=this
        this.loadScript=async function(url,callback) {
            function tmp(url){
                return new Promise(function(resolve,reject){
                    console.log(url)
                    let isLoaded = document.querySelectorAll(`[src="${url}"]`);
                    if(isLoaded.length > 0) {
                        resolve()
                        return;
                    }
                    let myScript = document.createElement("script");
                    myScript.src = url;
                    document.body.appendChild(myScript);
                    myScript.onload=function(){
                        clearTimeout(timer)
                        resolve()
                    }
                    var timer=setTimeout(function (){
                        console.log("Error in loading "+url)
                        resolve()
                    },7000)
                })
            }
            if(typeof(url)==='string'){
                tmp(url).then(function(){
                    if(callback){
                        callback()
                    }
                })
            }
            else if(url.length>0){
                async function tmp2(){
                    for(var i=0;i<url.length;i++){
                        if(url[i].split(" ").length==1)
                            await tmp(url[i])
                        else
                            tmp(url[i].split(" ")[1])
                        console.log(url[i])
                    }
                    if(callback)
                        callback()
                }
                tmp2()
            }
            else{
                if(callback){
                    callback()
                }
            }
        }
        this.loadStyle=async function(url,callback) {
            var head = document.getElementsByTagName('head')[0];var head = document.getElementsByTagName('head')[0];
            function tmp(url){
                return new Promise(function(resolve,reject){
                    let isLoaded = document.querySelectorAll(`link[href='${url}']`);
                    if(isLoaded.length > 0) {
                        resolve()
                        return;
                    }
                    let link = document.createElement("link");
                    link.rel = "stylesheet";
                    link.href = url;
                    link.type = 'text/css'; //Set's it's type to text/css
                    $(head).prepend(link)
                    resolve()
                })
            }
            if(typeof(url)==='string'){
                tmp(url).then(function(){
                    if(callback){
                        callback()
                    }
                })
            }
            else{
                async function tmp2(){
                    for(var i=0;i<url.length;i++){
                        if(url[i].split(" ").length==1)
                            await tmp(url[i])
                        else
                            tmp(url[i].split(" ")[1])
                        console.log(url[i])
                    }
                    if(callback)
                        callback()
                }
                tmp2()
            }
        }
        this.setTitle=function (title) {
            document.getElementsByTagName("title")[0].innerHTML=title + " - Afro-Tech Training Center"
        }
        this.initScripts=function (){
            String.prototype.toInteger=function(){return parseInt(this)}
            String.prototype.toFloat=function(){return parseFloat(this)}
            String.prototype.replaceAll=function(){
                var self=this
                var s=arguments
                arguments[0].split("||").forEach(a=>{
                    while(self.includes(a)){
                        self=self.replace(a,s[1])
                    }
                })

                return self
            }
            Number.prototype.toFloor=function(){return Math.floor(this)}
// select name,age,addt from tbl order by dateconvert(created)
            alasql.fn.dateconvert = function(dateStr) {
                dateStr=moment(dateStr).format("YYYY.MM.DD")
                console.log(dateStr)
                return dateStr
            };
            Array.prototype.range=function(){
                if(this.length==1){
                    return Array.from(Array(this[0]).keys())
                }
                else if(this.length==2){
                    var arr=[]
                    for(var i=this[0];i<this[1];i++){
                        arr.push(i)
                    }
                    return arr
                }
                else if(this.length==3){
                    var arr=[]
                    for(var i=this[0];i<this[1];i+=this[2]){
                        arr.push(i)
                    }
                    return arr
                }
                else return []

            }
            Array.prototype.sum=function(){
                return this.reduce(function(a,b){return a+b})
            }
            $.fn.hasAttr = function(name) {
                return this.attr(name) !== undefined;
            };

        }

    })
    .service("$tr",function ($rootScope,$http){
        $rootScope.$tr = this
        var ar//--ar
        var en//--en
        this.translate=function (key){
            if(key) {
                var keys = key.split('.')
                let word = $rootScope.lang == 'ar' ? ar : en
                for (let i = 0; i < keys.length; i++) {
                    if (word[keys[i]])
                        word = word[keys[i]]
                }
                return (typeof (word) == 'string' ? word : '')
            }
            else
                return ""
        }
    })


