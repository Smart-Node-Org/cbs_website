angular.module("myApp")
    .filter("today",function ($rootScope) {
    return function (input) {
        if(!input)
            return input
        var out=input.filter(function (item) {
            return moment().format('YYYY-MM-DD')==moment(item.date).format('YYYY-MM-DD')
        })
        return out
    }
})
    .filter("month",function ($rootScope) {
        return function (input,year,month) {
            if(!input)
                return input

            var out=input.filter(function (item) {
                return (moment(item.date).month()+1)==month && moment(item.date).year()==year
            })


            return out
        }
    })
    .filter("tot_filter",function ($rootScope) {
        return function (input) {

            $rootScope.tot_ptice=0
            if(!input){
                $rootScope.good=false
                return input
            }

            var count=0
            input.forEach(function (item) {
                if(item.p_price&&item.qty) {
                    $rootScope.tot_ptice += item.p_price * item.qty
                    count++
                }
            })

            if(input.length==count)
                $rootScope.good=true
            else
                $rootScope.good=false


            return input
        }
    })
    .filter("moment",function ($rootScope) {
    return function (time,format) {
        return moment(time).format(format)
    }
})
    .filter("degreeCounter",function ($rootScope) {
        return function (exam) {
            var degree=0;
            exam.trueFalse.forEach(function (q) {
                if(q.degree)
                    degree+=q.degree
            })
            exam.circle.forEach(function (q) {
                if(q.degree)
                    degree+=q.degree
            })
            exam.output.forEach(function (q) {
                if(q.degree)
                    degree+=q.degree
            })
            exam.code.forEach(function (q) {
                if(q.degree)
                    degree+=q.degree
            })
            exam.short.forEach(function (q) {
                if(q.degree)
                    degree+=q.degree
            })
            exam.long.forEach(function (q) {
                if(q.degree)
                    degree+=q.degree
            })
            exam.table.forEach(function (q) {
                if(q.degree)
                    degree+=q.degree
            })
            return degree
        }
    })
    .filter("checkExam",function ($rootScope) {
        return function (exam) {
            var isGood=true;
            exam.trueFalse.forEach(function (q) {
                isGood=isGood&&q.question&&q.degree
            })
            if(!isGood){
                console.log("trueFalse invalid")
                return true
            }
            exam.circle.forEach(function (q) {
                isGood=isGood&&q.question&&q.a1Text&&q.a2Text&&q.a3Text&&q.a4Text&&q.degree&&q.answer
            })
            if(!isGood){
                console.log("circle invalid")
                return true
            }
            exam.output.forEach(function (q) {
                isGood=isGood&&q.tm&&q.pl&&(q.editor?q.editor.getValue():1)&&q.answer&&q.degree
            })
            if(!isGood){
                console.log("output invalid")
                return true
            }
            exam.code.forEach(function (q) {
                isGood=isGood&&q.tm&&q.pl&&(q.editor?q.editor.getValue():1)&&q.degree
            })
            if(!isGood){
                console.log("code invalid")
                return true
            }
            exam.short.forEach(function (q) {
                isGood=isGood&&q.question&&q.degree&&q.answer
            })
            if(!isGood){
                console.log("short invalid")
                return true
            }
            exam.long.forEach(function (q) {
                isGood=isGood&&q.question&&q.degree&&q.answer
            })
            if(!isGood){
                console.log("long invalid")
                return true
            }
            exam.table.forEach(function (q) {
                q.raw.forEach(function (c) {
                    isGood=isGood&&c.q&&c.a
                })
                q.answer.forEach(function (c) {
                    isGood=isGood&&c
                })
                isGood=isGood&&(q.raw.length==q.answer.length)
                isGood=isGood&&q.raw&&q.degree&&q.answer
            })
            if(!isGood){
                console.log("table invalid")
                return true
            }
            return !isGood
        }
    })

