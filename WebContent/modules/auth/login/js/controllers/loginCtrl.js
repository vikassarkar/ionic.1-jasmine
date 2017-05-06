"use strict";

define(["app", "loginService"], function(app) {
	app.controller("loginCtrl", ["$scope", "loginService", "$location", "serviceUrl", "$ionicPopup",
		function($scope, loginService, $location, serviceUrl, $ionicPopup) {
			
			$scope.login = function(user){
                var response = {
                    "userDetails": {
                        "1234512345": {
                            "email":"",
                            "password":"12345"
                        },
                        "1231231231": {
                            "email":"",
                            "password":"12312"
                        },
                        "9191919191": {
                            "email":"",
                            "password":"99999"
                        }}
                    }
				authenticateUserLogin(response, user);
			}
            function authenticateUserLogin(response, user){
				if(response.userDetails[user.username]){
					if(response.userDetails[user.username].password === user.password){
						$location.path("/home");
					}else{
						popupAlert("The number or password you entered is incorrect")
					}
				}
				else{
					popupAlert("The number or password you entered is incorrect")
				}
			}	
            function popupAlert(mssg){
                    var alertPopup = $ionicPopup.confirm({
                        title: 'Almost there!',
                        template: mssg,
                        buttons: [
                            { text: 'CANCEL' },
                            {
                                text: 'TRY AGAIN'

                            }
                        ]
                    });
                    alertPopup.then(function(res) {
                        console.log('failed to log in.....');
                    });
            }		
		}
	])
});