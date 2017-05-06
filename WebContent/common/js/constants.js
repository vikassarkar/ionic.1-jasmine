'use strict';

define([
  'app'
], function (app) {
  	app.constant('$ionicLoadingConfig', {
        template: "<div class='app-loader'><div class='app-ripple-gif'><div></div><div></div></div></span></div>"
    });
    
    app.constant('serviceUrl',{
        pansingh02: {
            adv: 'http://pansingh02v:8585/api/Advertisement/getadd',
            home:{
                userDetails:"http://pansingh02v:8585/api/Invoice/CurrentBill?AccountInternalId=103"
            },
            viewBill:{
                userData:"http://pansingh02v:8585/api/Invoice/ViewBill?AccountInternalId=103"
            },
            billHistory:{
                allUserDetails:"http://pansingh02v:8585/api/Invoice/BillHistory?AccountInternalId=103&Month=",
                userDetails:"http://pansingh02v:8585/api/Invoice/ViewBillByMonth?AccountInternalId=103&Month="
            },
            account:{
                userDetails:"http://pansingh02v:8585/api/Invoice/CurrentBill?AccountInternalId=103"
            }
        },
        uswest2:{
            adv: 'http://pansingh02v:8585/api/Advertisement/getadd',
            home:{
                userDetails:"http://kcpoc.us-west-2.elasticbeanstalk.com/api/Invoice/CurrentBill?AccountInternalId=406"
            },
            viewBill:{
                userData:"http://kcpoc.us-west-2.elasticbeanstalk.com/api/Invoice/ViewBill?AccountInternalId=406"
            },
            billHistory:{
                allUserDetails:"http://kcpoc.us-west-2.elasticbeanstalk.com/api/Invoice/BillHistory?AccountInternalId=406&Month=",
                userDetails:"http://kcpoc.us-west-2.elasticbeanstalk.com/api/Invoice/ViewBillByMonth?AccountInternalId=406&Month="
            },
            account:{
                userDetails:"http://kcpoc.us-west-2.elasticbeanstalk.com/api/Invoice/CurrentBill?AccountInternalId=406"
            }
        },
        mockdata: {
            adv: 'http://pansingh02v:8585/api/Advertisement/getadd',
            home: {
                userDetails: "mockdata/home.json"
            },
            viewBill: {
                userData: "mockdata/viewBill.json"
            },
            billHistory: {
                userDetails: "mockdata/billHistoryDounut.json",
                allUserDetails: "mockdata/billHistoryBar.json"
            },
            account: {
                userDetails: "mockdata/home.json"
            }
        }
    })
});
