/**
 * Created by thanhpt on 4/1/2015.
 */
var config = {
    devDomain : window.location.origin,
    domainAPI : 'http://baomongolab.herokuapp.com',
    apiTest : {"x-nahi-token": "apikeytest", 'Content-Type': 'application/x-www-form-urlencoded'},
    /* set, get, revove Localstage */
    
    limit : 50,
    initAlphabetPaging: function($scope, service){
        $scope.filterAlphabet = 'A';
        $scope.alphabetItems = [];
        $scope.userList = [];
        $scope.setAlphabetPage = function(){
            $scope.filterAlphabet = this.n;
            service.list($scope);
        }
    },
    initPaging : function($scope, $filter, services, sort){
        /*   init paging */
        $scope.reverse = false;
        $scope.itemsPerPage = this.limit;
        $scope.pagedItems = [];
        $scope.currentPage = 1;
        $scope.items = '';
        $scope.sortPage = (!sort)?sort:undefined;

        var searchMatch = function (haystack, needle) {
            if (!needle) {
                return true;
            }
            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        };

        // init the filtered items
        $scope.search = function (page) {
            if ($scope.query)
                $scope.pagedItems = $filter('filter')($scope.items.result, function (item) {
                    for(var attr in item) {
                        if (searchMatch(item[attr], $scope.query))
                            return true;
                    }
                    return false;
                });
            else
                $scope.pagedItems = $scope.items.result
            $scope.currentPage = page;
            $scope.numPages = Math.ceil($scope.items.total/$scope.itemsPerPage)
        };

        $scope.range = function (start, end) {
            var ret = [];
            if (!end) {
                end = start;
                start = 1;
            }
            for (var i = start; i <= end; i++) {
                ret.push(i);
            }
            return ret;
        };

        $scope.prevPage = function () {
            if ($scope.currentPage > 1) {
                services.newList($scope, currentPage - 1);
            }
        };
        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.numPages) {;
                services.newList($scope, currentPage + 1);
            }
        };
        $scope.setPage = function () {
            services.newList($scope, this.n);
        };

        // change sorting order
        $scope.sort_by = function(newSortingOrder) {
            if ($scope.sortingOrder == newSortingOrder)
                $scope.reverse = !$scope.reverse;

            $scope.sortingOrder = newSortingOrder;

            // icon setup
            $('th i').each(function(){
                // icon reset
                $(this).removeClass().addClass('icon-sort');
            });
        };
    },


    localStage : {
        set:function(name,data){
            window.localStorage.setItem(name,data);
        },
        get:function(name){
            return window.localStorage.getItem(name);
        },
        remove:function(name){
            window.localStorage.removeItem(name);
        }
    },

    numberWithCommas: function(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    },

    rainbow: function(numOfSteps, step) {
        // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
        // Adam Cole, 2011-Sept-14
        // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
        var r, g, b;
        var h = step / numOfSteps;
        var i = ~~(h * 6);
        var f = h * 6 - i;
        var q = 1 - f;
        switch(i % 6){
            case 0: r = 1; g = f; b = 0; break;
            case 1: r = q; g = 1; b = 0; break;
            case 2: r = 0; g = 1; b = f; break;
            case 3: r = 0; g = q; b = 1; break;
            case 4: r = f; g = 0; b = 1; break;
            case 5: r = 1; g = 0; b = q; break;
        }
        var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
        return (c);
    }
} ;