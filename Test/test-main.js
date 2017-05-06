var tests = [];
for (var file in window.__karma__.files) {
    if (/Spec\.js$/.test(file)) {
        tests.push(file);
    }
}

/*below code will add external & notify properties to window required by HAWK.js*/
window.external = {};
window.external.notify = function(arg1,arg2,arg3) {console.log('external notify called ->',arg1,arg2,arg3)}

var source = "../WebContent/";

require.config({
  baseUrl: '/base/src',
  paths: {
        'app'                               : source+'common/js/app',

        'ionic'                             : source+'vendors/ionic/js/ionic.bundle.min',
        'd3'                                : source+'vendors/d3/d3.min',

        'authCtrl'                          : source+'common/js/controllers/authCtrl',
        'appMainCtrl'                       : source+'common/js/controllers/appMainCtrl',
        'httpService'                       : source+'common/js/services/httpService',

        'appMenu'                           : source+'common/js/directives/appMenu',
        'appFooter'                         : source+'common/js/directives/appFooter',
        'appLoading'                        : source+'common/js/directives/appLoading',
        'appError'                          : source+'common/js/directives/appError',
        'appAdvertisement'                  : source+'common/js/directives/appAdvertisement',
        'appUserBalanceSummary'             : source+'common/js/directives/appUserBalanceSummary',
        'appBoxPercentageIndicator'         : source+'common/js/directives/appBoxPercentageIndicator',
        'doughnut'                          : source+'common/js/directives/doughnut',
        'bar'                               : source+'common/js/directives/bar',

        'loginCtrl'                         : source+'modules/auth/login/js/controllers/loginCtrl',
        'loginService'                      : source+'modules/auth/login/js/services/loginService',

        'homeCtrl'                          : source+'modules/home/js/controllers/homeCtrl',

        'viewBillCtrl'                      : source+'modules/viewBill/js/controllers/viewBillCtrl',

        'billHistoryCtrl'                   : source+'modules/billHistory/js/controllers/billHistoryCtrl',

        'accountCtrl'                       : source+'modules/account/js/controllers/accountCtrl',

        'angularMock'                       : source+'vendors/angular-mocks/angular-mocks'
  },  
  shim: {
    'angularMock': ['ionic'],
    'app': ['angularMock']
  },
  priority: [
        'ionic'
  ],
  deps: tests,

  // start test run, once Require.js is done
  callback: window.__karma__.start
});


