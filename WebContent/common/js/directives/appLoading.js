
"use strict";

define(["app"], function(app) {
    app.directive("appLoading",
        function() {
            return {
                restrict: 'E',
                scope:{
                    loader:'='
                },
                replace: true, 
                transclude: true,
                link: function(scope, element, attrs){
                    if(scope.loader){
                         scope.loader = scope.loader;
                    }
                },
                templateUrl:"common/views/templates/appLoading.html"
            };
        }
    )
});




