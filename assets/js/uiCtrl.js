/* Thanhpt From NAHI
 *
 * @author tpt2213
 *
 *
 *
 * */

'use strict';
angular.module('bbbfund', [
    'ngRoute','ngAnimate','ngCookies', 'ngSanitize'
])
    .config(['$routeProvider','$locationProvider','$httpProvider', function($routeProvider,$locationProvider,$httpProvider) {
        //$httpProvider.defaults.useXDomain = true;
        //Remove the header containing XMLHttpRequest used to identify ajax call
        //that would prevent CORS from working
        // delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

        $routeProvider
        .when('/login', {
            templateUrl : 'partials/login.html',
            controller : 'authCtrl'
        })
        .when('/home', {
            templateUrl : 'partials/home.html',
            controller : 'homeCtrl'
        })
        .when('/price', {
            templateUrl : 'partials/price.html',
            controller : 'stockInfoCtrl'
        })

        .when('/bbbfund/overview', {
            templateUrl : 'partials/bbbfund.html',
            controller : 'bbbfundCtrl'
        })

        .when('/bbbfund/chart', {
            templateUrl : 'partials/chart.html',
            controller : 'chartCtrl'
        })

        .when('/bbbfund/portfolio', {
            templateUrl : 'partials/account.html',
            controller : 'accountCtrl'
        })

        .when('/user/overview', {
            templateUrl : 'partials/user.html',
            controller : 'userCtrl'
        })

        .when('/user/chart', {
            templateUrl : 'partials/user-chart.html',
            controller : 'userChartCtrl'
        })

        .when('/user/portfolio', {
            templateUrl : 'partials/user-account.html',
            controller : 'userAccountCtrl'
        })
        /*======================ROUTING FOR MANAGER ITEMS=======================*/
        /*=============================================================*/

        .otherwise({
            redirectTo: '/home'
        });
    }])

/**
 *===========================  ALL Controller  ===========================
 *========================================================================
 */

/**
 *@controller CONTROLLER LOGIN
 *=====================================================
 */
    .controller('authCtrl', ['$scope', '$rootScope', '$location', 'authService', function($scope, $rootScope, $location, authService) {
        $scope.showSignup = function(){
           $('.form-login').fadeOut(10);
           $('#form-signup').fadeIn(10); 
        }
        $scope.showLogin = function(){
           $('.form-login').fadeIn(10);
           $('#form-signup').fadeOut(10); 
        }
        $scope.signup = function(){
          authService.signup($scope);
        }
        $scope.login = function(){
          authService.login($scope);
        }
        $scope.cancelLogin = function(){
          $location.path('/bbbfund/overview');
        }
    }])

