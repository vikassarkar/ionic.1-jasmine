define(['app', 'appMainCtrl'], function() {
    describe('appMainCtrl', function() {

        var createController, windowRef, ionicNavBarDelegateSpy, scopeRef;

        // Set up the module
        beforeEach(module('app'));

        beforeEach(inject(function($injector) {

            var $rootScope = $injector.get('$rootScope');
            var $controller = $injector.get('$controller');
            scopeRef = $rootScope.$new();
            windowRef = $injector.get('$window');
            
            //set spy on object for assertion
            ionicNavBarDelegateSpy = $injector.get('$ionicNavBarDelegate');
            spyOn(ionicNavBarDelegateSpy, 'showBackButton');

            createController = function() {
                return $controller('appMainCtrl', {
                    '$scope': scopeRef,
                    '$ionicNavBarDelegate': ionicNavBarDelegateSpy,
                    '$window': windowRef
                });
            };
        }));
        
        it("should disable back button for android", function() {
            console.log("running 1st test for appMainCtrl");
            windowRef.navigator = {
                userAgent: "Android"
            };
            var controller = createController();
            expect(ionicNavBarDelegateSpy.showBackButton).toHaveBeenCalledWith(false);
        });
        
        it("should disable back button for android using navigator", function() {
            console.log("running 1st test for appMainCtrl");
            windowRef.navigator = {
                vendor: "Android"
            };
            var controller = createController();
            expect(ionicNavBarDelegateSpy.showBackButton).toHaveBeenCalledWith(false);
        
        });

        it("should not disable back button if not android", function() {
            windowRef.navigator = {
                userAgent: "iPhone"
            };
            var controller = createController();
            expect(ionicNavBarDelegateSpy.showBackButton).not.toHaveBeenCalled();
        
        });

        it("should toggle menu", function() {            
            var controller = createController();
            scopeRef.toggleMenu();
            expect(scopeRef.menuShown).toBe(true);
        
        });
    });
});