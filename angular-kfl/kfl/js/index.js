/**
 * Created by Administrator on 2017/4/6.
 */
angular.module('myApp', ["ng", "ngRoute"])
    .controller("startCtrl", function () {})
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
        var did = $routeParams.did;
        $scope.order = {
            oid: 'NULL',
            phone: '',
            user_name: '',
            sex: '',
            addr: '',
            did: did
        };
        $scope.orderDish = () => {
            if ($scope.order.user_name == '') {
                showMsg('联系人');
            } else if ($scope.order.phone == '') {
                showMsg('联系电话');
            } else if ($scope.order.addr == '') {
                showMsg('送餐地址');
            }
            function showMsg(msg){
                $scope.msg = msg;
                $timeout(() => {
                    $scope.msg = '';
                }, 3000)
            }
            $http.post('/getOrder', $scope.order)
                .then((data) => {
                        $location.path('/myOrder').replace();
                    }, (err) => {

                    }
                )
        };
    })
    .controller("myOrderCtrl", function ($scope, $http) {

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