/**
 * @controller CONTROLLER HOME
 * =====================================================
 */
    .controller('homeCtrl', ['$scope', '$rootScope','$http', '$location', function($scope, $rootScope, $http, $location) {

        // $scope.txt = 'Trang chủ';
        // $scope.logout = function() {
        //     authService.logout();
        // };
        // var listRoles = JSON.parse(config.localStage.get('listRoles'));
        // $rootScope.dataShow = listRoles;
        // $("div .list-group .cssSlideUp").removeClass("ng-hide");

        // config.routinTestLogin(authService,$location,{defURL:'/login',useURL:'/home/list-items'});
        // config.getInfoAdmin($rootScope);

        // $('.scrollX > .scrollbarY, .scrollY > .scrollbarY').css({width:0});
        // $('.scrollY.initialized > .viewport').css({'overflow-y': 'hidden'});
    }])

    .controller('stockInfoCtrl', ['$scope', '$rootScope','$http', '$location', '$filter', 'stockService' , 'stockInfoService', function($scope, $rootScope, $http, $location, $filter, stockService, stockInfoService) {
        $scope.showFilter = false;
        $scope.txtFilter = 'Bộ lọc mã CK';
        $scope.userCheck = {};
        $scope.filterShowHide = function(){
            if ($scope.showFilter) {
                $scope.showFilter = false;
                $scope.txtFilter = 'Bộ lọc mã CK';
            }
            else {
                $scope.showFilter = true;
                $scope.txtFilter = 'Đóng bộ lọc mã CK';
            }
        }
        config.initPaging($scope, $filter, stockInfoService);
        config.initAlphabetPaging($scope, stockService);
        stockService.list($scope);
        stockService.listMarket($scope);
        stockInfoService.newList($scope, 1);

        $scope.marketChange = function(page) {
            stockInfoService.newList($scope, page);
            stockService.list($scope);
        }
        $scope.rebuildUserList = function(stock){
            if (stock.checked)
                $scope.userCheck[stock.code] = true;
            else {
                delete $scope.userCheck[stock.code];
            }
        }
        $scope.unCheck = function(){
            $scope.userCheck = {};
            for (var i = 0; i < $scope.allStocks.length; i++) {
                for (var j = 0; j < $scope.allStocks[i].length; j++) {
                   $scope.allStocks[i][j].checked = false;
                }
            }
        }
        $scope.doHide = function(){
            $scope.showFilter = false;
            $scope.txtFilter = 'Bộ lọc mã CK';
            stockInfoService.newList($scope, 1);
        }
    }])

    .controller('bbbfundCtrl', ['$scope', '$rootScope','$http', '$location', '$filter', 'bbbfundService', function($scope, $rootScope, $http, $location, $filter, bbbfundService) {
        $scope.bbbfund = {
          stock: {},
          property: {},
          analyse: {},
          index: {}
        };
        $scope.vn = {};
        $scope.vn30 = {};
        $scope.now = new Date().toDateString();

        bbbfundService.property(function(properties){
          bbbfundService.index(function(indexs){
            $scope.bbbfund.property.asset = config.numberWithCommas(properties[0].total.toFixed(0));
            $scope.bbbfund.property.profit = properties[0].profit;
            $scope.bbbfund.property.percent = properties[0].percent;

            if (indexs.bbbfund.change < 0) {
              $('#bbb-asset').addClass("lose-value");
              $('#bbb-profit').addClass("lose-value");
              $('#bbb-percent').addClass("lose-value");
            }
            else {
              $('#bbb-asset').addClass("gain-value");
              $('#bbb-profit').addClass("gain-value");
              $('#bbb-percent').addClass("gain-value");
            }

            if (indexs.vn.change < 0) {
              $('#vnindex').addClass("lose-value");
              $('#vnpercent').addClass("lose-value");
            }
            else {
              $('#vnindex').addClass("gain-value");
              $('#vnpercent').addClass("gain-value");

            }

            if (indexs.vn30.change < 0) {
              $('#vn30index').addClass("lose-value");
              $('#vn30percent').addClass("lose-value");
            }
            else {
              $('#vn30index').addClass("gain-value"); 
              $('#vn30percent').addClass("gain-value");
            }

            $scope.bbbfund.index = numeral(indexs.bbbfund.index).format('0,0.0');
            $scope.bbbfund.dailyProfit = numeral(properties[0].total * indexs.bbbfund.percentChange/100).format('0,0');
            $scope.bbbfund.dailyPercent = numeral(indexs.bbbfund.percentChange).format('0,0.00');
            $scope.vn.index = numeral(indexs.vn.index).format('0,0.0');
            $scope.vn.change = numeral(indexs.vn.change).format('0,0.0');
            $scope.vn.percent = numeral(indexs.vn.percentChange).format('0,0.00');
            $scope.vn30.index = numeral(indexs.vn30.index).format('0,0.0');
            $scope.vn30.change = numeral(indexs.vn30.change).format('0,0.0');
            $scope.vn30.percent = numeral(indexs.vn30.percentChange).format('0,0.00');
          });
        });
        bbbfundService.indexChart($scope);
        bbbfundService.yearlyProperty($scope);
        bbbfundService.stockChange($scope);
    }])

    .controller('chartCtrl', ['$scope', '$rootScope','$http', '$location', '$filter', 'bbbfundService' , 'chartService', function($scope, $rootScope, $http, $location, $filter, bbbfundService, chartService) {
        $scope.bbbfund = {
          stock: [],
          property: {},
          analyse: {},
          index: {}
        };
        $scope.vn = {};
        $scope.vn30 = {};
        $scope.now = new Date().toDateString();
        bbbfundService.property(function(properties){
          bbbfundService.index(function(indexs){
            $scope.bbbfund.property.asset = config.numberWithCommas(properties[0].total.toFixed(0));
            $scope.bbbfund.property.profit = properties[0].profit;
            $scope.bbbfund.property.percent = properties[0].percent;

            if (indexs.bbbfund.change < 0) {
              $('#bbb-asset').addClass("lose-value");
              $('#bbb-profit').addClass("lose-value");
              $('#bbb-percent').addClass("lose-value");
            }
            else {
              $('#bbb-asset').addClass("gain-value");
              $('#bbb-profit').addClass("gain-value");
              $('#bbb-percent').addClass("gain-value");
            }

            if (indexs.vn.change < 0) {
              $('#vnindex').addClass("lose-value");
              $('#vnpercent').addClass("lose-value");
            }
            else {
              $('#vnindex').addClass("gain-value");
              $('#vnpercent').addClass("gain-value");

            }

            if (indexs.vn30.change < 0) {
              $('#vn30index').addClass("lose-value");
              $('#vn30percent').addClass("lose-value");
            }
            else {
              $('#vn30index').addClass("gain-value"); 
              $('#vn30percent').addClass("gain-value");
            }

            $scope.bbbfund.index = numeral(indexs.bbbfund.index).format('0,0.0');
            $scope.bbbfund.dailyProfit = numeral(properties[0].total * indexs.bbbfund.percentChange/100).format('0,0');
            $scope.bbbfund.dailyPercent = numeral(indexs.bbbfund.percentChange).format('0,0.00');
            $scope.vn.index = numeral(indexs.vn.index).format('0,0.0');
            $scope.vn.change = numeral(indexs.vn.change).format('0,0.0');
            $scope.vn.percent = numeral(indexs.vn.percentChange).format('0,0.00');
            $scope.vn30.index = numeral(indexs.vn30.index).format('0,0.0');
            $scope.vn30.change = numeral(indexs.vn30.change).format('0,0.0');
            $scope.vn30.percent = numeral(indexs.vn30.percentChange).format('0,0.00');
            chartService.asset(properties);
          });
        });
        bbbfundService.indexChart($scope);
        chartService.stock();
        chartService.analyse($scope);
    }])

    .controller('accountCtrl', ['$scope', '$rootScope','$http', '$location', '$filter', 'authService' , 'accountService', 'bbbfundService', 'userAccountService', function($scope, $rootScope, $http, $location, $filter, authService, accountService, bbbfundService, userAccountService) {
      $scope.bbbfund = {
        stock: {},
        property: {},
        analyse: {},
        index: {}
      };
      $scope.listExchange = [{}];
      $scope.cash = 0;
      $scope.isAdmin = false; // $scope.isAdmin = authService.isAdmin();
      $scope.vn = {};
      $scope.vn30 = {};
      $scope.now = new Date().toDateString();
      $scope.exchange = {};
      $scope.stocks = {};
      $scope.filter = function(isShow, input) {
        if (isShow) {
          $scope.showFilter = true;
          $scope.searchText = input;
        }
        else {
          $scope.showFilter = false;
        }
      }

      $scope.showCash = function(isShow) {
        if (isShow) {
          $scope.bbbfund.stock = _.map($scope.bbbfund.stock, function(n){
            n.toggle = n.profit;
            return n;
          });
        }
        else {
          $scope.bbbfund.stock = _.map($scope.bbbfund.stock, function(n){
            n.toggle = n.percent;
            return n;
          });
        }
      }

      $scope.addStock = function(){
        $scope.listExchange.push({});
      }
      $scope.removeStock = function(i){
        $scope.listExchange.splice(i, 1);
      }
      $scope.compare = function(value1, value2) {
        if (numeral().unformat(value1) > numeral().unformat(value2))
          return 'gt';
        if (numeral().unformat(value1) < numeral().unformat(value2))
          return 'lt';
        return 'eq';
      }

      $scope.exchange.buy = function(){
        userAccountService.buy($scope.listExchange);
      }
      $scope.exchange.sell = function(){
        userAccountService.sell($scope.listExchange);
      }
      $scope.exchange.payout = function(){
        userAccountService.payout($scope.listExchange);
      }
      $scope.exchange.cash = function(){
        userAccountService.cash($scope.cash);
      }
      $scope.exchange.cash = function(){
        userAccountService.cash(-$scope.cash);
      }

      bbbfundService.property(function(properties){
        bbbfundService.index(function(indexs){
          $scope.bbbfund.property.asset = config.numberWithCommas(properties[0].total.toFixed(0));
          $scope.bbbfund.property.profit = properties[0].profit;
          $scope.bbbfund.property.percent = properties[0].percent;

          if (indexs.bbbfund.change < 0) {
            $('#bbb-asset').addClass("lose-value");
            $('#bbb-profit').addClass("lose-value");
            $('#bbb-percent').addClass("lose-value");
          }
          else {
            $('#bbb-asset').addClass("gain-value");
            $('#bbb-profit').addClass("gain-value");
            $('#bbb-percent').addClass("gain-value");
          }

          if (indexs.vn.change < 0) {
            $('#vnindex').addClass("lose-value");
            $('#vnpercent').addClass("lose-value");
          }
          else {
            $('#vnindex').addClass("gain-value");
            $('#vnpercent').addClass("gain-value");

          }

          if (indexs.vn30.change < 0) {
            $('#vn30index').addClass("lose-value");
            $('#vn30percent').addClass("lose-value");
          }
          else {
            $('#vn30index').addClass("gain-value"); 
            $('#vn30percent').addClass("gain-value");
          }

          $scope.bbbfund.index = numeral(indexs.bbbfund.index).format('0,0.0');
          $scope.bbbfund.dailyProfit = numeral(properties[0].total * indexs.bbbfund.percentChange/100).format('0,0');
          $scope.bbbfund.dailyPercent = numeral(indexs.bbbfund.percentChange).format('0,0.00');
          $scope.bbbfund.property.cash = numeral(properties[0].cash).format('0,0');
          $scope.bbbfund.property.capital = numeral(properties[0].capital).format('0,0');
          $scope.vn.index = numeral(indexs.vn.index).format('0,0.0');
          $scope.vn.change = numeral(indexs.vn.change).format('0,0.0');
          $scope.vn.percent = numeral(indexs.vn.percentChange).format('0,0.00');
          $scope.vn30.index = numeral(indexs.vn30.index).format('0,0.0');
          $scope.vn30.change = numeral(indexs.vn30.change).format('0,0.0');
          $scope.vn30.percent = numeral(indexs.vn30.percentChange).format('0,0.00');
        });
      });
      accountService.bbbStock($scope);
      accountService.stockList($scope);
    }])
  
    .controller('userCtrl', ['$scope', '$rootScope','$http', '$location', '$filter', 'userService', 'mssboxService', function($scope, $rootScope, $http, $location, $filter, userService, mssboxService) {
      $scope.user = {
          stock: {},
          property: {},
          analyse: {},
          index: {}
        };
      $scope.vn = {};
      $scope.vn30 = {};
      $scope.now = new Date().toDateString();

      userService.property(function(properties){
        userService.index(function(indexs){
          if (properties[0]) {
            $scope.user.property.asset = config.numberWithCommas(properties[0].total.toFixed(0));
            $scope.user.property.profit = properties[0].profit;
            $scope.user.property.percent = properties[0].percent;

            if (indexs.user.change < 0) {
              $('#bbb-asset').addClass("lose-value");
              $('#bbb-profit').addClass("lose-value");
              $('#bbb-percent').addClass("lose-value");
            }
            else {
              $('#bbb-asset').addClass("gain-value");
              $('#bbb-profit').addClass("gain-value");
              $('#bbb-percent').addClass("gain-value");
            }

            if (indexs.vn.change < 0) {
              $('#vnindex').addClass("lose-value");
              $('#vnpercent').addClass("lose-value");
            }
            else {
              $('#vnindex').addClass("gain-value");
              $('#vnpercent').addClass("gain-value");

            }

            if (indexs.vn30.change < 0) {
              $('#vn30index').addClass("lose-value");
              $('#vn30percent').addClass("lose-value");
            }
            else {
              $('#vn30index').addClass("gain-value"); 
              $('#vn30percent').addClass("gain-value");
            }

            $scope.user.nickname = properties[0].user.nickname.toUpperCase();
            $scope.user.createdAt = properties[0].user.createdAt;
            $scope.user.index = numeral(indexs.user.index).format('0,0.0');
            $scope.user.dailyProfit = numeral(properties[0].total * indexs.user.percentChange/100).format('0,0');
            $scope.user.dailyPercent = numeral(indexs.user.percentChange).format('0,0.00');
            $scope.vn.index = numeral(indexs.vn.index).format('0,0.0');
            $scope.vn.change = numeral(indexs.vn.change).format('0,0.0');
            $scope.vn.percent = numeral(indexs.vn.percentChange).format('0,0.00');
            $scope.vn30.index = numeral(indexs.vn30.index).format('0,0.0');
            $scope.vn30.change = numeral(indexs.vn30.change).format('0,0.0');
            $scope.vn30.percent = numeral(indexs.vn30.percentChange).format('0,0.00');

            userService.indexChart($scope);
            userService.yearlyProperty($scope);
            userService.stockChange($scope);
          }
          else {
            mssboxService.MsgboxPortfolio('BBBFUND - PORTFOLIO', "You haven't had any portfolio. Please make one!!");
          }
        });
      });
    }])

    .controller('userChartCtrl', ['$scope', '$rootScope','$http', '$location', '$filter', 'userService' , 'userchartService', function($scope, $rootScope, $http, $location, $filter, userService, userchartService) {
        $scope.user = {
          stock: [],
          property: {},
          analyse: {},
          index: {}
        };
        $scope.vn = {};
        $scope.vn30 = {};
        $scope.now = new Date().toDateString();
        userService.property(function(properties){
          userService.index(function(indexs){
            if (properties[0]) {
              $scope.user.property.asset = config.numberWithCommas(properties[0].total.toFixed(0));
              $scope.user.property.profit = properties[0].profit;
              $scope.user.property.percent = properties[0].percent;

              if (indexs.user.change < 0) {
                $('#bbb-asset').addClass("lose-value");
                $('#bbb-profit').addClass("lose-value");
                $('#bbb-percent').addClass("lose-value");
              }
              else {
                $('#bbb-asset').addClass("gain-value");
                $('#bbb-profit').addClass("gain-value");
                $('#bbb-percent').addClass("gain-value");
              }

              if (indexs.vn.change < 0) {
                $('#vnindex').addClass("lose-value");
                $('#vnpercent').addClass("lose-value");
              }
              else {
                $('#vnindex').addClass("gain-value");
                $('#vnpercent').addClass("gain-value");

              }

              if (indexs.vn30.change < 0) {
                $('#vn30index').addClass("lose-value");
                $('#vn30percent').addClass("lose-value");
              }
              else {
                $('#vn30index').addClass("gain-value"); 
                $('#vn30percent').addClass("gain-value");
              }

              $scope.user.nickname = properties[0].user.nickname.toUpperCase();
              $scope.user.index = numeral(indexs.user.index).format('0,0.0');
              $scope.user.dailyProfit = numeral(properties[0].total * indexs.user.percentChange/(100+indexs.user.percentChange)).format('0,0');
              $scope.user.dailyPercent = numeral(indexs.user.percentChange).format('0,0.00');
              $scope.vn.index = numeral(indexs.vn.index).format('0,0.0');
              $scope.vn.change = numeral(indexs.vn.change).format('0,0.0');
              $scope.vn.percent = numeral(indexs.vn.percentChange).format('0,0.00');
              $scope.vn30.index = numeral(indexs.vn30.index).format('0,0.0');
              $scope.vn30.change = numeral(indexs.vn30.change).format('0,0.0');
              $scope.vn30.percent = numeral(indexs.vn30.percentChange).format('0,0.00');

              userchartService.asset(properties);
              userService.indexChart($scope);
              userchartService.stock();
              userchartService.analyse($scope);
            }
            else {
              mssboxService.MsgboxPortfolio('BBBFUND - PORTFOLIO', "You haven't had any portfolio. Please make one!!");
            }
          });
        });
    }])

    .controller('userAccountCtrl', ['$scope', '$rootScope','$http', '$location', '$filter', 'authService' , 'userAccountService', 'userService', function($scope, $rootScope, $http, $location, $filter, authService, userAccountService, userService) {
      $scope.user = {
        stock: {},
        property: {},
        analyse: {},
        index: {}
      };
      $scope.listExchange = [{feePercent: 0.35}];
      $scope.listCreate = [{feePercent: 0.35}];
      $scope.cash = 0;
      $scope.vn = {};
      $scope.vn30 = {};
      $scope.now = new Date().toDateString();
      $scope.exchange = {};
      $scope.stocks = {};
      $scope.isExist = true;
      $scope.filter = function(isShow, input) {
        if (isShow) {
          $scope.showFilter = true;
          $scope.searchText = input;
        }
        else {
          $scope.showFilter = false;
        }
      }

      $scope.showCash = function(isShow) {
        if (isShow) {
          $scope.user.stock = _.map($scope.user.stock, function(n){
            n.toggle = n.profit;
            return n;
          });
        }
        else {
          $scope.user.stock = _.map($scope.user.stock, function(n){
            n.toggle = n.percent;
            return n;
          });
        }
      }

      $scope.addStock = function(){
        $scope.listExchange.push({feePercent: 0.35});
        $scope.listCreate.push({feePercent: 0.35});
      }
      $scope.removeStock = function(i){
        $scope.listExchange.splice(i, 1);
        $scope.listCreate.splice(i, 1);
      }
      $scope.compare = function(value1, value2) {
        if (numeral().unformat(value1) > numeral().unformat(value2))
          return 'gt';
        if (numeral().unformat(value1) < numeral().unformat(value2))
          return 'lt';
        return 'eq';
      }

      $scope.exchange.buy = function(){
        userAccountService.stock($scope.listExchange);
      }
      $scope.exchange.sell = function(){
        $scope.listExchange = _.map($scope.listExchange, function(n){
          n.qty = -n.qty;
          return n;
        })
        userAccountService.stock($scope.listExchange);
      }
      $scope.exchange.payout = function(){
        userAccountService.payout($scope.listExchange);
      }
      $scope.exchange.deposit = function(){
        userAccountService.cash($scope.cash1);
      }
      $scope.exchange.cash = function(){
        userAccountService.cash(-$scope.cash1);
      }
      $scope.create = function(){
        userAccountService.create($scope);
      }

      userService.property(function(properties){
        userService.index(function(indexs){
          if (properties[0]) {
            $scope.user.property.asset = config.numberWithCommas(properties[0].total.toFixed(0));
            $scope.user.property.profit = properties[0].profit;
            $scope.user.property.percent = properties[0].percent;

            if (indexs.user.change < 0) {
              $('#bbb-asset').addClass("lose-value");
              $('#bbb-profit').addClass("lose-value");
              $('#bbb-percent').addClass("lose-value");
            }
            else {
              $('#bbb-asset').addClass("gain-value");
              $('#bbb-profit').addClass("gain-value");
              $('#bbb-percent').addClass("gain-value");
            }

            if (indexs.vn.change < 0) {
              $('#vnindex').addClass("lose-value");
              $('#vnpercent').addClass("lose-value");
            }
            else {
              $('#vnindex').addClass("gain-value");
              $('#vnpercent').addClass("gain-value");

            }

            if (indexs.vn30.change < 0) {
              $('#vn30index').addClass("lose-value");
              $('#vn30percent').addClass("lose-value");
            }
            else {
              $('#vn30index').addClass("gain-value"); 
              $('#vn30percent').addClass("gain-value");
            }

            $scope.user.index = numeral(indexs.user.index).format('0,0.0');
            $scope.user.dailyProfit = numeral(properties[0].total * indexs.user.percentChange/100).format('0,0');
            $scope.user.dailyPercent = numeral(indexs.user.percentChange).format('0,0.00');
            $scope.user.property.cash = numeral(properties[0].cash).format('0,0');
            $scope.user.property.capital = numeral(properties[0].capital).format('0,0');
            $scope.vn.index = numeral(indexs.vn.index).format('0,0.0');
            $scope.vn.change = numeral(indexs.vn.change).format('0,0.0');
            $scope.vn.percent = numeral(indexs.vn.percentChange).format('0,0.00');
            $scope.vn30.index = numeral(indexs.vn30.index).format('0,0.0');
            $scope.vn30.change = numeral(indexs.vn30.change).format('0,0.0');
            $scope.vn30.percent = numeral(indexs.vn30.percentChange).format('0,0.00');

            userAccountService.userStock($scope);
            userAccountService.stockList($scope);
          }
          else {
            $scope.isExist = false;
            userAccountService.stockList($scope);
          }
        });
      });
      
    }])
