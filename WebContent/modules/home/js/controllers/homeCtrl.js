"use strict";
define(["app"], function (app) {
    app.controller("homeCtrl", ["$scope", "httpService", "serviceUrl",
        function ($scope, httpService, serviceUrl) {
            $scope.showLoader = true;
            httpService.getServiceHandler(serviceUrl.uswest2.home.userDetails).then(
                function (response) {
                    console.log(response);
                    $scope.userBalanceSummary = response;
                    $scope.showLoader = false;
                }, function (error) {
                    console.log(error);
                    $scope.userBalanceSummary = "error";
                    if(error.Message){
                        $scope.errorMssg = error.Message;
                    }
                    $scope.showLoader = false;
                }
                );

        }])
});
