
"use strict";

define(["app"], function(app) {
    app.directive("appFooter",
        function() {
            return {
                restrict: 'A',
                replace: true, 
                transclude: true,
                link: function(scope, element, attrs){},
                templateUrl:"common/views/templates/appFooter.html"
            };
        }
    )
});




