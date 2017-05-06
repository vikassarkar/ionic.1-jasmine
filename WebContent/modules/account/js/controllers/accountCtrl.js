"use strict";

define(["app"], function (app) {
    app.controller("accountCtrl", ["$scope", "httpService", "$timeout", "serviceUrl",
        function ($scope, httpService, $timeout, serviceUrl) {
            
            $scope.showLoader = true;
            $scope.accountListView = true;           
            $scope.toggleView = function (view) {
                $scope.showLoader = true;
                if (view == "list") {
                    $scope.accountListView = true;
                    //$scope.showLoader = false;
                } else {
                    $scope.accountListView = false;
                    //$scope.showLoader = false;
                }
                $timeout(function () {
                   $scope.showLoader = false;
                }, 1000);
            }
            httpService.getServiceHandler(serviceUrl.uswest2.home.userDetails).then(
                function (response) {
                    console.log(response);
                    $scope.accountData = response;
                    $scope.showLoader = false;
                }, function (error) {
                    console.log(error);
                    $scope.accountData = "error";
                    if(error.Message){
                        $scope.errorMssg = error.Message;
                    }
                    $scope.showLoader = false;
                }
            );
        }])
});