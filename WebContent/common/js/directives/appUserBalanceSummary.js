"use strict";

define(["app"], function (app) {
    app.directive("appUserBalanceSummary",
        function () {
            return {
                restrict: 'A',
                scope:{
                	data:'='
                },
                replace: true, 
                transclude: true,
                templateUrl: "common/views/templates/appUserBalanceSummary.html",
                link: function (scope, element, attrs) {
                	scope.userDetails = scope.data;
                }
            };
        }
    )
});




