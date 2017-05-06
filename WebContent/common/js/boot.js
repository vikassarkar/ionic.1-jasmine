// requires routes, config, run they implicit requiring the app
require([
  'modules/routes',
  'common/js/config',
  'common/js/run',
  'common/js/constants'
], function () {
  'use strict';
  // Here you have to set your app name to bootstrap it manually
  angular.bootstrap(document, ['app']);
});