/**
 * @detectives  DIRECTIVES
 *============================  Dùng để tạo và edit UI  ==================
 *========================================================================
 */
    .directive('showonhoverparent',
      function() {
        return {
          link : function(scope, element, attrs) {
            element.parent().bind('mouseenter', function() {
                element.show();
            });
            element.parent().bind('mouseleave', function() {
                 element.hide();
            });
          }
       };
    })

    .directive('clock', ['dateFilter', '$timeout', function(dateFilter, $timeout){
        return {
            restrict: 'E',
            scope: {
                format: '@'
            },
            link: function(scope, element, attrs){
                var updateTime = function(){
                    var now = Date.now();
                    element.html(dateFilter(now, scope.format));
                    $timeout(updateTime, now % 1000);
                };

                updateTime();
            }
        };
    }])

/**
 *======================  SERVICES  ======================
 *========================================================
 */
    .factory('mssboxService', ['$window', function (window) {
        return{
            Messeggbox: function(title, messg) {
                BootstrapDialog.show({
                    title: title,
                    message: messg,
                    onhide: function() {
                        // location.reload();
                    }
                });
            },
            MsgboxLogin: function(title, messg) {
                BootstrapDialog.show({
                    title: title,
                    message: messg,
                    onhide: function() {
                      window.location = '#/login';
                    }
                });
            },
            MsgboxPortfolio: function(title, messg) {
                BootstrapDialog.show({
                    title: title,
                    message: messg,
                    onhide: function() {
                      window.location = '#/user/portfolio';
                    }
                });
            },
            MesseggboxCustom: function(title, messg, button) {
                BootstrapDialog.show({
                    title: title,
                    message: messg,
                    buttons: button
                });
            }
        }
    }])

    .factory('actpostService', ['$http', function($http) {
        return{
            postdata: function(url, data, header) {
                return $http({
                    method         : 'POST',
                    url            : url,
                    data           : data,
                    withCredentials: true,
                    transformRequest: function(obj) {
                        var str = [];
                        for (var key in obj) {
                            if (obj[key] instanceof Array) {
                                for (var idx in obj[key]) {
                                    var subObj = obj[key][idx];
                                    for (var subKey in subObj) {
                                        str.push(encodeURIComponent(key) + "[" + idx + "][" + encodeURIComponent(subKey) + "]=" + encodeURIComponent(subObj[subKey]));
                                    }
                                }
                            }
                            else {
                                str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
                            }
                        }
                        return str.join("&");
                    }
                });
            }
        };
    }])

    .factory('authService', function($http, $rootScope, $route, $templateCache, $location, actpostService, mssboxService) {
        return{
            login: function(scope) {
                var data = {username: scope.user.name, password: scope.user.password};
                var request_login = actpostService.postdata(config.domainAPI + '/auth/login', data, {});
                request_login.success(function(success) {
                    config.localStage.set('userInfo', success);
                    mssboxService.Messeggbox('PORTFOLIO - LOGIN', 'Login successful!!');    
                    $location.path('/user/overview');
                });
                request_login.error(function(err, status) {
                    if(status==400)
                        config.showError(err, mssboxService);
                    else if(status>400 && status<=505)
                        config.showErroDefault(err, mssboxService);
                    else
                        mssboxService.Messeggbox('BBB FUND', config.messDefault);
                });
            },
            logout: function() {
                /*/admin/auth/logout*/
                var request_logout = actpostService.postdata(config.domainAPI+'/admin/auth/logout', {}, {});
                config.localStage.remove('dataLogin');
                config.localStage.remove('infoAdmin');
                config.localStage.remove('listRoles');
                config.showHeadAndLeft();
                $("div .list-group a").removeClass("active");
                $location.path('/login');

                /*  var request_logout = actpostService.postdata(config.domainAPI + '/auth/logout', {},config.apiAuth());
                 request_logout.success(function(success) {
                 console.log('====================logout thanh cong=======================');
                 mssboxService.Messeggbox('Đăng Xuất', 'Chào Admin, hẹn gặp lại!');
                 config.localStage.remove('dataLogin');
                 config.showHeadAndLeft();
                 $location.path('/login');
                 });
                 request_logout.error(function(err, status) {
                 console.log('err', status);
                 console.log(err);
                 switch (status)
                 {
                 case 400:
                 mssboxService.Messeggbox("Thông Tin", "Lỗi Đăng Xuất!");
                 break;
                 default :
                 break;
                 }
                 });*/
            },
            /* function check exit token  */
            isLogged: function() {            
            },

            signup: function(scope){
              var data = {username: scope.user.name, password: scope.user.password, email: scope.user.mail};
              var request_signup = actpostService.postdata(config.domainAPI + '/auth/register', data, {});
              request_signup.success(function(success) {
                config.localStage.set('userInfo', success);
                mssboxService.Messeggbox('PORTFOLIO - SIGNUP', 'Signup successful!!');
                $location.path('/user/overview');
              })
              request_signup.error(function(err, status) {
                if(status == 400)
                    config.showError(err, mssboxService);
                else if(status>400 && status<=505)
                    config.showErroDefault(err, mssboxService);
                else
                    mssboxService.Messeggbox('BBB FUND', config.messDefault);
              });
            }
        };

    })

    .factory('stockService', function($http, $rootScope, $route, $templateCache, $location, actpostService, mssboxService) {
        return {
            listMarket: function(scope){
                var request_listMarket = actpostService.postdata(config.domainAPI + '/stock/listMarket', {}, {});
                request_listMarket.success(function(success){
                    scope.listMarket = success;
                })
            },
            list: function(scope){
                var data = {};
                if (scope.market) data.market = scope.market;
                data.limit = -1;
                data.filter = scope.filterAlphabet;
                var request_listStock = actpostService.postdata(config.domainAPI + '/stock/list', data, {})
                request_listStock.success(function(success){
                    var column = 10;
                    scope.allStocks = []
                    for (var i = 0; i < success.total; i++) {
                        success.result[i].checked = scope.userCheck[success.result[i].code];
                        if (i%column == 0) {
                            scope.allStocks.push([success.result[i]])
                        }
                        else {
                            scope.allStocks[Math.floor(i/column)].push(success.result[i])
                        }
                    }

                });
                request_listStock.error(function(err, status){
                    if(status==400)
                        config.showError(err.code, mssboxService);
                    else if(status>400 && status<=505)
                        config.showErroDefault(err.code, mssboxService);
                    else
                        config.showErroConnect(mssboxService, $location);
                })
            }
        }
    })

    .factory('stockInfoService', function($http, $rootScope, $route, $templateCache, $location, actpostService, mssboxService, stockService) {
        return{
            newList: function(scope, page) {
                   /*  thực hiện lấy danh sách vật phẩm  dùng ngay */
                var data = {};
                if (scope.market) data.market = scope.market;
                data.code = JSON.stringify(_.keys(scope.userCheck));
                data.page = page;
                data.limit = 50;
                var request_listStockInfo = actpostService.postdata(config.domainAPI + '/stockinfo/new', data, {});
                request_listStockInfo.success(function(success) {
                    scope.items = null;
                    scope.items = success;
                    scope.search(page);
                });
                request_listStockInfo.error(function(err, status) {
                    if(status==400)
                        config.showError(err.code, mssboxService);
                    else if(status>400 && status<=505)
                        config.showErroDefault(err.code, mssboxService);
                    else
                        config.showErroConnect(mssboxService, $location);
                });
            },
        };
    })

    .factory('bbbfundService', function($http, $rootScope, $route, $templateCache, $location, actpostService, mssboxService, stockService) {
        return{
            property: function(done) {
                   /*  thực hiện lấy danh sách vật phẩm  dùng ngay */
                var data = {};

                var request_propertyList = actpostService.postdata(config.domainAPI + '/bbbfund/property/new', data, {});
                request_propertyList.success(function(success) {
                    done(success);
                });
                request_propertyList.error(function(err, status) {
                    if(status==400)
                        config.showError(err.code, mssboxService);
                    else if(status>400 && status<=505)
                        config.showErroDefault(err.code, mssboxService);
                    else
                        config.showErroConnect(mssboxService, $location);
                });
            },

            index: function(done) {
                var data = {};
                var request_indexList = actpostService.postdata(config.domainAPI + '/bbbfund/index/new', data, {});
                request_indexList.success(function(success) {
                    success.bbbfund.percentChange = success.bbbfund.percentChange || 0;
                    success.vn.change = success.vn.change || 0;
                    success.vn.percentChange = success.vn.percentChange || 0;
                    success.vn30.change = success.vn30.change || 0;
                    success.vn30.percentChange = success.vn30.percentChange || 0;

                    done(success)
                });
                request_indexList.error(function(err, status) {
                    if(status==400)
                        config.showError(err.code, mssboxService);
                    else if(status>400 && status<=505)
                        config.showErroDefault(err.code, mssboxService);
                    else
                        config.showErroConnect(mssboxService, $location);
                });
            },

            indexChart: function(scope) {
              var request_indexChart = actpostService.postdata(config.domainAPI + '/bbbfund/index/chart', {}, {});
              request_indexChart.success(function(success) {
                var lineChartData = {
                  labels : success.date,
                  datasets : [
                    {
                      label: 'BBB Index',
                      fillColor : "rgba(122, 204, 163, 0.5)",
                      strokeColor : "rgba(122, 204, 163,1)",
                      poinColor: "rgba(122, 204, 163,1)",
                      data : _.map(success.userIndex, function(n){return n.toFixed(2)})
                    },
                    {
                      label: 'VN Index',
                      fillColor : "rgba(198,198,198,0.5)",
                      strokeColor : "rgba(198,198,198,1)",
                      poinColor: "rgba(198,198,198,1)",
                      data : _.map(success.vnIndex, function(n){return n.toFixed(2)})
                    },
                    {
                      label: 'VN30 Index',
                      fillColor : "rgba(151,187,205,0.5)",
                      strokeColor : "rgba(151,187,205,1)",
                      poinColor: "rgba(151,187,205,1)",
                      data : _.map(success.vn30Index, function(n){return n.toFixed(2)})
                    }
                  ]
                };
                new Chart(document.getElementById("line").getContext("2d")).Line(lineChartData, {
                  scaleShowGridLines : false,
                  datasetStrokeWidth: 2,
                  pointDot: false,
                  showXLabels: _.last(success.date).split('-')[1] - success.date[0].split('-')[1],
                  multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>"
                });
              });
              request_indexChart.error(function(err, status) {
                if(status==400)
                    config.showError(err.code, mssboxService);
                else if(status>400 && status<=505)
                    config.showErroDefault(err.code, mssboxService);
                else
                    config.showErroConnect(mssboxService, $location);
              });
            },

            yearlyProperty: function(scope) {
                   /*  thực hiện lấy danh sách vật phẩm  dùng ngay */
                var request_yearlyProperty = actpostService.postdata(config.domainAPI + '/bbbfund/property/yearlychart', {}, {});
                request_yearlyProperty.success(function(success) {
                  success.months = _.map(success.months, function(n){
                    switch (n) {
                      case 1:
                        return n = 'Jan';
                        break;
                      case 2:
                        return n = 'Feb';
                        break;
                      case 3:
                        return n = 'Mar';
                        break;
                      case 4:
                        return n = 'Apr';
                        break;
                      case 5:
                        return n = 'May';
                        break;
                      case 6:
                        return n = 'Jun';
                        break;
                      case 7:
                        return n = 'Jul';
                        break;
                      case 8:
                        return n = 'Aug';
                        break;
                      case 9:
                        return n = 'Sep';
                        break;
                      case 10:
                        return n = 'Oct';
                        break;
                      case 11:
                        return n = 'Nov';
                        break;
                      case 12:
                        return n = 'Dec';
                        break;
                    }
                  });
                  var barData = {
                    labels : success.months,
                    datasets : [
                      {
                        label: 'Capital',
                        fillColor: "rgba(220,220,220,0.5)",
                        strokeColor: "rgba(220,220,220,0.8)",
                        highlightFill: "rgba(220,220,220,0.75)",
                        highlightStroke: "rgba(220,220,220,1)",
                        data : success.capital
                      },
                      {
                        label: 'Total Asset',
                        fillColor: "rgba(151,187,205,0.5)",
                        strokeColor: "rgba(151,187,205,0.8)",
                        highlightFill: "rgba(151,187,205,0.75)",
                        highlightStroke: "rgba(151,187,205,1)",
                        data : success.total
                      }
                    ]
                  };
                  new Chart(document.getElementById("bar").getContext("2d")).Bar(barData, {
                    scaleShowGridLines : false,
                    barStrokeWidth: 2,
                    //Number - Spacing between each of the X value sets
                    barValueSpacing : 10,

                    //Number - Spacing between data sets within X values
                    barDatasetSpacing : 2,
                    multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>"
                  });
                });
                request_yearlyProperty.error(function(err, status) {
                    if(status==400)
                        config.showError(err.code, mssboxService);
                    else if(status>400 && status<=505)
                        config.showErroDefault(err.code, mssboxService);
                    else
                        config.showErroConnect(mssboxService, $location);
                });
            },

            stockChange: function(scope) {
                   /*  thực hiện lấy danh sách vật phẩm  dùng ngay */
                var data = {};

                var request_stockChange = actpostService.postdata(config.domainAPI + '/bbbfund/stock/change', data, {});
                request_stockChange.success(function(success) {
                    scope.bbbfund.gainList = success.gain;
                    scope.bbbfund.loseList = success.lose;
                });
                request_stockChange.error(function(err, status) {
                    if(status==400)
                        config.showError(err.code, mssboxService);
                    else if(status>400 && status<=505)
                        config.showErroDefault(err.code, mssboxService);
                    else
                        config.showErroConnect(mssboxService, $location);
                });
            },
        };
    })
    
    .factory('chartService', function($http, $rootScope, $route, $templateCache, $location, actpostService, mssboxService, bbbfundService) {
        return{
          asset: function(properties) {
            var data = [
              {
                value: properties[0].stock,
                color: config.rainbow(2, 1),
                label: "Stock"
              },
              {
                value: properties[0].cash,
                color: config.rainbow(2, 2),
                label: "Cash"
              }
            ]
            new Chart(document.getElementById("asset").getContext("2d")).Pie(data, {
              segmentStrokeWidth : 1,
              tooltipTemplate: " <%=label%>: <%= numeral(value).format('($00[.]00)') %> - <%= numeral(circumference / 6.283).format('(0[.][00]%)') %>"
            });
          },

          stock: function() {
            var data = {};
            var request_bbbstock = actpostService.postdata(config.domainAPI + '/bbbfund/stock/new', data, {});
            request_bbbstock.success(function(success) {
                var pieData = [];
                for (var i = 0; i < success.length; i++){
                  pieData.push({value: success[i].total, color: config.rainbow(success.length, i+1), label: success[i].stock.code})
                }
                new Chart(document.getElementById("stock").getContext("2d")).Pie(pieData, {
                  segmentStrokeWidth : 1,
                  tooltipTemplate: " <%=label%>: <%= numeral(value).format('($00[.]00)') %> - <%= numeral(circumference / 6.283).format('(0[.][00]%)') %>"
                });
            });
            request_bbbstock.error(function(err, status) {
                if(status==400)
                    config.showError(err.code, mssboxService);
                else if(status>400 && status<=505)
                    config.showErroDefault(err.code, mssboxService);
                else
                    config.showErroConnect(mssboxService, $location);
            });
          },

          analyse: function(scope) {
            var data = {};
            var now = new Date();
            data.year = now.getFullYear();
            data.quarter = Math.floor(now.getMonth()/3) + 1;
            var request_bbbAnalyse = actpostService.postdata(config.domainAPI + '/bbbfund/stock/analyse', data, {});
            request_bbbAnalyse.success(function(success) {
              scope.bbbfund.analyse.annualReturn = numeral(success.annualReturn).format('0,0');
              scope.bbbfund.analyse.pe = numeral(success.pe).format('0.00');
              scope.bbbfund.analyse.pb = numeral(success.pb).format('0.00');
              scope.bbbfund.analyse.roa = numeral(success.roa).format('0.00%');
              scope.bbbfund.analyse.roe = numeral(success.roe).format('0.00%');
            })
            request_bbbAnalyse.error(function(err, status) {
                if(status==400)
                    config.showError(err.code, mssboxService);
                else if(status>400 && status<=505)
                    config.showErroDefault(err.code, mssboxService);
                else
                    config.showErroConnect(mssboxService, $location);
            });
          }
        };
    })

    .factory('accountService', function($http, $rootScope, $route, $templateCache, $location, actpostService, mssboxService, bbbfundService) {
        return{
          bbbStock: function(scope) {
            var data = {};
            var request_bbbstock = actpostService.postdata(config.domainAPI + '/bbbfund/stock/new', data, {});
            request_bbbstock.success(function(success) {
                scope.bbbfund.stock = _.map(success, function(n){
                  n.percent = numeral(n.profit/(n.total-n.profit)).format('0.00%')
                  n.qty = numeral(n.qty).format('0,0');
                  n.price = numeral(n.price).format('0,0.0');
                  n.avgPrice = numeral(n.avgPrice).format('0,0.0');
                  n.total = numeral(n.total).format('0,0');
                  n.profit = numeral(n.profit).format('0,0');
                  n.payout = numeral(n.payout).format('0,0');
                  n.toggle = n.profit;
                  return n;
                });
            });
            request_bbbstock.error(function(err, status) {
                if(status==400)
                    config.showError(err.code, mssboxService);
                else if(status>400 && status<=505)
                    config.showErroDefault(err.code, mssboxService);
                else
                    config.showErroConnect(mssboxService, $location);
            });
          },

          stockList: function(scope) {
            var data = {};
            data.limit = -1;
            var request_stockList = actpostService.postdata(config.domainAPI + '/stock/list', data, {})
            request_stockList.success(function(success){
              scope.stocks = success.result;
              scope.showFilter = false;
            });
            request_stockList.error(function(err, status){
                if(status==400)
                    config.showError(err.code, mssboxService);
                else if(status>400 && status<=505)
                    config.showErroDefault(err.code, mssboxService);
                else
                    config.showErroConnect(mssboxService, $location);
            })            
          }
        };
    })

    .factory('userService', function($http, $rootScope, $route, $templateCache, $location, actpostService, mssboxService) {
        return{
            property: function(done) {
                   /*  thực hiện lấy danh sách vật phẩm  dùng ngay */
                var data = {};

                var request_propertyList = actpostService.postdata(config.domainAPI + '/user/property/new', data, {});
                request_propertyList.success(function(success) {
                    done(success);
                });
                request_propertyList.error(function(err, status) {
                    if(status==400)
                        config.showError(err.code, mssboxService);
                    else if(status>400 && status<=505)
                        config.showErroDefault(err.code, mssboxService);
                    else
                        config.showErroConnect(mssboxService, $location);
                });
            },

            index: function(done) {
                var data = {};
                var request_indexList = actpostService.postdata(config.domainAPI + '/user/index/new', data, {});
                request_indexList.success(function(success) {
                    // success.user.percentChange = success.user.percentChange || 0;
                    // success.vn.change = success.vn.change || 0;
                    // success.vn.percentChange = success.vn.percentChange || 0;
                    // success.vn30.change = success.vn30.change || 0;
                    // success.vn30.percentChange = success.vn30.percentChange || 0;

                    done(success)
                });
                request_indexList.error(function(err, status) {
                    if(status==400)
                        config.showError(err.code, mssboxService);
                    else if(status>400 && status<=505)
                        config.showErroDefault(err.code, mssboxService);
                    else
                        config.showErroConnect(mssboxService, $location);
                });
            },

            indexChart: function(scope) {
              var request_indexChart = actpostService.postdata(config.domainAPI + '/user/index/chart', {}, {});
              request_indexChart.success(function(success) {
                var lineChartData = {
                  labels : success.date,
                  datasets : [
                    {
                      label: scope.user.nickname,
                      fillColor : "rgba(122, 204, 163, 0.5)",
                      strokeColor : "rgba(122, 204, 163,1)",
                      poinColor: "rgba(122, 204, 163,1)",
                      data : _.map(success.userIndex, function(n){return n.toFixed(2)})
                    },
                    {
                      label: 'VN Index',
                      fillColor : "rgba(198,198,198,0.5)",
                      strokeColor : "rgba(198,198,198,1)",
                      poinColor: "rgba(198,198,198,1)",
                      data : _.map(success.vnIndex, function(n){return n.toFixed(2)})
                    },
                    {
                      label: 'VN30 Index',
                      fillColor : "rgba(151,187,205,0.5)",
                      strokeColor : "rgba(151,187,205,1)",
                      poinColor: "rgba(151,187,205,1)",
                      data : _.map(success.vn30Index, function(n){return n.toFixed(2)})
                    }
                  ]
                };
                new Chart(document.getElementById("line").getContext("2d")).Line(lineChartData, {
                  scaleShowGridLines : false,
                  datasetStrokeWidth: 2,
                  pointDot: false,
                  showXLabels: _.last(success.date).split('-')[1] - success.date[0].split('-')[1],
                  multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>"
                });
              });
              request_indexChart.error(function(err, status) {
                if(status==400)
                    config.showError(err.code, mssboxService);
                else if(status>400 && status<=505)
                    config.showErroDefault(err.code, mssboxService);
                else
                    config.showErroConnect(mssboxService, $location);
              });
            },

            yearlyProperty: function(scope) {
                   /*  thực hiện lấy danh sách vật phẩm  dùng ngay */
                var request_yearlyProperty = actpostService.postdata(config.domainAPI + '/user/property/yearlychart', {}, {});
                request_yearlyProperty.success(function(success) {
                  success.months = _.map(success.months, function(n){
                    switch (n) {
                      case 1:
                        return n = 'Jan';
                        break;
                      case 2:
                        return n = 'Feb';
                        break;
                      case 3:
                        return n = 'Mar';
                        break;
                      case 4:
                        return n = 'Apr';
                        break;
                      case 5:
                        return n = 'May';
                        break;
                      case 6:
                        return n = 'Jun';
                        break;
                      case 7:
                        return n = 'Jul';
                        break;
                      case 8:
                        return n = 'Aug';
                        break;
                      case 9:
                        return n = 'Sep';
                        break;
                      case 10:
                        return n = 'Oct';
                        break;
                      case 11:
                        return n = 'Nov';
                        break;
                      case 12:
                        return n = 'Dec';
                        break;
                    }
                  });
                  var barData = {
                    labels : success.months,
                    datasets : [
                      {
                        label: 'Capital',
                        fillColor: "rgba(220,220,220,0.5)",
                        strokeColor: "rgba(220,220,220,0.8)",
                        highlightFill: "rgba(220,220,220,0.75)",
                        highlightStroke: "rgba(220,220,220,1)",
                        data : success.capital
                      },
                      {
                        label: 'Total Asset',
                        fillColor: "rgba(151,187,205,0.5)",
                        strokeColor: "rgba(151,187,205,0.8)",
                        highlightFill: "rgba(151,187,205,0.75)",
                        highlightStroke: "rgba(151,187,205,1)",
                        data : success.total
                      }
                    ]
                  };
                  new Chart(document.getElementById("bar").getContext("2d")).Bar(barData, {
                    scaleShowGridLines : false,
                    barStrokeWidth: 2,
                    //Number - Spacing between each of the X value sets
                    barValueSpacing : 10,

                    //Number - Spacing between data sets within X values
                    barDatasetSpacing : 2,
                    multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>"
                  });
                });
                request_yearlyProperty.error(function(err, status) {
                    if(status==400)
                        config.showError(err.code, mssboxService);
                    else if(status>400 && status<=505)
                        config.showErroDefault(err.code, mssboxService);
                    else
                        config.showErroConnect(mssboxService, $location);
                });
            },

            stockChange: function(scope) {
                   /*  thực hiện lấy danh sách vật phẩm  dùng ngay */
                var data = {};

                var request_stockChange = actpostService.postdata(config.domainAPI + '/user/stock/change', data, {});
                request_stockChange.success(function(success) {
                    scope.user.gainList = success.gain;
                    scope.user.loseList = success.lose;
                });
                request_stockChange.error(function(err, status) {
                    if(status==400)
                        config.showError(err.code, mssboxService);
                    else if(status>400 && status<=505)
                        config.showErroDefault(err.code, mssboxService);
                    else
                        config.showErroConnect(mssboxService, $location);
                });
            },
        };
    })
    
    .factory('userchartService', function($http, $rootScope, $route, $templateCache, $location, actpostService, mssboxService, userService) {
        return{
          asset: function(properties) {
            var data = [
              {
                value: properties[0].stock,
                color: config.rainbow(2, 1),
                label: "Stock"
              },
              {
                value: properties[0].cash,
                color: config.rainbow(2, 2),
                label: "Cash"
              }
            ]
            new Chart(document.getElementById("asset").getContext("2d")).Pie(data, {
              segmentStrokeWidth : 1,
              tooltipTemplate: " <%=label%>: <%= numeral(value).format('($00[.]00)') %> - <%= numeral(circumference / 6.283).format('(0[.][00]%)') %>"
            });
          },

          stock: function() {
            var data = {};
            var request_userstock = actpostService.postdata(config.domainAPI + '/user/stock/new', data, {});
            request_userstock.success(function(success) {
                var pieData = [];
                for (var i = 0; i < success.length; i++){
                  pieData.push({value: success[i].total, color: config.rainbow(success.length, i+1), label: success[i].stock.code})
                }
                new Chart(document.getElementById("stock").getContext("2d")).Pie(pieData, {
                  segmentStrokeWidth : 1,
                  tooltipTemplate: " <%=label%>: <%= numeral(value).format('($00[.]00)') %> - <%= numeral(circumference / 6.283).format('(0[.][00]%)') %>"
                });
            });
            request_userstock.error(function(err, status) {
                if(status==400)
                    config.showError(err.code, mssboxService);
                else if(status>400 && status<=505)
                    config.showErroDefault(err.code, mssboxService);
                else
                    config.showErroConnect(mssboxService, $location);
            });
          },

          analyse: function(scope) {
            var data = {};
            var now = new Date();
            data.year = now.getFullYear();
            data.quarter = Math.floor(now.getMonth()/3) + 1;
            var request_userAnalyse = actpostService.postdata(config.domainAPI + '/user/stock/analyse', data, {});
            request_userAnalyse.success(function(success) {
              scope.user.analyse.annualReturn = numeral(success.annualReturn).format('0,0');
              scope.user.analyse.pe = numeral(success.pe).format('0.00');
              scope.user.analyse.pb = numeral(success.pb).format('0.00');
              scope.user.analyse.roa = numeral(success.roa).format('0.00%');
              scope.user.analyse.roe = numeral(success.roe).format('0.00%');
            })
            request_userAnalyse.error(function(err, status) {
                if(status==400)
                    config.showError(err.code, mssboxService);
                else if(status>400 && status<=505)
                    config.showErroDefault(err.code, mssboxService);
                else
                    config.showErroConnect(mssboxService, $location);
            });
          }
        };
    })

    .factory('userAccountService', function($http, $rootScope, $route, $templateCache, $location, actpostService, mssboxService, userService) {
        return{
          userStock: function(scope) {
            var data = {};
            var request_userstock = actpostService.postdata(config.domainAPI + '/user/stock/new', data, {});
            request_userstock.success(function(success) {
                scope.user.stock = _.map(success, function(n){
                  n.percent = numeral(n.profit/(n.total-n.profit)).format('0.00%');
                  n.qty = numeral(n.qty).format('0,0');
                  n.price = numeral(n.price).format('0,0.0');
                  n.avgPrice = numeral(n.avgPrice).format('0,0.0');
                  n.total = numeral(n.total).format('0,0');
                  n.profit = numeral(n.profit).format('0,0');
                  n.payout = numeral(n.payout).format('0,0');
                  n.toggle = n.profit;
                  return n;
                });
            });
            request_userstock.error(function(err, status) {
                if(status==400)
                    config.showError(err.code, mssboxService);
                else if(status>400 && status<=505)
                    config.showErroDefault(err.code, mssboxService);
                else
                    config.showErroConnect(mssboxService, $location);
            });
          },

          create: function(scope) {
            var data = {};
            data.cash = scope.cash2;
            for (var i = 0; i < scope.listCreate.length; i++) {
              scope.listCreate[i].fee = Math.ceil(scope.listCreate[i].fee);
            }
            data.stockList = scope.listCreate;
            var request_createPortfolio = actpostService.postdata(config.domainAPI + '/user/exchange/create', data, {});
            request_createPortfolio.success(function(success) {
              mssboxService.Messeggbox('BBBFUND - PORTFOLIO', 'Successful create!!');
              $location.path('/user/portfolio');
            });
            request_createPortfolio.error(function(err, status) {
                if(status==400)
                    config.showError(err.code, mssboxService);
                else if(status>400 && status<=505)
                    config.showErroDefault(err.code, mssboxService);
                else
                    config.showErroConnect(mssboxService, $location);
            });
          },

          stock: function(data) {
            for (var i = 0; i < data.length; i++) {
              data[i].fee = Math.ceil(data[i].fee);
            }
            var request_stockExchange = actpostService.postdata(config.domainAPI + '/user/exchange/stock', {exchange: data}, {});
            request_stockExchange.success(function(success) {
              mssboxService.Messeggbox('BBBFUND - PORTFOLIO', 'Successful update!!');
              $location.path('/user/portfolio');
            });
            request_stockExchange.error(function(err, status) {
                if(status==400)
                    config.showError(err.code, mssboxService);
                else if(status>400 && status<=505)
                    config.showErroDefault(err.code, mssboxService);
                else
                    config.showErroConnect(mssboxService, $location);
            });
          },

          payout: function(data) {
            for (var i = 0; i < data.length; i++) {
              data[i].fee = Math.ceil(data[i].fee);
            }
            var request_payout = actpostService.postdata(config.domainAPI + '/user/exchange/payout', {exchange: data}, {});
            request_payout.success(function(success) {
              mssboxService.Messeggbox('BBBFUND - PORTFOLIO', 'Updated successful!!');
              $location.path('/user/portfolio');
            });
            request_payout.error(function(err, status) {
                if(status==400)
                    config.showError(err.code, mssboxService);
                else if(status>400 && status<=505)
                    config.showErroDefault(err.code, mssboxService);
                else
                    config.showErroConnect(mssboxService, $location);
            });
          },

          cash: function(cash) {
            var request_cash = actpostService.postdata(config.domainAPI + '/user/exchange/cash', {cash: cash}, {});
            request_cash.success(function(success) {
              mssboxService.Messeggbox('BBBFUND - PORTFOLIO', 'Updated successful!!');
              $location.path('/user/portfolio');
            });
            request_cash.error(function(err, status) {
                if(status==400)
                    config.showError(err.code, mssboxService);
                else if(status>400 && status<=505)
                    config.showErroDefault(err.code, mssboxService);
                else
                    config.showErroConnect(mssboxService, $location);
            });
          },

          stockList: function(scope) {
            var data = {};
            data.limit = -1;
            var request_stockList = actpostService.postdata(config.domainAPI + '/stock/list', data, {})
            request_stockList.success(function(success){
              scope.stocks = success.result;
              scope.showFilter = false;
            });
            request_stockList.error(function(err, status){
                if(status==400)
                    config.showError(err.code, mssboxService);
                else if(status>400 && status<=505)
                    config.showErroDefault(err.code, mssboxService);
                else
                    config.showErroConnect(mssboxService, $location);
            })            
          }

        };
    })

    .run(function($rootScope, $http, $cookies, $location, authService) {
        $rootScope.nickNameMe = '';
        $rootScope.roleID = '';
        $rootScope.dataShow = {};
        // var routespermission = ['/home'];  //route that require login
        // $rootScope.$on('$routeChangeStart', function() {
        //     if (routespermission.indexOf($location.path()) != -1)
        //     {
        //         if (authService.islogged())
        //         {
        //             console.log($location.path()) ;
        //             console.log('------------------------vao den day routespermission.indexOf----------');
        //             $location.path('/home');
        //         }
        //         else
        //         {
        //             console.log('------------------------vao den day routespermission.login----------');
        //             $location.path('/login');
        //         }
        //     }
        //     else{
        //         console.log('=========================sssss========================');
        //         $location.path($location.path());
        //         console.log($location.path());
        //         console.log($location.protocol());
        //     }
        // });
    });