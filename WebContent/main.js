var require = {
  baseUrl: '',
  paths: {
        'app'                               : 'common/js/app',

        'ionic'                             : 'vendors/ionic/js/ionic.bundle.min',
        'd3'                                : 'vendors/d3/d3.min',

        'authCtrl'                          : 'common/js/controllers/authCtrl',
        'appMainCtrl'                       : 'common/js/controllers/appMainCtrl',
        'httpService'                       : 'common/js/services/httpService',

        'appMenu'                           : 'common/js/directives/appMenu',
        'appFooter'                         : 'common/js/directives/appFooter',
        'appLoading'                        : 'common/js/directives/appLoading',
        'appError'                          : 'common/js/directives/appError',
        'appAdvertisement'                  : 'common/js/directives/appAdvertisement',
        'appUserBalanceSummary'             : 'common/js/directives/appUserBalanceSummary',
        'appBoxPercentageIndicator'         : 'common/js/directives/appBoxPercentageIndicator',
        'doughnut'                          : 'common/js/directives/doughnut',
        'bar'                               : 'common/js/directives/bar',

        'loginCtrl'                         : 'modules/auth/login/js/controllers/loginCtrl',
        'loginService'                      : 'modules/auth/login/js/services/loginService',

        'homeCtrl'                          : 'modules/home/js/controllers/homeCtrl',

        'viewBillCtrl'                      : 'modules/viewBill/js/controllers/viewBillCtrl',

        'billHistoryCtrl'                   : 'modules/billHistory/js/controllers/billHistoryCtrl',

        'accountCtrl'                       : 'modules/account/js/controllers/accountCtrl'
  },  
  shim: {
  },
  priority: [
        'ionic'
  ]
};


