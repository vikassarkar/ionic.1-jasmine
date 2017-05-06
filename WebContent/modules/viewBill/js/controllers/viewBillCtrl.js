"use strict";
define(["app"], function (app) {
    app.controller("viewBillCtrl", ["$scope", "httpService", "serviceUrl", function ($scope, httpService, serviceUrl) {
        $scope.showLoader = true;
        httpService.getServiceHandler(serviceUrl.uswest2.viewBill.userData).then(
            function (response) {
                console.log(response);
                $scope.userBalanceSummary = response.userDetails;
                $scope.dataDonut = response.subscribers;
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