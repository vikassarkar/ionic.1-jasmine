  'use strict';

  define([
      'app',
      'd3',
      'authCtrl',
      'appMainCtrl',
      'httpService',
      'appMenu',
      'appFooter',
      'appLoading',
      'appError',
      'appAdvertisement',
      'appUserBalanceSummary',
      'appBoxPercentageIndicator',
      'doughnut',
      'bar',
      'loginCtrl',
      'homeCtrl',
      'viewBillCtrl',
      'billHistoryCtrl',
      'accountCtrl'
      
  ], function(app) {
      
      app.config([
          '$stateProvider',
          '$urlRouterProvider',
          function($stateProvider, $urlRouterProvider) {
              $urlRouterProvider.otherwise('/login');
              $stateProvider
                  .state('auth', {
                      url: '',
                      abstract: true,
                      templateUrl: 'common/views/auth.html',
                      controller: 'authCtrl'
                  })
                  .state('auth.login', {
                      url: '/login',
                      views:{
                        'authContent': {
                          templateUrl: 'modules/auth/login/views/login.html',
                          controller: 'loginCtrl'
                        }
                      }                      
                  })
                  .state('auth.signup', {
                      url: '/signup',
                      views:{
                        'authContent': {
                          templateUrl: 'modules/auth/signup/views/signup.html'
                        }
                      }
                  })
                  .state('auth.resetPassword', {
                      url: '/resetPassword',
                      views:{
                        'authContent': {
                          templateUrl: 'modules/auth/resetPassword/views/resetPassword.html'
                        }
                      }
                  })
                  .state('app', {
                      url: '',
                      abstract: true,
                      templateUrl: 'common/views/app.html',
                      controller: 'appMainCtrl'
                  })
                  .state('app.home', {
                      url: '/home',
                      views:{
                        'appContent': {
                          templateUrl: 'modules/home/views/home.html',
                          controller: 'homeCtrl'
                        }
                      }
                  })
                  .state('app.billHistory', {
                      url: '/billHistory',
                      views: {
                          'appContent': {
                              templateUrl: 'modules/billHistory/views/billHistory.html',
                              controller: 'billHistoryCtrl'
                          }
                      }
                  })
                  .state('app.viewBill', {
                      url: '/viewBill',
                      views: {
                          'appContent': {
                              templateUrl: 'modules/viewBill/views/viewBill.html',
                              controller: 'viewBillCtrl'
                          }
                      }
                  })
                  .state('app.account', {
                      url: '/account',
                      views: {
                          'appContent': {
                              templateUrl: 'modules/account/views/account.html',
                              controller: 'accountCtrl'
                          }
                      }
                  });
          }
      ]);
  });
