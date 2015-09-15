/**
 * Created by thanhpt on 4/1/2015.
 */
var config = {
    devDomain : window.location.origin, //'http://127.0.0.1:1337',//window.location.origin,
    domainAPI : 'http://baomongolab.herokuapp.com', //'http://127.0.0.1:1337', //http://172.30.0.205:8000   //http://172.30.0.203:1338
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
            /*if ($scope.reverse)
             $('th.'+new_sorting_order+' i').removeClass().addClass('icon-chevron-up');
             else
             $('th.'+new_sorting_order+' i').removeClass().addClass('icon-chevron-down');*/
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
    },
    
    setCssBody : function (url){
        $("body").css({"background": url,"-webkit-background-size": "cover","-moz-background-size": 'cover',"-o-background-size": 'cover',"background-size": 'cover'});
    },

    /* header and left bar */
    showHeadAndLeft : function(){
        var data = JSON.parse(this.localStage.get('dataLogin'));
        if(data!=undefined && data!='' && data!=null)
        {
            /*var expToken = new Date(data.tokenExpireAt);
            var dateNow = new Date();
            if(dateNow <= expToken)
            {
            }*/
            $(".home-head").fadeIn();
            $(".homne-left-bar").fadeIn();
            $(".myScroll").css({'margin': '0 315px auto'});
            return false;
        }
        $(".home-head").css({"display": "none"});
        $(".homne-left-bar").css({"display": "none"});
        $("html, body .myScroll").css({'margin': '0'},{'height': '0'});
    },
    /* show menu left */
    showLeftMenu : function(id){
        if($("div "+ id +" .cssSlideUp").length=1)
        {
            $("div "+ id +" .cssSlideUp").addClass("ng-hide");
        }
    },

    formatDate:function(date,scope){
        if(scope&&date==''){
            scope.formatDate = function(date){
                var value =  new Date(date) ;
                return  
                    ((value.getDate().toString().length==1)?'0'+value.getDate().toString():value.getDate().toString())
                    + "/" +
                    ((value.getMonth().toString().length==1)?'0'+(value.getMonth()+1).toString():(value.getMonth()+1).toString())
                    + "/" +
                    ((value.getFullYear().toString().length==1)?'0'+value.getFullYear().toString():value.getFullYear().toString());
            };
        }else{
            var value = new Date(date) ;
            return
                ((value.getMonth().toString().length==1)?'0'+(value.getMonth()+1).toString():(value.getMonth()+1).toString())
                + "/" +
                ((value.getDate().toString().length==1)?'0'+value.getDate().toString():value.getDate().toString())
                + "/" +
                ((value.getFullYear().toString().length==1)?'0'+value.getFullYear().toString():value.getFullYear().toString());
        }
    },
    thatEditItem : null,
    thatViewItem : null,
    thatLoginCtl : null,
    

    multiSelectCtrl : function ($scope){
        $scope.getSelectedItemsOnly = function(item){
            return item.selected;
        };
        $scope.getSelectedItemsOnly1 = function(item){
            return item.selected;
        };
        $scope.checkHinh = function(arr,index){
            if(arr[index].selected==undefined)
            {
                arr[index].selected = true;
            }
            else if(arr[index].selected==true){
                arr[index].selected = false;
            }
            else if(arr[index].selected==false){
                arr[index].selected = true;
            }
            for(var i =0;i<arr.length;i++){
                if(i!=index && arr[i].selected!=undefined && arr[i].selected==true){
                    arr[i].selected = false;
                }
            }
        };

        $scope.handelWh = function(id, e,cho){
            if(cho.listImageWH.length>=4){
                $('#multiple-select-wrapper-wh'+id.toString()+' .list ul.items-list').css('height',161);
            }
            else{
                $('#multiple-select-wrapper-wh'+id.toString()+' .list ul.items-list').css('height','auto');
            }
            e.stopPropagation();
            $('#multiple-select-wrapper-wh'+id.toString()+' .list').toggle('slideDown');
            for(var o=0;o<$('.toBo').length;o++){
                if(o!=id){
                    $('#multiple-select-wrapper-wh'+o.toString()+' .list').slideUp();
                    $('#multiple-select-wrapper-as'+o.toString()+' .list').slideUp();
                }
            }
            $('#multiple-select-wrapper-as'+id.toString()+' .list').slideUp();
            $('#multiple-select-wrapper-wh'+id.toString()+' .list').bind('click', function(e){
                e.stopPropagation();
            });
            $(document).bind('click', function(){
                $('#multiple-select-wrapper-wh'+id.toString()+' .list').slideUp();
            });
        };

        $scope.handelAs = function(id,e,cho){
            if(cho.listImageAS.length>=4)
                $('#multiple-select-wrapper-as'+id.toString()+' .list ul.items-list').css('height',161);
            else
                $('#multiple-select-wrapper-as'+id.toString()+' .list ul.items-list').css('height','auto');
            e.stopPropagation();
            $('#multiple-select-wrapper-as'+id.toString()+' .list').toggle('slideDown');
            for(var o=0;o<$('.toBo').length;o++){
                if(o!=id){
                    $('#multiple-select-wrapper-wh'+o.toString()+' .list').slideUp();
                    $('#multiple-select-wrapper-as'+o.toString()+' .list').slideUp();
                }
            }
            $('#multiple-select-wrapper-wh'+id.toString()+' .list').slideUp();
            $('#multiple-select-wrapper-as'+id.toString()+' .list').bind('click', function(e){
                e.stopPropagation();
            });
            $(document).bind('click', function(){
                $('#multiple-select-wrapper-as'+id.toString()+' .list').slideUp();
            });
        };
    },

    initPagingDef : function($scope,$filter){
        // init
        $scope.sortingOrder = sortingOrder;
        $scope.reverse = false;
        $scope.filteredItems = [];
        $scope.groupedItems = [];
        $scope.itemsPerPage = 15;
        $scope.pagedItems = [];
        $scope.currentPage = 0;
        $scope.items = [
        ];

        var searchMatch = function (haystack, needle) {
            if (!needle) {
                return true;
            }
            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        };

        // init the filtered items
        console.log($scope.items);
        $scope.search = function () {
            $scope.filteredItems = $filter('filter')($scope.items, function (item) {
                for(var attr in item) {
                    if (searchMatch(item[attr], $scope.query))
                        return true;
                }
                return false;
            });
            // take care of the sorting order
            if ($scope.sortingOrder !== '') {
                $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
            }
            $scope.currentPage = 0;
            // now group by pages
            $scope.groupToPages();
        };

        // calculate page in place
        $scope.groupToPages = function () {
            $scope.pagedItems = [];

            for (var i = 0; i < $scope.filteredItems.length; i++) {
                if (i % $scope.itemsPerPage === 0) {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
                } else {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
                }
            }
        };

        $scope.range = function (start, end) {
            var ret = [];
            if (!end) {
                end = start;
                start = 0;
            }
            for (var i = start; i < end; i++) {
                ret.push(i);
            }
            return ret;
        };

        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.pagedItems.length - 1) {
                $scope.currentPage++;
            }
        };

        $scope.setPage = function () {
            $scope.currentPage = this.n;
        };

        // functions have been describe process the data for display

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
            /* if ($scope.reverse)
             $('th.'+new_sorting_order+' i').removeClass().addClass('icon-chevron-up');
             else
             $('th.'+new_sorting_order+' i').removeClass().addClass('icon-chevron-down');*/
        };

    },

    routinTestLogin : function(authService,$location,url){
        if (authService.islogged())
        {
            $location.path(url.useURL);
            return true;
        }
        else
        {
            $location.path(url.defURL);
            return false;
        }

    },

    fixFullName : function(text)
    {
        var te = text.toString().trim();
        if(te.length>=13)
        {
            te =  te.substr(0,11)+'...';
        }
        return te;
    },
    setInfoAdmin : function(username){
        this.localStage.set('infoAdmin',JSON.stringify({'nickname':this.fixFullName(username)}));
    },
    getInfoAdmin : function(rootScope){
        var dataInfoUser = JSON.parse(this.localStage.get('infoAdmin'));
        if(dataInfoUser)
            rootScope.nickname = dataInfoUser.nickname;

        var dataLogin = JSON.parse(this.localStage.get('dataLogin'));
        if(dataLogin)
            rootScope.roleID = dataLogin.role.id;

        var dataShowAct = JSON.parse(this.localStage.get('listRoles'));
        if(dataShowAct)
            rootScope.dataShow = dataShowAct;

        rootScope.clsListMn = 'list-group-item nguoi-dung-quan-tri';
        rootScope.clsAddMn = 'list-group-item them-quan-tri';
    },
    isDate : function(date) {
        return ( (new Date(date) !== "Invalid Date" && !isNaN(new Date(date)) ));
    },
    checkDateFromTo : function(from,to){
        var startD = new Date(from.toString("dd/mm/yyyy"));
        var endD = new Date(to.toString("dd/mm/yyyy"));
        if(endD>startD)
            return true;
        return false;
    },
    addMinutes : function(date, minutes) {
        return new Date(date.getTime() + minutes*60000);
    },
    isInt : function(n){
        return Number(n)===n && n%1===0;
    },
    isCheckUnicode : function(text){
        return /^([a-z0-9A-Z^\-_]{0,})$/.test(text);
    },

    /*default image */
    imgDefaultW : function() {return ( window.location.origin + "/images/user/photo-def-w.png");},
    imgDefaultM : function() {return ( window.location.origin + "/images/user/photo-def-m.png");},

    /* show hide scroll */
    showScroll : function(){
        $('document').ready(function() {
            $('.defScrollOk .scrollbarY').fadeIn();
            $('.defScrollOk').addClass("scrollY myScroll");
        });
    },
    hideScroll : function(){
        $('document').ready(function() {
            $('.defScrollOk .scrollbarY').fadeOut();
            $('.defScrollOk').removeClass("scrollY myScroll");
        });
    },
    goScrollWindown : function(int){
        $('document').ready(function() {
            $(window).scrollTop(int);
        });
    },

    /*remove array*/
    removeItemArray : function(arr) {
        var what, a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax= arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    },

    /* check data paging */
    checkDataPaging : function(arr){
        if(arr.length==0)
        {
            return true;
        }
        else
            return false;
    },

    /* show Allow Rule */
    arrayRules : {
        admin:       {view:false,add:false,delete:false,edit:false},
        roles:       {view:false,add:false,delete:false,edit:false},
        games:       {view:false,add:false,delete:false,edit:false},
        items:       {view:false,add:false,delete:false,edit:false},
        notifis:     {view:false,add:false,delete:false,edit:false},
        users:       {view:false,add:false,delete:false,edit:false},
        report:      {view:false,add:false,delete:false,edit:false},
        dautri:      {view:true,add:true,delete:true,edit:true}
    },
    setDefaultRules : function(){
        this.arrayRules = {
            admin :      {view:false,add:false,delete:false,edit:false},
            roles:       {view:false,add:false,delete:false,edit:false},
            games:       {view:false,add:false,delete:false,edit:false},
            items:       {view:false,add:false,delete:false,edit:false},
            notifis:     {view:false,add:false,delete:false,edit:false},
            users:       {view:false,add:false,delete:false,edit:false},
            report:      {view:false,add:false,delete:false,edit:false},
            dautri:      {view:true,add:true,delete:true,edit:true}
        };
    },
    setSetsRules : function(data,rootscope){
        this.setDefaultRules();
        for(var t=0; t<data.length; t++){
            /* quản lý quản trị */
            if((data[t].access&1) != 0 && data[t].permission.code == 'PG01')
                this.arrayRules.admin.view = true;
            if ((data[t].access&2) != 0 && data[t].permission.code == 'PG01')
                this.arrayRules.admin.add = true;
            if ((data[t].access&4) != 0 && data[t].permission.code == 'PG01')
                this.arrayRules.admin.delete = true;
            if ((data[t].access&8) != 0 && data[t].permission.code == 'PG01')
                this.arrayRules.admin.edit = true;

            /* quản lý quyền */
            if( (data[t].access&1) != 0 && data[t].permission.code == 'PG02')
                this.arrayRules.roles.view = true;
            if ( (data[t].access&2) != 0 && data[t].permission.code == 'PG02')
                this.arrayRules.roles.add = true;
             if ( (data[t].access&4) != 0 && data[t].permission.code == 'PG02')
                this.arrayRules.roles.delete = true;
             if ( (data[t].access&8) != 0 && data[t].permission.code == 'PG02')
                this.arrayRules.roles.edit = true;


            /* quản lý trò chơi */
              if( (data[t].access&1) != 0 && data[t].permission.code == 'PG03')
                this.arrayRules.games.view = true;
             if ( (data[t].access&2) != 0 && data[t].permission.code == 'PG03')
                this.arrayRules.games.add = true;
             if ( (data[t].access&4) != 0 && data[t].permission.code == 'PG03')
                this.arrayRules.games.delete = true;
             if ( (data[t].access&8) != 0 && data[t].permission.code == 'PG03')
                this.arrayRules.games.edit = true;

            /* quản lý vật phẩm */
              if( (data[t].access&1) != 0 && data[t].permission.code == 'PG04')
                this.arrayRules.items.view = true;
             if ( (data[t].access&2) != 0 && data[t].permission.code == 'PG04')
                this.arrayRules.items.add = true;
             if ( (data[t].access&4) != 0 && data[t].permission.code == 'PG04')
                this.arrayRules.items.delete = true;
             if ( (data[t].access&8) != 0 && data[t].permission.code == 'PG04')
                this.arrayRules.items.edit = true;

            /* quản lý thông báo */
              if( (data[t].access&1) != 0 && data[t].permission.code == 'PG05')
                this.arrayRules.notifis.view = true;
             if ( (data[t].access&2) != 0 && data[t].permission.code == 'PG05')
                this.arrayRules.notifis.add = true;
             if ( (data[t].access&4) != 0 && data[t].permission.code == 'PG05')
                this.arrayRules.notifis.delete = true;
             if ( (data[t].access&8) != 0 && data[t].permission.code == 'PG05')
                this.arrayRules.notifis.edit = true;

            /* quản lý người dùng */
              if( (data[t].access&1) != 0 && data[t].permission.code == 'PG06')
                this.arrayRules.users.view = true;
             if ( (data[t].access&2) != 0 && data[t].permission.code == 'PG06')
                this.arrayRules.users.add = true;
             if ( (data[t].access&4) != 0 && data[t].permission.code == 'PG06')
                this.arrayRules.users.delete = true;
             if ( (data[t].access&8) != 0 && data[t].permission.code == 'PG06')
                this.arrayRules.users.edit = true;

            /* quản lý report */
            if( (data[t].access&1) != 0 && data[t].permission.code == 'PG07')
                this.arrayRules.report.view = true;
            if ( (data[t].access&2) != 0 && data[t].permission.code == 'PG07')
                this.arrayRules.report.add = true;
            if ( (data[t].access&4) != 0 && data[t].permission.code == 'PG07')
                this.arrayRules.report.delete = true;
            if ( (data[t].access&8) != 0 && data[t].permission.code == 'PG07')
                this.arrayRules.report.edit = true;
        }
        rootscope = this.arrayRules;
        //console.log(rootscope);
        config.localStage.set('listRoles',JSON.stringify(this.arrayRules));
    },

    setContentText : function(arrCt,arrUse,arrayT){
        arrCt.push(arrUse.permission.name);
        if((arrUse.access&1) != 0){
            arrCt.push('xem');
            arrayT.push(true);
        }
        else{
            arrayT.push(false);
        }

        if ((arrUse.access&2) != 0){
            arrCt.push('thêm');
            arrayT.push(true);
        }
        else{
            arrayT.push(false);
        }

        if ((arrUse.access&4) != 0){
            arrCt.push('xóa');
            arrayT.push(true);
        }
        else{
            arrayT.push(false);
        }

        if ((arrUse.access&8) != 0){
            arrCt.push('sửa');
            arrayT.push(true);
        }
        else{
            arrayT.push(false);
        }
    },

    /* show err code for nulti API */
    messDefault : "Lost connection! Please try again later!!",
    showErroConnect : function(mssboxService, location){
        mssboxService.Messeggbox('BBB FUND', config.messDefault);
        config.localStage.remove('dataLogin');
        config.localStage.remove('infoAdmin');
        config.localStage.remove('listRoles');
        config.showHeadAndLeft();
        $("div .list-group a").removeClass("active");
        location.path('/login');
    },
    showErroDefault: function(code, mssboxService, authService){
        if (code == 1000)
            mssboxService.Messeggbox('ERROR', "Could not process. Please try again later!!!");
        if (code == 1013)
            mssboxService.MsgboxLogin('ERROR', "You are not logged in");  
    },
    
    showError: function(err, mssboxService){
        if (err.code == 1001)
            mssboxService.Messeggbox('PORTFOLIO - SIGNUP', err.error);
        else if (err.code==1002)
            mssboxService.Messeggbox('PORTFOLIO - SIGNUP', err.error);
        else if (err.code==1003)
            mssboxService.Messeggbox('PORTFOLIO - LOGIN', err.error);
        else if (err.code==1004)
            mssboxService.Messeggbox('PORTFOLIO - LOGIN', err.error);
        else if (err.code==1005)
            mssboxService.Messeggbox('PORTFOLIO - LOGIN', err.error);
        else if (err.code==1006)
            mssboxService.Messeggbox('PORTFOLIO - LOGIN', err.error);
    },
    
};

Array.prototype.compare = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
} ;