"use strict";
define(["app"], function(app) {
	app.controller("billHistoryCtrl", ["$scope","httpService", "serviceUrl", function ($scope, httpService, serviceUrl) {

        $scope.dateData = [ 'Aug 2015', 'Sep 2015', 'Oct 2015'];
        $scope.arrow = false;
        $scope.showOuterLoader = true;
        $scope.showOuterError = false;
        var firstLoad = true;
        $scope.callDataService = function(date) {
            var pos = $scope.dateData.indexOf(date);
            pos = pos + 1;
            if(pos == ($scope.dateData.length )) {
                $scope.arrowRight = true;
            } else {
                $scope.arrowRight = false;
            }
            if(pos == 0) {
                $scope.arrowLeft = true;
            } else {
                $scope.arrowLeft = false;
            }
            $scope.dataDonut = '';
            $scope.barData = '';
            var dateConfig = date.split(" ");
            $scope.showBarLoader = true;
            $scope.showDonutLoader = true;
            //httpService.getServiceHandler(serviceUrl.uswest2.billHistory.allUserDetails+""+dateConfig[0]+"&Year="+dateConfig[1]).then(
            httpService.getServiceHandler(serviceUrl.uswest2.billHistory.allUserDetails).then(
                
                function (response) {
                    console.log(response);
                    $scope.barData = response.MonthWithBalance;
                    $scope.currMonth = dateConfig[0] + " " + dateConfig[1];
                    $scope.selectedMonth = dateConfig[0];
                    $scope.showBarLoader = false;
                    //httpService.getServiceHandler(serviceUrl.uswest2.billHistory.userDetails+""+dateConfig[0]+"&Year="+dateConfig[1]).then(
                    httpService.getServiceHandler(serviceUrl.uswest2.billHistory.userDetails).then(
                        function (response) {
                            console.log(response);
                            $scope.dataDonut = response.Subscribers;
                            $scope.showDonutLoader = false;
                            $scope.showOuterLoader = false;
                            $scope.showOuterError = true;
                        }, function (error) {
                            console.log(error);
                            $scope.dataDonut = "error";
                            $scope.showDonutLoader = false;
                            $scope.showOuterLoader = false;
                            $scope.showOuterError = true;
                        }
                    );
                    if($scope.dataDonut){
                        $scope.showOuterLoader = false;
                    }
                }, function (error) {
                    console.log(error);
                    $scope.barData = "error";
                    $scope.showBarLoader = false;
                    if(firstLoad){
                        $scope.showOuterLoader = false;
                        $scope.showOuterError = true;
                        firstLoad = false;
                    }
                }
            );



        }

        $scope.callDataService($scope.dateData[2])
        //$scope.monthArr = ['Jan 2015', 'Feb 2015', 'Mar 2015', 'Apr 2015','May 2015', 'Jun 2015', 'Jul 2015', 'Aug 2015', 'Sep 2015', 'Oct 2015', 'Nov 2015', 'Dec 2015']
        //$scope.currMonth = $scope.monthArr[0];
        $scope.leftCal = function() {
            var pos = $scope.dateData.indexOf($scope.currMonth);
            pos = pos - 1;
            if(pos == 0) {
                $scope.arrowLeft = true;
            } else {
                $scope.arrowLeft = false;
            }
            $scope.callDataService($scope.dateData[pos]);
        }
        $scope.rightCal = function() {
            var pos = $scope.dateData.indexOf($scope.currMonth);
            pos = pos + 1;
            if(pos == ($scope.dateData.length )) {
                $scope.arrowRight = true;
            } else {
                $scope.arrowRight = false;
            }
            $scope.callDataService($scope.dateData[pos]);
        }
       // document.getElementById($scope.selectedMonth).setAttribute('fill','#70e9f4')
    }])
});