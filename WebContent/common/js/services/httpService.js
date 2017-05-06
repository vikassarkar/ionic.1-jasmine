"use strict";

define(['app'], function(app) {
	app.factory("httpService", ["$http", "$q",
		function($http, $q) {
            var getServiceHandler = function(url) {
				var deferred = $q.defer();
				$http({
					method: "GET",
					url: url,
					headers: {
                        'Accept': 'application/json',
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
			};
            var setServiceHandler = function(method, url, data) {
				var deferred = $q.defer();
				$http({
					method: method,
					url: url,
                    data: data,
					headers: {
                        'Accept': 'application/json',
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
			};
			return { 
				getServiceHandler : getServiceHandler,
                setServiceHandler: setServiceHandler
			}
		}
	]);
});