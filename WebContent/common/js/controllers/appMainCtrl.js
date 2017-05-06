"use strict";

define(["app"], function(app) {
    app.controller("appMainCtrl",  ["$scope", "$ionicNavBarDelegate", "$window",
        function($scope, $ionicNavBarDelegate, $window) {
			var userAgent = $window.navigator.userAgent || $window.navigator.vendor;
			if(userAgent.match( /Android/i )){
				$ionicNavBarDelegate.showBackButton(false);
			}
			$scope.menuShown = false;
			$scope.toggleMenu = function() {
				$scope.menuShown = !$scope.menuShown;
			};
        }
    ])
});
