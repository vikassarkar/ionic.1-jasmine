"use strict";

define(["app"], function(app) {
    app.directive("appAdvertisement", ["httpService", "serviceUrl",
        function(httpService, serviceUrl) {
            return {
                restrict: 'A',
                replace: true, 
                transclude: true,
                link: function(scope, element, attrs){
                    httpService.getServiceHandler(serviceUrl.local.adv).then(
                        function (response) {
                            element[0].innerHTML = response;
                        }, function (error) {

                        }
                    );
                }
            };
        }
    ])
});