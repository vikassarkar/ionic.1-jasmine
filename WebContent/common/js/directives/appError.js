
"use strict";

define(["app"], function(app) {
    app.directive("appError",
        function() {
            return {
                restrict: 'A',
                scope:{
                    error:'='
                },
                replace: true, 
                transclude: true,
                link: function(scope, element, attrs){
                    if(scope.error){
                        scope.error = scope.error;
                    }                   
                },
                templateUrl:"common/views/templates/appError.html"
            };
        }
    )
});




