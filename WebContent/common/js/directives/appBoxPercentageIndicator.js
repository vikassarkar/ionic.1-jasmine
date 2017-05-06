"use strict";

define(["app"], function (app) {
    app.directive("appBoxPercentageIndicator",
        function () {
            return {
                restrict: 'A',
                scope:{
                	data:'='
                },
                replace: true, 
                transclude: true,
                link: function (scope, element, attrs) {
                    scope.usageData = scope.data;
                    element[0].style.height = element[0].offsetWidth + "px"
                    //add orentation change effect as well	
                    if (scope.data !== "unlimited") {
                        element[0].classList.add("app-percentage-box");
                        element[0].querySelector(".app-unused-value").style.height = scope.data + "%";
                    } else {
                        element[0].classList.add("app-unlimited-box");
                        element[0].querySelector(".app-unused-value").classList.add("hide");
                    }
                },
                templateUrl: "common/views/templates/appBoxPercentageIndicator.html"
            };
        }
    )
});




