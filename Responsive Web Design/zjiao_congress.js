        //when loading the page;
            var myApp = angular.module("myApp", ['angularUtils.directives.dirPagination']);
            myApp.controller('MyController', function MyController($scope,$http) {
            
                
            //initialize the current table;  
            $scope.currentTable = "Legislators";
            $scope.bigHeadline = "Legislators";
            //initialize the current tag when first table; 
            $scope.currentTag = "state";
            $scope.currentOrderBy = ['state_name','last_name'];
            $scope.selected = true;
            $scope.committeesChamber = {chamber : 'house'};
            $scope.committeesOrderBy = 'committee_id'; 
            $scope.currentPage = 1;
            $scope.pageSize = 10;
            //get legislators 538 info;
            $http.get("http://zjiao.cy8pm7xxjw.us-west-1.elasticbeanstalk.com/",{
            params: {database: 'legislators', apikey: 'ff7bc0029eb24bb392f848926acde51c',per_page:'all'}}).then(function(response) {
            $scope.nameLists = response.data.results;
            });
            //get bills 50 active info;  
            $http.get("http://zjiao.cy8pm7xxjw.us-west-1.elasticbeanstalk.com/",{
            params: {database: 'bills', apikey: 'ff7bc0029eb24bb392f848926acde51c',per_page:'50',type: 'active'}}).then(function(response) {
            $scope.activeBillLists = response.data.results;
            });
            //get bills 50 new info;  
            $http.get("http://zjiao.cy8pm7xxjw.us-west-1.elasticbeanstalk.com/",{
            params: {database: 'bills', apikey: 'ff7bc0029eb24bb392f848926acde51c',per_page:'50',type: 'new'}}).then(function(response) {
            $scope.newBillLists = response.data.results;
            });
            //get committees 228 info;
            $http.get("http://zjiao.cy8pm7xxjw.us-west-1.elasticbeanstalk.com/",{
            params: {database: 'committees', apikey: 'ff7bc0029eb24bb392f848926acde51c',per_page:'all'}}).then(function(response) {
            $scope.CommitteeLists = response.data.results;
            });    
            
            //Select four tables:
            $scope.goTable = function(tableName) {
                if(tableName == "Legislators") {
                   $scope.bigHeadline = "Legislators";
                   $scope.currentTag = "state";
                } else if(tableName == "Bills") {
                   $scope.bigHeadline = "Bills";
                   $scope.currentBillTag = "activeBills";
                   $scope.BillLists = $scope.activeBillLists;
                } else if(tableName == "Committees") {
                   $scope.bigHeadline = "Committees";
                   $scope.currentCommTag = "House";
                } else if(tableName == "Favorites") {
                   $scope.bigHeadline = "Favorites";
                   $scope.currentFavTag = "Legislators";
                }
                $scope.currentTable = tableName;
            
            }
            $scope.hasClick = function(tableName) {
                return $scope.currentTable === tableName;
            }
            
            
            //Select tags in Legislators:
            $scope.goTab = function(tagName) {
                if(tagName == "state") {
                    $scope.currentOrderBy = ['state_name','last_name'];
                    $scope.chamberFillter = null;
                    $scope.inputFillter = null;
                    $scope.filterState = "noselect"
                } else if(tagName == "house") {
                    $scope.currentOrderBy = 'last_name';
                    $scope.chamberFillter = {chamber : 'house'};
                    $scope.inputFillter = "";
                    $scope.queryHouse = "";
                } else if(tagName == "senate") {
                    $scope.currentOrderBy = 'last_name';
                    $scope.chamberFillter = {chamber : 'senate'};
                    $scope.inputFillter = "";
                    $scope.querySenate = "";
                }
                $scope.currentTag = tagName;
            }
            $scope.hasSet = function(tagName) {
                return $scope.currentTag === tagName;
            }
            $scope.$watch('filterState', function() {
                if($scope.filterState != "noselect") {
                   $scope.inputFillter = {state : $scope.filterState}; 
                } else {
                    $scope.inputFillter =  null;
                }
            ;})
            $scope.$watch('queryHouse', function() {
                if($scope.queryHouse != null) {
                    $scope.chamberFillter = {chamber : 'house'};
                    $scope.inputFillter = $scope.queryHouse;
                }
            });
            $scope.$watch('querySenate', function() {
                if($scope.querySenate != null) {
                    $scope.chamberFillter = {chamber : 'senate'};
                    $scope.inputFillter = $scope.querySenate;
                }
            });  
            $scope.viewDetails = function(num) {
                $scope.entry = num;
                $http.get("http://zjiao.cy8pm7xxjw.us-west-1.elasticbeanstalk.com/",{
                    params: {database: 'committees',
                             apikey:'ff7bc0029eb24bb392f848926acde51c',
                             per_page:'5',
                             member_ids: $scope.entry.bioguide_id
                    }}).then(function(response) {
                    $scope.committeesTop5 = response.data.results;
                    
                });
                $http.get("http://zjiao.cy8pm7xxjw.us-west-1.elasticbeanstalk.com/",{
                    params: {database: 'bills', 
                             apikey: 'ff7bc0029eb24bb392f848926acde51c',
                             per_page:'5',
                             sponsor_id: $scope.entry.bioguide_id
                    }}).then(function(response) {
                    $scope.billsTop5 = response.data.results;
                });
                var currentTime = new Date().getTime();
                var startTime = new Date(num.term_start).getTime();
                var endTime = new Date(num.term_end).getTime();
                $scope.term = Math.round(Math.abs(currentTime - startTime) / Math.abs(endTime - startTime) * 100);
                $scope.currentTable = "Legislators";
                $("#myCarousel_L").carousel("next");
            };
               
                
            
            //Select tags in Bills:
            $scope.goBillTab = function(billTagName) {
                if(billTagName == "activeBills") {
                  $scope.BillLists = $scope.activeBillLists;
                  $scope.billsSearch = "";
                  $scope.queryActive = "";
                } else if(billTagName == "newBills") {
                  $scope.BillLists = $scope.newBillLists;
                  $scope.billsSearch = "";
                  $scope.queryNew = "";
                }
                $scope.currentBillTag = billTagName;
            }
            $scope.hasSetBill = function(billTagName) {
                return $scope.currentBillTag === billTagName;
            }
            $scope.$watch('queryActive', function() {
                if($scope.queryActive != null) {
                    $scope.billsSearch = $scope.queryActive;
                }
            });
            $scope.$watch('queryNew', function() {
                if($scope.queryNew != null) {
                    $scope.billsSearch = $scope.queryNew;
                }
            });
            $scope.viewBills = function(bill) {
                $scope.billEntry = bill;
                $scope.currentTable = "Bills";
                $("#myCarousel_B").carousel("next");
            };
            
             

            //Select tags in Committees:  
            $scope.goCommitteeTab = function(CommTagName) {
                if(CommTagName == "House") {
                  $scope.committeesChamber = {chamber : 'house'};
                  $scope.committeesSearch = "";
                  $scope.searchHouse = "";
                } else if(CommTagName == "Senate") {
                  $scope.committeesChamber = {chamber : 'senate'};
                  $scope.committeesSearch = "";
                  $scope.searchSenate = "";
                } else if(CommTagName == "Joint") {
                  $scope.committeesChamber = {chamber : 'joint'};
                  $scope.committeesSearch = "";
                  $scope.searchJoint = "";
                }
                $scope.currentCommTag = CommTagName;
            }
            $scope.hasSetCommittees = function(CommTagName) {
                return $scope.currentCommTag === CommTagName;
            }
            $scope.$watch('searchHouse', function() {
                if($scope.searchHouse != null) { 
                    $scope.committeesSearch = $scope.searchHouse;
                    $scope.committeesChamber = {chamber : 'house'};
                }
            });
            $scope.$watch('searchSenate', function() { 
                if($scope.searchSenate != null) {
                    $scope.committeesSearch = $scope.searchSenate;
                    $scope.committeesChamber = {chamber : 'senate'};
                } 
            });
            $scope.$watch('searchJoint', function() {
                if($scope.searchJoint != null) {
                    $scope.committeesSearch = $scope.searchJoint;
                    $scope.committeesChamber = {chamber : 'joint'};
                }
            });
            
        
            //The Favorite table
            //Select tags in Favorites:  
            $scope.goFavoritesTab = function(FavTagName) {
                $scope.currentFavTag = FavTagName;
            }
            $scope.hasSetFavorites = function(FavTagName) {
                return $scope.currentFavTag === FavTagName;
            }
            //The L table
            $scope.favoritesListL = [];
            if(localStorage.favoritesListL) {
                $scope.favoritesListL = JSON.parse(localStorage.favoritesListL);
            }
            $scope.toggleFavoriteL = function(entry){
                
                var index = -1;
                if(!entry.liked){
                    for(var i = 0; i < $scope.favoritesListL.length; i++){
                        if($scope.favoritesListL[i].bioguide_id == entry.bioguide_id){
                            index = i;
                            break;
                        }
                    }
                    if(index == -1){
                        $scope.favoritesListL.push(entry);
                        localStorage.favoritesListL = JSON.stringify($scope.favoritesListL);
                    }
                } else {
                    for(var i = 0; i < $scope.favoritesListL.length; i++){
                        if($scope.favoritesListL[i].bioguide_id == entry.bioguide_id){
                            index = i;
                            break;
                        }
                    }
                    if(index != -1){
                        $scope.favoritesListL.splice(index, 1);
                        localStorage.favoritesListL = JSON.stringify($scope.favoritesListL);
                    }
                }
                entry.liked = !entry.liked;
            }
            $scope.deleteFavoriteL = function(entry){
                for(var i = 0; i < $scope.favoritesListL.length; i++){
                        if($scope.favoritesListL[i].bioguide_id == entry.bioguide_id){
                            index = i;
                            break;
                        }
                    }
                    if(index != -1){
                        $scope.favoritesListL.splice(index, 1);
                        localStorage.favoritesListL = JSON.stringify($scope.favoritesListL);
                    }
                entry.liked = false;
            }
            
            //The B table
            $scope.favoritesListB = [];
            var index = -1;
            if(localStorage.favoritesListB) {
                $scope.favoritesListB = JSON.parse(localStorage.favoritesListB);
            }
            $scope.toggleFavoriteB = function(entry){
                var index = -1;
                if(!entry.liked){
                    for(var i = 0; i < $scope.favoritesListB.length; i++){
                        if($scope.favoritesListB[i].bill_id == entry.bill_id){
                            index = i;
                            break;
                        }
                    }
                    if(index == -1){
                        $scope.favoritesListB.push(entry);
                        localStorage.favoritesListB = JSON.stringify($scope.favoritesListB);
                    }
                } else {
                    for(var i = 0; i < $scope.favoritesListB.length; i++){
                        if($scope.favoritesListB[i].bill_id == entry.bill_id){
                            index = i;
                            break;
                        }
                    }
                    if(index != -1){
                        $scope.favoritesListB.splice(index, 1);
                        localStorage.favoritesListB = JSON.stringify($scope.favoritesListB);
                    }
                }
                entry.liked = !entry.liked;
            }
            $scope.deleteFavoriteB = function(entry){
                for(var i = 0; i < $scope.favoritesListB.length; i++){
                        if($scope.favoritesListB[i].bill_id == entry.bill_id){
                            index = i;
                            break;
                        }
                    }
                    if(index != -1){
                        $scope.favoritesListB.splice(index, 1);
                        localStorage.favoritesListB = JSON.stringify($scope.favoritesListB);
                    }
                entry.liked = false;
            }
            
            
            
            
            //The C table
            $scope.favoritesListC = [];
            var index = -1;
            if(localStorage.favoritesListC) {
                $scope.favoritesListC = JSON.parse(localStorage.favoritesListC);
            }
            $scope.toggleFavoriteC = function(entry){
                var index = -1;
                if(!entry.liked){
                    for(var i = 0; i < $scope.favoritesListC.length; i++){
                        if($scope.favoritesListC[i].committee_id == entry.committee_id){
                            index = i;
                            break;
                        }
                    }
                    if(index == -1){
                        $scope.favoritesListC.push(entry);
                        localStorage.favoritesListC = JSON.stringify($scope.favoritesListC);
                    }
                } else {
                    for(var i = 0; i < $scope.favoritesListC.length; i++){
                        if($scope.favoritesListC[i].committee_id == entry.committee_id){
                            index = i;
                            break;
                        }
                    }
                    if(index != -1){
                        $scope.favoritesListC.splice(index, 1);
                        localStorage.favoritesListC = JSON.stringify($scope.favoritesListC);
                    }
                }
                entry.liked = !entry.liked;
            }
            $scope.deleteFavoriteC = function(entry){
                for(var i = 0; i < $scope.favoritesListC.length; i++){
                        if($scope.favoritesListC[i].committee_id == entry.committee_id){
                            index = i;
                            break;
                        }
                    }
                    if(index != -1){
                        $scope.favoritesListC.splice(index, 1);
                        localStorage.favoritesListC = JSON.stringify($scope.favoritesListC);
                    }
                entry.liked = false;
            }
            
            //localStorage.clear();
            
            $(".toggle").click(function(){
                $(".sidebar").toggle();
            });
            $('.carousel').carousel({
                interval: false
            })
            $("#prevSlide1").click(function(){
                $scope.bigHeadline = $scope.currentTable;
                $scope.$apply();
                $("#myCarousel_L").carousel("prev");
            });
            $("#prevSlide2").click(function(){
                $scope.bigHeadline = $scope.currentTable;
                $scope.$apply();
                $("#myCarousel_B").carousel("prev");
            });
            
            
            });   


            //Second controller to control the pagination;
            myApp.controller('OtherController', function OtherController($scope) {
                $scope.pageChangeHandler = function(num) {
                console.log('going to page ' + num);
            };
            }); 

        //button set
        $(document).ready(function(){
        
      });