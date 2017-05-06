"use strict";

define(['app'], function(app) {
	app.factory("loginService", ["$http", "$q",
		function($http, $q) {
			var checkUserDetails = function(method, url) {
				var deferred = $q.defer();
				$http({
					method: method,
					data: "",
					url: url,
					headers: {
						'Content-Type': 'application/json'
					}
				})
				.success(function(data) {
					deferred.resolve(data);
				})
				.error(function(data) {
					deferred.reject(data);
				});
				return deferred.promise;
			}
			return { 
				checkUserDetails : checkUserDetails 
			}
		}
	]);
});