/**
 * Created by Administrator on 2017/4/6.
 */
angular.module('myApp', ["ng", "ngRoute"])
    .controller("startCtrl", function ($scope,$location) {
        $location.path('/main').replace()
    })
    .controller("detailCtrl", function ($scope, $routeParams, $http) {
        var did = $routeParams.did;
        $scope.dish = {};
        $scope.msg = '';
        $http({
            url: "getDish",
            method: 'get',
            params: {
                did:did
            }
        }).success((data) => {
            $scope.dish = data[0];
        })
    })
    .controller("orderCtrl", function ($scope, $routeParams, $http, $timeout, $location) {
        function setLocalStorage(key,value) {
            return localStorage.setItem("kfl_"+key,value)
        }
        function getLocalStorage(key) {
            return localStorage.getItem("kfl_"+key)
        }
        var did = $routeParams.did;
        $scope.phone= getLocalStorage("phone");
        $scope.user_name= getLocalStorage("user_name");
        $scope.sex= getLocalStorage("sex");
        $scope.addr= getLocalStorage("addr");
        $scope.orderDish = () => {

            if ($scope.user_name == '') {
                showMsg('联系人');
                return;
            }
            if ($scope.phone == '') {
                showMsg('联系电话');
                return;
            }
            if ($scope.addr == '') {
                showMsg('送餐地址');
                return;
            }
            function showMsg(msg){
                $scope.msg = msg;
                $timeout(() => {
                    $scope.msg = '';
                }, 3000)
            }
            $http({
                url:"getOrder",
                method:"get",
                params:{
                    "user_name": $scope.user_name,
                    "phone": $scope.phone,
                    "sex": $scope.sex,
                    "addr": $scope.addr,
                    "did":did
                }

            }).success(function (data) {
                console.log(data);
                if(data.insertId>0){
                    setLocalStorage("user_name",$scope.user_name)
                    setLocalStorage("sex",$scope.sex)
                    setLocalStorage("phone",$scope.phone)
                    setLocalStorage("addr",$scope.addr)
                    $location.path("/myOrder")
                }
                //如果插入成功
                //1、给出成功提示，并且跳转页面到订购清单
                //2、保存用户输入信息到localStorage

            })

            // $http.post('/getOrder', $scope.order)
            //     .then((data) => {
            //             $location.path('/myOrder').replace();
            //         }, (err) => {
            //
            //         }
            //     )
        };
    })
    .controller("myOrderCtrl", function ($scope, $http) {
        function getLocalStorage(key) {
            return localStorage.getItem("kfl_"+key)
        }
        var phone=getLocalStorage("phone");
        $scope.hasOrder=false;
        if(phone != null){
            $http({
                url:"getMyOrder",
                method:"get",
                params:{
                    phone:phone
                }
            }).success(function(data){
                $scope.hasOrder=true;
                $scope.orders=data
            })
        }else{
            $scope.hasOrder=false;
        }
    })
    .controller("mainCtrl", function($scope,$http) {
        $scope.dishes = [];
        var num = 4;
        var index = 0;
        $scope.searchTxt = '';
        $scope.loadStatus = 1;//1：未加载，2：加载中,3:没有更多
        getDishes();
        $scope.getMoreDish = () => {
            getDishes();
        };
        $scope.searchDishes = (e) => {
            if ($scope.searchTxt == '') {
                $scope.dishes = [];
                index = 0;
                getDishes();
            }else {
                if (e.keyCode === 13) {
                    $http({
                        url: "getDishes",
                        method: "get",
                        params: {
                            num: num,
                            index: index,
                            searchTxt: $scope.searchTxt
                        },
                    }).success((data) => {
                        $scope.dishes = data;
                        index = 0;
                        $scope.loadStatus = 3;
                    });
                }
            }
        };
        function getDishes() {
            $scope.loadStatus = 2;
            $http({
                url: "getDishes",
                method: "get",
                params: {
                    num: num,
                    index: index,
                    searchTxt: $scope.searchTxt
                },
            }).success( (data) => {
                $scope.dishes = $scope.dishes.concat(data);
                index++;
                if (data.length === 0) {
                    $scope.loadStatus = 3;
                }else {
                    $scope.loadStatus = 1;
                }
            });
        }
    })
    .config(["$routeProvider", function ($routeProvider) {
        $routeProvider
            .when("/start", {
                templateUrl: "template/start.html",
                controller: "startCtrl"
            })
            .when('/main', {
                templateUrl: "template/main.html",
                controller: "mainCtrl"
            })
            .when('/detail/:did', {
                templateUrl: "template/detail.html",
                controller: "detailCtrl"
            })
            .when('/order/:did', {
                templateUrl: "template/order.html",
                controller: "orderCtrl"
            })
            .when('/myOrder', {
                templateUrl: "template/myOrder.html",
                controller: "myOrderCtrl"
            })
            .when('/', {
                redirectTo: "/start"
            })
    }]);