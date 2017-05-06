'use strict';

define([
  'app'
], function (app) {
  	app.config(function($ionicConfigProvider) {
        $ionicConfigProvider.backButton.previousTitleText(false).text(' ');
     });
});
