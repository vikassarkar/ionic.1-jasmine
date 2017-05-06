"use strict";

define(["app"], function (app) {
    app.directive("appMenu",
        function ($timeout, $location) {
            return {
                restrict: 'A',
                scope: {
                    show: '='
                },
                replace: true, // Replace with the template below
                transclude: true, // we want to insert custom content inside the directive
                link: function (scope, element, attrs) {
                    var location = $location.path().split("/")[1];
                    var activeLink = element[0].querySelector("a[ui-sref='app." + location + "']");
                    if(activeLink){
                        activeLink.classList.add("active-menu");
                    }
                    scope.hideMenu = function () {

                        var el =  element[0].querySelector(".menu-dialog");
                        el.classList.add("out");
                        $timeout(function () {
                            el.classList.remove("out");
                            scope.show = false;
                        }, 310);
                    };

                    scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

                        var deActiveLink = element[0].getElementsByClassName("menu-link");
                        var activeLink = element[0].querySelector("a[ui-sref='" + toState.name + "']");
                        angular.forEach(deActiveLink, function (value, key) {
                             deActiveLink[key].classList.remove("active-menu");
                        });
                        if(activeLink){
                            activeLink.classList.add("active-menu");
                        }
                    });
                },
                templateUrl: "common/views/templates/appMenu.html"
            };
        }
    )
});




