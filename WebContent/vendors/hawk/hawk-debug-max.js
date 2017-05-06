// Initialization
var deviceapis = new Object();
deviceapis.pim = new Object();
deviceapis._isReady = false;
deviceapis._utils = new Object();
deviceapis._version = "9.4.0-26.0.5 (201511261300)";

// Readiness
deviceapis.ready = function(callback)
{
	deviceapis.ready._callback = callback;
	if (deviceapis._isReady) {
		deviceapis.ready._callback();
	}
};

deviceapis._setReady = function()
{
	deviceapis._isReady = true;
	if (deviceapis.ready._callback != undefined) {
		deviceapis.ready._callback();
	}
};
/*global deviceapis */
/*global callDeviceAPI */

// Error
function Error(type, message)
{
	this.type = type;
	this.message = message;
}
/*global deviceapis */

// Fake bridge
deviceapis._bridge = new Object();
deviceapis._bridge._initialize = function(callback) {
	callback();	
};

// Device APIs - DEBUG
deviceapis.debug = new Object();
deviceapis.debugdata = new Object();
deviceapis.debugcontext = new Object();

function callDeviceAPI(API, parameters)
{
    if (API == "ACCELEROMETER") {
    	callACCELEROMETERDeviceAPI(parameters);
    } else if (API == "APPLICATION") {
    	callAPPLICATIONDeviceAPI(parameters);
    } else if (API == "AUGMENTEDREALITY") {
    	callAUGMENTEDREALITYDeviceAPI(parameters);
    } else if (API == "BARCODE") {
    	callBARCODEDeviceAPI(parameters);
    } else if (API == "CALENDAR") {
    	callCALENDARDeviceAPI(parameters);
    } else if (API == "CALL") {
    	DeviceAPI(parameters);
    } else if (API == "CAPTURE") {
    	callCAPTUREDeviceAPI(parameters);
    } else if (API == "CONTACTS") {
    	callCONTACTSDeviceAPI(parameters);
    } else if (API == "CONTEXT") {
    	callCONTEXTDeviceAPI(parameters);
    } else if (API == "DATEPICKER") {
    	callDATEPICKERDeviceAPI(parameters);
    } else if (API == "DEBUG") {
    	callDEBUGDeviceAPI(parameters);
    } else if (API == "DEVICE") {
    	callDEVICEDeviceAPI(parameters);
    } else if (API == "ENGINE") {
    	callENGINEDeviceAPI(parameters);
    } else if (API == "FEATURES") {
    	callFEATURESDeviceAPI(parameters);
    } else if (API == "FILESYSTEM") {
    	callFILESYSTEMDeviceAPI(parameters);
    } else if (API == "SYSTEM") {
    	callSYSTEMDeviceAPI(parameters);
    } else if (API == "GEOLOCATION") {
    	callGEOLOCATIONDeviceAPI(parameters);
    } else if (API == "LOG") {
    	callLOGDeviceAPI(parameters);
    } else if (API == "MESSAGING") {
    	callMESSAGINGDeviceAPI(parameters);
    } else if (API == "NETWORK") {
    	callNETWORKDeviceAPI(parameters);
    } else if (API == "NETWORKACTIVITYINDICATOR") {
    	callNETWORKACTIVITYINDICATORDeviceAPI(parameters);
    } else if (API == "NOTIFICATION") {
    	callNOTIFICATIONDeviceAPI(parameters);
    } else if (API == "ORIENTATION") {
    	callORIENTATIONDeviceAPI(parameters);
    } else if (API == "QUIT") {
    	callQUITDeviceAPI(parameters);
    } else if (API == "SCREENORIENTATION") {
    	callSCREENORIENTATIONDeviceAPI(parameters);
    } else if (API == "SMS") {
    	callSMSDeviceAPI(parameters);
    } else if (API == "UPLOAD") {
    	callUPLOADDeviceAPI(parameters);
    } else if (API == "VIBRATE") {
    	callVIBRATEDeviceAPI(parameters);
    } else if (API == "VOLUME") {
    	callVOLUMEDeviceAPI(parameters);
    } else if (API == "TRACKING") {
    	callTRACKINGDeviceAPI(parameters);
    } else if (API == "WAP") {
    	callWAPDeviceAPI(parameters);
    } else if (API == "WEBCMD.PRINTDOC") {
    	callPrintDeviceAPI(parameters);   
    } else if (API == "WEBCMD.SHARE") {
    	callSHAREDeviceAPI(parameters);
    } else if (API == "WEBCMD.SECURESTORAGE") {
    	callSECURESTORAGEDeviceAPI(parameters);
    } else if (API == "LAYOUT") {
        callLAYOUTDeviceAPI(parameters);
    } else {
    	alert("ERROR: Unknown Device API");
    }
}

function callACCELEROMETERDeviceAPI(parameters)
{
	var x, y, z;

	// parameters
	var action = deviceapis._utils.getParameterValue(parameters, "action"); 
	var id = deviceapis._utils.getParameterValue(parameters, "id"); 
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback"); 
	//var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");
	var callback = deviceapis._utils.getParameterValue(parameters, "callback");

	// controls
	if (action===null) {
		alert("ERROR: [ACCELEROMETER] Action missing");
		return;	
	} else if ((action!=="get") && (action!=="watch") && (action!=="clear")) {
		alert("ERROR: [ACCELEROMETER] Action invalid: "+action);
		return;	
	} else if (((action==="watch") || (action==="clear")) && (id===null)) {
		alert("ERROR: [ACCELEROMETER] Id missing");
		return;
	} else if (((action==="get") || (action==="watch")) && (onSuccessCallback===null)) {
		alert("ERROR: [ACCELEROMETER] On success callback missing");
		return;
	}

	// simulation
	if (action==="get") {
		if (deviceapis.debugdata.accelerometer != undefined) {
			x = deviceapis.debugdata.accelerometer.x;
			y = deviceapis.debugdata.accelerometer.y;
			z = deviceapis.debugdata.accelerometer.z;
		} else {
			x = Math.round((Math.random()*20-10)*10)/10;
			y = Math.round((Math.random()*20-10)*10)/10;
			z = Math.round((Math.random()*20-10)*10)/10;
		}
		eval(onSuccessCallback+"('"+x+"','"+y+"','"+z+"')");
	} else if (action==="watch") {
		if (deviceapis.debugdata.accelerometer != undefined) {
			x = deviceapis.debugdata.accelerometer.x;
			y = deviceapis.debugdata.accelerometer.y;
			z = deviceapis.debugdata.accelerometer.z;
		} else {
			x = Math.round((Math.random()*20-10)*10)/10;
			y = Math.round((Math.random()*20-10)*10)/10;
			z = Math.round((Math.random()*20-10)*10)/10;
		}
		eval(onSuccessCallback+"('"+id+"','"+x+"','"+y+"','"+z+"')");
	} else if (action==="clear") {
		eval(callback+"("+id+")");
	}
}

function callAPPLICATIONDeviceAPI(parameters)
{
	// parameters
	var action = deviceapis._utils.getParameterValue(parameters, "action"); 
	var callback = deviceapis._utils.getParameterValue(parameters, "callback"); 
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback");
	var onCancelCallback = deviceapis._utils.getParameterValue(parameters, "onCancelCallback");
	var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");
	// Dialog
	var type = deviceapis._utils.getParameterValue(parameters, "type");
	var title = decodeURIComponent(deviceapis._utils.getParameterValue(parameters, "title"));
	var message = decodeURIComponent(deviceapis._utils.getParameterValue(parameters, "message"));
	var button1Label = decodeURIComponent(deviceapis._utils.getParameterValue(parameters, "button1Label"));
	var button2Label = decodeURIComponent(deviceapis._utils.getParameterValue(parameters, "button2Label"));

	// controls
	if (action===null) {
		alert("ERROR: [APPLICATION] Action missing");
		return;	
	} else if ((action!=="getID") && (action!=="getVersion") && (action!=="checkUpdateAvailability") && (action!=="downloadUpdate") && (action!=="applyUpdate") && (action!=="hideSplashScreen") && (action!=="listenBackKey") && (action!=="quit") && (action!=="showDialog")) {
		alert("ERROR: [APPLICATION] Action invalid: "+action);
		return;	
	} else if (((action==="getID") || (action==="getVersion")) && (callback===null)) {
		alert("ERROR: [APPLICATION] Callback missing");
		return;
	}  else if ((action==="checkUpdateAvailability") && (onSuccessCallback===null)) {
		alert("ERROR: [APPLICATION] On success callback missing");
		return;
	}  else if ((action==="downloadUpdate") && (onSuccessCallback===null)) {
		alert("ERROR: [APPLICATION] On success callback missing");
		return;
	}   else if ((action==="applyUpdate") && (onSuccessCallback===null)) {
		alert("ERROR: [APPLICATION] On success callback missing");
		return;
	} else if ((action==="showDialog") && (type===null)) {
		alert("ERROR: [APPLICATION] Dialog - type missing");
		return;
	} else if ((action==="showDialog") && (title===null)) {
		alert("ERROR: [APPLICATION] Dialog - title missing");
		return;
	} else if ((action==="showDialog") && (message===null)) {
		alert("ERROR: [APPLICATION] Dialog - message missing");
		return;
	} else if ((action==="showDialog") && (button1Label===null)) {
		alert("ERROR: [APPLICATION] Dialog - button1Label missing");
		return;
	} else if ((action==="showDialog") && (type==="confirm") && (button2Label===null)) {
		alert("ERROR: [APPLICATION] Dialog - button2Label missing");
		return;
	} else if ((action==="showDialog") && (type==="confirm") && (onSuccessCallback===null)) {
		alert("ERROR: [APPLICATION] Dialog - onSuccessCallback missing");
		return;
	}

	// simulation
	if (action==="getID") {
		var id;
		if (deviceapis.debugdata.application != undefined) {
			version = deviceapis.debugdata.application.id;
		} else {
			id = "myapp";
		}
		eval(callback+"('"+id+"')");
	} else if (action==="getVersion") {
		var version;
		if (deviceapis.debugdata.application != undefined) {
			version = deviceapis.debugdata.application.version;
		} else {
			version = "1.0.0";
		}
		eval(callback+"('"+version+"')");
	} else if (action==="checkUpdateAvailability") {
		var updateVersion;
		var updateMandatory;
		var updateRelease;
		if (deviceapis.debugdata.application != undefined) {
			updateVersion = deviceapis.debugdata.application.updateVersion;
			updateMandatory = deviceapis.debugdata.application.updateMandatory;
			updateRelease = deviceapis.debugdata.application.updateRelease;
		} else {
			updateVersion = "1.1.0";
			updateMandatory = true;
			updateRelease = false;
		}
		eval(onSuccessCallback+"('"+updateVersion+"',"+updateMandatory+","+updateRelease+")");
	} else if (action==="downloadUpdate") {
		eval(onSuccessCallback+"()");
	} else if (action==="applyUpdate") {
		eval(onSuccessCallback+"()");
	} else if (action==="hideSplashScreen") {
		alert("Splash screen hidden");
	} else if (action==="listenBackKey") {
		alert("Back key listened");
	} else if (action==="quit") {
		document.write("<!DOCTYPE html><html><body><p>Application quitted.</p></body></html>");
	} else if (action==="showDialog") {
		if (type==="alert") {
			window.alert(message);
			eval(onSuccessCallback+"()");
		}
		else if (type==="confirm") {
			var res = window.confirm(message);
			if (res===true) {
				eval(onSuccessCallback+"()");
			} else {
				eval(onCancelCallback+"()");
			}
		}
	}
}

function callAUGMENTEDREALITYDeviceAPI(parameters)
{
	// parameters
	var ids = decodeURIComponent(deviceapis._utils.getParameterValue(parameters, "ids"));
	var labels = decodeURIComponent(deviceapis._utils.getParameterValue(parameters, "labels"));
	var latitudes = deviceapis._utils.getParameterValue(parameters, "latitudes");
	var longitudes = deviceapis._utils.getParameterValue(parameters, "longitudes");
	var altitudes = deviceapis._utils.getParameterValue(parameters, "altitudes");
	var callback = deviceapis._utils.getParameterValue(parameters, "callback");
	
	// controls
	if ((ids===null) || (labels===null) || (latitudes===null) || (longitudes===null) || (altitudes===null)) {
		alert("ERROR: [AUGMENTEDREALITY] POIs missing");
		return;
	}
	
	// simulation
	var idsArray = ids.split(";");
	var labelsArray = labels.split(";");
	var latitudesArray = latitudes.split(";");
	var longitudesArray = longitudes.split(";");
	var altitudesArray = altitudes.split(";");
	
	var ardiv = document.createElement("div");
	ardiv.setAttribute("id", "ar-debug");
	ardiv.setAttribute("style", "z-index:1000; position:absolute; top:0; bottom:0; left:0; width:100%; background:#ffffff;");
	var innerHTML = "<div style='clear:both'>";
	var poisNumber = idsArray.length;
	for (var i=0; i<poisNumber; i++) {
		if (i>0) {
			innerHTML += "<br/><br/>";
		}
		innerHTML += "<a href=\"javascript:document.getElementById('ar-debug').parentNode.removeChild(document.getElementById('ar-debug'));"+callback+"('"+idsArray[i]+"');\">"+labelsArray[i]+"<br/>("+latitudesArray[i]+", "+longitudesArray[i]+", "+altitudesArray[i]+")</a>";
		
	}
	innerHTML += "</div>";
	innerHTML += "<div style='float:right'><a href=\"javascript:document.getElementById('ar-debug').parentNode.removeChild(document.getElementById('ar-debug'));"+callback+"();\">Close A/R</a></div>";
	ardiv.innerHTML = innerHTML;
	document.body.appendChild(ardiv);
}

function callBARCODEDeviceAPI(parameters)
{
	// parameters
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback");
	var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");
	
	// controls
	if (onSuccessCallback===null) {
		alert("ERROR: [BARCODE] On success callback missing");
		if (onFailureCallback!=null) {
			eval(onFailureCallback+"()");
		}
		return;
	}
	
	// simulation
	if (onSuccessCallback!=null) {
		var text, type;
		if (deviceapis.debugdata.barcode != undefined) {
			text = deviceapis.debugdata.barcode.text;
			type = deviceapis.debugdata.barcode.type;
		} else {
			text = "barcode text";
			type = "barcode type";
		}
		eval(onSuccessCallback+"('"+text+"','"+type+"')");
	}
}

function DeviceAPI(parameters)
{
	// parameters
	var number = decodeURIComponent(deviceapis._utils.getParameterValue(parameters, "number"));
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback");
	var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");
	
	// controls
	if (number===null) {
		alert("ERROR: [CALL] Number missing");
		if (onFailureCallback!=null) {
			eval(onFailureCallback+"()");
		}
		return;
	}
	
	// simulation
	alert("Calling " + number + "...");
	if (onSuccessCallback!=null) {
		eval(onSuccessCallback+"()");
	}
}

function callCALENDARDeviceAPI(parameters)
{
	// parameters
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback");
	//var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");
	var filter = deviceapis._utils.getParameterValue(parameters, "filter");
	
	// controls
	if (onSuccessCallback===null) {
		alert("ERROR: [CALENDAR] On success callback missing");
		return;
	}
	
	// data
	var eventsJSON;
	if (deviceapis.debugdata.calendar != undefined) {
		eventsJSON = deviceapis.debugdata.calendar;
	} else {
		eventsJSON = '{"events":[' +
			'{"startDate":"1325376000","summary":"New year","description":"Happy New Year!","rrule":"FREQ=YEARLY"},' +
			'{"startDate":"1325419200","summary":"Call mom","description":"","rrule":"FREQ=DAILY;UNTIL=20140101T183015"},' +
			'{"startDate":"1331812800","summary":"Lunch with friends","description":"","rrule":""},' +
			'{"startDate":"1331841600","summary":"Inauguration","description":"","rrule":""},' +
			'{"startDate":"1341100800","summary":"Summer holidays!","description":"","rrule":""},' +
			'{"startDate":"1341136800","summary":"Car wash","description":"","rrule":""},' +
			'{"startDate":"1341176400","summary":"Party!","description":"","rrule":""},' +
			'{"startDate":"1355961600","summary":"Winter holidays!","description":"","rrule":""}' +
			']}';
	}
	
	// filter
	var events = JSON.parse(eventsJSON).events;
	var filteredEvents = new Array();
	if ((filter == null) || (filter == "undefined")) {
		filteredEvents = events;
	} else {
		var eventsFilter = JSON.parse(decodeURI(filter));
		for (var i=0; i<events.length; i++) {
			if ((deviceapis._utils.matchFilter(events[i].startDate, eventsFilter.startDate)) &&
					(deviceapis._utils.matchFilter(events[i].summary, eventsFilter.summary)) &&
					(deviceapis._utils.matchFilter(events[i].description, eventsFilter.description)) &&
					(deviceapis._utils.matchFilter(events[i].rrule, eventsFilter.rrule))) {
				filteredEvents.push(events[i]);
			}
		}
	}
	var filteredEventsJSON = "{\"events\":"+JSON.stringify(filteredEvents)+"}";
	
	// simulation
	eval(onSuccessCallback+"('"+filteredEventsJSON+"')");
}

function callCAPTUREDeviceAPI(parameters)
{
	// parameters
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback");
	var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");
	
	// controls
	if (onSuccessCallback===null) {
		alert("ERROR: [CAPTURE] On success callback missing");
		if (onFailureCallback!=null) {
			eval(onFailureCallback+"()");
		}
		return;
	}
	
	// simulation
	var path, data;
	if (deviceapis.debugdata.capture != undefined) {
		path = deviceapis.debugdata.capture.path;
		data = deviceapis.debugdata.capture.data;
	} else {
		path = "../media/hawk.jpg";
		data = "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%3D";
	}
	if (onSuccessCallback!=null) {
		eval(onSuccessCallback+"('"+path+"', '"+data+"')");
	}
}

function callCONTACTSDeviceAPI(parameters)
{
	// parameters
	var action = deviceapis._utils.getParameterValue(parameters, "action");
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback");
	//var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");
	//var filter = deviceapis._utils.getParameterValue(parameters, "filter");
	var contact = deviceapis._utils.getParameterValue(parameters, "contact");
	
	// controls
	if (action===null) {
		alert("ERROR: [CONTACTS] Action missing");
		return;
	} else if ((action!="find") && (action!="add")) {
		alert("ERROR: [CONTACTS] Action invalid: " + action);
		return;
	}
	if ((action==="find") && (onSuccessCallback===null)) {
		alert("ERROR: [CONTACTS] On success callback missing");
		return;
	}
	if ((action==="add") && (contact===null)) {
		alert("ERROR: [CONTACTS] Contact missing");
		return;
	}
	// data
	if (action == "find") {
		var contactsJSON;
		if (deviceapis.debugdata.contacts != undefined) {
			contactsJSON = deviceapis.debugdata.contacts;
		} else {
			contactsJSON = '{"contacts":[' +
			'{"firstName":"Raphaelle","secondName":"","lastName":"Alba","organizationName":"Amdocs","phoneNumbers":[{"number":"111222333","types":["PREF","MOBILE"],"label":"iPhone"},{"number":"444555666","types":["WORK"]},{"number":"777888999","types":["HOME"]}],"emails":[{"email":"raphaelle.alba@work.com","types":["PREF","WORK"]},{"email":"raphalba@home.com", "types":["HOME"]}]},' +
			'{"firstName":"Jack","secondName":"","lastName":"Bauer","organizationName":"Amdocs","phoneNumbers":[{"number":"111111111","types":["MOBILE"],"label":"iPhone"},{"number":"222222222","types":["PREF","WORK"]},{"number":"333333333","types":["HOME"]}],"emails":[{"email":"jack.bauer@work.com","types":["WORK"]},{"email":"jbauer@home.com","types":["PREF","HOME"]}]},' +
			'{"firstName":"Kourtney","secondName":"","lastName":"Brown","organizationName":"Amdocs","phoneNumbers":[{"number":"222222222","types":["PREF","MOBILE"],"label":"iPhone"},{"number":"333333333","types":["WORK"]},{"number":"444444444","types":["HOME"]}],"emails":[{"email":"kourtney.brown@work.com","types":["PREF","WORK"]},{"email":"kbrown@home.com", "types":["HOME"]}]},' +
			'{"firstName":"Colin","secondName":"","lastName":"Cassel","organizationName":"Amdocs","phoneNumbers":[{"number":"333333333","types":["MOBILE"],"label":"iPhone"},{"number":"444444444","types":["PREF","WORK"]},{"number":"555555555","types":["HOME"]}],"emails":[{"email":"colin.cassel@work.com","types":["WORK"]},{"email":"ccassel@home.com","types":["PREF","HOME"]}]},' +
			'{"firstName":"Erin","secondName":"","lastName":"Cruise","organizationName":"Amdocs","phoneNumbers":[{"number":"444444444","types":["PREF","MOBILE"],"label":"iPhone"},{"number":"555555555","types":["WORK"]},{"number":"666666666","types":["HOME"]}],"emails":[{"email":"erin.cruise@work.com","types":["PREF","WORK"]},{"email":"ecruise@home.com", "types":["HOME"]}]},' +
			'{"firstName":"Benoit","secondName":"","lastName":"Cyrus","organizationName":"Amdocs","phoneNumbers":[{"number":"555555555","types":["MOBILE"],"label":"iPhone"},{"number":"666666666","types":["PREF","WORK"]},{"number":"777777777","types":["HOME"]}],"emails":[{"email":"benoit.cyrus@work.com","types":["WORK"]},{"email":"bcyrus@home.com","types":["PREF","HOME"]}]},' +
			'{"firstName":"John","secondName":"Franck","lastName":"Doe","organizationName":"Amdocs","phoneNumbers":[{"number":"666666666","types":["PREF","MOBILE"],"label":"iPhone"},{"number":"777777777","types":["WORK"]},{"number":"888888888","types":["HOME"]}],"emails":[{"email":"john.doe@work.com","types":["PREF","WORK"]},{"email":"jdoe@home.com", "types":["HOME"]}]},' +
			'{"firstName":"Jane","secondName":"","lastName":"Doe","organizationName":"Amdocs","phoneNumbers":[{"number":"777777777","types":["MOBILE"],"label":"iPhone"},{"number":"888888888","types":["PREF","WORK"]},{"number":"999999999","types":["HOME"]}],"emails":[{"email":"janedoe@work.com","types":["WORK"]},{"email":"jdoe@home.com","types":["PREF","HOME"]}]},' +
			'{"firstName":"Laeticia","secondName":"","lastName":"Hodge","organizationName":"Amdocs","phoneNumbers":[{"number":"888888888","types":["PREF","MOBILE"],"label":"iPhone"},{"number":"999999999","types":["WORK"]},{"number":"000000000","types":["HOME"]}],"emails":[{"email":"laeticia.hodge@work.com","types":["PREF","WORK"]},{"email":"lhodge@home.com", "types":["HOME"]}]},' +
			'{"firstName":"Thierry","secondName":"","lastName":"John","organizationName":"Amdocs","phoneNumbers":[{"number":"999999999","types":["MOBILE"],"label":"iPhone"},{"number":"000000000","types":["PREF","WORK"]},{"number":"111111111","types":["HOME"]}],"emails":[{"email":"thierry.john@work.com","types":["WORK"]},{"email":"tjohn@home.com","types":["PREF","HOME"]}]},' +
			'{"firstName":"Katrina","secondName":"","lastName":"Kardashian","organizationName":"Amdocs","phoneNumbers":[{"number":"111222333","types":["PREF","MOBILE"],"label":"iPhone"},{"number":"444555666","types":["WORK"]},{"number":"777888999","types":["HOME"]}],"emails":[{"email":"katrina.kardashian@work.com","types":["PREF","WORK"]},{"email":"kkardashian@home.com", "types":["HOME"]}]},' +
			'{"firstName":"Michael","secondName":"","lastName":"Lopez","organizationName":"Amdocs","phoneNumbers":[{"number":"111111111","types":["MOBILE"],"label":"iPhone"},{"number":"222222222","types":["PREF","WORK"]},{"number":"333333333","types":["HOME"]}],"emails":[{"email":"michael.lopez@work.com","types":["WORK"]},{"email":"mlopez@home.com","types":["PREF","HOME"]}]},' +
			'{"firstName":"Mark","secondName":"","lastName":"McDoom","organizationName":"Amdocs","phoneNumbers":[{"number":"222222222","types":["PREF","MOBILE"],"label":"iPhone"},{"number":"333333333","types":["WORK"]},{"number":"444444444","types":["HOME"]}],"emails":[{"email":"mark.mcdoom@work.com","types":["PREF","WORK"]},{"email":"mmcdoom@home.com", "types":["HOME"]}]},' +
			'{"firstName":"David ","secondName":"","lastName":"Palermo","organizationName":"Amdocs","phoneNumbers":[{"number":"333333333","types":["MOBILE"],"label":"iPhone"},{"number":"444444444","types":["PREF","WORK"]},{"number":"555555555","types":["HOME"]}],"emails":[{"email":"david.palermo@work.com","types":["WORK"]},{"email":"dpalermo@home.com","types":["PREF","HOME"]}]},' +
			'{"firstName":"Soan","secondName":"","lastName":"Roland","organizationName":"Amdocs","phoneNumbers":[{"number":"444444444","types":["PREF","MOBILE"],"label":"iPhone"},{"number":"555555555","types":["WORK"]},{"number":"666666666","types":["HOME"]}],"emails":[{"email":"soan.roland@work.com","types":["PREF","WORK"]},{"email":"sroland@home.com", "types":["HOME"]}]},' +
			'{"firstName":"Lorant ","secondName":"","lastName":"Sebastien","organizationName":"Amdocs","phoneNumbers":[{"number":"555555555","types":["MOBILE"],"label":"iPhone"},{"number":"666666666","types":["PREF","WORK"]},{"number":"777777777","types":["HOME"]}],"emails":[{"email":"lorant.sebastien@work.com","types":["WORK"]},{"email":"lsebastien@home.com","types":["PREF","HOME"]}]},' +
			'{"firstName":"John","secondName":"","lastName":"Smith","organizationName":"Amdocs","phoneNumbers":[{"number":"666666666","types":["PREF","MOBILE"],"label":"iPhone"},{"number":"777777777","types":["WORK"]},{"number":"888888888","types":["HOME"]}],"emails":[{"email":"john.smith@work.com","types":["PREF","WORK"]}, {"email":"jsmith@home.com", "types":["HOME"]}]},' +
			'{"firstName":"Robert","secondName":"","lastName":"Stewart","organizationName":"Amdocs","phoneNumbers":[{"number":"777777777","types":["MOBILE"],"label":"iPhone"},{"number":"888888888","types":["PREF","WORK"]},{"number":"999999999","types":["HOME"]}],"emails":[{"email":"robert.stewart@work.com","types":["WORK"]},{"email":"rstewart@home.com","types":["PREF","HOME"]}]},' +
			'{"firstName":"Xavier","secondName":"Blake","lastName":"Williams","organizationName":"Amdocs","phoneNumbers":[{"number":"888888888","types":["PREF","MOBILE"],"label":"iPhone"},{"number":"999999999","types":["WORK"]},{"number":"000000000","types":["HOME"]}],"emails":[{"email":"xavier.williams@work.com","types":["PREF","WORK"]},{"email":"xwilliams@home.com", "types":["HOME"]}]}' +
			']}';
		}
	
		// simulation
		eval(onSuccessCallback+"('"+contactsJSON+"')");
	} else if (action == "add") {
		// simulation
		alert("Contact added");
		eval(onSuccessCallback+"()");
	}
}

function callCONTEXTDeviceAPI(parameters)
{
	// parameters
	var action = deviceapis._utils.getParameterValue(parameters, "action");
	var name = decodeURIComponent(deviceapis._utils.getParameterValue(parameters, "name"));
	var value = decodeURIComponent(deviceapis._utils.getParameterValue(parameters, "value"));
	var callback = deviceapis._utils.getParameterValue(parameters, "callback");
	
	// controls
	if (action===null) {
		alert("ERROR: [CONTEXT] Action missing");
		return;
	} else if ((action!=="save") && (action!=="load")) {
		alert("ERROR: [CONTEXT] Action invalid: "+action);
		return;
	} else if ((action==="save") && (name===null) && (value===null)) {
		alert("ERROR: [CONTEXT] Name to save and value to set missing");
		return;
	} else if ((action==="save") && (name===null)) {
		alert("ERROR: [CONTEXT] Name to save missing");
		return;
	} else if ((action==="save") && (value===null)) {
		alert("ERROR: [CONTEXT] Value to set missing");
		return;
	} else if ((action==="load") && (name===null) && (callback===null)) {
		alert("ERROR: [CONTEXT] Name to load and callback to get data missing");
		return;
	} else if ((action==="load") && (name===null)) {
		alert("ERROR: [CONTEXT] Name to load missing");
		return;
	} else if ((action==="load") && (callback===null)) {
		alert("ERROR: [CONTEXT] Callback to get data missing");
		return;
	}
	
	// simulation
	if (action==="save") {
		if (callback != undefined) {
			callback += "()";
			eval(callback);
		}
		alert("Saving data: " + name + " = " + value);
	} else if (action==="load") {
		if (deviceapis.debugdata.context != undefined) {
			value = "";
			for (var i=0; i<deviceapis.debugdata.context.names.length; i++) {
				if (name == deviceapis.debugdata.context.names[i]) {
					value = deviceapis.debugdata.context.values[i];
				}
			}
		} else {
			value = "test context data";
		}
		callback += "('" + value + "')";
		alert("Loading data: " + name + " = " + value);
		eval(callback);
	}
}

function callDATEPICKERDeviceAPI(parameters)
{
	// parameters
	var type = deviceapis._utils.getParameterValue(parameters, "type");
	var value = deviceapis._utils.getParameterValue(parameters, "value");
	var minvalue = deviceapis._utils.getParameterValue(parameters, "minvalue");
	var maxvalue = deviceapis._utils.getParameterValue(parameters, "maxvalue");
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback");
	var onCancelCallback = deviceapis._utils.getParameterValue(parameters, "onCancelCallback");
	//var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");
	
	// controls
	if (type===null) {
		alert("ERROR: [DATEPICKER] Type missing");
		return;
	} else if ((type!=="DATE") && (type!=="TIME")) {
		alert("ERROR: [DATEPICKER] Type invalid: "+type);
		return;
	} else if (value===null) {
		alert("ERROR: [DATEPICKER] Value missing");
		return;
	} else if (minvalue===null) {
		alert("ERROR: [DATEPICKER] Min value missing");
		return;
	} else if (maxvalue===null) {
		alert("ERROR: [DATEPICKER] Max value missing");
		return;
	} else if (onSuccessCallback===null) {
		alert("ERROR: [DATEPICKER] On success callback missing");
		return;
	} else if (onCancelCallback===null) {
		alert("ERROR: [DATEPICKER] On cancel callback missing");
		return;
	}
	
	// simulation
	alert("date picker displayed");
	deviceapis.utils.datepicker._displayCancel();
}

function callDEBUGDeviceAPI(parameters)
{
	// parameters
	var action = deviceapis._utils.getParameterValue(parameters, "action");
	var status = deviceapis._utils.getParameterValue(parameters, "status");
	var persistence = deviceapis._utils.getParameterValue(parameters, "persistence");
	var level = deviceapis._utils.getParameterValue(parameters, "level");
	var maxlines = deviceapis._utils.getParameterValue(parameters, "maxlines");
	var cleaning = deviceapis._utils.getParameterValue(parameters, "cleaning");
	var callback = deviceapis._utils.getParameterValue(parameters, "callback");
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback");
	//var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");
	
	var missingParameters = new Array();
	var message;
	
	// controls
	if (action===null) {
		alert("ERROR: [DEBUG] action missing");
		return;
	} else if ((action!=="getConfiguration") && (action!=="setConfiguration") && (action!=="start") && (action!=="stop") && (action!=="load") && (action!=="clean") && (action!=="post")) {
		alert("ERROR: [DEBUG] action invalid: "+action);
		return;
	} else if (action==="getConfiguration") {
		if (callback===null) {
			alert("ERROR: [DEBUG] callback to get configuration missing");
			return;
		}
	} else if (action==="setConfiguration") {
		if ((status===null) || (persistence===null) || (level===null) || (maxlines===null) || (cleaning===null)) {
			if (status===null) {
				missingParameters.push("status");
			}
			if (persistence===null) {
				missingParameters.push("persistence");
			}
			if (level===null) {
				missingParameters.push("level");
			}
			if (maxlines===null) {
				missingParameters.push("maxlines");
			}
			if (cleaning===null) {
				missingParameters.push("cleaning");
			}
			message = "";
			for (var i=0; i<missingParameters.length; i++) {
				if (message!="") {
					if (i===missingParameters.length-1) {
						message += " and ";
					} else {
						message += ", ";
					}
				}
				message += missingParameters[i];
			}
			message = "ERROR: [DEBUG] " + message + " to configure missing";
			alert(message);
			return;
		} else if ((status!=="on") && (status!=="off")) {
			alert("ERROR: [DEBUG] status to configure invalid: "+status);
			return;
		} else if ((persistence!=="on") && (persistence!=="off")) {
			alert("ERROR: [DEBUG] persistence to configure invalid: "+persistence);
			return;
		} else if ((level!=="fatal") && (level!=="error") && (level!=="warn") && (level!=="info") && (level!=="debug")) {
			alert("ERROR: [DEBUG] level to configure invalid: "+level);
			return;
		} else if (isNaN(maxlines)) {
			alert("ERROR: [DEBUG] maxlines to configure invalid: "+maxlines);
			return;
		} else if ((cleaning!=="none") && (cleaning!=="fifo") && (cleaning!=="post")) {
			alert("ERROR: [DEBUG] cleaning to configure invalid: "+cleaning);
			return;
		}
	} else if (action==="load") {
		if (callback===null) {
			alert("ERROR: [DEBUG] callback to load missing");
			return;
		}
	}
	
	// simulation
	if (action==="getConfiguration") {
		eval(callback+"('on', 'on', 'info', 50, 'fifo')");
	} else if (action==="setConfiguration") {
		alert("Debug logs configuration set:\n status: "+status+"\n persistence: "+persistence+"\n level: "+level+"\n maxlines: "+maxlines+"\n cleaning: "+cleaning);
		if ((callback!=null) && (callback!="")) {
			eval(callback+"()");
		}
	} else if (action==="start") {
		alert("Starting debug logs");
		if ((callback!=null) && (callback!="")) {
			eval(callback+"()");
		}
	} else if (action==="stop") {
		alert("Stopping debug logs");
		if ((callback!=null) && (callback!="")) {
			eval(callback+"()");
		}
	} else if (action==="load") {
		var logs = "{\"logs\":[{\"time\":\"1293840000\",\"level\":\"fatal\",\"log\":\"Fatal error\"},{\"time\":\"1293840000\",\"level\":\"error\",\"log\":\"Error\"},{\"time\":\"1293840000\",\"level\":\"warn\",\"log\":\"Warning\"},{\"time\":\"1293840000\",\"level\":\"info\",\"log\":\"Information\"},{\"time\":\"1293840000\",\"level\":\"debug\",\"log\":\"Debug\"}]}";
		eval(callback+"('"+logs+"')");
	} else if (action==="clean") {
		alert("Cleaning debug logs");
		if ((callback!=null) && (callback!="")) {
			eval(callback+"()");
		}
	} else if (action==="post") {
		alert("Posting debug logs");
		if ((onSuccessCallback!=null) && (onSuccessCallback!="")) {
			eval(onSuccessCallback+"()");
		}
	}
}

function callDEVICEDeviceAPI(parameters)
{
	// parameters
	var action = deviceapis._utils.getParameterValue(parameters, "action");
	var callback = deviceapis._utils.getParameterValue(parameters, "callback");
	
	// controls
	if (action==="getProperties") {
		if (callback===null) {
			alert("ERROR: [DEVICE] get properties callback missing");
			return;
		}
	} else if (action==="getIDs") {
		if (callback===null) {
			alert("ERROR: [DEVICE] get IDs callback missing");
			return;
		}
	}
	
	// simulation
	if (action==="getProperties") {
		var brand, model, os, screenWidth, screenHeight, translucentAreaWidth, translucentAreaHeight;
		if (deviceapis.debugdata.device != undefined) {
			brand = deviceapis.debugdata.device.brand;
			model = deviceapis.debugdata.device.model;
			os = deviceapis.debugdata.device.OS;
			screenWidth = deviceapis.debugdata.device.screenWidth;
			screenHeight = deviceapis.debugdata.device.screenHeight;
			translucentAreaWidth = deviceapis.debugdata.device.screenWidth;
			translucentAreaHeight = 20;
		} else {
			brand = "Brand";
			model = "Model";
			os = "OS";
			screenWidth = window.innerWidth;
			screenHeight = window.innerHeight;
			translucentAreaWidth = window.innerWidth;
			translucentAreaHeight = 20;
		}
		callback += "(";
		callback += "'" + brand + "'";
		callback += ",";
		callback += "'" + model + "'";
		callback += ",";
		callback += "'" + os + "'";
		callback += ",";
		callback += "'" + screenWidth + "'";
		callback += ",";
		callback += "'" + screenHeight + "'";
		callback += ",";
		callback += "'" + translucentAreaWidth + "'";
		callback += ",";
		callback += "'" + translucentAreaHeight + "'";
		callback += ")";
		eval(callback);
	} else if (action==="getIDs") {
		var udid, usid;
		if (deviceapis.debugdata.device != undefined) {
			udid = deviceapis.debugdata.device.UDID;
			usid = deviceapis.debugdata.device.USID;
		} else {
			udid = "UDID";
			usid = "USID";
		}
		callback += "(";
		callback += "'" + udid + "'";
		callback += ",";
		callback += "'" + usid + "'";
		callback += ")";
		eval(callback);		
	}
}

function callENGINEDeviceAPI(parameters)
{
	// parameters
	var callback = deviceapis._utils.getParameterValue(parameters, "callback");
	
	// controls
	if (callback===null) {
		alert("ERROR: [ENGINE] Callback missing");
		return;
	}
	
	// simulation
	var version;
	if (deviceapis.debugdata.engine != undefined) {
		version = deviceapis.debugdata.engine.version;
	} else {
		version = "test";
	}
	callback += "(";
	callback += "'" + version + "'";
	callback += ")";

	eval(callback);
}

function callFEATURESDeviceAPI(parameters)
{
	// parameters
	var callback = deviceapis._utils.getParameterValue(parameters, "callback");
	
	// controls
	if (callback===null) {
		alert("ERROR: [FEATURES] Callback missing");
		return;
	}
	
	// simulation
	var features = "{\"features\":[{\"uri\":\"supported feature\",\"support\":\"true\"},{\"uri\":\"not supported feature\",\"support\":\"false\"}]}";
	eval(callback+"('"+features+"')");
}

function callFILESYSTEMDeviceAPI(parameters)
{
	// parameters
	var action = deviceapis._utils.getParameterValue(parameters, "action"); 
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback"); 
	//var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");
	var location = deviceapis._utils.getParameterValue(parameters, "location"); 
	
	var fileRef = deviceapis._utils.getParameterValue(parameters, "fileRef"); 
	var wacPath = deviceapis._utils.getParameterValue(parameters, "wacPath"); 
	
	// Get current time since Epoch (UTC)
	var utcTime = Math.round((new Date()).getTime() / 1000);

	// controls are done in filesystem.js
	
	// simulation
	if (action==="resolveRoot") {
		var rootProperties = {
			readOnly: false,
			isFile: false,
			isDirectory: true,
			created:  utcTime - 365*24*3600,	// one year ago
			modified: utcTime - 24*3600,	// 24h ago
			path: location,			
			name: "",	
			fullPath:location,
			length: 2
		};
		setTimeout(function(){
			eval(onSuccessCallback+"('"+JSON.stringify(rootProperties)+"')");		
		}, 100);
	} else if (action==="file_listFiles") {
		// Return a file and a folder
		var files = [];
		files.push({
			readOnly: false,
			isFile: true,
			isDirectory: false,
			created:	 utcTime - 2*3600,	// 2h ago
			modified: utcTime - 3600,	// 1h ago
			path: wacPath + '/',
			name: "file.txt",
			fullPath: wacPath + "/file.txt",
			fileSize: 200,
			_uri: "file://file.txt"
		});
		files.push({
			readOnly: false,
			isFile: true,
			isDirectory: false,
			created:		utcTime - 365*24*3600,	 // 1 year ago
			modified:	utcTime - 365*24*3600,	 // 1 year ago
			path: wacPath + '/',
			name: "capture.jpg",
			fullPath: wacPath + "/capture.jpg",
			fileSize: 20762,
			_uri: "../media/capture.jpg"
		});
		files.push({
			readOnly: false,
			isFile: false,
			isDirectory: true,
			created:	 utcTime - 25*3600,  // 25h ago
			modified: utcTime - 24*3600,  // 24h ago
			path: wacPath + '/',
			name: "Folder",
			fullPath: wacPath + "/Folder",			
			length: 3,
			_uri: "file://Folder/"
		});
		setTimeout(function(){
			eval(onSuccessCallback+"("+fileRef+",'"+JSON.stringify(files)+"')");
		}, 100);
	} else if (action==="file_readAsText") {
		// Return a string
		var string = "Text content of " + wacPath; 
		string += ":\\nThis is a simulation!";
		setTimeout(function(){
			eval(onSuccessCallback+"("+fileRef+", '"+string+"')");
		}, 100);
	} else if (action==="file_deleteFile") {
		// Return a file and a folder
		setTimeout(function(){
			eval(onSuccessCallback+"("+fileRef+")");
		}, 100);
	} else if (action==="file_deleteDirectory") {
		// Return a file and a folder
		setTimeout(function(){
			eval(onSuccessCallback+"("+fileRef+")");
		}, 100);
	} else if (action==="fileStream_read") {
		// Return a string
		var string2 = "Text content of " + wacPath; 
		string2 += ":\\nThis is a simulation!";
		setTimeout(function(){
			eval(onSuccessCallback+"("+fileRef+", '"+string2+"')");
		}, 100);
	} else if (action==="fileStream_readBytes") {
		// Return UTF-8 BOM + "Hello world!"
		var dataBytes = [0xEF, 0xBB, 0xBF,   0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x20, 0x57, 0x6F, 0x72, 0x6C, 0x64, 0x21];
		setTimeout(function(){
			eval(onSuccessCallback+"("+fileRef+", '"+dataBytes+"')");
		}, 100);
	} else {
		alert("ERROR: [FILESYSTEM] Action not supported in simulation: " + action);		
	}
}

function callSYSTEMDeviceAPI(parameters)
{
	// parameters
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback");
	var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");
	
	// simulation
	if (onSuccessCallback!=null) {
		var fontScale;
		if (deviceapis.debugdata.system != undefined) {
			fontScale = deviceapis.debugdata.system.fontScale;
		} else {
			fontScale = 1;
		}
		eval(onSuccessCallback+"(" + fontScale +")");
	}
}

function callGEOLOCATIONDeviceAPI(parameters)
{
	// parameters
	var action = deviceapis._utils.getParameterValue(parameters, "action"); 
	var id = deviceapis._utils.getParameterValue(parameters, "id"); 
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback"); 
	//var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");
	var callback = deviceapis._utils.getParameterValue(parameters, "callback");

	// controls
	if (action===null) {
		alert("ERROR: [GEOLOCATION] Action missing");
		return;	
	} else if ((action!=="get") && (action!=="watch") && (action!=="clear")) {
		alert("ERROR: [GEOLOCATION] Action invalid: "+action);
		return;	
	} else if (((action==="watch") || (action==="clear")) && (id===null)) {
		alert("ERROR: [GEOLOCATION] Id missing");
		return;
	} else if (((action==="get") || (action==="watch")) && (onSuccessCallback===null)) {
		alert("ERROR: [GEOLOCATION] On success callback missing");
		return;
	}

	// simulation
	if (action==="get") {
		var longitude, latitude, altitude, horizontalPrecision, verticalPrecision, speed, timestamp;
		if (deviceapis.debugdata.geolocation != undefined) {
			longitude = deviceapis.debugdata.geolocation.longitude;
			latitude = deviceapis.debugdata.geolocation.latitude;
			altitude = deviceapis.debugdata.geolocation.altitude;
			horizontalPrecision = deviceapis.debugdata.geolocation.horizontalPrecision;
			verticalPrecision = deviceapis.debugdata.geolocation.verticalPrecision;
			speed = deviceapis.debugdata.geolocation.speed;
			timestamp = deviceapis.debugdata.geolocation.timestamp;
		} else {
			longitude = Math.round((Math.random()*360-180)*100)/100;
			latitude = Math.round((Math.random()*360-180)*100)/100;
			altitude = Math.round(Math.random()*10500000-500000);
			horizontalPrecision = Math.round((Math.random()*10)*10)/10;
			verticalPrecision = Math.round((Math.random()*10)*10)/10;
			speed = Math.round((Math.random()*10)*10)/10;
			timestamp = Math.round(Math.random()*10);
		}
		eval(onSuccessCallback+"('"+longitude+"','"+latitude+"','"+altitude+"','"+horizontalPrecision+"','"+verticalPrecision+"','"+speed+"','"+timestamp+"')");
	} else if (action==="watch") {
		if (deviceapis.debugdata.geolocation != undefined) {
			longitude = deviceapis.debugdata.geolocation.longitude;
			latitude = deviceapis.debugdata.geolocation.latitude;
			altitude = deviceapis.debugdata.geolocation.altitude;
			horizontalPrecision = deviceapis.debugdata.geolocation.horizontalPrecision;
			verticalPrecision = deviceapis.debugdata.geolocation.verticalPrecision;
			speed = deviceapis.debugdata.geolocation.speed;
			timestamp = deviceapis.debugdata.geolocation.timestamp;
		} else {
			longitude = Math.round((Math.random()*360-180)*100)/100;
			latitude = Math.round((Math.random()*360-180)*100)/100;
			altitude = Math.round(Math.random()*10500000-500000);
			horizontalPrecision = Math.round((Math.random()*10)*10)/10;
			verticalPrecision = Math.round((Math.random()*10)*10)/10;
			speed = Math.round((Math.random()*10)*10)/10;
			timestamp = Math.round(Math.random()*10);
		}
		eval(onSuccessCallback+"('"+id+"','"+longitude+"','"+latitude+"','"+altitude+"','"+horizontalPrecision+"','"+verticalPrecision+"','"+speed+"','"+timestamp+"')");
	} else if (action==="clear") {
		eval(callback+"("+id+")");
	}
}

function callLOGDeviceAPI(parameters)
{
	// parameters
	var action = deviceapis._utils.getParameterValue(parameters, "action");
	var status = deviceapis._utils.getParameterValue(parameters, "status");
	var persistence = deviceapis._utils.getParameterValue(parameters, "persistence");
	var level = deviceapis._utils.getParameterValue(parameters, "level");
	var maxlines = deviceapis._utils.getParameterValue(parameters, "maxlines");
	var cleaning = deviceapis._utils.getParameterValue(parameters, "cleaning");
	var log = decodeURIComponent(deviceapis._utils.getParameterValue(parameters, "log"));
	var callback = deviceapis._utils.getParameterValue(parameters, "callback");
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback");
	//var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");
	
	var missingParameters = new Array();
	var message;
	
	// controls
	if (action===null) {
		alert("ERROR: [LOG] action missing");
		return;
	} else if ((action!=="getConfiguration") && (action!=="setConfiguration") && (action!=="start") && (action!=="stop") && (action!=="save") && (action!=="load") && (action!=="clean") && (action!=="post")) {
		alert("ERROR: [LOG] action invalid: "+action);
		return;
	} else if (action==="getConfiguration") {
		if (callback===null) {
			alert("ERROR: [LOG] callback to get configuration missing");
			return;
		}
	} else if (action==="setConfiguration") {
		if ((status===null) || (persistence===null) || (level===null) || (maxlines===null) || (cleaning===null)) {
			if (status===null) {
				missingParameters.push("status");
			}
			if (persistence===null) {
				missingParameters.push("persistence");
			}
			if (level===null) {
				missingParameters.push("level");
			}
			if (maxlines===null) {
				missingParameters.push("maxlines");
			}
			if (cleaning===null) {
				missingParameters.push("cleaning");
			}
			message = "";
			for (var i=0; i<missingParameters.length; i++) {
				if (message!="") {
					if (i===missingParameters.length-1) {
						message += " and ";
					} else {
						message += ", ";
					}
				}
				message += missingParameters[i];
			}
			message = "ERROR: [LOG] " + message + " to configure missing";
			alert(message);
			return;
		} else if ((status!=="on") && (status!=="off")) {
			alert("ERROR: [LOG] status to configure invalid: "+status);
			return;
		} else if ((persistence!=="on") && (persistence!=="off")) {
			alert("ERROR: [LOG] persistence to configure invalid: "+persistence);
			return;
		} else if ((level!=="fatal") && (level!=="error") && (level!=="warn") && (level!=="info") && (level!=="debug")) {
			alert("ERROR: [LOG] level to configure invalid: "+level);
			return;
		} else if (isNaN(maxlines)) {
			alert("ERROR: [LOG] maxlines to configure invalid: "+maxlines);
			return;
		} else if ((cleaning!=="none") && (cleaning!=="fifo") && (cleaning!=="post")) {
			alert("ERROR: [LOG] cleaning to configure invalid: "+cleaning);
			return;
		}
	} else if (action==="save") {
		if ((level===null) || (log===null)) {
			if (level===null) {
				missingParameters.push("level");
			}
			if (log===null) {
				missingParameters.push("log");
			}
			message = "";
			for (var i=0; i<missingParameters.length; i++) {
				if (message!="") {
					if (i===missingParameters.length-1) {
						message += " and ";
					} else {
						message += ", ";
					}
				}
				message += missingParameters[i];
			}
			message = "ERROR: [LOG] " + message + " to save missing";
			alert(message);
			return;
		} else if ((level!=="fatal") && (level!=="error") && (level!=="warn") && (level!=="info") && (level!=="debug")) {
			alert("ERROR: [LOG] Level to save invalid: "+level);
			return;
		}
	} else if (action==="load") {
		if (callback===null) {
			alert("ERROR: [LOG] callback to load missing");
			return;
		}
	}
	
	// simulation
	if (action==="getConfiguration") {
		eval(callback+"('on', 'on', 'info', 50, 'fifo')");
	} else if (action==="setConfiguration") {
		alert("Logs configuration set:\n status: "+status+"\n persistence: "+persistence+"\n level: "+level+"\n maxlines: "+maxlines+"\n cleaning: "+cleaning);
		if ((callback!=null) && (callback!="")) {
			eval(callback+"()");
		}
	} else if (action==="start") {
		alert("Starting logs");
		if ((callback!=null) && (callback!="")) {
			eval(callback+"()");
		}
	} else if (action==="stop") {
		alert("Stopping logs");
		if ((callback!=null) && (callback!="")) {
			eval(callback+"()");
		}
	} else if (action==="save") {
		message = "Saving log: ["+level+"] "+log;
		alert(message);
		if ((callback!=null) && (callback!="")) {
			eval(callback+"()");
		}
	} else if (action==="load") {
		var logs = "{\"logs\":[{\"time\":\"1293840000\",\"level\":\"fatal\",\"log\":\"Fatal error\"},{\"time\":\"1293840000\",\"level\":\"error\",\"log\":\"Error\"},{\"time\":\"1293840000\",\"level\":\"warn\",\"log\":\"Warning\"},{\"time\":\"1293840000\",\"level\":\"info\",\"log\":\"Information\"},{\"time\":\"1293840000\",\"level\":\"debug\",\"log\":\"Debug\"}]}";
		eval(callback+"('"+logs+"')");
	} else if (action==="clean") {
		alert("Cleaning logs");
		if ((callback!=null) && (callback!="")) {
			eval(callback+"()");
		}
	} else if (action==="post") {
		alert("Posting logs");
		if ((onSuccessCallback!=null) && (onSuccessCallback!="")) {
			eval(onSuccessCallback+"()");
		}
	}
}

function callMESSAGINGDeviceAPI(parameters)
{
	// parameters
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback");
	//var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");
	var filter = deviceapis._utils.getParameterValue(parameters, "filter");
	
	// controls
	if (onSuccessCallback===null) {
		alert("ERROR: [MESSAGING] On success callback missing");
		return;
	}
	
	// data
	var messagesJSON;
	if (deviceapis.debugdata.messaging != undefined) {
		messagesJSON = deviceapis.debugdata.messaging;
	} else {
		messagesJSON = "{\"messages\":[{\"sender\":\"john.doe@nowhere.ext\",\"status\":\"true\",\"message\":\"Hi!\",\"date\":\"1314878400\"},{\"sender\":\"john.doe@nowhere.ext\",\"status\":\"true\",\"message\":\"How R U?\",\"date\":\"1314880200\"}]}";
	}
	
	// filter
	var messages = JSON.parse(messagesJSON).messages;
	var filteredMessages = new Array();
	if ((filter == null) || (filter == "undefined")) {
		filteredMessages = messages;
	} else {
		var messagesFilter = JSON.parse(decodeURI(filter));
		for (var i=0; i<messages.length; i++) {
			if ((deviceapis._utils.matchFilter(messages[i].sender, messagesFilter.sender)) 
					&& (deviceapis._utils.matchFilter(messages[i].status, messagesFilter.status))
					&& (deviceapis._utils.matchFilter(messages[i].message, messagesFilter.message))
					&& (deviceapis._utils.matchFilter(messages[i].date, messagesFilter.date))) {
				filteredMessages.push(messages[i]);
			}
		}
	}
	var filteredMessagesJSON = "{\"messages\":"+JSON.stringify(filteredMessages)+"}";
	
	// simulation
	eval(onSuccessCallback+"('"+filteredMessagesJSON+"')");
}

function callNETWORKDeviceAPI(parameters)
{
	// parameters
	var action = deviceapis._utils.getParameterValue(parameters, "action");
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback");
	var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");	
	
	// controls
	if (action===null) {
		alert("ERROR: [NETWORK] Action missing");
		return;	
	} else if ((action!=="getType") && (action!=="getCellularInfo") && (action!=="getWifiInfo")) {
		alert("ERROR: [NETWORK] Action invalid: "+action);
		return;
	} else if (onSuccessCallback===null) {
		alert("ERROR: [NETWORK] onSuccessCallback missing");
		return;
	}
	
	// simulation
	if (action==="getType") {
		var type;
		if (deviceapis.debugdata.network != undefined) {
			type = JSON.parse(deviceapis.debugdata.network).type;
		} else {
			type = "N/A";
		}
		eval(onSuccessCallback+"('"+type+"')");
	} else if (action==="getCellularInfo") {
		var roaming, ip, name, mcc, mnc, lac, cellId, operatorName, operatorMcc, operatorMnc;
		if (deviceapis.debugdata.network != undefined) {
			var cellularInfoJSON = JSON.parse(deviceapis.debugdata.network).cellularInfo;
			roaming = cellularInfoJSON.roaming;
			ip = cellularInfoJSON.ip;
			name = cellularInfoJSON.name;
			mcc = cellularInfoJSON.mcc;
			mnc = cellularInfoJSON.mnc;
			lac = cellularInfoJSON.lac;
			cellId = cellularInfoJSON.cellId;
			operatorName = cellularInfoJSON.operatorName;
			operatorMcc = cellularInfoJSON.operatorMcc;
			operatorMnc = cellularInfoJSON.operatorMnc;
		} else {
			roaming = "N/A";
			ip = "N/A";
			name = "N/A";
			mcc = "N/A";
			mnc = "N/A";
			lac = "N/A";
			cellId = "N/A";
			operatorName = "N/A";
			operatorMcc = "N/A";
			operatorMnc = "N/A";
		}
		eval(onSuccessCallback+"('"+roaming+"','"+ip+"','"+name+"','"+mcc+"','"+mnc+"','"+lac+"','"+cellId+"','"+operatorName+"','"+operatorMcc+"','"+operatorMnc+"')");
	} else if (action==="getWifiInfo") {
		var ip, ssid;
		if (deviceapis.debugdata.network != undefined) {
			var wifiInfoJSON = JSON.parse(deviceapis.debugdata.network).wifiInfo;
			ip = wifiInfoJSON.ip;
			ssid = wifiInfoJSON.ssid;
		} else {
			ip = "N/A";
			ssid = "N/A";
		}
		eval(onSuccessCallback+"('"+ip+"','"+ssid+"')");
	}
}

function callNETWORKACTIVITYINDICATORDeviceAPI(parameters)
{
	// parameters
	var action = deviceapis._utils.getParameterValue(parameters, "action");
	if (action===null) {
		alert("ERROR: [NETWORKACTIVITYINDICATOR] Action missing");
		return;
	} else if ((action!=="on") && (action!=="off")) {
		alert("ERROR: [NETWORKACTIVITYINDICATOR] Action invalid: "+action);
		return;
	}
	
	// simulation
	alert("Network activity indicator set "+action+".");
}

function callNOTIFICATIONDeviceAPI(parameters)
{
	// parameters
	var action = deviceapis._utils.getParameterValue(parameters, "action");
	var userID = decodeURIComponent(deviceapis._utils.getParameterValue(parameters, "userID"));
	var sessionToken = decodeURIComponent(deviceapis._utils.getParameterValue(parameters, "sessionToken"));
	var types = deviceapis._utils.getParameterValue(parameters, "types");
	var callbacks = deviceapis._utils.getParameterValue(parameters, "callbacks");
	//var data = deviceapis._utils.getParameterValue(parameters, "data");
	var callback = deviceapis._utils.getParameterValue(parameters, "callback");
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback");
	//var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");
	
	// controls
	if (action===null) {
		alert("ERROR: [NOTIFICATION] Action missing");
		return;	
	} else if ((action!=="setUser") && (action!=="getUser")  && (action!=="register") && (action!=="registerTypes") && (action!=="unregisterTypes") && (action!=="getRegisteredTypes") && (action!=="getCenterTypes") && (action!=="registerCallbacks") && (action!=="unregisterCallbacks") && (action!=="check")) {
		alert("ERROR: [NOTIFICATION] Action invalid: "+action);
		return;
	} else if ((action==="setUser") && (userID===null)) {
		alert("ERROR: [NOTIFICATION] User to set missing");
		return;
	} else if ((action==="getUser") && (callback===null)) {
		alert("ERROR: [NOTIFICATION] Callback to get user missing");
		return;
	} else if ((action==="register") && (sessionToken===null)) {
		alert("ERROR: [NOTIFICATION] Session token to register missing");
		return;
	} else if ((action==="registerTypes") && (types===null)) {
		alert("ERROR: [NOTIFICATION] Types to register missing");
		return;
	} else if ((action==="unregisterTypes") && (types===null)) {
		alert("ERROR: [NOTIFICATION] Types to register missing");
		return;
	} else if ((action==="registerCallbacks") && (callbacks===null)) {
		alert("ERROR: [NOTIFICATION] Callbacks to register missing");
		return;
	} else if ((action==="unregisterCallbacks") && (callbacks===null)) {
		alert("ERROR: [NOTIFICATION] Callbacks to unregister missing");
		return;
	} else if (action==="getRegisteredTypes") {
		if (callback===null) {
			alert("ERROR: [NOTIFICATION] Callback to get registered types missing");
			return;
		}
	} else if (action==="getSystemTypes") {
		if (callback===null) {
			alert("ERROR: [NOTIFICATION] Callback to get notification system types missing");
			return;
		}
	}
	
	// simulation
	if (action==="setUser") {
		alert("Set user: "+userID);
		if ((onSuccessCallback!=null) && (onSuccessCallback!="")) {
			eval(onSuccessCallback+"()");
		}
	} else if (action==="getUser") {
		if (deviceapis.debugdata.notification != undefined) {
			eval(callback+"("+JSON.stringify(JSON.parse(deviceapis.debugdata.notification).userID)+")");
		} else {
			eval(callback+"('userID')");
		}
	} else if (action==="register") {
		alert("Register: "+sessionToken);
		if ((onSuccessCallback!=null) && (onSuccessCallback!="")) {
			eval(onSuccessCallback+"()");
		}
	} else if (action==="registerTypes") {
		alert("Registered types: "+types);
		if ((onSuccessCallback!=null) && (onSuccessCallback!="")) {
			eval(onSuccessCallback+"()");
		}
	} else if (action==="unregisterTypes") {
		alert("Unregistered types: "+types);
		if ((onSuccessCallback!=null) && (onSuccessCallback!="")) {
			eval(onSuccessCallback+"()");
		}
	} else if (action==="getRegisteredTypes") {
		if (deviceapis.debugdata.notification != undefined) {
			eval(callback+"("+JSON.stringify(JSON.parse(deviceapis.debugdata.notification).types)+")");
		} else {
			eval(callback+"('alert,badge,sound,vibrate')");
		}
	} else if (action==="getSystemTypes") {
		if (deviceapis.debugdata.notification != undefined) {
			eval(callback+"("+JSON.stringify(JSON.parse(deviceapis.debugdata.notification).systemtypes)+")");
		} else {
			eval(callback+"('alert,badge,sound,vibrate')");
		}
	} else if (action==="registerCallbacks") {
		alert("Registered callbacks: "+callbacks);
	} else if (action==="unregisterCallbacks") {
		alert("Unregistered callbacks: "+callbacks);
	} else if (action==="check") {
		if ((onSuccessCallback!=null) && (onSuccessCallback!="")) {
			eval(onSuccessCallback+"()");
		}
	}
}

function callORIENTATIONDeviceAPI(parameters)
{
	// parameters
	var action = deviceapis._utils.getParameterValue(parameters, "action"); 
	var id = deviceapis._utils.getParameterValue(parameters, "id"); 
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback"); 
	//var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");
	var callback = deviceapis._utils.getParameterValue(parameters, "callback");

	// controls
	if (action===null) {
		alert("ERROR: [ORIENTATION] Action missing");
		return;	
	} else if ((action!=="get") && (action!=="watch") && (action!=="clear")) {
		alert("ERROR: [ORIENTATION] Action invalid: "+action);
		return;	
	} else if (((action==="watch") || (action==="clear")) && (id===null)) {
		alert("ERROR: [ORIENTATION] Id missing");
		return;
	} else if (((action==="get") || (action==="watch")) && (onSuccessCallback===null)) {
		alert("ERROR: [ORIENTATION] On success callback missing");
		return;
	}

	// simulation
	var alpha, beta, gamma;
	if (action==="get") {
		if (deviceapis.debugdata.orientation != undefined) {
			alpha = deviceapis.debugdata.orientation.alpha;
			beta = deviceapis.debugdata.orientation.beta;
			gamma = deviceapis.debugdata.orientation.gamma;
		} else {
			alpha = Math.round((Math.random()*360)*10)/10;
			beta = Math.round((Math.random()*360-180)*10)/10;
			gamma = Math.round((Math.random()*180-90)*10)/10;
		}
		eval(onSuccessCallback+"('','','','',"+alpha+","+beta+","+gamma+",'')");
	} else if (action==="watch") {
		if (deviceapis.debugdata.orientation != undefined) {
			alpha = deviceapis.debugdata.orientation.alpha;
			beta = deviceapis.debugdata.orientation.beta;
			gamma = deviceapis.debugdata.orientation.gamma;
		} else {
			alpha = Math.round((Math.random()*360)*10)/10;
			beta = Math.round((Math.random()*360-180)*10)/10;
			gamma = Math.round((Math.random()*180-90)*10)/10;
		}
		eval(onSuccessCallback+"("+id+",'','','','',"+alpha+","+beta+","+gamma+",'')");
	} else if (action==="clear") {
		eval(callback+"("+id+")");
	}
}

function callPrintDeviceAPI(parameters)
{
	RESPONSE_TIME = 3000;
	
	// acknownledge, only skip it in simulation
	var acknowledge = parameters.substring(parameters.indexOf("=", 0)+1, parameters.indexOf("&", 0));
	parameters = parameters.substring(parameters.indexOf("&", 0)+1);
	
	// get action
	var action = parameters.substring(0, parameters.indexOf("=", 0));
	parameters = parameters.substring(parameters.indexOf("=", 0)+1);
	
	// get parameters object
	parameters = JSON.parse(decodeURIComponent(parameters));
	
	if (action==="print") {
	    setTimeout(
	    	function() {
	    		eval(parameters.onSuccess + "()");
	    	},
	    	RESPONSE_TIME);
	}
}

function callQUITDeviceAPI(parameters)
{
	// simulation
	document.write("<!DOCTYPE html><html><body><p>Application quitted.</p></body></html>");
}

function callSCREENORIENTATIONDeviceAPI(parameters)
{
	// parameters
	var action = deviceapis._utils.getParameterValue(parameters, "action");
	if (action===null) {
		alert("ERROR: [SCREENORIENTATION] Action missing");
		return;
	} else if ((action!=="on") && (action!=="off") && (action!=="portrait") && (action!=="landscape") && (action!=="portrait2") && (action!=="landscape2")) {
		alert("ERROR: [SCREENORIENTATION] Action invalid: "+action);
		return;
	}
	
	// simulation
	alert("Screen orientation set "+action+".");
}

function callSHAREDeviceAPI(parameters)
{
	// acknowledge, only skip it in simulation
	var acknowledge = parameters.substring(parameters.indexOf("=", 0)+1, parameters.indexOf("&", 0));
	parameters = parameters.substring(parameters.indexOf("&", 0)+1);
	
	// get action
	var action = parameters.substring(0, parameters.indexOf("=", 0));
	parameters = parameters.substring(parameters.indexOf("=", 0)+1);
                                                                       
	// get parameters object
	parameters = JSON.parse(decodeURIComponent(parameters));
		
	if (action==="share") {
	    var notification = "Sharing to ";
      if (parameters.targets==undefined || parameters.targets==null || parameters.targets.length==0) {
        notification += "any available social network";
      } else if (parameters.targets.length>1) { 
        notification += "any specified social network: " + parameters.targets;
      } else { 
        notification += parameters.targets[0];
      }
      if (parameters.message) {
        notification += "\n\tmessage: " + parameters.message;
      }  
      if (parameters.files) {
        notification += "\n\tfiles: " + parameters.files.length;
      } 
      if (parameters.link) {
        notification += "\n\tlink: " + parameters.link;
      }
      alert(notification);
      eval(parameters.onSuccess + "()");
	    //	},
	    //	deviceapis.debugcontext.securestorage.RESPONSE_TIME);
	} else if (action==="listTargets") {
		eval(parameters.onSuccess + "(['facebook', 'twitter'])");
	}
}

deviceapis.debugcontext.securestorage = {
	opened: false /*,
	RESPONSE_TIME: 10*/
};
function callSECURESTORAGEDeviceAPI(parameters)
{
	// acknownledge, only skip it in simulation
	var acknowledge = parameters.substring(parameters.indexOf("=", 0)+1, parameters.indexOf("&", 0));
	parameters = parameters.substring(parameters.indexOf("&", 0)+1);
	
	// get action
	var action = parameters.substring(0, parameters.indexOf("=", 0));
	parameters = parameters.substring(parameters.indexOf("=", 0)+1);
	
	// get parameters object
	parameters = JSON.parse(decodeURIComponent(parameters));
		
	if (action==="open") {
	    // check password (stored in the local storage)
	    if (localStorage.getItem("password")!=null) {
		    if (localStorage.getItem("password")!=parameters.developerKey) {
		    	if (parameters.onError) {
	    			setTimeout(
	    				function() {
	    					eval(parameters.onError + "()");   
	    				},
	    				deviceapis.debugcontext.securestorage.RESPONSE_TIME);
	    		}
	    		return;
	    	}
	    } else {
	    	// if not defined, use the one passed at the first open
	    	localStorage.setItem("password", parameters.developerKey);
	    }
		
	    deviceapis.debugcontext.securestorage.opened = true;      
	    
	    // removed: callback lost (undefined)
	    //setTimeout(
	    //	function() {
	    		eval(parameters.onSuccess + "()");
	    //	},
	    //	deviceapis.debugcontext.securestorage.RESPONSE_TIME);
	} else if (action==="close") {
		deviceapis.debugcontext.securestorage.opened = false;
	    //setTimeout(
	    //	function() {
	    		eval(parameters.onSuccess + "()");
	    //	},
	    //	deviceapis.debugcontext.securestorage.RESPONSE_TIME);
	} else if (action==="migrate") {
		// the secure storage must be open
		if (!deviceapis.debugcontext.securestorage.opened) {
	    	if (parameters.onError) {
	    	//	setTimeout(
	    	//		function() {
	    				eval(parameters.onError + "()");   
	    	//		},
	    	//		deviceapis.debugcontext.securestorage.RESPONSE_TIME);        
	        }
	        return;
	    }
	      
		// in debug, use localStorage to mimic secure storage
	    localStorage.setItem("password", parameters.developerKey);
		//setTimeout(
	    //	function() {
	    		 eval(parameters.onSuccess + "()");
	    //	},
	    //	deviceapis.debugcontext.securestorage.RESPONSE_TIME);
	} else if (action==="setItem") {
		 // the secure storage must be open
	     if (!deviceapis.debugcontext.securestorage.opened) {
	    	if (parameters.onError) {
	    		//setTimeout(
	    		//	function() {
	    				eval(parameters.onError + "()");   
	    		//	},
	    		//	deviceapis.debugcontext.securestorage.RESPONSE_TIME);
	         }
	         return;
	      }
	      
	      // in debug, use localStorage to mimic secure storage
	      localStorage.setItem(parameters.key, parameters.value);
	      //setTimeout(
	      // function() {
	    		 eval(parameters.onSuccess + "()");
	      // },
	      // deviceapis.debugcontext.securestorage.RESPONSE_TIME);
	} else if (action==="getItem") {
		  // the secure storage must be open
	      if (!deviceapis.debugcontext.securestorage.opened) {
	         if (parameters.onError) {
	            //setTimeout(
	            //	function() {
	            		eval(parameters.onError + "()");   
	            //	},
	            //	deviceapis.debugcontext.securestorage.RESPONSE_TIME);       
	         }
	         return;
	      }
	      
	      // in debug, use localStorage to mimic secure storage
	      //setTimeout(
	      // function() {
		         var value = localStorage.getItem(parameters.key);
		         if (value!=null) {
		            eval(parameters.onSuccess + '("' + deviceapis._utils.escapeString(value) + '")');            
		         }
		         else {
		            eval(parameters.onSuccess + '(null)');   
		         }
	    	 //},
	    	 //deviceapis.debugcontext.securestorage.RESPONSE_TIME);
	} else if (action==="removeItem") {
		  // the secure storage must be open
	      if (!deviceapis.debugcontext.securestorage.opened) {
	         if (parameters.onError) {
	            //setTimeout(
	            //	function() {
	            		eval(parameters.onError + "()");   
	            //	},
	            //	deviceapis.debugcontext.securestorage.RESPONSE_TIME);        
	         }
	         return;
	      }
	      
	      // in debug, use localStorage to mimic secure storage
	      localStorage.removeItem(parameters.key);
	      //setTimeout(
	      //  function() {
	    		 eval(parameters.onSuccess + "()");
	      //  },
	      //  deviceapis.debugcontext.securestorage.RESPONSE_TIME);
	} else if (action==="clear") {
		  // The secure storage must be open
	      if (!deviceapis.debugcontext.securestorage.opened) {
	         if (parameters.onError) {
	            //setTimeout(
	            //	function() {
	            		eval(parameters.onError + "()");   
	            //	},
	            //	deviceapis.debugcontext.securestorage.RESPONSE_TIME);      
	         }
	         return;
	      }
	      
	      // in debug, use localStorage to mimic secure storage (but keep the
			// password)
	      var pwd = localStorage.getItem("password");
	      localStorage.clear();
	      localStorage.setItem("password", pwd);
	      
	     // setTimeout(
	     //  function() {
	    		 eval(parameters.onSuccess + "()");
	     //  },
	     //  deviceapis.debugcontext.securestorage.RESPONSE_TIME);
	}
}

function callSMSDeviceAPI(parameters)
{
	// parameters
	var number = decodeURIComponent(deviceapis._utils.getParameterValue(parameters, "number"));
	var message = decodeURIComponent(deviceapis._utils.getParameterValue(parameters, "message"));
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback"); 
	var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");
	
	// controls
	if ((number===null) && (message===null)) {
		alert("ERROR: [SMS] Number and message missing");
		return;
	} else if (number===null) {
		alert("ERROR: [SMS] Number missing");
		return;
	} else if (message===null) {
		alert("ERROR: [SMS] Message missing");
		return;
	}
	
	// simulation
	alert("Sending message \"" + message +"\" to " + number + "...");
	if (onSuccessCallback!=null) {
		eval(onSuccessCallback+"()");
	}
}

function callTRACKINGDeviceAPI(parameters)
{	
	// parameters
	var action = deviceapis._utils.getParameterValue(parameters, "action");
	var status = deviceapis._utils.getParameterValue(parameters, "status");
	var persistence = deviceapis._utils.getParameterValue(parameters, "persistence");
	var maxlines = deviceapis._utils.getParameterValue(parameters, "maxlines");
	var cleaning = deviceapis._utils.getParameterValue(parameters, "cleaning");
	var screenName = decodeURIComponent(deviceapis._utils.getParameterValue(parameters, "screenName"));
	var category = decodeURIComponent(deviceapis._utils.getParameterValue(parameters, "category"));
	var taction = decodeURIComponent(deviceapis._utils.getParameterValue(parameters, "taction"));
	var callback = deviceapis._utils.getParameterValue(parameters, "callback");
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback");
	//var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");
	
	var missingParameters = new Array();
	var tracking;
	var message;

	// controls
	if (action===null) {
		alert("ERROR: [TRACKING] action missing");
		return;
	} else if ((action!=="getConfiguration") && (action!=="setConfiguration") && (action!=="start") && (action!=="stop") && (action!=="trackScreenView") && (action!=="trackEvent") && (action!=="load") && (action!=="clean") && (action!=="post")) {
		alert("ERROR: [TRACKING] action invalid: "+action);
		return;
	} else if (action==="getConfiguration") {
		if (callback===null) {
			alert("ERROR: [TRACKING] callback to get configuration missing");
			return;
		}
	} else if (action==="setConfiguration") {
		if ((status===null) || (persistence===null) || (maxlines===null) || (cleaning===null)) {
			if (status===null) {
				missingParameters.push("status");
			}
			if (persistence===null) {
				missingParameters.push("persistence");
			}
			if (maxlines===null) {
				missingParameters.push("maxlines");
			}
			if (cleaning===null) {
				missingParameters.push("cleaning");
			}
			tracking = "";
			for (var i=0; i<missingParameters.length; i++) {
				if (tracking!="") {
					if (i===missingParameters.length-1) {
						tracking += " and ";
					} else {
						tracking += ", ";
					}
				}
				tracking += missingParameters[i];
			}
			tracking = "ERROR: [TRACKING] " + tracking + " to configure missing";
			alert(tracking);
			return;
		} else if ((status!=="on") && (status!=="off")) {
			alert("ERROR: [TRACKING] status to configure invalid: "+status);
			return;
		} else if ((persistence!=="on") && (persistence!=="off")) {
			alert("ERROR: [TRACKING] persistence to configure invalid: "+persistence);
			return;
		} else if (isNaN(maxlines)) {
			alert("ERROR: [TRACKING] maxlines to configure invalid: "+maxlines);
			return;
		} else if ((cleaning!=="none") && (cleaning!=="fifo") && (cleaning!=="post")) {
			alert("ERROR: [TRACKING] cleaning to configure invalid: "+cleaning);
			return;
		}
	} else if (action==="trackScreenView") {
		if (screenName == null) {
			alert("ERROR: [TRACKING] screen name to track missing");
			return;
		}
	} else if (action==="trackEvent") {
		if ((category===null) && (taction===null)) {
			alert("ERROR: [TRACKING] category and action to track missing");
			return;
		} else if ((category===null) && (taction!=null)) {
			alert("ERROR: [TRACKING] category to track missing");
			return;
		} else if ((category!=null) && (taction===null)) {
			alert("ERROR: [TRACKING] action to track missing");
			return;
		}
	} else if (action==="load") {
		if (callback===null) {
			alert("ERROR: [TRACKING] callback to load missing");
			return;
		}
	}
	
	// simulation
	if (action==="getConfiguration") {
		eval(callback+"('on', 'on', 50, 'fifo')");
	} else if (action==="setConfiguration") {
		alert("Data tracking configuration set:\n status: "+status+"\n persistence: "+persistence+"\n maxlines: "+maxlines+"\n cleaning: "+cleaning);
		if ((callback!=null) && (callback!="")) {
			eval(callback+"()");
		}
	} else if (action==="start") {
		alert("Starting data tracking");
		if ((callback!=null) && (callback!="")) {
			eval(callback+"()");
		}
	} else if (action==="stop") {
		alert("Stopping data tracking");
		if ((callback!=null) && (callback!="")) {
			eval(callback+"()");
		}
	} else if (action==="trackScreenView") {
		message = "Tracking screen view:\n screen name: "+screenName;
		alert(message);
		if ((callback!=null) && (callback!="")) {
			eval(callback+"()");
		}
	} else if (action==="trackEvent") {
		message = "Tracking event:\n Category: "+category+"\n Action: "+taction;
		alert(message);
		if ((callback!=null) && (callback!="")) {
			eval(callback+"()");
		}
	} else if (action==="load") {
		var trackedData = "{\"tracking\":[{\"time\":\"1293840000\",\"screenName\":\"screen 1\"},{\"time\":\"1293840000\",\"screenName\":\"screen 2\"},{\"time\":\"1293840000\",\"screenName\":\"screen 2\",\"category\":\"software\",\"action\":\"download\"}]}";
		eval(callback+"('"+trackedData+"')");
	} else if (action==="clean") {
		alert("Cleaning tracked data");
		if ((callback!=null) && (callback!="")) {
			eval(callback+"()");
		}
	} else if (action==="post") {
		alert("Posting tracked data");
		if ((onSuccessCallback!=null) && (onSuccessCallback!="")) {
			eval(onSuccessCallback+"()");
		}
	}
}

function callUPLOADDeviceAPI(parameters)
{
	// parameters
	var file = deviceapis._utils.getParameterValue(parameters, "file");   
	var type = deviceapis._utils.getParameterValue(parameters, "type"); 
	var destination = deviceapis._utils.getParameterValue(parameters, "destination");
	var onSuccessCallback = deviceapis._utils.getParameterValue(parameters, "onSuccessCallback");
	var onFailureCallback = deviceapis._utils.getParameterValue(parameters, "onFailureCallback");
	
	// controls
	if ((file===null) && (type===null) && (destination===null)) {
		alert("ERROR: [UPLOAD] File full path, mime-type and destination missing");
		if (onFailureCallback!=null) {
			eval(onFailureCallback+"()");
		}
		return;
	} else if ((file===null) && (type===null)) {
		alert("ERROR: [UPLOAD] File full path and mime-type missing");
		if (onFailureCallback!=null) {
			eval(onFailureCallback+"()");
		}
		return; 
	} else if ((file===null) && (destination===null)) {
		alert("ERROR: [UPLOAD] File full path and destination missing");
		if (onFailureCallback!=null) {
			eval(onFailureCallback+"()");
		}
		return;
	} else if ((type===null) && (destination===null)) {
		alert("ERROR: [UPLOAD] File mime-type and destination missing");
		if (onFailureCallback!=null) {
			eval(onFailureCallback+"()");
		}
		return;
	} else if (file===null) {
		alert("ERROR: [UPLOAD] File full path missing");
		if (onFailureCallback!=null) {
			eval(onFailureCallback+"()");
		}
		return;
	} else if (type===null) {
		alert("ERROR: [UPLOAD] File mime-type missing");
		if (onFailureCallback!=null) {
			eval(onFailureCallback+"()");
		}
		return;
	} else if (destination===null) {
		alert("ERROR: [UPLOAD] File destination missing");
		if (onFailureCallback!=null) {
			eval(onFailureCallback+"()");
		}
		return;
	}
	
	// simulation
	if (onSuccessCallback!=null) {
		eval(onSuccessCallback+"()");
	}
}

function callVIBRATEDeviceAPI(parameters)
{
	// parameters
	var action = deviceapis._utils.getParameterValue(parameters, "action");
	var duration = deviceapis._utils.getParameterValue(parameters, "duration");
	if (action===null) {
		alert("ERROR: [VIBRATE] Action missing");
		return;
	} else if ((action!=="start") && (action!=="stop")) {
		alert("ERROR: [VIBRATE] Action invalid: "+action);
		return;
	}
	
	// simulation
	if (action==="start") {
		if ((duration!=null) && (duration!="")) {
			alert("Vibrating "+duration+"ms...");
		} else {
			alert("Vibrating indefinitely...");
		}
	} else if (action==="stop") {
		alert("Vibration stopped.");
	}   
}

function callVOLUMEDeviceAPI(parameters)
{
	// parameters
	var action = deviceapis._utils.getParameterValue(parameters, "action");
	if (action===null) {
		alert("ERROR: [VOLUME] Action missing");
		return;
	} else if ((action!=="on") && (action!=="off") && (action!=="up") && (action!=="down")) {
		alert("ERROR: [VOLUME] Action invalid: "+action);
		return;
	}
	
	// simulation
	alert("Sound set "+action+".");
}

function callWAPDeviceAPI(parameters)
{
	// parameters
	var url = deviceapis._utils.getParameterValue(parameters, "url");

	// controls
	if (url===null) {
		alert("ERROR: [WAP] URL missing");
		return;	
	}

	// simulation
	window.open(decodeURIComponent(url));
}

deviceapis.debugcontext.layout = {
      layoutListener: null,
      
      _notifyLayoutChange: function() {
    	  // get width and height
    	  var width = window.innerWidth;
    	  var height = window.innerHeight;
    	  
    	  // determine current orientation
    	  var orientation = width > height ? "landscape-primary" : "portrait-primary";
    	  
    	  // get status bar state
    	  if (deviceapis.debugcontext.layout.statusbarVisible == undefined) {
    		  if (deviceapis.debugdata.layout != undefined) {
    			  deviceapis.debugcontext.layout.statusbarVisible = deviceapis.debugdata.layout.statusbarVisible;
    		  } else {
    			  deviceapis.debugcontext.layout.statusbarVisible = false;
    		  }
    	  }
    	  
    	  // build a layout object containing all layout information
    	  var newLayout = new Object();
    	  newLayout.application = new Object();
    	  newLayout.application.orientation = orientation;
    	  newLayout.application.supportedorientations = ["portrait-primary", "portrait-secondary", "landscape-primary", "landscape-secondary"];
    	  newLayout.application.area = [0, 0, width, height];
    	  newLayout.statusbar = new Object();
    	  newLayout.statusbar.visible = false;
    	  
    	  // call listener
    	  eval(deviceapis.debugcontext.layout.layoutListener + "('" + JSON.stringify(newLayout) + "')");
      }
};

function callLAYOUTDeviceAPI(parameters)
{
	// parameters
	var action = deviceapis._utils.getParameterValue(parameters, "action");
	var layoutListener = deviceapis._utils.getParameterValue(parameters, "layoutListener");
	var statusbar = deviceapis._utils.getParameterValue(parameters, "statusbar");
	var orientations = deviceapis._utils.getParameterValue(parameters, "orientations");
	var callback = deviceapis._utils.getParameterValue(parameters, "callback");

	// basic controls
	if (action===null) {
		alert("ERROR: [LAYOUT] action missing");
		return;
	} else if ((action!=="initialize") && (action!=="set")) {
		alert("ERROR: [LAYOUT] action invalid: "+action);
		return;
	}

	// according to the API
	if (action==="initialize") {
		// store the listener function
		deviceapis.debugcontext.layout.layoutListener = layoutListener;
		// register event listener to be notified about window resize
		window.addEventListener('resize', deviceapis.debugcontext.layout._notifyLayoutChange, false);
		// provide the initial layout data
		setTimeout(deviceapis.debugcontext.layout._notifyLayoutChange, 10);
	} else if (action==="set") {
		// simulation
		if ((statusbar != null) && (statusbar.length > 0)) {
			alert("Requesting status bar " + statusbar);
		}
		if ((orientations != null) && (orientations != "0")) {			
			var supportedorientations = "";
			if ((orientations & 0x01) != 0) {
				supportedorientations += '"portrait-primary"';
			}
			if ((orientations & 0x02) != 0) {
				if (supportedorientations.length > 0) {
					supportedorientations += ",";
				}
				supportedorientations += '"portrait-secondary"';
			}
			if ((orientations & 0x04) != 0) {
				if (supportedorientations.length > 0) {
					supportedorientations += ",";
				}
				supportedorientations += '"landscape-primary"';
			}
			if ((orientations & 0x08) != 0) {
				if (supportedorientations.length > 0) {
					supportedorientations += ",";
				}
				supportedorientations += '"landscape-secondary"';
			}			
			alert("Requesting supported orientations : [" + supportedorientations + "]");
		}
		
		// callback
		if (callback != null) {
			setTimeout(
				function() {
					supportedOrientations = ["portrait-primary", "portrait-secondary", "landscape-primary", "landscape-secondary"];
					eval(callback + "('" + JSON.stringify(supportedOrientations) + "', null, null, null)");  
				}, 10);
		}
	}
}


/*global deviceapis */
/*global callDeviceAPI */

// Device
function UpdateInformation(version, mandatory, release)
{
	this.version = version;
	this.mandatory = mandatory;
	this.release = release;
}

deviceapis.application = new Object();
deviceapis.application.id = null;
//deviceapis.application.getID._callback;
deviceapis.application.version = null;
//deviceapis.application.getVersion._callback;
deviceapis.application.update = new Object();
//deviceapis.application.update._onSuccessCallback;
//deviceapis.application.update._onFailureCallback;
deviceapis.application.alert = new Object();
deviceapis.application.confirm = new Object();

// Get id
deviceapis.application.getID = function(callback)
{
	deviceapis.application.getID._callback = callback;
	if (deviceapis.application.id == null) {
		callDeviceAPI("APPLICATION", "action=getID&callback=deviceapis.application._getID");
	} else {
		deviceapis.application.getID._callback(deviceapis.application.id);
	}
};

deviceapis.application._getID = function(id)
{
	deviceapis.application.id = id;
	deviceapis.application.getID._callback(deviceapis.application.id);
};

// Get version
deviceapis.application.getVersion = function(callback)
{
	deviceapis.application.getVersion._callback = callback;
	if (deviceapis.application.version == null) {
		callDeviceAPI("APPLICATION", "action=getVersion&callback=deviceapis.application._getVersion");
	} else {
		deviceapis.application.getVersion._callback(deviceapis.application.version);
	}
};

deviceapis.application._getVersion = function(version)
{
	deviceapis.application.version = version;
	deviceapis.application.getVersion._callback(deviceapis.application.version);
};

// Update - Check availability
deviceapis.application.update.checkAvailability = function(onSuccessCallback, onFailureCallback)
{
	deviceapis.application.update.checkAvailability._onSuccessCallback = onSuccessCallback;
	deviceapis.application.update.checkAvailability._onFailureCallback = onFailureCallback;
	callDeviceAPI("APPLICATION", "action=checkUpdateAvailability&onSuccessCallback=deviceapis.application.update._checkAvailability&onFailureCallback=deviceapis.application.update._checkAvailabilityError");
};

deviceapis.application.update._checkAvailability = function(version, mandatory, release)
{
	var updateInformation = new UpdateInformation(version, mandatory==='true', release==='true');
	deviceapis.application.update.checkAvailability._onSuccessCallback(updateInformation);
};

deviceapis.application.update._checkAvailabilityError = function(error)
{
	if (deviceapis.application.update.checkAvailability._onFailureCallback) {
		deviceapis.application.update.checkAvailability._onFailureCallback(error);
	}
};

// Update - Download
deviceapis.application.update.download = function(onSuccessCallback, onFailureCallback)
{
	deviceapis.application.update.download._onSuccessCallback = onSuccessCallback;
	deviceapis.application.update.download._onFailureCallback = onFailureCallback;
	callDeviceAPI("APPLICATION", "action=downloadUpdate&onSuccessCallback=deviceapis.application.update._download&onFailureCallback=deviceapis.application.update._downloadError");
};

deviceapis.application.update._download = function()
{
	deviceapis.application.update.download._onSuccessCallback();
};

deviceapis.application.update._downloadError = function(error)
{
	if (deviceapis.application.update.download._onFailureCallback) {
		deviceapis.application.update.download._onFailureCallback(error);
	}
};

// Update - Apply
deviceapis.application.update.apply = function(onSuccessCallback, onFailureCallback)
{
	deviceapis.application.update.apply._onSuccessCallback = onSuccessCallback;
	deviceapis.application.update.apply._onFailureCallback = onFailureCallback;
	callDeviceAPI("APPLICATION", "action=applyUpdate&onSuccessCallback=deviceapis.application.update._apply&onFailureCallback=deviceapis.application.update._applyError");
};

deviceapis.application.update._apply = function()
{
	deviceapis.application.update.apply._onSuccessCallback();
};

deviceapis.application.update._applyError = function(error)
{
	if (deviceapis.application.update.apply._onFailureCallback) {
		deviceapis.application.update.apply._onFailureCallback(error);
	}
};

// Hide splash screen
deviceapis.application.hideSplashScreen = function() 
{
	callDeviceAPI("APPLICATION", "action=hideSplashScreen");
};

// Dialog - Alert
deviceapis.application.alert = function(title, message, buttonlabel, callback, escapecallback) 
{
	deviceapis.application.alert.onButton1 = callback;
	deviceapis.application.alert.onEscape = escapecallback;
	callDeviceAPI("APPLICATION", "action=showDialog&type=alert&title=" + encodeURIComponent(title) + "&message=" + encodeURIComponent(message) + "&button1Label=" + encodeURIComponent(buttonlabel) + "&onSuccessCallback=deviceapis.application.alert._onButton1&onEscapeCallback=deviceapis.application.alert._onEscape");
};

deviceapis.application.alert._onButton1 = function()
{
	if (deviceapis.application.alert.onButton1 != undefined) {
		deviceapis.application.alert.onButton1();
	}
};

deviceapis.application.alert._onEscape = function()
{
	if (deviceapis.application.alert.onEscape != undefined) {
		deviceapis.application.alert.onEscape();
	}
};

// Dialog - Confirm
deviceapis.application.confirm = function(title, message, confirmbuttonlabel, cancelbuttonlabel, confirmcallback, cancelcallback, escapecallback) 
{
	deviceapis.application.confirm.onButton1 = confirmcallback;
	deviceapis.application.confirm.onButton2 = cancelcallback;
	deviceapis.application.confirm.onEscape = escapecallback;
	callDeviceAPI("APPLICATION", "action=showDialog&type=confirm&title=" + encodeURIComponent(title) + "&message=" + encodeURIComponent(message) + "&button1Label=" + encodeURIComponent(confirmbuttonlabel) + "&button2Label=" + encodeURIComponent(cancelbuttonlabel) + "&onSuccessCallback=deviceapis.application.confirm._onButton1&onCancelCallback=deviceapis.application.confirm._onButton2&onEscapeCallback=deviceapis.application.confirm._onEscape");
};

deviceapis.application.confirm._onButton1 = function()
{
	deviceapis.application.confirm.onButton1();
};

deviceapis.application.confirm._onButton2 = function()
{
	if (deviceapis.application.confirm.onButton2 != undefined) {
		deviceapis.application.confirm.onButton2();
	}
};

deviceapis.application.confirm._onEscape = function()
{
	if (deviceapis.application.confirm.onEscape != undefined) {
		deviceapis.application.confirm.onEscape();
	}
};

// Listen back key
deviceapis.application.listenBackKey = function() 
{
	callDeviceAPI("APPLICATION", "action=listenBackKey");
};

deviceapis.application._dispatchEvent = function(eventcode) 
{
	var event = document.createEvent("Event");
	event.initEvent(eventcode, true, true);
	document.dispatchEvent(event);
};

// Quit
deviceapis.application.quit = function() 
{
	callDeviceAPI("APPLICATION", "action=quit");
};
/*global deviceapis */
/*global callDeviceAPI */
/*global chrome */

// Browser (based on BrowserDetect.js)
deviceapis.browserinfo = new Object();

deviceapis.browserinfo = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser);
		if (this.browser == null) {
			this.browser = "an unknown browser";
		}
		this.version = this.searchVersion(navigator.userAgent);
		if (this.version == null) {
			this.version = this.searchVersion(navigator.appVersion);
			if (this.version == null) {
				this.version = "an unknown version";
			}
		}
		this.OS = this.searchString(this.dataOS);
		if (this.OS == null) {
			this.OS = "an unknown OS";
		}
		this.OSVersion = this.searchVersion(navigator.userAgent);
		this.userAgent = navigator.userAgent;
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1) {
					return data[i].identity;
				}
			}
			else if (dataProp) {
				return data[i].identity;
			}
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) { return;}
		dataString = dataString.substring(index+this.versionSearchString.length+1);
		if ((this.OS != null) && (this.OSVersion == 'iOS')) {
			dataString = dataString.replace( '_', '.' );
		}
		var versionNumber = parseFloat(dataString);
		if (isNaN(versionNumber)) { return; }
		return versionNumber;
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "IEMobile",
			identity: "IEMobile"
		},
		{
			// Test MS Edge before because UA also contains "Windows Phone" substring
			// User agent strings on Windows 10:
			// desktop/tablet : Mozilla/5.0 (Windows NT 10.0; Win64; x64; WebView/3.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.<OS build number>
			// mobile : Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; WebView/3.0; DEVICE INFO) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Mobile Safari/537.36 Edge/12.<OS build number>
			string: navigator.userAgent,
			subString: "Edge/",
			identity: "MS Edge",
			versionSearch: "Edge"			
		},
		{
			string: navigator.userAgent,
			subString: "Windows Phone",
			identity: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Windows NT 6.3",
			identity: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{
     	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{		// for Mozilla and IE11
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.userAgent,
			subString: "Windows Phone",
			identity: "Windows Phone"
		},
		{
			string: navigator.userAgent,
			subString: "Android",
			identity: "Android"
		},
		{
			string: navigator.userAgent,
			subString: "Windows NT",
			identity: "Windows NT"
		},
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.userAgent,
			subString: "iPhone",
			identity: "iOS",
			versionSearch: "OS"
		},
		{
			string: navigator.userAgent,
			subString: "iPad",
			identity: "iOS",
			versionSearch: "OS"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		},
		{
			string: navigator.platform,
			subString: "BlackBerry",
			identity: "BlackBerry"
		}
	]
};

deviceapis.browserinfo.init();

// OS detection + BF11239
deviceapis.browserinfo.isWindowsPhone81WRT = deviceapis.browserinfo.userAgent.indexOf("Windows Phone")!==-1 && deviceapis.browserinfo.userAgent.indexOf("IEMobile")!==-1 && deviceapis.browserinfo.userAgent.indexOf("WebView/")!==-1;
deviceapis.browserinfo.isWindowsPhone = deviceapis.browserinfo.userAgent.indexOf("Windows Phone")!==-1;
deviceapis.browserinfo.isWindows81 = deviceapis.browserinfo.userAgent.indexOf("Windows NT 6.3")!==-1;
deviceapis.browserinfo.isWindows10 = deviceapis.browserinfo.userAgent.indexOf("Windows NT 10.0")!==-1;
deviceapis.browserinfo.isWindows10Mobile = deviceapis.browserinfo.userAgent.indexOf("Windows Phone 10.0")!==-1;
if ((!deviceapis.browserinfo.isWindowsPhone) && (!deviceapis.browserinfo.isWindows81) && (!deviceapis.browserinfo.isWindows10)) {
	deviceapis.browserinfo.isiOS = (deviceapis.browserinfo.userAgent.indexOf("iPhone")!==-1) || (deviceapis.browserinfo.userAgent.indexOf("iPad")!==-1);
	deviceapis.browserinfo.isAndroid = deviceapis.browserinfo.userAgent.indexOf("Android")!==-1;
	deviceapis.browserinfo.isBlackberry = deviceapis.browserinfo.userAgent.indexOf("BlackBerry")!==-1;
}
if (deviceapis.browserinfo.userAgent.indexOf("Edge/")==-1) { // Be carefull because MS Edge defines 'chrome' and 'chrome.app'
	deviceapis.browserinfo.isDeviceEmulator = (typeof chrome != "undefined") && (chrome.app != undefined);
}
/*global deviceapis */
/*global callDeviceAPI */

//Accelerometer
function Acceleration(xAxis, yAxis, zAxis)
{
	this.xAxis = xAxis;
	this.yAxis = yAxis;
	this.zAxis = zAxis;
}

function Accelerometer()
{
	this.getCurrentAcceleration = function(onSuccessCallback, onFailureCallback)
	{
		this.onSuccessCallback = onSuccessCallback;
		this.onFailureCallback = onFailureCallback;
		callDeviceAPI("ACCELEROMETER", "action=get&onSuccessCallback=deviceapis.accelerometer._getCurrentAcceleration&onFailureCallback=deviceapis.accelerometer._getCurrentAccelerationError");
	},
	this._getCurrentAcceleration = function(x, y, z)
	{
		if (this.onSuccessCallback != null) {
			this.onSuccessCallback(new Acceleration(x, y, z));
		}
	},
	this._getCurrentAccelerationError = function()
	{
		if (this.onFailureCallback != null) {
			this.onFailureCallback();
		}
	},
	this.watchAcceleration = function(onSuccessCallback, onFailureCallback, options)
	{
		this.id = deviceapis.accelerometer.watch.nextId;
		deviceapis.accelerometer.watch.nextId++;
		this.onSuccessCallback = onSuccessCallback;
		this.onFailureCallback = onFailureCallback;
		this.minNotificationInterval = 1000; // default: 1s
		if (options!==null) {
			this.minNotificationInterval = options.minNotificationInterval;
		}
		this._watchAccelerationLoop();
	},
	this._watchAccelerationLoop = function()
	{
		callDeviceAPI("ACCELEROMETER", "action=watch&id="+this.id+"&onSuccessCallback=deviceapis.accelerometer._watchAcceleration&onFailureCallback=deviceapis.accelerometer._watchAccelerationError");
	},
	this._watchAcceleration = function(x, y, z)
	{
		if (this.onSuccessCallback!==null) {
			this.onSuccessCallback(new Acceleration(x, y, z));
		}
	},
	this._watchAccelerationError = function()
	{
		if (this.onFailureCallback!==null) {
			this.onFailureCallback();
		}
	},
	this.clearWatch = function(callback)
	{
		this.callback = callback;
		callDeviceAPI("ACCELEROMETER", "action=clear&id="+this.id+"&callback=deviceapis.accelerometer._clearWatch");
	},
	this._clearWatch = function()
	{
		this.callback();
	};
}

deviceapis.accelerometer = new Object();
deviceapis.accelerometer.get = new Object();
//deviceapis.accelerometer.get.accelerometer;
deviceapis.accelerometer.watch = new Object();
deviceapis.accelerometer.watch.nextId = 0;
deviceapis.accelerometer.watch.accelerometers = new Array();

// 		get current acceleration
deviceapis.accelerometer.getCurrentAcceleration = function(onSuccessCallback, onFailureCallback)
{
	deviceapis.accelerometer.get.accelerometer = new Accelerometer();
	deviceapis.accelerometer.get.accelerometer.getCurrentAcceleration(onSuccessCallback, onFailureCallback);
};

deviceapis.accelerometer._getCurrentAcceleration = function(x, y, z)
{
	deviceapis.accelerometer.get.accelerometer._getCurrentAcceleration(x, y, z);
	deviceapis.accelerometer.get.accelerometer = null;
};

deviceapis.accelerometer._getCurrentAccelerationError = function()
{
	deviceapis.accelerometer.get.accelerometer._getCurrentAccelerationError();
	deviceapis.accelerometer.get.accelerometer = null;
};

//		watch acceleration
deviceapis.accelerometer.watch._getIDIndex = function(id)
{
    for (var i=0; i<deviceapis.accelerometer.watch.accelerometers.length; i++) {
    	if (deviceapis.accelerometer.watch.accelerometers[i].id == id) {
    		return i;
    	}
    }
    return -1;
};

deviceapis.accelerometer.watchAcceleration = function(onSuccessCallback, onFailureCallback, options)
{
	var accelerometer = new Accelerometer();
	deviceapis.accelerometer.watch.accelerometers.push(accelerometer);
	accelerometer.watchAcceleration(onSuccessCallback, onFailureCallback, options);
	return accelerometer.id;
};

deviceapis.accelerometer._watchAccelerationLoop = function(id)
{
	var index = deviceapis.accelerometer.watch._getIDIndex(id);
	if (index!==-1) { // watcher still active
		var accelerometer = deviceapis.accelerometer.watch.accelerometers[index];
		accelerometer._watchAccelerationLoop();
	}
};

deviceapis.accelerometer._watchAcceleration = function(id, x, y, z)
{
	var index = deviceapis.accelerometer.watch._getIDIndex(id);
	if (index!==-1) { // watcher still active
		var accelerometer = deviceapis.accelerometer.watch.accelerometers[index];
		accelerometer._watchAcceleration(x, y, z);
		setTimeout("deviceapis.accelerometer._watchAccelerationLoop("+accelerometer.id+")", accelerometer.minNotificationInterval);
	}
};

deviceapis.accelerometer._watchAccelerationError = function(id)
{
	var index = deviceapis.accelerometer.watch._getIDIndex(id);
	if (index!==-1) { // watcher still active
		var accelerometer = deviceapis.accelerometer.watch.accelerometers[index];
		accelerometer._watchAccelerationError();
		deviceapis.accelerometer.watch.accelerometers.splice(index, 1);
	}
};

//		clear watch
deviceapis.accelerometer.clearWatch = function(id, callback)
{
	var index = deviceapis.accelerometer.watch._getIDIndex(id);
	if (index!==-1) { // watcher still active	
		var accelerometer = deviceapis.accelerometer.watch.accelerometers[index];
		accelerometer.clearWatch(callback);
	}
};

deviceapis.accelerometer._clearWatch = function(id)
{
	var index = deviceapis.accelerometer.watch._getIDIndex(id);
	if (index!==-1) { // watcher still active	
		var accelerometer = deviceapis.accelerometer.watch.accelerometers[index];
		accelerometer._clearWatch();
		deviceapis.accelerometer.watch.accelerometers.splice(index, 1);
	}
};
/*global deviceapis */
/*global callDeviceAPI */

// Augmented Reality
deviceapis.augmentedreality = new Object();
//deviceapis.augmentedreality.callback;

deviceapis.augmentedreality.launch = function(pois, callback)
{
	var ids = "";
	var labels = "";
	var latitudes = "";
	var longitudes = "";
	var altitudes = "";
	
	pois = pois.POIs;
	for (var i=0; i<pois.length; i++) {
		var poi = pois[i];
		if (i>0) {
			ids += ";";
			labels += ";";
			latitudes += ";";
			longitudes += ";";
			altitudes += ";";
		}
		ids += poi.id;
		labels += poi.label;
		latitudes += poi.coordinates[0];
		longitudes += poi.coordinates[1];
		altitudes += poi.coordinates[2];
	}
	deviceapis.augmentedreality.launch._callback = callback;
	callDeviceAPI("AUGMENTEDREALITY", "ids="+encodeURIComponent(ids)+"&labels="+encodeURIComponent(labels)+"&latitudes="+latitudes+"&longitudes="+longitudes+"&altitudes="+altitudes+"&callback=deviceapis.augmentedreality._launch");
};

deviceapis.augmentedreality._launch = function(data)
{
	deviceapis.augmentedreality.launch._callback(data);
};
/*global deviceapis */
/*global callDeviceAPI */

// Barcode
function Barcode(text, type)
{
	this.text = text;
	this.type = type;
}

deviceapis.barcode = new Object();
//deviceapis.barcode.onSuccessCallback;
//deviceapis.barcode.onFailureCallback;

deviceapis.barcode.scan = function(onSuccessCallback, onFailureCallback)
{
	deviceapis.barcode.scan._onSuccessCallback = onSuccessCallback;
	deviceapis.barcode.scan._onFailureCallback = onFailureCallback;
	callDeviceAPI("BARCODE", "onSuccessCallback=deviceapis.barcode._scan&onFailureCallback=deviceapis.barcode._scanError");
};

deviceapis.barcode._scan = function(text, type)
{
	var barcode = new Barcode(text, type);
	deviceapis.barcode.scan._onSuccessCallback(barcode);
};

deviceapis.barcode._scanError = function(errorCode)
{
	if (deviceapis.barcode.scan._onFailureCallback != undefined) {
		deviceapis.barcode.scan._onFailureCallback(errorCode);
	}
};
/*global deviceapis */
/*global callDeviceAPI */

// Calendar
deviceapis.pim.calendar = new Object();
//deviceapis.pim.calendar.onSuccessCallback;
//deviceapis.pim.calendar.onFailureCallback;

deviceapis.pim.calendar.findEvents = function(onSuccessCallback, onFailureCallback, filter)
{
	deviceapis.pim.calendar.findEvents._onSuccessCallback = onSuccessCallback;
	deviceapis.pim.calendar.findEvents._onFailureCallback = onFailureCallback;
	for (var i in filter) {
		filter[i] = encodeURIComponent(filter[i]);
	}
	callDeviceAPI("CALENDAR", "onSuccessCallback=deviceapis.pim.calendar._findEvents&onFailureCallback=deviceapis.pim.calendar._findEventsError&filter="+encodeURIComponent(JSON.stringify(filter)));
};

deviceapis.pim.calendar._findEvents = function(data)
{
	var events = new Array();
	var eventsJSONObject = JSON.parse(data);
	if ((eventsJSONObject!==null) && (eventsJSONObject.events!==null)) {
    	events = eventsJSONObject.events;
	}
	deviceapis.pim.calendar.findEvents._onSuccessCallback(events);
};

deviceapis.pim.calendar._findEventsError = function(errorCode)
{
	if (deviceapis.pim.calendar.findEvents._onFailureCallback!== undefined) {
		deviceapis.pim.calendar.findEvents._onFailureCallback(errorCode);
	}
};
/*global deviceapis */
/*global callDeviceAPI */

// Camera
function Picture(url, data)
{
	this.url = url;
	this.data = data;
}

deviceapis.camera = new Object();
//deviceapis.camera.onSuccessCallback;
//deviceapis.camera.onFailureCallback;

deviceapis.camera.captureImage = function(onSuccessCallback, onFailureCallback)
{
	deviceapis.camera.captureImage._onSuccessCallback = onSuccessCallback;
	deviceapis.camera.captureImage._onFailureCallback = onFailureCallback;
	callDeviceAPI("CAPTURE", "onSuccessCallback=deviceapis.camera._captureImage&onFailureCallback=deviceapis.camera._captureImageError");
};

deviceapis.camera._captureImage = function(url, data)
{
	var picture = new Picture(url, data);
	deviceapis.camera.captureImage._onSuccessCallback(picture);
};

deviceapis.camera._captureImageError = function(error)
{
	if (deviceapis.camera.captureImage._onFailureCallback != undefined) {
		deviceapis.camera.captureImage._onFailureCallback(error);
	}
};
/*global deviceapis */
/*global callDeviceAPI */

// Contacts
function Contact(firstName, secondName, lastName, organizationName, phoneNumbers, emails)
{
	this.firstName = firstName;
	this.secondName = secondName;
	this.lastName = lastName;
	this.organizationName = organizationName;
	this.phoneNumbers = phoneNumbers;
	this.emails = emails;
	
	this.toJSON = function()
	{
		return "{" +
			"\"firstName\":\"" + firstName + "\"," +
			"\"secondName\":\"" + secondName + "\"," +
			"\"lastName\":\"" + lastName + "\"," +
			"\"organizationName\":\"" + organizationName + "\"," +
			"\"phoneNumbers\":\"" + phoneNumbers + "\"," +
			"\"emails\":\"" + emails + "\"" +
			"}";
	};

	this.toJSONWithEncodedValues = function()
	{
		return "{" +
			"\"firstName\":\"" + encodeURIComponent(firstName) + "\"," +
			"\"secondName\":\"" + encodeURIComponent(secondName) + "\"," +
			"\"lastName\":\"" + encodeURIComponent(lastName) + "\"," +
			"\"organizationName\":\"" + encodeURIComponent(organizationName) + "\"," +
			"\"phoneNumbers\":\"" + encodeURIComponent(phoneNumbers) + "\"," +
			"\"emails\":\"" + encodeURIComponent(emails) + "\"" +
			"}";
	};
}

deviceapis.pim.contact = new Object();

//		find contacts
deviceapis.pim.contact.findContacts = function(onSuccessCallback, onFailureCallback, filter)
{
	deviceapis.pim.contact.filter = filter;
	deviceapis.pim.contact.findContacts._onSuccessCallback = onSuccessCallback;
	deviceapis.pim.contact.findContacts._onFailureCallback = onFailureCallback;
	callDeviceAPI("CONTACTS", "action=find&onSuccessCallback=deviceapis.pim.contact._findContacts&onFailureCallback=deviceapis.pim.contact._findContactsError");
};

deviceapis.pim.contact._findContacts = function(data)
{
	var contacts = new Array();
	var contactsJSONObject = JSON.parse(data);
	if ((contactsJSONObject!==null) && (contactsJSONObject.contacts!==null)) {
    	contacts = contactsJSONObject.contacts;
	}
	
	// filter
	var filteredContacts = new Array();
	var filter = deviceapis.pim.contact.filter;
	if ((filter == null) || (filter == "undefined")) {
		filteredContacts = contacts;
	} else {
		for (var i=0; i<contacts.length; i++) {
			if ((deviceapis._utils.matchFilter(contacts[i].firstName, filter.firstName)) &&
				(deviceapis._utils.matchFilter(contacts[i].secondName, filter.secondName)) &&
				(deviceapis._utils.matchFilter(contacts[i].lastName, filter.lastName)) &&
				(deviceapis._utils.matchFilter(contacts[i].organizationName, filter.organizationName)) &&
				(deviceapis._utils.matchFilterInList(contacts[i].phoneNumbers, "number", filter.phoneNumber)) &&
				(deviceapis._utils.matchFilterInList(contacts[i].emails, "email", filter.email))) {
				filteredContacts.push(contacts[i]);
			}
		}
	}
	deviceapis.pim.contact.findContacts._onSuccessCallback(filteredContacts);	
};

deviceapis.pim.contact._findContactsError = function(errorCode)
{
	if (deviceapis.pim.contact.findContacts._onFailureCallback != undefined) {
		deviceapis.pim.contact.findContacts._onFailureCallback(errorCode);
	}
};

//		create contact
deviceapis.pim.contact.createContact = function(data)
{
	var firstName = "";
	var secondName = "";
	var lastName = "";
	var companyName = "";
	var phoneNumbers = [];
	var emails = [];
	
	if (data.firstName != undefined) {
		firstName = data.firstName;
	}
	if (data.secondName != undefined) {
		secondName = data.secondName;
	}
	if (data.lastName != undefined) {
		lastName = data.lastName;
	}
	if (data.companyName != undefined) {
		companyName = data.companyName;
	}
	if (data.phoneNumbers != undefined) {
		phoneNumbers = data.phoneNumbers;
	}
	if (data.emails != undefined) {
		emails = data.emails;
	}	
	
	return new Contact(firstName, secondName, lastName, companyName, phoneNumbers, emails);
};

//		add contact
deviceapis.pim.contact.addContact = function(contact, onSuccessCallback, onFailureCallback)
{
	deviceapis.pim.contact.addContact._onSuccessCallback = onSuccessCallback;
	deviceapis.pim.contact.addContact._onFailureCallback = onFailureCallback;
	callDeviceAPI("CONTACTS", "action=add&contact=" + contact.toJSONWithEncodedValues() + "&onSuccessCallback=deviceapis.pim.contact._addContact&onFailureCallback=deviceapis.pim.contact._addContactError");
};

deviceapis.pim.contact._addContact = function()
{
	if (deviceapis.pim.contact.addContact._onSuccessCallback != undefined) {
		deviceapis.pim.contact.addContact._onSuccessCallback();	
	}
};

deviceapis.pim.contact._addContactError = function()
{
	if (deviceapis.pim.contact.addContact._onFailureCallback != undefined) {
		deviceapis.pim.contact.addContact._onFailureCallback();
	}
};
/*global deviceapis */
/*global callDeviceAPI */

// Context
deviceapis.context = new Object();
//deviceapis.context.callback;

deviceapis.context.save = function (name, value, callback)
{
	deviceapis.context.save._callback = callback;
	callDeviceAPI("CONTEXT", "action=save&name="+encodeURIComponent(name)+"&value="+encodeURIComponent(value)+"&callback=deviceapis.context._save");
};
deviceapis.context._save = function()
{
	if (deviceapis.context.save._callback != undefined) {
		deviceapis.context.save._callback();
	}
};

deviceapis.context.load = function(name, callback)
{
	deviceapis.context.load._callback = callback;
	callDeviceAPI("CONTEXT", "action=load&name="+encodeURIComponent(name)+"&callback=deviceapis.context._load");
};
deviceapis.context._load = function(value)
{
	eval("deviceapis.context.load._callback('"+deviceapis._utils.escapeString(decodeURIComponent(value))+"')");
};
/*global deviceapis */
/*global callDeviceAPI */

// Debug
deviceapis.debug = new Object();
//deviceapis.debug.callback;
//deviceapis.debug.onSuccessCallback;
//deviceapis.debug.onFailureCallback;

function DebugConfiguration(status, persistence, level, maxlines, cleaning)
{
	this.status = status;
	this.persistence = persistence;
	this.level = level;
	this.maxlines = maxlines;
	this.cleaning = cleaning;
}

deviceapis.debug.getConfiguration = function(callback)
{
	deviceapis.debug.getConfiguration._callback = callback;
	callDeviceAPI("DEBUG","action=getConfiguration&callback=deviceapis.debug._getConfiguration");
};
deviceapis.debug._getConfiguration = function(status, persistence, level, maxlines, cleaning)
{
	if (deviceapis.debug.getConfiguration._callback != undefined) {
		deviceapis.debug.getConfiguration._callback(new DebugConfiguration(status, persistence, level, maxlines, cleaning));
	}
};

deviceapis.debug.setConfiguration = function(status, persistence, level, maxlines, cleaning, callback)
{
	deviceapis.debug.setConfiguration._callback = callback;
	callDeviceAPI("DEBUG","action=setConfiguration&status="+status+"&persistence="+persistence+"&level="+level+"&maxlines="+maxlines+"&cleaning="+cleaning+"&callback=deviceapis.debug._setConfiguration");
};
deviceapis.debug._setConfiguration = function()
{
	if (deviceapis.debug.setConfiguration._callback != undefined) {
		deviceapis.debug.setConfiguration._callback();
	}
};

deviceapis.debug.start = function(callback)
{
	deviceapis.debug.start._callback = callback;
	callDeviceAPI("DEBUG","action=start&callback=deviceapis.debug._start");
};
deviceapis.debug._start = function()
{
	if (deviceapis.debug.start._callback != undefined) {
		deviceapis.debug.start._callback();
	}
};

deviceapis.debug.stop = function(callback)
{
	deviceapis.debug.stop._callback = callback;
	callDeviceAPI("DEBUG","action=stop&callback=deviceapis.debug._stop");
};
deviceapis.debug._stop = function()
{
	if (deviceapis.debug.stop._callback != undefined) {
		deviceapis.debug.stop._callback();
	}
};

deviceapis.debug.load = function(callback)
{
	deviceapis.debug.load._callback = callback;
	callDeviceAPI("DEBUG","action=load&callback=deviceapis.debug._load");
};
deviceapis.debug._load = function(data)
{
	if (deviceapis.debug.load._callback != undefined) {
		var logsArray = new Array();
		var logsJSONObject = JSON.parse(data);
		if ((logsJSONObject!==null) && (logsJSONObject.logs!==null)) {
			logsArray = logsJSONObject.logs;
		}
		deviceapis.debug.load._callback(logsArray);
	}
};

deviceapis.debug.clean = function(callback)
{
	deviceapis.debug.clean._callback = callback;
	callDeviceAPI("DEBUG","action=clean&callback=deviceapis.debug._clean");
};
deviceapis.debug._clean = function()
{
	if (deviceapis.debug.clean._callback  != undefined) {
		deviceapis.debug.clean._callback ();
	}
};

deviceapis.debug.post = function(onSuccessCallback, onFailureCallback)
{
	deviceapis.debug.post._onSuccessCallback = onSuccessCallback;
	deviceapis.debug.post._onFailureCallback = onFailureCallback;
	callDeviceAPI("DEBUG","action=post&onSuccessCallback=deviceapis.debug._post&onFailureCallback=deviceapis.debug._postError");
};
deviceapis.debug._post = function()
{
	if (deviceapis.debug.post._onSuccessCallback != undefined) {
		deviceapis.debug.post._onSuccessCallback();
	}
};
deviceapis.debug._postError = function()
{
	if (deviceapis.debug.post._onFailureCallback != undefined) {
		deviceapis.debug.post._onFailureCallback();
	}
};
/*global deviceapis */
/*global callDeviceAPI */

// Device
function DeviceInformation(brand, model, os, screenWidth, screenHeight, translucentAreaWidth, translucentAreaHeight)
{
	this.brand = brand;
	this.model = model;
	this.os = os;
	
	this.screenWidth = screenWidth;
	this.screenHeight = screenHeight;
	
	this.translucentAreaWidth = translucentAreaWidth;
	this.translucentAreaHeight = translucentAreaHeight;
}

function DeviceIDs(udid, udidErrorCode, usid, usidErrorCode)
{
	this.udid = udid;
	this.udidErrorCode = udidErrorCode;
	this.usid = usid;
	this.usidErrorCode = usidErrorCode;
}

deviceapis.device = new Object();
deviceapis.device._properties = null;
deviceapis.device._ids = null;


// properties
deviceapis.device.getProperties = function(callback)
{
	deviceapis.device.getProperties._callback = callback;
	callDeviceAPI("DEVICE", "action=getProperties&callback=deviceapis.device._getProperties");
};

deviceapis.device._getProperties = function(brand, model, os, screenWidth, screenHeight, translucentAreaWidth, translucentAreaHeight)
{
	deviceapis.device._properties = new DeviceInformation(brand, model, os, screenWidth, screenHeight, translucentAreaWidth, translucentAreaHeight);
	deviceapis.device.getProperties._callback(deviceapis.device._properties);
};

// IDs
deviceapis.device.getIDs = function(callback)
{
	deviceapis.device.getIDs._callback = callback;
	if (deviceapis.device._ids == null) {
		callDeviceAPI("DEVICE", "action=getIDs&callback=deviceapis.device._getIDs");
	} else {
		deviceapis.device.getIDs._callback(deviceapis.device._ids);
	}
};

deviceapis.device._getIDs = function(udid, udidErrorCode, usid, usidErrorCode)
{
	deviceapis.device._ids = new DeviceIDs(udid, udidErrorCode, usid, usidErrorCode);
	deviceapis.device.getIDs._callback(deviceapis.device._ids);
};
/*global deviceapis */
/*global callDeviceAPI */

// Device interaction
deviceapis.deviceinteraction = new Object();
//deviceapis.deviceinteraction.onSuccessCallback;
//deviceapis.deviceinteraction.onFailureCallback;
//deviceapis.deviceinteraction.callback

// Call
deviceapis.deviceinteraction.call = function(number, onSuccessCallback, onFailureCallback)
{
	deviceapis.deviceinteraction.call._onSuccessCallback = onSuccessCallback;
	deviceapis.deviceinteraction.call._onFailureCallback = onFailureCallback;
	callDeviceAPI("CALL", "number="+encodeURIComponent(number)+"&onSuccessCallback=deviceapis.deviceinteraction._call&onFailureCallback=deviceapis.deviceinteraction._callError");
};
deviceapis.deviceinteraction._call = function()
{
	if (deviceapis.deviceinteraction.call._onSuccessCallback != undefined) {
		deviceapis.deviceinteraction.call._onSuccessCallback();
	}
};
deviceapis.deviceinteraction._callError = function(errorCode)
{
	if (deviceapis.deviceinteraction.call._onFailureCallback != undefined) {
		deviceapis.deviceinteraction.call._onFailureCallback(errorCode);
	}
};

// Vibrate
deviceapis.deviceinteraction.startVibrate = function(duration)
{
	if (duration===undefined) {
		duration = "";
	}
	callDeviceAPI("VIBRATE", "action=start&duration="+duration);
};
deviceapis.deviceinteraction.stopVibrate = function()
{
	callDeviceAPI("VIBRATE", "action=stop");
};

/* deprecated
// Volume
deviceapis.deviceinteraction.mute = function()
{
	callDeviceAPI("VOLUME", "action=off");
};
deviceapis.deviceinteraction.unmute = function()
{
	callDeviceAPI("VOLUME", "action=on");
};
deviceapis.deviceinteraction.increaseVolume = function()
{
	callDeviceAPI("VOLUME", "action=up");
};
deviceapis.deviceinteraction.decreaseVolume = function()
{
	callDeviceAPI("VOLUME", "action=down");
};
*//*global deviceapis */
/*global callDeviceAPI */

// Engine
function EngineInformation(version, HAWKversion)
{
	this.version = version;
	this.HAWKversion = HAWKversion;
}

deviceapis._engine = new Object();
deviceapis._engine._properties = null;
deviceapis._engine.version = "x.y.z";
deviceapis._engine.HAWKversion = "a.b.c";
//deviceapis._engine.callback;

deviceapis._engine.getProperties = function(callback)
{
	deviceapis._engine.getProperties._callback = callback;
	if (deviceapis._engine._properties == null) {
		callDeviceAPI("ENGINE", "jslibversion=" + deviceapis._version + "&callback=deviceapis._engine._getProperties");
	} else {
		deviceapis._engine.getProperties._callback(deviceapis._engine._properties);
	}
};

deviceapis._engine._getProperties = function(version, HAWKversion)
{
	deviceapis._engine.version = version;
	deviceapis._engine.HAWKversion = HAWKversion;
	deviceapis._engine._properties = new EngineInformation(version, HAWKversion);
	deviceapis._engine.getProperties._callback(deviceapis._engine._properties);
};

/*global deviceapis */
/*global callDeviceAPI */

// Features
//deviceapis.listAvailableFeatures.callback;

deviceapis.listAvailableFeatures = function(callback)
{
	deviceapis.listAvailableFeatures._callback = callback;
	callDeviceAPI("FEATURES","callback=deviceapis._listAvailableFeatures");
};

deviceapis._listAvailableFeatures = function(data)
{
	var features = new Array();
	var featuresJSONObject = JSON.parse(data);
	if ((featuresJSONObject!==null) && (featuresJSONObject.features!==null)) {
		features = featuresJSONObject.features;
	}
	deviceapis.listAvailableFeatures._callback(features);
};
/*global deviceapis */
/*global callDeviceAPI */

// Filesystem
deviceapis.filesystem = new Object();
//deviceapis.filesystem.onSuccessCallback;
//deviceapis.filesystem.onFailureCallback;

// Contains all instantiated objects by this API (File, FileStream)
deviceapis.filesystem.objects = [];	
// Virtual roots available on WAC
deviceapis.filesystem.wacVirtualRoots = ["documents", "images", "music", "videos", "downloads", "wgt-package", "wgt-private", "wgt-private-tmp", "removable"];

// Upload
deviceapis.filesystem.upload = function(file, type, destination, onSuccessCallback, onFailureCallback)
{
	deviceapis.filesystem.upload._onSuccessCallback = onSuccessCallback;
	deviceapis.filesystem.upload._onFailureCallback = onFailureCallback;
	callDeviceAPI("UPLOAD", "file=" + encodeURIComponent(file) + "&type=" + encodeURIComponent(type) + "&destination=" + encodeURIComponent(destination) +"&onSuccessCallback=deviceapis.filesystem._upload&onFailureCallback=deviceapis.filesystem._uploadError");
};

deviceapis.filesystem._upload = function()
{
	if (deviceapis.filesystem.upload._onSuccessCallback != undefined) {
		deviceapis.filesystem.upload._onSuccessCallback();
	}
};

deviceapis.filesystem._uploadError = function()
{
	if (deviceapis.filesystem.upload._onFailureCallback != undefined) {
		deviceapis.filesystem.upload._onFailureCallback();
	}
};

// Resolve
deviceapis.filesystem.resolve = function(onSuccessCallback,  onFailureCallback, location, mode)
{
	deviceapis.filesystem.resolve._onSuccessCallback = onSuccessCallback;
	deviceapis.filesystem.resolve._onFailureCallback = onFailureCallback;
	deviceapis.filesystem.mode = mode;
	
	// Check parameters
	if (!onSuccessCallback || !location || !mode) {
		deviceapis.filesystem._resolveError("InvalidValuesError", "resolve: Missing parameters");
		return;			
	}
	if ((mode != "r") && (mode != "rw")) {
		this._openStreamError(new Error("InvalidValuesError", "resolve: Mode must be r or rw"));
		return;			
	}	
	
	// Separate the virtual root from the path 
	var splittedLocation = location.split('/');
	var locationVirtualRoot = splittedLocation.shift();								// VirtualRoot
	deviceapis.filesystem._recursiveResolvePath = splittedLocation.join('/');	// B/../C.txt
		
	var allVirtualRoots = '+' + deviceapis.filesystem.wacVirtualRoots.join('+') + '+';
	if (-1 == allVirtualRoots.indexOf('+' + locationVirtualRoot + '+')) {
		deviceapis.filesystem._resolveError("NotFoundError", "resolve: Invalid virtual root");
		return;			
	}
	
	// Resolve the virtual root first, then the full path
	// Refer to File.resolve comments for more details
	callDeviceAPI("FILESYSTEM", "action=resolveRoot&location=" + encodeURIComponent(locationVirtualRoot) + "&onSuccessCallback=deviceapis.filesystem._resolve&onFailureCallback=deviceapis.filesystem._resolveError");
};

deviceapis.filesystem._resolve = function(properties)
{
	var file = new deviceapis.filesystem.File(JSON.parse(properties), undefined, deviceapis.filesystem.mode);
	
	// Check if we need to continue resolving the path
	if ("" != deviceapis.filesystem._recursiveResolvePath) {
		file.resolve(deviceapis.filesystem.resolve._onSuccessCallback, deviceapis.filesystem.resolve._onFailureCallback, deviceapis.filesystem._recursiveResolvePath, deviceapis.filesystem.mode);
	}
	else {
		deviceapis.filesystem.resolve._onSuccessCallback(file);		
	}	
};

deviceapis.filesystem._resolveError = function(type, message)
{
	if (deviceapis.filesystem.resolve._onFailureCallback) {
		deviceapis.filesystem.resolve._onFailureCallback(new Error(type, message));	
	}
};

// File class
deviceapis.filesystem.File = function(properties, parent, mode)
{
	this.parent = parent;
	 
	// The access rights (r or rw)
	if (mode) {
		this._mode = mode;	 
	}
	else {
		// Reuse the parent
		this._mode = parent._mode;
	}
	 
	// Copy properties fields to this object
	for (var key in properties) {
		this[key] = properties[key];
	}
	 
	 // Convert datetimes expressed in seconds since epoch(UTC) to javacript local date
	if (this.created) {
		this.created = new Date(this.created * 1000);
	}
	if (this.modified) {
		this.modified = new Date(this.modified * 1000);
	}
	 
	// Store the object reference. Used in callbacks to retrieve the object
	this._reference = deviceapis.filesystem.objects.length;
	deviceapis.filesystem.objects.push(this);
};

deviceapis.filesystem.File.prototype = {
	toURI: function() {
		return this._uri;
	},
	
	listFiles: function(successCallback, errorCallback, filter) {
		this._onSuccessCallback = successCallback;
		this._onFailureCallback = errorCallback;
		this._filterDate = undefined;
			
		// Check parameters
		if (!successCallback) {
			this._listFilesError(new Error("InvalidValuesError", "listFiles: Missing parameters"));
			return;			
		}
		
		var filterName = null;
		if (filter) {
			// Report name
			filterName = filter.name;
			
			// Date filtering is managed by this class
			this._filterDate = new Object();
			if (filter.startModified) {
				this._filterDate.startModified = filter.startModified.getTime() / 1000;
			}
			if (filter.endModified) {
				this._filterDate.endModified = filter.endModified.getTime() / 1000;
			}
			if (filter.startCreated) {
				this._filterDate.startCreated = filter.startCreated.getTime() / 1000;
			}
			if (filter.endCreated) {
				this._filterDate.endCreated = filter.endCreated.getTime() / 1000;
			}
		}
		
		deviceapis.filesystem.File.listFiles(this._reference, this.fullPath, filterName);
	},
	_listFiles: function(propertiesArray) {
		var files = [];
		for (var nI in propertiesArray) {
			// Check if the item respects the filters if any
			if (this._filterDate) {
				if (propertiesArray[nI].created) {
					if (this._filterDate.startCreated && (propertiesArray[nI].created < this._filterDate.startCreated)) {
						// Creation date if before the filter
						continue;
					}
					if (this._filterDate.endCreated && (propertiesArray[nI].created > this._filterDate.endCreated)) {
						// Creation date if after the filter
						continue;
					}
				}
				if (propertiesArray[nI].modified) {
					if (this._filterDate.startModified && (propertiesArray[nI].modified < this._filterDate.startModified)) {
						// Last modification date if before the filter
						continue;
					}
					if (this._filterDate.endModified && (propertiesArray[nI].modified > this._filterDate.endModified)) {
						// Last modification date if after the filter
						continue;
					}
				}
			}
			
			// Add it to the result array
			files.push(new deviceapis.filesystem.File(propertiesArray[nI], this));
		}
		this._onSuccessCallback(files);
	},
	_listFilesError: function(error) {
		if (this._onFailureCallback) {
			this._onFailureCallback(error);
		}
	},
	
	readAsText: function(successCallback, errorCallback, encoding) {
		this._onSuccessCallback = successCallback;
		this._onFailureCallback = errorCallback;
		
		// Check parameters
		if (!successCallback ) {
			this._readAsTextError(new Error("InvalidValuesError", "readAsText: Missing parameters"));
			return;			
		}
		if (!this.isFile) {
			this._readAsTextError(new Error("IOError", "readAsText: Not a file"));
			return;			
		}
		if (encoding && (encoding != "UTF-8")) {
			this._readAsTextError(new Error("InvalidValuesError", "readAsText: Only UTF-8 encoding is supported"));
			return;			
		}	
		if ((this._mode != "r") && (this._mode != "rw")) {
			this._readAsTextError(new Error("SecurityError", "readAsText: Not in read mode"));
			return;						
		}	
		
		deviceapis.filesystem.File.readAsText(this._reference, this.fullPath);
	},
	_readAsText: function(text) {
		this._onSuccessCallback(text);		
	},
	_readAsTextError: function(error) {
		if (this._onFailureCallback) {
			this._onFailureCallback(error);
		}
	},		
	
	openStream: function(successCallback, errorCallback, mode, encoding) {
		this._onSuccessCallback = successCallback;		
		this._onFailureCallback = errorCallback;
		
		// Check parameters
		if (!successCallback || !mode) {
			this._openStreamError(new Error("InvalidValuesError", "openStream: Missing parameters"));
			return;			
		}
		if (!this.isFile) {
			this._openStreamError(new Error("IOError", "openStream: Not a file"));
			return;			
		}
		if (encoding && (encoding != "UTF-8")) {
			this._openStreamError(new Error("InvalidValuesError", "openStream: Only UTF-8 encoding is supported"));
			return;			
		}
		if ((mode != "r") && (mode != "w") && (mode != "a")) {
			this._openStreamError(new Error("InvalidValuesError", "openStream: Mode must be r, w or a"));
			return;			
		}	
		if (((mode == "w") || (mode == "a")) && (this._mode != "rw")) {
			this._openStreamError(new Error("SecurityError", "openStream: Not in rw mode"));
			return;						
		}	
		
		// Instantiate the FileStream object
		this._fileStream = new deviceapis.filesystem.FileStream(this, mode);
		
		// And call device api top prepare the file
		deviceapis.filesystem.File.openStream(this._reference, this.fullPath, mode);
	},
	_openStream: function() {
		this._onSuccessCallback(this._fileStream);		
	},	
	_openStreamError: function(error) {
		this._fileStream = undefined;
		if (this._onFailureCallback) {
			this._onFailureCallback(error);
		}
	},	

	resolve: function(successCallback, errorCallback, filePath) {
		this._onSuccessCallback = successCallback;
		this._onFailureCallback = errorCallback;
		
		// Check parameters
		if (!successCallback || !filePath) {
			this._resolveError(new Error("InvalidValuesError", "resolve: Missing parameters"));
			return;			
		}
		
		// Due to the parent member of the File class, we need to build File instances of each subfolder
		// in filePath.
		// If filePath is A/B/C.txt, start by resolving A, then resolve B/C.txt from the generated A file,
		// and then resolve C.txt from the generate B file. The generated C file with be the object we will
		// return.
		var splittedFilePath = filePath.split('/');				// [A, B, C.txt]
		var path = splittedFilePath.shift();						// A
		this._recursiveResolvePath = splittedFilePath.join('/');	// B/C.txt

		deviceapis.filesystem.File.resolve(this._reference, this.fullPath, path);
	},
	_resolve: function(properties) {
		var file = new deviceapis.filesystem.File(properties, this);
		
		// Check if we need to continue resolving the path
		if ("" != this._recursiveResolvePath) {
			file.resolve(this._onSuccessCallback, this._onFailureCallback, this._recursiveResolvePath);
		}
		else {
			this._onSuccessCallback(file);		
		}
	},
	_resolveError: function(error) {
		if (this._onFailureCallback) {
			this._onFailureCallback(error);
		}
	},	
	
	deleteDirectory: function(successCallback, errorCallback, directory, recursive) {
		this._onSuccessCallback = successCallback;
		this._onFailureCallback = errorCallback;	
		
		// Check parameters
		if (!successCallback || !directory) {
			this._deleteDirectoryError(new Error("InvalidValuesError", "deleteDirectory: Missing parameters"));
			return;			
		}
		if (!this.isDirectory) {
			this._deleteDirectoryError(new Error("IOError", "deleteDirectory: File object is not a directory"));
			return;			
		}
		if (this._mode != "rw") {
			this._deleteDirectoryError(new Error("SecurityError", "deleteDirectory: Not in rw mode"));
			return;						
		}
		
		// According to the WAC spec:
		//    - the "directory" parameter is the full path string of the directory to delete.
		//    - this directory must be under the current folder (the current "this" object")
		// So, we just need the relative path of "directory" from the current folder.
		// If it cannot be retrieved, this is a INVALID_VALUES_ERR.
		var relativePath = this._getRelativePath(directory);
		if (!relativePath) {	
			this._deleteDirectoryError(new Error("InvalidValuesError", "deleteDirectory: Directory is not under the current directory"));
			return;
		}
		
		deviceapis.filesystem.File.deleteDirectory(this._reference, this.fullPath, relativePath, recursive);
	},
	_deleteDirectory: function() {
		this._onSuccessCallback();
	},
	_deleteDirectoryError: function(error) {
		if (this._onFailureCallback) {
			this._onFailureCallback(error);
		}
	},
	
	deleteFile: function(successCallback, errorCallback, file) {
		this._onSuccessCallback = successCallback;
		this._onFailureCallback = errorCallback;
		
		// Check parameters
		if (!successCallback || !file) {
			this._deleteFileError(new Error("InvalidValuesError", "deleteFile: Missing parameters"));
			return;			
		}
		if (!this.isDirectory) {
			this._deleteFileError(new Error("IOError", "deleteFile: File object is not a directory"));
			return;			
		}
		if (this._mode != "rw") {
			this._deleteFileError(new Error("SecurityError", "deleteFile: Not in rw mode"));
			return;						
		}		
		
		// Get relative path from this File path (check deleteDirectory for more details)
		var relativePath = this._getRelativePath(file);
		if (!relativePath) {	
			this._deleteFileError(new Error("InvalidValuesError", "deleteFile: File is not under the current directory"));
			return;
		}
		
		deviceapis.filesystem.File.deleteFile(this._reference, this.fullPath, relativePath);
	},
	_deleteFile: function() {
		this._onSuccessCallback();
	},
	_deleteFileError: function(error) {
		if (this._onFailureCallback) {
			this._onFailureCallback(error);
		}
	},	

	copyTo: function(successCallback, errorCallback, originalFilePath, destinationFilePath, overwrite) {
		this._onSuccessCallback = successCallback;
		this._onFailureCallback = errorCallback;
		
		// Check parameters
		if (!successCallback || !originalFilePath || !destinationFilePath || (undefined == overwrite)) {
			this._copyToError(new Error("InvalidValuesError", "copyTo: Missing parameters"));
			return;			
		}
		if (this._mode != "rw") {
			this._copyToError(new Error("SecurityError", "copyTo: Not in rw mode"));
			return;						
		}		
		
		// Get relative path from this File path (check deleteDirectory for more details)
		var relativePath = this._getRelativePath(originalFilePath);
		if (!relativePath) {	
			this._copyToError(new Error("InvalidValuesError", "copyTo: File or Directory is not under the current directory"));
			return;
		}
		
		deviceapis.filesystem.File.copyTo(this._reference, this.fullPath, relativePath, destinationFilePath, overwrite);
	},
	_copyTo: function() {
		this._onSuccessCallback();
	},
	_copyToError: function(error) {
		if (this._onFailureCallback) {
			this._onFailureCallback(error);
		}
	},	

	moveTo: function(successCallback, errorCallback, originalFilePath, destinationFilePath, overwrite) {
		this._onSuccessCallback = successCallback;
		this._onFailureCallback = errorCallback;
		
		// Check parameters
		if (!successCallback || !originalFilePath || !destinationFilePath || (undefined == overwrite)) {
			this._moveToError(new Error("InvalidValuesError", "moveTo: Missing parameters"));
			return;			
		}
		if (this._mode != "rw") {
			this._moveToError(new Error("SecurityError", "moveTo: Not in rw mode"));
			return;						
		}		
		
		// Get relative path from this File path (check deleteDirectory for more details)
		var relativePath = this._getRelativePath(originalFilePath);
		if (!relativePath) {	
			this._moveToError(new Error("InvalidValuesError", "moveTo: File or Directory is not under the current directory"));
			return;
		}
		
		deviceapis.filesystem.File.moveTo(this._reference, this.fullPath, relativePath, destinationFilePath, overwrite);
	},
	_moveTo: function() {
		this._onSuccessCallback();
	},
	_moveToError: function(error) {
		if (this._onFailureCallback) {
			this._onFailureCallback(error);
		}
	},		
	
	uncompressTo: function(successCallback, errorCallback, zipFilePath, destinationFilePath, overwrite, password) {
		this._onSuccessCallback = successCallback;
		this._onFailureCallback = errorCallback;
		
		// Check parameters
		if (!successCallback || !zipFilePath || !destinationFilePath || (undefined == overwrite)) {
			this._uncompressToError(new Error("InvalidValuesError", "uncompressTo: Missing parameters"));
			return;			
		}
		if (this._mode != "rw") {
			this._uncompressToError(new Error("SecurityError", "uncompressTo: Not in rw mode"));
			return;						
		}		
		
		// Get relative path from this File path (check deleteDirectory for more details)
		var relativePath = this._getRelativePath(zipFilePath);
		if (!relativePath) {	
			this._uncompressToError(new Error("InvalidValuesError", "uncompressTo: The zip file is not under the current directory"));
			return;
		}
		
		deviceapis.filesystem.File.uncompressTo(this._reference, this.fullPath, relativePath, destinationFilePath, overwrite);
	},
	_uncompressTo: function() {
		this._onSuccessCallback();
	},
	_uncompressToError: function(error) {
		if (this._onFailureCallback) {
			this._onFailureCallback(error);
		}
	},		
	
	createDirectory: function(successCallback, errorCallback, dirPath) {
		this._onSuccessCallback = successCallback;
		this._onFailureCallback = errorCallback;
		
		// Check parameters
		if (!successCallback || !dirPath) {
			this._moveToError(new Error("createDirectory", "createDirectory: Missing parameters"));
			return;			
		}
		if (!this.isDirectory) {
			this._createDirectoryError(new Error("IOError", "createDirectory: Not a directory"));
			return;			
		}
		if (this._mode != "rw") {
			this._createDirectoryError(new Error("SecurityError", "createDirectory: Not in rw mode"));
			return;						
		}		
		
		deviceapis.filesystem.File.createDirectory(this._reference, this.fullPath, dirPath);
	},
	_createDirectory: function(relativePath) {
		// We must return a File instance on the created directory
		this.resolve(this._onSuccessCallback, this._onFailureCallback, relativePath, "rw");
	},
	_createDirectoryError: function(error) {
		if (this._onFailureCallback) {
			this._onFailureCallback(error);
		}
	},		
	
	createFile: function(successCallback, errorCallback, filePath) {
		this._onSuccessCallback = successCallback;
		this._onFailureCallback = errorCallback;
		
		// Check parameters
		if (!successCallback || !filePath) {
			this._moveToError(new Error("createDirectory", "createFile: Missing parameters"));
			return;			
		}
		if (!this.isDirectory) {
			this._createDirectoryError(new Error("IOError", "createFile: Not a directory"));
			return;			
		}
		if (this._mode != "rw") {
			this._createDirectoryError(new Error("SecurityError", "createFile: Not in rw mode"));
			return;						
		}		
		
		deviceapis.filesystem.File.createFile(this._reference, this.fullPath, filePath);
	},
	_createFile: function(relativePath) {
		// We must return a File instance on the created file
		this.resolve(this._onSuccessCallback, this._onFailureCallback, relativePath, "rw");
	},
	_createFileError: function(error) {
		if (this._onFailureCallback) {
			this._onFailureCallback(error);
		}
	},		

	// Computes the path string relative to the "this" directory
	_getRelativePath: function(fullPath) {
		var relativePath = null;
		var index = fullPath.indexOf(this.fullPath);
		if (0 == index) {
			relativePath = fullPath.substring(this.fullPath.length + 1);
		}
		return relativePath;
	},
	
	// Checks if the instance can execute the passed operation
	_checkMode: function(operation) {
		
		
	}
};

// listFiles
deviceapis.filesystem.File.listFiles = function(fileRef, wacPath, filterName) {
	var command = "fileRef=" + encodeURIComponent(fileRef) + "&wacPath=" + encodeURIComponent(wacPath) + "&action=file_listFiles&onSuccessCallback=deviceapis.filesystem.File._listFiles&onFailureCallback=deviceapis.filesystem.File._listFilesError";
	
	// Filter is optional
	if (filterName) {
		command += "&filterName=" + encodeURIComponent(filterName);	
	}
	callDeviceAPI("FILESYSTEM", command);	
};

deviceapis.filesystem.File._listFiles = function(fileRef, propertiesArray) {
	// Report to the requesting object
	deviceapis.filesystem.objects[fileRef]._listFiles(JSON.parse(propertiesArray));
};

deviceapis.filesystem.File._listFilesError = function(fileRef, type, message) {
	deviceapis.filesystem.objects[fileRef]._listFilesError(new Error(type, message));
};

// readAsText
deviceapis.filesystem.File.readAsText = function(fileRef, wacPath) {
	callDeviceAPI("FILESYSTEM", "fileRef=" + encodeURIComponent(fileRef) + "&wacPath=" + encodeURIComponent(wacPath) + "&action=file_readAsText&onSuccessCallback=deviceapis.filesystem.File._readAsText&onFailureCallback=deviceapis.filesystem.File._readAsTextError");
};

deviceapis.filesystem.File._readAsText = function(fileRef, text) {
	deviceapis.filesystem.objects[fileRef]._readAsText(text);
};

deviceapis.filesystem.File._readAsTextError = function(fileRef, type, message) {
	deviceapis.filesystem.objects[fileRef]._readAsTextError(new Error(type, message));
};

// openStream
deviceapis.filesystem.File.openStream = function(fileRef, wacPath, mode) {
	callDeviceAPI("FILESYSTEM", "fileRef=" + encodeURIComponent(fileRef) + "&wacPath=" + encodeURIComponent(wacPath) + "&action=file_openStream&mode=" + encodeURIComponent(mode) + "&onSuccessCallback=deviceapis.filesystem.File._openStream&onFailureCallback=deviceapis.filesystem.File._openStreamError");
};

deviceapis.filesystem.File._openStream = function(fileRef) {
	deviceapis.filesystem.objects[fileRef]._openStream();
};

deviceapis.filesystem.File._openStreamError = function(fileRef, type, message) {
	deviceapis.filesystem.objects[fileRef]._openStreamError(new Error(type, message));
};

// resolve (relativeFilePath must contain only one folder of file)
deviceapis.filesystem.File.resolve = function(fileRef, wacPath, relativeFilePath) {
	callDeviceAPI("FILESYSTEM", "fileRef=" + encodeURIComponent(fileRef) + "&wacPath=" + encodeURIComponent(wacPath) + "&action=file_resolve&relativePath=" + encodeURIComponent(relativeFilePath) + "&onSuccessCallback=deviceapis.filesystem.File._resolve&onFailureCallback=deviceapis.filesystem.File._resolveError");
};

deviceapis.filesystem.File._resolve = function(fileRef, properties) {
	deviceapis.filesystem.objects[fileRef]._resolve(JSON.parse(properties));
};

deviceapis.filesystem.File._resolveError = function(fileRef, type, message) {
	deviceapis.filesystem.objects[fileRef]._resolveError(new Error(type, message));
};

// deleteDirectory
deviceapis.filesystem.File.deleteDirectory = function(fileRef, wacPath, relativeDirectoryPath, recursive) {
	callDeviceAPI("FILESYSTEM", "fileRef=" + encodeURIComponent(fileRef) + "&wacPath=" + encodeURIComponent(wacPath) + "&action=file_deleteDirectory&relativePath=" + encodeURIComponent(relativeDirectoryPath) + "&recursive=" + encodeURIComponent(recursive) + "&onSuccessCallback=deviceapis.filesystem.File._deleteDirectory&onFailureCallback=deviceapis.filesystem.File._deleteDirectoryError");
};

deviceapis.filesystem.File._deleteDirectory = function(fileRef) {
	deviceapis.filesystem.objects[fileRef]._deleteDirectory();
};

deviceapis.filesystem.File._deleteDirectoryError = function(fileRef, type, message) {
	deviceapis.filesystem.objects[fileRef]._deleteDirectoryError(new Error(type, message));
};

// deleteFile
deviceapis.filesystem.File.deleteFile = function(fileRef, wacPath, relativeFilePath) {
	callDeviceAPI("FILESYSTEM", "fileRef=" + encodeURIComponent(fileRef) + "&wacPath=" + encodeURIComponent(wacPath) + "&action=file_deleteFile&relativePath=" + encodeURIComponent(relativeFilePath) + "&onSuccessCallback=deviceapis.filesystem.File._deleteFile&onFailureCallback=deviceapis.filesystem.File._deleteFileError");
};

deviceapis.filesystem.File._deleteFile = function(fileRef) {
	deviceapis.filesystem.objects[fileRef]._deleteFile();
};

deviceapis.filesystem.File._deleteFileError = function(fileRef, type, message) {
	deviceapis.filesystem.objects[fileRef]._deleteFileError(new Error(type, message));
};

// copyTo
deviceapis.filesystem.File.copyTo = function(fileRef, wacPath, relativeFilePath, destinationWacPath, overwrite) {
	callDeviceAPI("FILESYSTEM", "fileRef=" + encodeURIComponent(fileRef) + "&wacPath=" + encodeURIComponent(wacPath) + "&action=file_copyTo&relativePath=" + encodeURIComponent(relativeFilePath) + "&destinationWacPath=" + encodeURIComponent(destinationWacPath) + "&overwrite=" + encodeURIComponent(overwrite) + "&onSuccessCallback=deviceapis.filesystem.File._copyTo&onFailureCallback=deviceapis.filesystem.File._copyToError");
};

deviceapis.filesystem.File._copyTo = function(fileRef) {
	deviceapis.filesystem.objects[fileRef]._copyTo();
};

deviceapis.filesystem.File._copyToError = function(fileRef, type, message) {
	deviceapis.filesystem.objects[fileRef]._copyToError(new Error(type, message));
};

// moveTo
deviceapis.filesystem.File.moveTo = function(fileRef, wacPath, relativeFilePath, destinationWacPath, overwrite) {
	callDeviceAPI("FILESYSTEM", "fileRef=" + encodeURIComponent(fileRef) + "&wacPath=" + encodeURIComponent(wacPath) + "&action=file_moveTo&relativePath=" + encodeURIComponent(relativeFilePath) + "&destinationWacPath=" + encodeURIComponent(destinationWacPath) +"&overwrite=" + encodeURIComponent(overwrite) + "&onSuccessCallback=deviceapis.filesystem.File._moveTo&onFailureCallback=deviceapis.filesystem.File._moveToError");
};

deviceapis.filesystem.File._moveTo = function(fileRef) {
	deviceapis.filesystem.objects[fileRef]._moveTo();
};

deviceapis.filesystem.File._moveToError = function(fileRef, type, message) {
	deviceapis.filesystem.objects[fileRef]._moveToError(new Error(type, message));
};

// uncompressTo
deviceapis.filesystem.File.uncompressTo = function(fileRef, wacPath, relativeFilePath, destinationWacPath, overwrite, password) {
	var command = "fileRef=" + encodeURIComponent(fileRef) + "&wacPath=" + encodeURIComponent(wacPath) + "&action=file_uncompressTo&relativePath=" + encodeURIComponent(relativeFilePath) + "&destinationWacPath=" + encodeURIComponent(destinationWacPath) + "&overwrite=" + encodeURIComponent(overwrite) + "&onSuccessCallback=deviceapis.filesystem.File._uncompressTo&onFailureCallback=deviceapis.filesystem.File._uncompressToError";
	if (password) {
		command += "&password=" + encodeURIComponent(password);
	}
	callDeviceAPI("FILESYSTEM", command);
};

deviceapis.filesystem.File._uncompressTo = function(fileRef) {
	deviceapis.filesystem.objects[fileRef]._uncompressTo();
};

deviceapis.filesystem.File._uncompressToError = function(fileRef, type, message) {
	deviceapis.filesystem.objects[fileRef]._uncompressToError(new Error(type, message));
};

// createDirectory
deviceapis.filesystem.File.createDirectory = function(fileRef, wacPath, relativeFilePath) {
	callDeviceAPI("FILESYSTEM", "fileRef=" + encodeURIComponent(fileRef) + "&wacPath=" + encodeURIComponent(wacPath) + "&action=file_createDirectory&relativePath=" + encodeURIComponent(relativeFilePath) + "&onSuccessCallback=deviceapis.filesystem.File._createDirectory&onFailureCallback=deviceapis.filesystem.File._createDirectoryError");
};

deviceapis.filesystem.File._createDirectory = function(fileRef, relativePath) {
	deviceapis.filesystem.objects[fileRef]._createDirectory(relativePath);
};

deviceapis.filesystem.File._createDirectoryError = function(fileRef, type, message) {
	deviceapis.filesystem.objects[fileRef]._createDirectoryError(new Error(type, message));
};

// createFile
deviceapis.filesystem.File.createFile = function(fileRef, wacPath, relativeFilePath) {
	callDeviceAPI("FILESYSTEM", "fileRef=" + encodeURIComponent(fileRef) + "&wacPath=" + encodeURIComponent(wacPath) + "&action=file_createFile&relativePath=" + encodeURIComponent(relativeFilePath) + "&onSuccessCallback=deviceapis.filesystem.File._createFile&onFailureCallback=deviceapis.filesystem.File._createFileError");
};

deviceapis.filesystem.File._createFile = function(fileRef, relativePath) {
	deviceapis.filesystem.objects[fileRef]._createFile(relativePath);
};

deviceapis.filesystem.File._createFileError = function(fileRef, type, message) {
	deviceapis.filesystem.objects[fileRef]._createFileError(new Error(type, message));
};

// FileStream class
deviceapis.filesystem.FileStream = function(file, mode) {
	this._file = file;
	 	// The access rights (r, w or a)
	this._mode = mode;
	 	this.eof = false;
	 	this.position = 0;
	 	this.bytesAvailable = file.fileSize;
	 
	 	// Manage append mode
	 	if (this._mode == "a") {
	 		this.eof = true;
	 		this.position = file.fileSize;
	 		this.bytesAvailable = 0;
	 }
};

deviceapis.filesystem.FileStream.prototype = {
	close: function() {
		this._file._fileStream = undefined;
	},
	
	read: function (successCallback, errorCallback, charCount) {
		this._onSuccessCallback = successCallback;
		this._onFailureCallback = errorCallback;
		
		// Check state and parameters
		if (!this._file._fileStream) {
			this._readError(new Error("InvalidValuesError", "read: The file stream is closed"));
			return;			
		}
		if (this._mode != "r") {
			this._readError(new Error("SecurityError", "read: Not in r mode"));
			return;						
		}		
		if (!successCallback || (undefined == charCount)) {
			this._readError(new Error("InvalidValuesError", "read: Missing parameters"));
			return;			
		}
		
		deviceapis.filesystem.FileStream.read(this._file._reference, this._file.fullPath, this.position, charCount);		
	},
	_read: function(string) {
		this._onSuccessCallback(string);
	},
	_readError: function(error) {
		if (this._onFailureCallback) {
			this._onFailureCallback(error);
		}
	},
	
	readBytes: function (successCallback, errorCallback, byteCount) {
		this._onSuccessCallback = successCallback;
		this._onFailureCallback = errorCallback;
		
		// Check state and parameters
		if (!this._file._fileStream) {
			this._readError(new Error("InvalidValuesError", "readBytes: The file stream is closed"));
			return;			
		}
		if (this._mode != "r") {
			this._readError(new Error("SecurityError", "readBytes: Not in r mode"));
			return;						
		}		
		if (!successCallback || (undefined == byteCount)) {
			this._readError(new Error("InvalidValuesError", "readBytes: Missing parameters"));
			return;			
		}
		
		deviceapis.filesystem.FileStream.readBytes(this._file._reference, this._file.fullPath, this.position, byteCount);		
	},
	_readBytes: function(byteData) {
		this._onSuccessCallback(byteData);
	},
	_readBytesError: function(error) {
		if (this._onFailureCallback) {
			this._onFailureCallback(error);
		}
	},
	
	readBase64: function (successCallback, errorCallback, byteCount) {
		this._onSuccessCallback = successCallback;
		this._onFailureCallback = errorCallback;
		
		// Check state and parameters
		if (!this._file._fileStream) {
			this._readError(new Error("InvalidValuesError", "readBase64: The file stream is closed"));
			return;			
		}
		if (this._mode != "r") {
			this._readError(new Error("SecurityError", "readBase64: Not in r mode"));
			return;						
		}		
		if (!successCallback || (undefined == byteCount)) {
			this._readError(new Error("InvalidValuesError", "readBase64: Missing parameters"));
			return;			
		}
		
		deviceapis.filesystem.FileStream.readBase64(this._file._reference, this._file.fullPath, this.position, byteCount);		
	},
	_readBase64: function(base64Data) {
		this._onSuccessCallback(base64Data);
	},
	_readBase64Error: function(error) {
		if (this._onFailureCallback) {
			this._onFailureCallback(error);
		}
	},
	
	write: function (successCallback, errorCallback, stringData) {
		this._onSuccessCallback = successCallback;
		this._onFailureCallback = errorCallback;
		
		// Check state and parameters
		if (!this._file._fileStream) {
			this._readError(new Error("InvalidValuesError", "write: The file stream is closed"));
			return;			
		}
		if (this._mode != "w"  && this._mode != "a") {
			this._readError(new Error("SecurityError", "write: Not in w or a mode"));
			return;						
		}		
		if (!successCallback || (undefined == stringData)) {
			this._readError(new Error("InvalidValuesError", "write: Missing parameters"));
			return;			
		}
		
		deviceapis.filesystem.FileStream.write(this._file._reference, this._file.fullPath, this.position, stringData);		
	},
	_write: function() {
		this._onSuccessCallback();
	},
	_writeError: function(error) {
		if (this._onFailureCallback) {
			this._onFailureCallback(error);
		}
	},

	writeBytes: function (successCallback, errorCallback, byteData) {
		this._onSuccessCallback = successCallback;
		this._onFailureCallback = errorCallback;
		
		// Check state and parameters
		if (!this._file._fileStream) {
			this._readError(new Error("InvalidValuesError", "writeBytes: The file stream is closed"));
			return;			
		}
		if (this._mode != "w"  && this._mode != "a") {
			this._readError(new Error("SecurityError", "writeBytes: Not in w or a mode"));
			return;						
		}		
		if (!successCallback || (undefined == byteData)) {
			this._readError(new Error("InvalidValuesError", "writeBytes: Missing parameters"));
			return;			
		}
		
		deviceapis.filesystem.FileStream.writeBytes(this._file._reference, this._file.fullPath, this.position, byteData);		
	},
	_writeBytes: function() {
		this._onSuccessCallback();
	},
	_writeBytesError: function(error) {
		if (this._onFailureCallback) {
			this._onFailureCallback(error);
		}
	},

	writeBase64: function (successCallback, errorCallback, base64Data) {
		this._onSuccessCallback = successCallback;
		this._onFailureCallback = errorCallback;
		
		// Check state and parameters
		if (!this._file._fileStream) {
			this._readError(new Error("InvalidValuesError", "writeBase64: The file stream is closed"));
			return;			
		}
		if (this._mode != "w"  && this._mode != "a") {
			this._readError(new Error("SecurityError", "writeBase64: Not in w or a mode"));
			return;						
		}		
		if (!successCallback || (undefined == base64Data)) {
			this._readError(new Error("InvalidValuesError", "writeBase64: Missing parameters"));
			return;			
		}
		
		deviceapis.filesystem.FileStream.writeBase64(this._file._reference, this._file.fullPath, this.position, base64Data);		
	},
	_writeBase64: function() {
		this._onSuccessCallback();
	},
	_writeBase64Error: function(error) {
		if (this._onFailureCallback) {
			this._onFailureCallback(error);
		}
	},	
	
	// Update File & FileStream objects attributes after a read of write operation
	_updateAttributes: function (newPosition, newFileSize)	{
		if (undefined != newFileSize) {
			this._file.fileSize = newFileSize;
		}
		
		this.position = newPosition;
		this.bytesAvailable = this._file.fileSize - this.position;
		if (0 == this.bytesAvailable) {
			// End of file
			this.bytesAvailable = -1;
			this.eof = true;
		} else {
			this.eof = false;
		}
	}
};

// read
deviceapis.filesystem.FileStream.read = function(fileRef, wacPath, position, charCount) {
	callDeviceAPI("FILESYSTEM", "fileRef=" + encodeURIComponent(fileRef) + "&wacPath=" + encodeURIComponent(wacPath) + "&action=fileStream_read&position=" + encodeURIComponent(position) + "&count=" + encodeURIComponent(charCount) + "&onSuccessCallback=deviceapis.filesystem.FileStream._read&onFailureCallback=deviceapis.filesystem.FileStream._readError");
};

deviceapis.filesystem.FileStream._read = function(fileRef, string, newPosition) {
	deviceapis.filesystem.objects[fileRef]._fileStream._updateAttributes(newPosition);
	deviceapis.filesystem.objects[fileRef]._fileStream._read(string);
};

deviceapis.filesystem.FileStream._readError = function(fileRef, type, message) {
	deviceapis.filesystem.objects[fileRef]._fileStream._readError(new Error(type, message));
};

// read bytes
deviceapis.filesystem.FileStream.readBytes = function(fileRef, wacPath, position, byteCount) {
	callDeviceAPI("FILESYSTEM", "fileRef=" + encodeURIComponent(fileRef) + "&wacPath=" + encodeURIComponent(wacPath) + "&action=fileStream_readBase64&position=" + encodeURIComponent(position) + "&count=" + encodeURIComponent(byteCount) + "&onSuccessCallback=deviceapis.filesystem.FileStream._readBytes&onFailureCallback=deviceapis.filesystem.FileStream._readBytesError");
};

deviceapis.filesystem.FileStream._readBytes = function(fileRef, base64Data, newPosition) {
	deviceapis.filesystem.objects[fileRef]._fileStream._updateAttributes(newPosition);
	deviceapis.filesystem.objects[fileRef]._fileStream._readBytes(deviceapis.utils.base64.decode(base64Data));
};

deviceapis.filesystem.FileStream._readBytesError = function(fileRef, type, message) {
	deviceapis.filesystem.objects[fileRef]._fileStream._readBytesError(new Error(type, message));
};

// read base64
deviceapis.filesystem.FileStream.readBase64 = function(fileRef, wacPath, position, byteCount) {
	callDeviceAPI("FILESYSTEM", "fileRef=" + encodeURIComponent(fileRef) + "&wacPath=" + encodeURIComponent(wacPath) +"&action=fileStream_readBase64&position=" + encodeURIComponent(position) + "&count=" + encodeURIComponent(byteCount) + "&onSuccessCallback=deviceapis.filesystem.FileStream._readBase64&onFailureCallback=deviceapis.filesystem.FileStream._readBase64Error");
};

deviceapis.filesystem.FileStream._readBase64 = function(fileRef, base64Data, newPosition) {
	deviceapis.filesystem.objects[fileRef]._fileStream._updateAttributes(newPosition);
	deviceapis.filesystem.objects[fileRef]._fileStream._readBase64(base64Data);
};

deviceapis.filesystem.FileStream._readBase64Error = function(fileRef, type, message) {
	deviceapis.filesystem.objects[fileRef]._fileStream._readBase64Error(new Error(type, message));
};

// write
deviceapis.filesystem.FileStream.write = function(fileRef, wacPath, position, stringData) {
	callDeviceAPI("FILESYSTEM", "fileRef=" + encodeURIComponent(fileRef) + "&wacPath=" + encodeURIComponent(wacPath) + "&action=fileStream_write&position=" + encodeURIComponent(position) + "&data=" + encodeURIComponent(stringData) + "&onSuccessCallback=deviceapis.filesystem.FileStream._write&onFailureCallback=deviceapis.filesystem.FileStream._writeError");
};

deviceapis.filesystem.FileStream._write = function(fileRef, newPosition, newFileSize) {
	deviceapis.filesystem.objects[fileRef]._fileStream._updateAttributes(newPosition, newFileSize);
	deviceapis.filesystem.objects[fileRef]._fileStream._write();
};

deviceapis.filesystem.FileStream._writeError = function(fileRef, type, message) {
	deviceapis.filesystem.objects[fileRef]._fileStream._writeError(new Error(type, message));
};

// write bytes
deviceapis.filesystem.FileStream.writeBytes = function(fileRef, wacPath, position, byteData) {
	// Base64-encode data to pass it to InstantString through document.href
	var base64Data = deviceapis.utils.base64.encode(byteData, 0, byteData.length);	
	callDeviceAPI("FILESYSTEM", "fileRef=" + encodeURIComponent(fileRef) + "&wacPath=" + encodeURIComponent(wacPath) + "&action=fileStream_writeBase64&position=" + encodeURIComponent(position) + "&data=" + encodeURIComponent(base64Data) +"&onSuccessCallback=deviceapis.filesystem.FileStream._writeBytes&onFailureCallback=deviceapis.filesystem.FileStream._writeBytesError");
};

deviceapis.filesystem.FileStream._writeBytes = function(fileRef, newPosition, newFileSize) {
	deviceapis.filesystem.objects[fileRef]._fileStream._updateAttributes(newPosition, newFileSize);
	deviceapis.filesystem.objects[fileRef]._fileStream._writeBytes();
};

deviceapis.filesystem.FileStream._writeBytesError = function(fileRef, type, message) {
	deviceapis.filesystem.objects[fileRef]._fileStream._writeBytesError(new Error(type, message));
};

// write base64
deviceapis.filesystem.FileStream.writeBase64 = function(fileRef, wacPath, position, base64Data) {
	callDeviceAPI("FILESYSTEM", "fileRef=" + encodeURIComponent(fileRef) + "&wacPath=" + encodeURIComponent(wacPath) + "&action=fileStream_writeBase64&position=" + encodeURIComponent(position) + "&data=" + encodeURIComponent(base64Data) + "&onSuccessCallback=deviceapis.filesystem.FileStream._writeBytes&onFailureCallback=deviceapis.filesystem.FileStream._writeBytesError");
};

deviceapis.filesystem.FileStream._writeBase64 = function(fileRef, newPosition, newFileSize) {
	deviceapis.filesystem.objects[fileRef]._fileStream._updateAttributes(newPosition, newFileSize);
	deviceapis.filesystem.objects[fileRef]._fileStream._writeBase64();
};

deviceapis.filesystem.FileStream._writeBase64Error = function(fileRef, type, message) {
	deviceapis.filesystem.objects[fileRef]._fileStream._writeBase64Error(new Error(type, message));
};
/*global deviceapis */
/*global callDeviceAPI */

// Geolocation
function Position(longitude, latitude, altitude, horizontalPrecision, verticalPrecision, speed, timestamp)
{
	this.coordinates = new Object();
	this.coordinates.longitude = longitude;
	this.coordinates.latitude = latitude;
	this.coordinates.altitude = altitude;
	this.coordinates.accuracy = horizontalPrecision;
	this.coordinates.altitudeAccuracy = verticalPrecision;
	this.coordinates.heading = "";
	this.coordinates.speed = speed;
	this.timestamp = timestamp;
}

function Geolocation()
{
	this.getCurrentPosition = function(onSuccessCallback, onFailureCallback)
	{
		this.onSuccessCallback = onSuccessCallback;
		this.onFailureCallback = onFailureCallback;
		callDeviceAPI("GEOLOCATION", "action=get&onSuccessCallback=deviceapis.geolocation._getCurrentPosition&onFailureCallback=deviceapis.geolocation._getCurrentPositionError");
	},
	this._getCurrentPosition= function(longitude, latitude, altitude, horizontalPrecision, verticalPrecision, speed, timestamp)
	{
		if (this.onSuccessCallback!==null) {
			this.onSuccessCallback(new Position(longitude, latitude, altitude, horizontalPrecision, verticalPrecision, speed, timestamp));
		}
	},
	this._getCurrentPositionError = function(errorCode)
	{
		if (this.onFailureCallback!==null) {
			this.onFailureCallback(errorCode);
		}
	},
	this.watchPosition = function(onSuccessCallback, onFailureCallback, options)
	{
		this.id = deviceapis.geolocation.watch.nextId;
		deviceapis.geolocation.watch.nextId++;
		this.onSuccessCallback = onSuccessCallback;
		this.onFailureCallback = onFailureCallback;
		this.minNotificationInterval = 1000; // default: 1s
		if (options!==null) {
			this.minNotificationInterval = options.minNotificationInterval;
		}
		this._watchPositionLoop();
	},
	this._watchPositionLoop = function()
	{
		callDeviceAPI("GEOLOCATION", "action=watch&id="+this.id+"&onSuccessCallback=deviceapis.geolocation._watchPosition&onFailureCallback=deviceapis.geolocation._watchPositionError");
	},
	this._watchPosition = function(longitude, latitude, altitude, horizontalPrecision, verticalPrecision, speed, timestamp)
	{
		if (this.onSuccessCallback!==null) {
			this.onSuccessCallback(new Position(longitude, latitude, altitude, horizontalPrecision, verticalPrecision, speed, timestamp));
		}
	},
	this._watchPositionError = function(errorCode)
	{
		if (this.onFailureCallback!==null) {
			this.onFailureCallback(errorCode);
		}
	},
	this.clearWatch = function(callback)
	{
		this.callback = callback;
		callDeviceAPI("GEOLOCATION", "action=clear&id="+this.id+"&callback=deviceapis.geolocation._clearWatch");
	},
	this._clearWatch = function()
	{
		this.callback();
	};
}

deviceapis.geolocation = new Object();
deviceapis.geolocation.get = new Object();
//deviceapis.geolocation.get.geolocation;
deviceapis.geolocation.watch = new Object();
deviceapis.geolocation.watch.nextId = 0;
deviceapis.geolocation.watch.geolocations = new Array();

// 		get current geolocation
deviceapis.geolocation.getCurrentPosition = function(onSuccessCallback, onFailureCallback)
{
	deviceapis.geolocation.get.geolocation = new Geolocation();
	deviceapis.geolocation.get.geolocation.getCurrentPosition(onSuccessCallback, onFailureCallback);
};

deviceapis.geolocation._getCurrentPosition = function(longitude, latitude, altitude, horizontalPrecision, verticalPrecision, speed, timestamp)
{
	deviceapis.geolocation.get.geolocation._getCurrentPosition(longitude, latitude, altitude, horizontalPrecision, verticalPrecision, speed, timestamp);
	deviceapis.geolocation.get.geolocation = null;
};

deviceapis.geolocation._getCurrentPositionError = function(errorCode)
{
	deviceapis.geolocation.get.geolocation._getCurrentPositionError(errorCode);
	deviceapis.geolocation.get.geolocation = null;
};

//		watch geolocation
deviceapis.geolocation.watch._getIDIndex = function(id)
{
    for (var i=0; i<deviceapis.geolocation.watch.geolocations.length; i++) {
    	if (deviceapis.geolocation.watch.geolocations[i].id == id) {
    		return i;
    	}
    }
    return -1;
};

deviceapis.geolocation.watchPosition = function(onSuccessCallback, onFailureCallback, options)
{
	var geolocation = new Geolocation();
	deviceapis.geolocation.watch.geolocations.push(geolocation);
	geolocation.watchPosition(onSuccessCallback, onFailureCallback, options);
	return geolocation.id;
};

deviceapis.geolocation._watchPositionLoop = function(id)
{
	var index = deviceapis.geolocation.watch._getIDIndex(id);
	if (index!==-1) { // watcher still active
		var geolocation = deviceapis.geolocation.watch.geolocations[index];
		geolocation._watchPositionLoop();
	}
};

deviceapis.geolocation._watchPosition = function(id, longitude, latitude, altitude, horizontalPrecision, verticalPrecision, speed, timestamp)
{
	var index = deviceapis.geolocation.watch._getIDIndex(id);
	if (index!==-1) { // watcher still active
		var geolocation = deviceapis.geolocation.watch.geolocations[index];
		geolocation._watchPosition(longitude, latitude, altitude, horizontalPrecision, verticalPrecision, speed, timestamp);
		setTimeout("deviceapis.geolocation._watchPositionLoop("+geolocation.id+")", geolocation.minNotificationInterval);
	}
};

deviceapis.geolocation._watchPositionError = function(id, errorCode)
{
	var index = deviceapis.geolocation.watch._getIDIndex(id);
	if (index!==-1) { // watcher still active
		var geolocation = deviceapis.geolocation.watch.geolocations[index];
		geolocation._watchPositionError(errorCode);
		deviceapis.geolocation.watch.geolocations.splice(index, 1);
	}
};

//		clear watch
deviceapis.geolocation.clearWatch = function(id, callback)
{
	var index = deviceapis.geolocation.watch._getIDIndex(id);
	if (index!==-1) { // watcher still active
		var geolocation = deviceapis.geolocation.watch.geolocations[index];
		geolocation.clearWatch(callback);
	}
};

deviceapis.geolocation._clearWatch = function(id)
{
	var index = deviceapis.geolocation.watch._getIDIndex(id);
	if (index!==-1) { // watcher still active
		var geolocation = deviceapis.geolocation.watch.geolocations[index];
		geolocation._clearWatch();
		deviceapis.geolocation.watch.geolocations.splice(index, 1);
	}
};
/*global deviceapis */
/*global callDeviceAPI */

// Log
deviceapis.log = new Object();
//deviceapis.log.callback;
//deviceapis.log.onSuccessCallback;
//deviceapis.log.onFailureCallback;

function LogConfiguration(status, persistence, level, maxlines, cleaning)
{
	this.status = status;
	this.persistence = persistence;
	this.level = level;
	this.maxlines = maxlines;
	this.cleaning = cleaning;
}

deviceapis.log.getConfiguration = function(callback)
{
	deviceapis.log.getConfiguration._callback = callback;
	callDeviceAPI("LOG","action=getConfiguration&callback=deviceapis.log._getConfiguration");
};
deviceapis.log._getConfiguration = function(status, persistence, level, maxlines, cleaning)
{
	if (deviceapis.log.getConfiguration._callback != undefined) {
		deviceapis.log.getConfiguration._callback(new LogConfiguration(status, persistence, level, maxlines, cleaning));
	}
};

deviceapis.log.setConfiguration = function(status, persistence, level, maxlines, cleaning, callback)
{
	deviceapis.log.setConfiguration._callback = callback;
	callDeviceAPI("LOG","action=setConfiguration&status="+status+"&persistence="+persistence+"&level="+level+"&maxlines="+maxlines+"&cleaning="+cleaning+"&callback=deviceapis.log._setConfiguration");
};
deviceapis.log._setConfiguration = function()
{
	if (deviceapis.log.setConfiguration._callback != undefined) {
		deviceapis.log.setConfiguration._callback();
	}
};

deviceapis.log.start = function(callback)
{
	deviceapis.log.start._callback = callback;
	callDeviceAPI("LOG","action=start&callback=deviceapis.log._start");
};
deviceapis.log._start = function()
{
	if (deviceapis.log.start._callback != undefined) {
		deviceapis.log.start._callback();
	}
};

deviceapis.log.stop = function(callback)
{
	deviceapis.log.stop._callback = callback;
	callDeviceAPI("LOG","action=stop&callback=deviceapis.log._stop");
};
deviceapis.log._stop = function()
{
	if (deviceapis.log.stop._callback != undefined) {
		deviceapis.log.stop._callback();
	}
};

deviceapis.log.save = function(level, log, callback)
{
	deviceapis.log.save._callback = callback;
	callDeviceAPI("LOG","action=save&level="+level+"&log="+encodeURIComponent(log)+"&callback=deviceapis.log._save");
};
deviceapis.log._save = function()
{
	if (deviceapis.log.save._callback != undefined) {
		deviceapis.log.save._callback();
	}
};

deviceapis.log.load = function(callback)
{
	deviceapis.log.load._callback = callback;
	callDeviceAPI("LOG","action=load&callback=deviceapis.log._load");
};
deviceapis.log._load = function(data)
{
	if (deviceapis.log.load._callback != undefined) {
		var logsArray = new Array();
		var logsJSONObject = JSON.parse(data);
		if ((logsJSONObject!==null) && (logsJSONObject.logs!==null)) {
			logsArray = logsJSONObject.logs;
		}
		deviceapis.log.load._callback(logsArray);
	}
};

deviceapis.log.clean = function(callback)
{
	deviceapis.log.clean._callback = callback;
	callDeviceAPI("LOG","action=clean&callback=deviceapis.log._clean");
};
deviceapis.log._clean = function()
{
	if (deviceapis.log.clean._callback != undefined) {
		deviceapis.log.clean._callback();
	}
};

deviceapis.log.post = function(onSuccessCallback, onFailureCallback)
{
	deviceapis.log.post._onSuccessCallback = onSuccessCallback;
	deviceapis.log.post._onFailureCallback = onFailureCallback;
	callDeviceAPI("LOG","action=post&onSuccessCallback=deviceapis.log._post&onFailureCallback=deviceapis.log._postError");
};
deviceapis.log._post = function()
{
	if (deviceapis.log.post._onSuccessCallback != undefined) {
		deviceapis.log.post._onSuccessCallback();
	}
};
deviceapis.log._postError = function()
{
	if (deviceapis.log.post._onFailureCallback != undefined) {
		deviceapis.log.post._onFailureCallback();
	}
};
/*global deviceapis */
/*global callDeviceAPI */

// Messages
function Message(to, body, subject, attachments, cc, bcc, priority)
{
	this.to = to;
	this.body = body;
	this.subject = subject;
	this.attachments = attachments;
	this.cc = cc;
	this.bcc = bcc;
	this.priority = priority;
	
	this.isSMS = false;
	this.isMMS = false;
	this.isEmail = false;
	if ((this.subject == null) && (this.attachments == null) && (this.cc == null) && (this.bcc == null) && (this.priority == null)) {
		this.isSMS = true;
	} else if ((this.cc == null) && (this.bcc == null) && (this.priority == null)) {
		this.isMMS = true;
	} else {
		this.isEmail = true;
	}
}

deviceapis.messaging = new Object();
//deviceapis.messaging.findMessages.onSuccessCallback;
//deviceapis.messaging.findMessages.onFailureCallback;
//deviceapis.messaging.sendMessage.onSuccessCallback;
//deviceapis.messaging.sendMessage.onFailureCallback;

deviceapis.messaging.findMessages = function(onSuccessCallback, onFailureCallback, filter)
{
	deviceapis.messaging.findMessages._onSuccessCallback = onSuccessCallback;
	deviceapis.messaging.findMessages._onFailureCallback = onFailureCallback;
	for (var i in filter) {
		filter[i] = encodeURIComponent(filter[i]);
	}
	callDeviceAPI("MESSAGING", "onSuccessCallback=deviceapis.messaging._findMessages&onFailureCallback=deviceapis.messaging._findMessagesError&filter="+encodeURIComponent(JSON.stringify(filter)));
};

deviceapis.messaging._findMessages = function(data)
{
	var messages = new Array();
	var messagesJSONObject = JSON.parse(data);
	if ((messagesJSONObject!==null) && (messagesJSONObject.messages!==null)) {
		messages = messagesJSONObject.messages;
	}
	deviceapis.messaging.findMessages._onSuccessCallback(messages);
};

deviceapis.messaging._findMessagesError = function()
{
	if (deviceapis.messaging.findMessages._onFailureCallback) {
		deviceapis.messaging.findMessages._onFailureCallback();
	}
};

// Send SMS
deviceapis.messaging.sendMessage = function(onSuccessCallback, onFailureCallback, message)
{
	deviceapis.messaging.sendMessage._onSuccessCallback = onSuccessCallback;
	deviceapis.messaging.sendMessage._onFailureCallback = onFailureCallback;
	callDeviceAPI("SMS", "number="+encodeURIComponent(message.to)+"&message="+encodeURIComponent(message.body)+"&onSuccessCallback=deviceapis.messaging._sendMessage&onFailureCallback=deviceapis.messaging._sendMessageError");
};
deviceapis.messaging._sendMessage = function()
{
	deviceapis.messaging.sendMessage._onSuccessCallback();
};
deviceapis.messaging._sendMessageError = function(error)
{
	if (deviceapis.messaging.sendMessage._onFailureCallback != null) {
		deviceapis.messaging.sendMessage._onFailureCallback(error);
	}
};
/*global deviceapis */
/*global callDeviceAPI */

// Network

// Cellular Information
function CellularInformation(roaming, ip, name, mcc, mnc, lac , cellId, carrierName, carrierMcc, carrierMnc)
{
	this.roaming = roaming;
	this.ip = ip;
	this.name = name;
	this.mcc = mcc;
	this.mnc = mnc;
	this.lac = lac;
	this.cellId = cellId;
	this.carrierName = carrierName;
	this.carrierMcc = carrierMcc;
	this.carrierMnc = carrierMnc;	
}

// WIFI Information
function WifiInformation(ip, ssid)
{
	this.ip = ip;
	this.ssid = ssid;
}

deviceapis.network = new Object();

//  get current connection type
deviceapis.network.getType = function(onSuccessCallback, onFailureCallback)
{	
	deviceapis.network.getType._onSuccessCallback = onSuccessCallback;
	deviceapis.network.getType._onFailureCallback = onFailureCallback;	
	callDeviceAPI("NETWORK", "action=getType&onSuccessCallback=deviceapis.network._getTypes&onFailureCallback=deviceapis.network._getTypesError");
};

deviceapis.network._getTypes = function(type)
{	
	deviceapis.network.getType._onSuccessCallback(type);
};

deviceapis.network._getTypesError = function(error)
{	
	if (deviceapis.network.getType._onFailureCallback != undefined) {
		deviceapis.network.getType._onFailureCallback(error);
	}
};

//  get cellular information
deviceapis.network.getCellularInfo = function(onSuccessCallback, onFailureCallback)
{
	deviceapis.network.getCellularInfo._onSuccessCallback = onSuccessCallback;
	deviceapis.network.getCellularInfo._onFailureCallback = onFailureCallback;	
	callDeviceAPI("NETWORK", "action=getCellularInfo&onSuccessCallback=deviceapis.network._getCellularInfo&onFailureCallback=deviceapis.network._getCellularInfoError");	
};

deviceapis.network._getCellularInfo = function(roaming, ip, name, mcc, mnc, lac , cellId, carrierName, carrierMcc, carrierMnc)
{
	deviceapis.network.getCellularInfo._onSuccessCallback(new CellularInformation(roaming, ip, name, mcc, mnc, lac , cellId, carrierName, carrierMcc, carrierMnc));
};

deviceapis.network._getCellularInfoError = function(error)
{
	if (deviceapis.network.getCellularInfo._onFailureCallback != undefined) {
		deviceapis.network.getCellularInfo._onFailureCallback(error);
	}
};

// get WIFI information
deviceapis.network.getWifiInfo = function(onSuccessCallback, onFailureCallback)
{	
	deviceapis.network.getWifiInfo._onSuccessCallback = onSuccessCallback;
	deviceapis.network.getWifiInfo._onFailureCallback = onFailureCallback;	
	callDeviceAPI("NETWORK", "action=getWifiInfo&onSuccessCallback=deviceapis.network._getWifiInfo&onFailureCallback=deviceapis.network._getWifiInfoError");	
};

deviceapis.network._getWifiInfo = function(ip, ssid)
{
	deviceapis.network.getWifiInfo._onSuccessCallback(new WifiInformation(ip, ssid));
};

deviceapis.network._getWifiInfoError = function(error)
{	
	if (deviceapis.network.getWifiInfo._onFailureCallback != undefined) {
		deviceapis.network.getWifiInfo._onFailureCallback(error);
	}
};
/*global deviceapis */
/*global callDeviceAPI */

// Notification
deviceapis.notification = new Object();
//deviceapis.notification.callback;
//deviceapis.notification.onSuccessCallback;
//deviceapis.notification.onFailureCallback;

// set user
deviceapis.notification.setUser = function(userID, onSuccessCallback, onFailureCallback)
{
	deviceapis.notification.setUser._onSuccessCallback = onSuccessCallback;
	deviceapis.notification.setUser._onFailureCallback = onFailureCallback;
	callDeviceAPI("NOTIFICATION", "action=setUser&userID="+encodeURIComponent(userID)+"&onSuccessCallback=deviceapis.notification._setUser&onFailureCallback=deviceapis.notification._setUserError");
};

deviceapis.notification._setUser = function()
{
	if (deviceapis.notification.setUser._onSuccessCallback != undefined) {
		deviceapis.notification.setUser._onSuccessCallback();
	}
};

deviceapis.notification._setUserError = function()
{
	if (deviceapis.notification.setUser._onFailureCallback != undefined) {
		deviceapis.notification.setUser._onFailureCallback();
	}
};

// get user
deviceapis.notification.getUser = function(callback)
{
	deviceapis.notification.getUser._callback = callback;
	callDeviceAPI("NOTIFICATION", "action=getUser&callback=deviceapis.notification._getUser");
};

deviceapis.notification._getUser = function(userID)
{
	deviceapis.notification.getUser._callback(userID);
};

// register (session token)
deviceapis.notification.register = function(sessionToken, onSuccessCallback, onFailureCallback)
{
	deviceapis.notification.register._onSuccessCallback = onSuccessCallback;
	deviceapis.notification.register._onFailureCallback = onFailureCallback;
	callDeviceAPI("NOTIFICATION", "action=register&sessionToken="+encodeURIComponent(sessionToken)+"&onSuccessCallback=deviceapis.notification._register&onFailureCallback=deviceapis.notification._registerError");
};

deviceapis.notification._register = function()
{
	if (deviceapis.notification.register._onSuccessCallback != undefined) {
		deviceapis.notification.register._onSuccessCallback();
	}
};

deviceapis.notification._registerError = function()
{
	if (deviceapis.notification.register._onFailureCallback != undefined) {
		deviceapis.notification.register._onFailureCallback();
	}
};

// register types
deviceapis.notification.registerTypes = function(types, onSuccessCallback, onFailureCallback)
{
	deviceapis.notification.registerTypes._onSuccessCallback = onSuccessCallback;
	deviceapis.notification.registerTypes._onFailureCallback = onFailureCallback;
	callDeviceAPI("NOTIFICATION", "action=registerTypes&types="+types+"&onSuccessCallback=deviceapis.notification._registerTypes&onFailureCallback=deviceapis.notification._registerTypesError");
};

deviceapis.notification._registerTypes = function()
{
	if (deviceapis.notification.registerTypes._onSuccessCallback != undefined) {
		deviceapis.notification.registerTypes._onSuccessCallback();
	}
};

deviceapis.notification._registerTypesError = function(errorCode)
{
	if (deviceapis.notification.registerTypes._onFailureCallback != undefined) {
		deviceapis.notification.registerTypes._onFailureCallback(errorCode);
	}
};

// unregister types
deviceapis.notification.unregisterTypes = function(types, onSuccessCallback, onFailureCallback)
{
	deviceapis.notification.unregisterTypes._onSuccessCallback = onSuccessCallback;
	deviceapis.notification.unregisterTypes._onFailureCallback = onFailureCallback;
	callDeviceAPI("NOTIFICATION", "action=unregisterTypes&types="+types+"&onSuccessCallback=deviceapis.notification._unregisterTypes&onFailureCallback=deviceapis.notification._unregisterTypesError");
};

deviceapis.notification._unregisterTypes = function()
{
	if (deviceapis.notification.unregisterTypes._onSuccessCallback != undefined) {
		deviceapis.notification.unregisterTypes._onSuccessCallback();
	}
};

deviceapis.notification._unregisterTypesError = function(errorCode)
{
	if (deviceapis.notification.unregisterTypes._onFailureCallback != undefined) {
		deviceapis.notification.unregisterTypes._onFailureCallback(errorCode);
	}
};

// get registered types
deviceapis.notification.getRegisteredTypes = function(callback)
{
	deviceapis.notification.getRegisteredTypes._callback = callback;
	callDeviceAPI("NOTIFICATION", "action=getRegisteredTypes&callback=deviceapis.notification._getRegisteredTypes");
};

deviceapis.notification._getRegisteredTypes = function(types)
{
	deviceapis.notification.getRegisteredTypes._callback(types.split(","));
};

// get system types
deviceapis.notification.getSystemTypes = function(callback)
{
	deviceapis.notification.getSystemTypes._callback = callback;
	callDeviceAPI("NOTIFICATION", "action=getSystemTypes&callback=deviceapis.notification._getSystemTypes&onFailureCallback=deviceapis.notification._getSystemTypesError");
};

deviceapis.notification._getSystemTypes = function(types)
{
	deviceapis.notification.getSystemTypes._callback(types.split(","));
};

deviceapis.notification._getSystemTypesError = function(errorCode)
{
	deviceapis.notification.getSystemTypes._callback([]);
};

// register callbacks
deviceapis.notification.registerCallbacks = function(callbacks)
{
	var callbacksArray = [];
	for (var callbackIndex=0; callbackIndex<callbacks.length; callbackIndex++) {
		callbacksArray.push(callbacks[callbackIndex].name);
	}
	callDeviceAPI("NOTIFICATION", "action=registerCallbacks&callbacks="+callbacksArray);
};

// unregister callbacks
deviceapis.notification.unregisterCallbacks = function(callbacks)
{
	var callbacksArray = [];
	for (var callbackIndex=0; callbackIndex<callbacks.length; callbackIndex++) {
		callbacksArray.push(callbacks[callbackIndex].name);
	}
	callDeviceAPI("NOTIFICATION", "action=unregisterCallbacks&callbacks="+callbacksArray);
};

// check
deviceapis.notification._check = function(callback)
{
	deviceapis.notification._check._callback = callback;
	callDeviceAPI("NOTIFICATION", "action=check&onSuccessCallback=deviceapis.notification._checkSuccess&onFailureCallback=deviceapis.notification._checkError");
};

deviceapis.notification._checkSuccess = function()
{
	if (deviceapis.notification._check._callback != undefined) {
		deviceapis.notification._check._callback();
	}
};

deviceapis.notification._checkError = function()
{
	deviceapis.application._dispatchEvent("notificationNotAvailable");
	if (deviceapis.notification._check._callback != undefined) {
		deviceapis.notification._check._callback();
	}
};

// receive
deviceapis.notification._receive = function(data, callbacks)
{
	var escapedData = data.replace(new RegExp("\\\\", "g"), "\\\\").replace(new RegExp("\"", "g"), "\\\"").replace(new RegExp("\'", "g"), "\\\'");
	var callbacksArray = callbacks.split(",");
	var callbacksNumber = callbacksArray.length;
	for (var callbackIndex=0; callbackIndex<callbacksNumber; callbackIndex++) {
		eval(callbacksArray[callbackIndex]+"('"+escapedData+"')");
	}
};
/*global deviceapis */
/*global callDeviceAPI */

// Open
deviceapis.open = function(url)
{
	callDeviceAPI("WAP", "url="+encodeURIComponent(url));
};
/*global deviceapis */
/*global callDeviceAPI */

// Orientation
function Rotation(teslaX, teslaY, teslaZ, azimuthMagneticNorth, azimuthTrueNorth, pitch, roll, time)
{
	this.alpha = azimuthTrueNorth;
	this.beta = pitch;
	this.gamma = roll;
}

function Orientation()
{
	this.getCurrentOrientation = function(onSuccessCallback, onFailureCallback)
	{
		this.onSuccessCallback = onSuccessCallback;
		this.onFailureCallback = onFailureCallback;
		callDeviceAPI("ORIENTATION", "action=get&onSuccessCallback=deviceapis.orientation._getCurrentOrientation&onFailureCallback=deviceapis.orientation._getCurrentOrientationError");
	},
	this._getCurrentOrientation= function(teslaX, teslaY, teslaZ, azimuthMagneticNorth, azimuthTrueNorth, pitch, roll, time)
	{
		if (this.onSuccessCallback!==null) {
			this.onSuccessCallback(new Rotation(teslaX, teslaY, teslaZ, azimuthMagneticNorth, azimuthTrueNorth, pitch, roll, time));
		}
	},
	this._getCurrentOrientationError = function(errorCode)
	{		
		if (this.onFailureCallback!==null) {
			this.onFailureCallback(errorCode);
		}
	},
	this.watchOrientation = function(onSuccessCallback, onFailureCallback, options)
	{
		this.id = deviceapis.orientation.watch.nextId;
		deviceapis.orientation.watch.nextId++;
		this.onSuccessCallback = onSuccessCallback;
		this.onFailureCallback = onFailureCallback;
		this.minNotificationInterval = 1000; // default: 1s
		if (options!==null) {
			this.minNotificationInterval = options.minNotificationInterval;
		}
		this._watchOrientationLoop();
	},
	this._watchOrientationLoop = function()
	{
		callDeviceAPI("ORIENTATION", "action=watch&id="+this.id+"&onSuccessCallback=deviceapis.orientation._watchOrientation&onFailureCallback=deviceapis.orientation._watchOrientationError");
	},
	this._watchOrientation = function(teslaX, teslaY, teslaZ, azimuthMagneticNorth, azimuthTrueNorth, pitch, roll, time)
	{
		if (this.onSuccessCallback!==null) {
			this.onSuccessCallback(new Rotation(teslaX, teslaY, teslaZ, azimuthMagneticNorth, azimuthTrueNorth, pitch, roll, time));
		}
	},
	this._watchOrientationError = function(errorCode)
	{		
		if (this.onFailureCallback!==null) {
			this.onFailureCallback(errorCode);
		}
	},
	this.clearWatch = function(callback)
	{
		this.callback = callback;
		callDeviceAPI("ORIENTATION", "action=clear&id="+this.id+"&callback=deviceapis.orientation._clearWatch");
	},
	this._clearWatch = function()
	{
		this.callback();
	};
}

deviceapis.orientation = new Object();
deviceapis.orientation.get = new Object();
//deviceapis.orientation.get.orientation;
deviceapis.orientation.watch = new Object();
deviceapis.orientation.watch.nextId = 0;
deviceapis.orientation.watch.orientations = new Array();

// 		get current orientation
deviceapis.orientation.getCurrentOrientation = function(onSuccessCallback, onFailureCallback)
{
	deviceapis.orientation.get.orientation = new Orientation();
	deviceapis.orientation.get.orientation.getCurrentOrientation(onSuccessCallback, onFailureCallback);
};

deviceapis.orientation._getCurrentOrientation = function(teslaX, teslaY, teslaZ, azimuthMagneticNorth, azimuthTrueNorth, pitch, roll, time)
{
	deviceapis.orientation.get.orientation._getCurrentOrientation(teslaX, teslaY, teslaZ, azimuthMagneticNorth, azimuthTrueNorth, pitch, roll, time);
	deviceapis.orientation.get.orientation = null;
};

deviceapis.orientation._getCurrentOrientationError = function(errorCode)
{
	deviceapis.orientation.get.orientation._getCurrentOrientationError(errorCode);
	deviceapis.orientation.get.orientation = null;
};

//		watch orientation
deviceapis.orientation.watch._getIDIndex = function(id)
{
    for (var i=0; i<deviceapis.orientation.watch.orientations.length; i++) {
    	if (deviceapis.orientation.watch.orientations[i].id == id) {
    		return i;
    	}
    }
    return -1;
};

deviceapis.orientation.watchOrientation = function(onSuccessCallback, onFailureCallback, options)
{
	var orientation = new Orientation();
	deviceapis.orientation.watch.orientations.push(orientation);
	orientation.watchOrientation(onSuccessCallback, onFailureCallback, options);
	return orientation.id;
};

deviceapis.orientation._watchOrientationLoop = function(id)
{
	var index = deviceapis.orientation.watch._getIDIndex(id);
	if (index!==-1) { // watcher still active
		var orientation = deviceapis.orientation.watch.orientations[index];
		orientation._watchOrientationLoop();
	}
};

deviceapis.orientation._watchOrientation = function(id, teslaX, teslaY, teslaZ, azimuthMagneticNorth, azimuthTrueNorth, pitch, roll, time)
{
	var index = deviceapis.orientation.watch._getIDIndex(id);
	if (index!==-1) { // watcher still active
		var orientation = deviceapis.orientation.watch.orientations[index];
		orientation._watchOrientation(teslaX, teslaY, teslaZ, azimuthMagneticNorth, azimuthTrueNorth, pitch, roll, time);
		setTimeout("deviceapis.orientation._watchOrientationLoop("+orientation.id+")", orientation.minNotificationInterval);
	}
};

deviceapis.orientation._watchOrientationError = function(id, errorCode)
{
	var index = deviceapis.orientation.watch._getIDIndex(id);
	if (index!==-1) { // watcher still active
		var orientation = deviceapis.orientation.watch.orientations[index];
		orientation._watchOrientationError(errorCode);
		deviceapis.orientation.watch.orientations.splice(index, 1);
	}
};

//		clear watch
deviceapis.orientation.clearWatch = function(id, callback)
{
	var index = deviceapis.orientation.watch._getIDIndex(id);
	if (index!==-1) { // watcher still active
		var orientation = deviceapis.orientation.watch.orientations[index];
		orientation.clearWatch(callback);
	}
};

deviceapis.orientation._clearWatch = function(id)
{
	var index = deviceapis.orientation.watch._getIDIndex(id);
	if (index!==-1) { // watcher still active
		var orientation = deviceapis.orientation.watch.orientations[index];
		orientation._clearWatch();
		deviceapis.orientation.watch.orientations.splice(index, 1);
	}
};
/*global deviceapis */
/*global callDeviceAPI */

// Quit
deviceapis.quit = function()
{
	callDeviceAPI("QUIT", "");
};
/*global deviceapis */
/*global callDeviceAPI */

// secure storage
deviceapis.securestorage = {
   onSuccessCallback: undefined,
   onFailureCallback: undefined,
   
   _onSuccessCallback: function(parameters) {
	  var callback = this.onSuccessCallback;
      
      this.onSuccessCallback = undefined;
      this.onFailureCallback = undefined;

      if (callback) {
    	  callback(parameters);
      }
   },
   _onFailureCallback: function(parameters) {
	  var callback = this.onFailureCallback;
      
      this.onSuccessCallback = undefined;
      this.onFailureCallback = undefined;

      if (callback) {
    	  callback(parameters);
      }
   },
   _computeOrigin: function(href) {
      // compute the document origin from the URL scheme, host and port
      var nHostIndex = href.indexOf("://", 0) + 3;
      var origin = href.substr(0, nHostIndex - 3);
      if (origin != "file") {
         // get the host
         var nPathIndex = href.indexOf("/", nHostIndex);
         var host = href.substr(nHostIndex, nPathIndex - nHostIndex);
      
         // get the port if defined
         var port = "80";
         var nPortIndex = href.indexOf(":", nHostIndex);
         if ((-1 != nPortIndex) && (nPortIndex < nPathIndex)) {
            port = href.substr(nPortIndex + 1, nPathIndex - nPortIndex - 1);
            host = href.substr(nHostIndex, nPortIndex - nHostIndex);
         }
         origin += "_" + host + "_" + port;
      }    
      
      return origin;
   },
   callDeviceAPI: function(action, parameters, onSuccessCallback, onFailureCallback) {
	  // check if an operation is not already pending
      /* removed: seems to be pending even when not really...
	   if (this.onSuccessCallback) {
         if (onFailureCallback) {
            onFailureCallback();
         }
         return;
      }
   	  */
	  
      this.onSuccessCallback = onSuccessCallback;
      this.onFailureCallback = onFailureCallback;
      
      parameters.origin = this._computeOrigin(document.location.href);
      parameters.onSuccess = "deviceapis.securestorage._onSuccessCallback";
      parameters.onError = "deviceapis.securestorage._onFailureCallback";
   
      callDeviceAPI("WEBCMD.SECURESTORAGE", "pipeJS=deviceapis._calls.next()&" + action + "=" + encodeURIComponent(JSON.stringify(parameters)));
   }
};

// open
deviceapis.securestorage.open = function(developerKey, onSuccessCallback, onFailureCallback) {
   // check parameters
   if ((developerKey == undefined) || (developerKey == null) || (developerKey == "")) {
	   if (onFailureCallback) {
		   onFailureCallback();
	   }
	   return;
   	}
   	// call API
	var parameters = {
		developerKey: developerKey
	};
	this.callDeviceAPI("open", parameters, onSuccessCallback, onFailureCallback);
};

// close
deviceapis.securestorage.close = function(onSuccessCallback, onFailureCallback) {
	// call API
	this.callDeviceAPI("close", {}, onSuccessCallback, onFailureCallback);
};

// migrate
deviceapis.securestorage.migrate = function(developerKey, onSuccessCallback, onFailureCallback) {
	// Check mandatory parameters
	if ((developerKey == undefined) || (developerKey == null) || (developerKey == "")) {
		if (onFailureCallback) {
			onFailureCallback();
		}
		return;
	}
	// call API
	var parameters = {
		developerKey: developerKey
	};
	this.callDeviceAPI("migrate", parameters, onSuccessCallback, onFailureCallback);
};

// get item
deviceapis.securestorage.getItem = function(key, onSuccessCallback, onFailureCallback) {
	// check parameters
	if ((key == undefined) || (key == null) || (key == "") || !onSuccessCallback) {
		if (onFailureCallback) {
			onFailureCallback();
		}
		return;
	}
	// call API
	var parameters = {
		key: key
	};
	this.callDeviceAPI("getItem", parameters, onSuccessCallback, onFailureCallback);
};

// set item
deviceapis.securestorage.setItem = function(key, value, onSuccessCallback, onFailureCallback) {
	// check parameters
	if ((key == undefined) || (key == null) || (key == "") || (value == undefined) || (value == null) || (value == "")) {
		if (onFailureCallback) {
			onFailureCallback();
		}
		return;
	}
	// call API
	var parameters = {
		key: key,
		value: value
	};
	this.callDeviceAPI("setItem", parameters, onSuccessCallback, onFailureCallback); 
};

// remove item
deviceapis.securestorage.removeItem = function(key, onSuccessCallback, onFailureCallback) {
   // check parameters
	if ((key == undefined) || (key == null) || (key == "")) {
		if (onFailureCallback) {
			onFailureCallback();
		}
		return;
	}
	// call API
	var parameters = {
		key: key
	};
	this.callDeviceAPI("removeItem", parameters, onSuccessCallback, onFailureCallback); 
};

// clear
deviceapis.securestorage.clear = function(onSuccessCallback, onFailureCallback) {
	// call API
	this.callDeviceAPI("clear", {}, onSuccessCallback, onFailureCallback); 
};
/*global deviceapis */
/*global callDeviceAPI */

// Social sharing
deviceapis.socialsharing = {
   onSuccessCallback: undefined,
   onFailureCallback: undefined,
   
   _onSuccessCallback: function(parameters) {
      var callback = this.onSuccessCallback;
      
      this.onSuccessCallback = undefined;
      this.onFailureCallback = undefined;

      if (callback) {
    	  callback(parameters);
      }
   },
   
   _onFailureCallback: function(parameters) {
      var callback = this.onFailureCallback;
      
      this.onSuccessCallback = undefined;
      this.onFailureCallback = undefined;

      if (callback) {
    	  if (parameters == "Failed") {
    		  callback();
    	  } else {
    		  callback(parameters);
    	  }
      }
   },
   
   _computeOrigin: function(href) {
      // compute the document origin from the URL scheme, host and port
      var nHostIndex = href.indexOf("://", 0) + 3;
      var origin = href.substr(0, nHostIndex - 3);
      if (origin !== "file") {
         // get the host
         var nPathIndex = href.indexOf("/", nHostIndex);
         var host = href.substr(nHostIndex, nPathIndex - nHostIndex);
      
         // get the port if defined
         var port = "80";
         var nPortIndex = href.indexOf(":", nHostIndex);
         if ((-1 != nPortIndex) && (nPortIndex < nPathIndex)) {
            port = href.substr(nPortIndex + 1, nPathIndex - nPortIndex - 1);
            host = href.substr(nHostIndex, nPortIndex - nHostIndex);
         }
         origin += "_" + host + "_" + port;
      }    
      
      return origin;
   },
   
   callDeviceAPI: function(action, parameters, onSuccessCallback, onFailureCallback) {
      this.onSuccessCallback = onSuccessCallback;
      this.onFailureCallback = onFailureCallback;
      
      parameters.origin = this._computeOrigin(document.location.href);
      parameters.onSuccess = "deviceapis.socialsharing._onSuccessCallback";
      parameters.onError = "deviceapis.socialsharing._onFailureCallback";
   
      callDeviceAPI("WEBCMD.SHARE", "pipeJS=deviceapis._calls.next()&" + action + "=" + encodeURIComponent(JSON.stringify(parameters)));
   }
};
           
//		share
deviceapis.socialsharing.share = function(providers, message, files, link, onSuccessCallback, onFailureCallback, options)
{
	if (providers) {
		for (var i = 0; i < providers.length; i++) {
			providers[i] = providers[i].toLowerCase();
		}
	}
	var parameters = {
		targets: providers,  
		message: message,   
		files: files,       
		link: link,
		options : options
	};
	this.callDeviceAPI("share", parameters, onSuccessCallback, onFailureCallback);
};

//		list
deviceapis.socialsharing.list = function(callback)
{
	var parameters = {};
	this.callDeviceAPI("listTargets", parameters, callback);
};
/*global deviceapis */
/*global callDeviceAPI */

// System
deviceapis.system = {
   // callbacks to the client app
   onSuccessCallback: undefined,
   onFailureCallback: undefined,
   
   // full data
   fullData: undefined,
   
   // full data type : binary or base64
   fullDataIsB64: false,
   
   // current offset within the full data buffer
   currOffset: undefined,
   
   // callback invoked by hawk core
   _onSuccessCallback: function(parameters) {
      // end of chunks or send another chunk ?
      if (this.currOffset >= this.fullData.length) {
         // reset
         var callback = this.onSuccessCallback;
         this.onSuccessCallback = undefined;
         this.onFailureCallback = undefined;
         this.fullData = undefined;
         
         // invoke user callback
         if (callback) {
            callback(parameters);
         }
      } else {
         // next chunk
         this._sendNextChunkToPrinter();
      }
   },
   
   // callback invoked by hawk core
   _onFailureCallback: function(parameters, optionalMessage) {
      // reset
      var callback = this.onFailureCallback;
      this.onSuccessCallback = undefined;
      this.onFailureCallback = undefined;
      this.fullData = undefined;

      // invoke user callback
      if (callback) {
         if (optionalMessage == undefined) {
            optionalMessage = "";
         }
         callback(new Error(parameters, optionalMessage));
      }
   },
   
   // computes the document origin
   _computeOrigin: function(href) {
      // compute the document origin from the URL scheme, host and port
      var nHostIndex = href.indexOf("://", 0) + 3;
      var origin = href.substr(0, nHostIndex - 3);
      if (origin != "file") {
         // get the host
         var nPathIndex = href.indexOf("/", nHostIndex);
         var host = href.substr(nHostIndex, nPathIndex - nHostIndex);
      
         // get the port if defined
         var port = "80";
         var nPortIndex = href.indexOf(":", nHostIndex);
         if ((-1 != nPortIndex) && (nPortIndex < nPathIndex)) {
            port = href.substr(nPortIndex + 1, nPathIndex - nPortIndex - 1);
            host = href.substr(nHostIndex, nPortIndex - nHostIndex);
         }
         origin += "_" + host + "_" + port;
      }    
      
      return origin;
   },
   
   // sends the next data chunk to the printer
   _sendNextChunkToPrinter: function() {
      // sanity check
      if ((this.fullData == undefined) || (this.fullData == null) ) {
         // failure callback
         this._onFailureCallback("InvalidValuesError", "byteData is not valid (null or undefined)");
         return;
      }
      
      // end of data reached ?
      if (this.currOffset >= this.fullData.length) {
         // release memory
         this.fullData = undefined;
         
         // nothing to do, should not happen
         return;
      }
      
      // get chunk as base64
      // base64 chunk must be multiple of 4 because 1 base64 char encodes 6 bits
      // if the whole buffer is a base64 buffer, get a sub-buffer size multiple of 4
      // if the whole buffer is a binary buffer, get a sub-buffer size multiple of 3
      var isFirstChunk = this.currOffset == 0;
      var chunkSize = this.fullDataIsBase64 ? 1048576 : 1048575; // about 1MB, multiple of 4 or 3
      if ((this.currOffset + chunkSize) > this.fullData.length) {
         chunkSize = this.fullData.length - this.currOffset;
      }
      var base64Chunk = null;
      if (this.fullDataIsBase64) {
         // get chunk
         base64Chunk = this.fullData.substring(this.currOffset, this.currOffset + chunkSize);
      } else {
         // convert to base64
         base64Chunk = deviceapis.utils.base64.encode(this.fullData, this.currOffset, chunkSize);         
      }      
      if ((base64Chunk == undefined) || (base64Chunk == null) || (base64Chunk == "")) {
         // failure callback
         this._onFailureCallback("InvalidValuesError", "base64Data is not valid (null or undefined)");
         return;
      }
      
      // update offset
      this.currOffset += chunkSize;
      
      // call the device api
      var parameters = {};
      parameters.origin = this._computeOrigin(document.location.href);
      parameters.datachunk = base64Chunk;
      parameters.firstchunk = isFirstChunk;
      parameters.lastchunk = this.currOffset == this.fullData.length;
      parameters.onSuccess = "deviceapis.system._onSuccessCallback";
      parameters.onError = "deviceapis.system._onFailureCallback";   
      if (this.fullDataIsBase64) {
         parameters.b64size = this.fullData.length;
      } else {
         parameters.binsize = this.fullData.length;
      }
      callDeviceAPI("WEBCMD.PRINTDOC", "pipeJS=deviceapis._calls.next()&print=" + encodeURIComponent(JSON.stringify(parameters)));
   }
};

// getFontScale
deviceapis.system.getFontScale = function(onSuccessCallback, onFailureCallback)
{
	deviceapis.system.getFontScale._onSuccessCallback = onSuccessCallback;
	deviceapis.system.getFontScale._onFailureCallback = onFailureCallback;
	callDeviceAPI("SYSTEM", "onSuccessCallback=deviceapis.system._getFontScale&onFailureCallback=deviceapis.system._getFontScaleError");
};

deviceapis.system._getFontScale = function(fontScale)
{
	if (deviceapis.system.getFontScale._onSuccessCallback != undefined) {
		deviceapis.system.getFontScale._onSuccessCallback(fontScale);
	}
};

deviceapis.system._getFontScaleError = function()
{
	if (deviceapis.system.getFontScale._onFailureCallback != undefined) {
		deviceapis.system.getFontScale._onFailureCallback();
	}
};

// print  
deviceapis.system.printBytes = function(onSuccessCallback, onFailureCallback, byteData)
{
   // work with chunks to avoid allocating huge buffers

   // check if an operation is not already pending
   if (this.onSuccessCallback) {
      if (onFailureCallback) {
         onFailureCallback(new Error("QueueFull", "Queue is full"));
      }
      return;
   }

   // check mandatory parameters
   if ((byteData == undefined) || (byteData == null)) {
      if (onFailureCallback) {
         onFailureCallback(new Error("InvalidValuesError", "byteData is not valid (null or undefined)"));
      }
      return;
   }
   if ((onSuccessCallback == undefined) || (onSuccessCallback == null)) {
      if (onFailureCallback) {
         onFailureCallback(new Error("InvalidValuesError", "onSuccessCallback is not valid (null or undefined)"));
      }
      return;
   }

   // save callbacks
   this.onSuccessCallback = onSuccessCallback;
   this.onFailureCallback = onFailureCallback;

   // save full data buffer
   this.fullData = byteData;
   this.fullDataIsBase64 = false;
   
   // init the current offset
   this.currOffset = 0;
   
   // start sending bytes to the printer
   this._sendNextChunkToPrinter();
};

deviceapis.system.printBase64 = function(onSuccessCallback, onFailureCallback, base64Data)
{
   // work with chunks to avoid allocating huge buffers
   
   // check if an operation is not already pending
   if (this.onSuccessCallback) {
      if (onFailureCallback) {
         onFailureCallback(new Error("QueueFull", "Queue is full"));
      }
      return;
   }
   
   // check mandatory parameters
   if ((base64Data == undefined) || (base64Data == null) || (base64Data == "")) {
      if (onFailureCallback) {
         onFailureCallback(new Error("InvalidValuesError", "base64Data is not valid (null or undefined)"));
      }
      return;
   }
   if ((onSuccessCallback == undefined) || (onSuccessCallback == null)) {
      if (onFailureCallback) {
         onFailureCallback(new Error("InvalidValuesError", "onSuccessCallback is not valid (null or undefined)"));
      }
      return;
   }
   
   // save callbacks
   this.onSuccessCallback = onSuccessCallback;
   this.onFailureCallback = onFailureCallback;

   // save full data buffer
   this.fullData = base64Data;
   this.fullDataIsBase64 = true;
   
   // init the current offset
   this.currOffset = 0;
   
   // start sending bytes to the printer
   this._sendNextChunkToPrinter();
};/*global deviceapis */
/*global callDeviceAPI */

// Tracking
deviceapis.tracking = new Object();
//deviceapis.tracking.callback;
//deviceapis.tracking.onSuccessCallback;
//deviceapis.tracking.onFailureCallback;

function TrackingConfiguration(status, persistence, maxlines, cleaning)
{
	this.status = status;
	this.persistence = persistence;
	this.maxlines = maxlines;
	this.cleaning = cleaning;
}

deviceapis.tracking.getConfiguration = function(callback)
{
	deviceapis.tracking.getConfiguration._callback = callback;
	callDeviceAPI("TRACKING","action=getConfiguration&callback=deviceapis.tracking._getConfiguration");
};
deviceapis.tracking._getConfiguration = function(status, persistence, maxlines, cleaning)
{
	if (deviceapis.tracking.getConfiguration._callback != undefined) {
		deviceapis.tracking.getConfiguration._callback(new TrackingConfiguration(status, persistence, maxlines, cleaning));
	}
};

deviceapis.tracking.setConfiguration = function(status, persistence, maxlines, cleaning, callback)
{
	deviceapis.tracking.setConfiguration._callback = callback;
	callDeviceAPI("TRACKING","action=setConfiguration&status="+status+"&persistence="+persistence+"&maxlines="+maxlines+"&cleaning="+cleaning+"&callback=deviceapis.tracking._setConfiguration");
};
deviceapis.tracking._setConfiguration = function()
{
	if (deviceapis.tracking.setConfiguration._callback != undefined) {
		deviceapis.tracking.setConfiguration._callback();
	}
};

deviceapis.tracking.start = function(callback)
{
	deviceapis.tracking.start._callback = callback;
	callDeviceAPI("TRACKING","action=start&callback=deviceapis.tracking._start");
};
deviceapis.tracking._start = function()
{
	if (deviceapis.tracking.start._callback != undefined) {
		deviceapis.tracking.start._callback();
	}
};

deviceapis.tracking.stop = function(callback)
{
	deviceapis.tracking.stop._callback = callback;
	callDeviceAPI("TRACKING","action=stop&callback=deviceapis.tracking._stop");
};
deviceapis.tracking._stop = function()
{
	if (deviceapis.tracking.stop._callback != undefined) {
		deviceapis.tracking.stop._callback();
	}
};

deviceapis.tracking.trackScreenView = function(screenName, callback)
{
	deviceapis.tracking.trackScreenView._callback = callback;
	callDeviceAPI("TRACKING","action=trackScreenView&screenName="+encodeURIComponent(screenName)+"&callback=deviceapis.tracking._trackScreenView");
};
deviceapis.tracking._trackScreenView = function()
{
	if (deviceapis.tracking.trackScreenView._callback != undefined) {
		deviceapis.tracking.trackScreenView._callback();
	}
};

deviceapis.tracking.trackEvent = function(category, taction, callback)
{
	deviceapis.tracking.trackEvent._callback = callback;
	callDeviceAPI("TRACKING","action=trackEvent&category="+encodeURIComponent(category)+"&taction="+encodeURIComponent(taction)+"&callback=deviceapis.tracking._trackEvent");
};
deviceapis.tracking._trackEvent = function()
{
	if (deviceapis.tracking.trackEvent._callback != undefined) {
		deviceapis.tracking.trackEvent._callback();
	}
};

deviceapis.tracking.load = function(callback)
{
	deviceapis.tracking.load._callback = callback;
	callDeviceAPI("TRACKING","action=load&callback=deviceapis.tracking._load");
};
deviceapis.tracking._load = function(data)
{
	if (deviceapis.tracking.load._callback != undefined) {
		var dataArray = new Array();
		var dataJSONObject = JSON.parse(data);
		if ((dataJSONObject!==null) && (dataJSONObject.tracking!==null)) {
			dataArray = dataJSONObject.tracking;
		}
		deviceapis.tracking.load._callback(dataArray);
	}
};

deviceapis.tracking.clean = function(callback)
{
	deviceapis.tracking.clean._callback = callback;
	callDeviceAPI("TRACKING","action=clean&callback=deviceapis.tracking._clean");
};
deviceapis.tracking._clean = function()
{
	if (deviceapis.tracking.clean._callback != undefined) {
		deviceapis.tracking.clean._callback();
	}
};

deviceapis.tracking.post = function(onSuccessCallback, onFailureCallback)
{
	deviceapis.tracking.post._onSuccessCallback = onSuccessCallback;
	deviceapis.tracking.post._onFailureCallback = onFailureCallback;
	callDeviceAPI("TRACKING","action=post&onSuccessCallback=deviceapis.tracking._post&onFailureCallback=deviceapis.tracking._postError");
};
deviceapis.tracking._post = function()
{
	if (deviceapis.tracking.post._onSuccessCallback != undefined) {
		deviceapis.tracking.post._onSuccessCallback();
	}
};
deviceapis.tracking._postError = function()
{
	if (deviceapis.tracking.post._onFailureCallback != undefined) {
		deviceapis.tracking.post._onFailureCallback();
	}
};
/*global deviceapis */
/*global callDeviceAPI */

// Web view
deviceapis.webview = new Object();
deviceapis.webview.statusbar = new Object();
deviceapis.webview.statusbar.networkactivityindicator = new Object();
deviceapis.webview.screenorientation = new Object();
deviceapis.webview.layout = new Object();
deviceapis.webview.layout._calls = new Object();
deviceapis.webview.layout._calls.queue = new Array();

// Layout
var Screen = new Object();
deviceapis.webview.layout._initialize = function(callback)
{
	deviceapis.webview.layout._initializeCallback = callback;
	callDeviceAPI("LAYOUT", "action=initialize&layoutListener=deviceapis.webview.layout._onChange");
};
deviceapis.webview.layout._onChange = function(layoutData)
{
	// Report values in Screen.layout object
	var newLayout = JSON.parse(layoutData);
	var orientationHasChanged = false;
	if (Screen.layout == undefined) {
		orientationHasChanged = true;
	} else if (newLayout.application.orientation != Screen.layout.application.orientation) {
		orientationHasChanged = true;
	}
	Screen.layout = newLayout;
   
	// Invoke the callback related to the initialization phase
	if (deviceapis.webview.layout._initializeCallback != undefined)
	{
		deviceapis.webview.layout._initializeCallback();
		deviceapis.webview.layout._initializeCallback = undefined;
	}
    
	// Raise the event to notify change
	if (orientationHasChanged) {
		deviceapis.application._dispatchEvent("orientationchange");
	}
	deviceapis.application._dispatchEvent("layoutchange");
};
deviceapis.webview.layout.set = function(layoutObject, callback)
{
	if ((layoutObject == null) || (layoutObject == undefined)) {
		return; // invalid input
	}

	deviceapis.webview.layout.set._callback = callback;

	// Prepare useful parameters to avoid passing the whole layout object as a json string (in addition some attributes are read-only)
	var statusbar = "";
	try {
		statusbar = layoutObject.statusbar.visible ? "on" : "off";
	} catch(e) {}
	var supportedorientations = 0x00;
	try {
		for (var i = 0; i < layoutObject.application.supportedorientations.length; i++) {
			if (layoutObject.application.supportedorientations[i] == "portrait-primary") {
				supportedorientations |= 0x01;
			} else if (layoutObject.application.supportedorientations[i] == "portrait-secondary") {
				supportedorientations |= 0x02;
			} else if (layoutObject.application.supportedorientations[i] == "landscape-primary") {
				supportedorientations |= 0x04;
			} else if (layoutObject.application.supportedorientations[i] == "landscape-secondary") {
				supportedorientations |= 0x08;
			}
		}
	} catch(e) {}
	
	// Status bar style
    var statusbarStyle = "";
    try {
        if (layoutObject.statusbar.style != undefined) {
            statusbarStyle = layoutObject.statusbar.style;
        }
    } catch(e) {}
	
	// iOS specific overlap option
	var statusbarOverlap = "";
	try {
	    if (layoutObject.statusbar.overlapping != undefined) {
	        statusbarOverlap = layoutObject.statusbar.overlapping ? "on" : "off";
	    }
	} catch(e) {}
	
	// WP specific options
	var statusbarBColor = "";
	try {
	    if (layoutObject.statusbar.backgroundcolor != undefined) {
	    	statusbarBColor = layoutObject.statusbar.backgroundcolor.replace("#","");
	    }
	} catch(e) {}
	var statusbarFColor = "";
	try {
	    if (layoutObject.statusbar.foregroundcolor != undefined) {
	    	statusbarFColor = layoutObject.statusbar.foregroundcolor.replace("#","");
	    }
	} catch(e) {}
	
	deviceapis.webview.layout._calls.queue.push("action=set&statusbar=" + statusbar + "&overlapping=" + statusbarOverlap + "&statusbarStyle=" + statusbarStyle + "&statusbarBColor=" + statusbarBColor + "&statusbarFColor=" + statusbarFColor + "&orientations=" + supportedorientations + "&callback=deviceapis.webview.layout._set");
	if (deviceapis.webview.layout._calls.queue.length===1) { // no call in progress
		callDeviceAPI("LAYOUT", deviceapis.webview.layout._calls.queue[0]);
	}
};
deviceapis.webview.layout._set = function(supportedOrientations, statusBarStyle, statusBarBColor, statusBarFColor)
{
	// update supported orientations
	Screen.layout.application.supportedorientations = JSON.parse(supportedOrientations);
	
	// update status bar style
	if ((statusBarStyle != null) && (statusBarStyle != "")) {
	   Screen.layout.statusbar.style = statusBarStyle;
	}
	
	// update status bar colors
	if ((statusBarBColor != null) && (statusBarBColor != "")) {
	   Screen.layout.statusbar.backgroundcolor = "#" + statusBarBColor;
	}
	if ((statusBarFColor != null) && (statusBarFColor != "")) {
	   Screen.layout.statusbar.foregroundcolor = "#" + statusBarFColor;
	}

	// call callback
	if (deviceapis.webview.layout.set._callback != undefined) {
		deviceapis.webview.layout.set._callback();
	}
	
	// process queue
	deviceapis.webview.layout._calls.queue.splice(0, 1);
	if (deviceapis.webview.layout._calls.queue.length>0) { // pending call
		callDeviceAPI("LAYOUT", deviceapis.webview.layout._calls.queue[0]);
	}
};

// Status bar
deviceapis.webview.statusbar.show = function()
{
	deviceapis.webview.layout.set({statusbar:{visible:true}});
};
deviceapis.webview.statusbar.hide = function()
{
	deviceapis.webview.layout.set({statusbar:{visible:false}});
};

// Network activity indicator
deviceapis.webview.statusbar.networkactivityindicator.show = function()
{
	callDeviceAPI("NETWORKACTIVITYINDICATOR", "action=on");
};
deviceapis.webview.statusbar.networkactivityindicator.hide = function()
{
	callDeviceAPI("NETWORKACTIVITYINDICATOR", "action=off");
};

// Screen orientation
deviceapis.webview.screenorientation.lock = function()
{
	callDeviceAPI("SCREENORIENTATION", "action=off");
};
deviceapis.webview.screenorientation.unlock = function()
{
	callDeviceAPI("SCREENORIENTATION", "action=on");
};
deviceapis.webview.screenorientation.set = function(orientation)
{
	deviceapis.webview.layout.set({application:{supportedorientations: [orientation]}});
};
/*global deviceapis */
/*global callDeviceAPI */

// utils
deviceapis.utils = new Object();
deviceapis.utils._imageAdaptorURL = "http://ia.pve2.streamezzo.com/imageadaptor/adapt/json";

// string
deviceapis._utils.escapeString = function (string)
{
	return string.replace(new RegExp("\\\\", "g"), "\\\\").replace(new RegExp("\"", "g"), "\\\"").replace(new RegExp("\'", "g"), "\\\'");
};

// base64
deviceapis.utils.base64 = new Object();
deviceapis.utils.base64._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; 

deviceapis.utils.base64.encode = function (byteData, offset, length)
{
     var base64String = [];
     var chr1, chr2, chr3 = "";
     var enc1, enc2, enc3, enc4 = "";
     var i = offset;
     var endBound = offset + length;

     do {
        chr1 = byteData[i++];
        chr2 = byteData[i++];
        chr3 = byteData[i++];

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
           enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
           enc4 = 64;
        }

        base64String.push(deviceapis.utils.base64._keyStr.charAt(enc1) +
           deviceapis.utils.base64._keyStr.charAt(enc2) +
           deviceapis.utils.base64._keyStr.charAt(enc3) +
           deviceapis.utils.base64._keyStr.charAt(enc4));
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
     } while (i < endBound);

     return base64String.join("");
};
    
deviceapis.utils.base64.decode = function (base64String)
{	  
	  var byteData = [];
	  var chr1, chr2, chr3 = "";
	  var enc1, enc2, enc3, enc4 = "";
	  var i = 0;

	  do {
	     enc1 = deviceapis.utils.base64._keyStr.indexOf(base64String.charAt(i++));
	     enc2 = deviceapis.utils.base64._keyStr.indexOf(base64String.charAt(i++));
	     enc3 = deviceapis.utils.base64._keyStr.indexOf(base64String.charAt(i++));
	     enc4 = deviceapis.utils.base64._keyStr.indexOf(base64String.charAt(i++));
	
	     chr1 = (enc1 << 2) | (enc2 >> 4);
	     chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	     chr3 = ((enc3 & 3) << 6) | enc4;
	
	     byteData.push(chr1);
	
	     if (enc3 != 64) {
	        byteData.push(chr2);
	     }
	     if (enc4 != 64) {
	        byteData.push(chr3);
	     }
	
	     chr1 = chr2 = chr3 = "";
	     enc1 = enc2 = enc3 = enc4 = "";
	  } while (i < base64String.length);

	  return byteData;
};

// parameter
deviceapis._utils.getParameterValue = function (parameters, parameterName)
{
	var startIndex = parameters.indexOf(parameterName + "=", 0);
	if (startIndex == -1) {
		return null;
	}
	startIndex += parameterName.length+1;

	var endIndex = parameters.indexOf("&", startIndex);
	if (endIndex == -1) {
		endIndex = parameters.length;
	}
	return parameters.substring(startIndex, endIndex);
};

// filter
deviceapis._utils.matchFilter = function (string, filter) 
{
	var filterPattern;

	if ((filter == null) || (filter == "undefined")) {
  		return true;
  	}
	if ((string == null) || (string == "undefined")) {
  		return false;
  	}
	var filterArray = filter.split("%");
	if (filterArray.length == 1) { // equals
	  	return string.toLowerCase() == filter.toLowerCase();
	}
	if ((filterArray.length == 2) && (filterArray[1] == "")) { // starts with
  		filterPattern = "^"+filterArray[0];
    } else if ((filterArray.length == 2) && (filterArray[0] == "")) { // ends with
  		filterPattern = filterArray[1]+"$";
  	} else if ((filterArray.length == 3) && (filterArray[0] == "") && (filterArray[2] == "")) { // contains
  		filterPattern = filterArray[1]+"+";
  	}
  	return string.match(new RegExp(filterPattern, "gi")) != null;
};

deviceapis._utils.matchFilterInList = function (list, name, filter) 
{
	var filterPattern;

	if ((filter == null) || (filter == "undefined")) {
  		return true;
  	}
	if ((list == null) || (list.length == 0)) {
  		return false;
  	}
	var filterArray = filter.split("%");
	if (filterArray.length == 1) { // equals
	  	return string.toLowerCase() == filter.toLowerCase();
	}
	if ((filterArray.length == 2) && (filterArray[1] == "")) { // starts with
  		filterPattern = "^"+filterArray[0];
    } else if ((filterArray.length == 2) && (filterArray[0] == "")) { // ends with
  		filterPattern = filterArray[1]+"$";
  	} else if ((filterArray.length == 3) && (filterArray[0] == "") && (filterArray[2] == "")) { // contains
  		filterPattern = filterArray[1]+"+";
  	}
	var itemsNumber = list.length;
	for (var itemIndex=0; itemIndex<itemsNumber; itemIndex++) {
		var item = eval("list[" + itemIndex + "]" + "." + name);
		if (item.match(new RegExp(filterPattern, "gi")) != null) {
			return true;
		}
	}
  	return false;
};

// load page and execute JS
deviceapis._utils.injectJSFile = function (url, file)
{
	callDeviceAPI("INJECTJSFILE", "url=" + encodeURIComponent(url) + "&file=" + file);
};

// CORS
deviceapis._utils.createCORSRequest = function(method, url)
{
  	var xhr = new XMLHttpRequest();
  	if ("withCredentials" in xhr) {
    	xhr.open(method, url, true);
  	} else if (typeof XDomainRequest != "undefined") {
    	xhr = new XDomainRequest();
    	xhr.open(method, url);
  	} else {
    	xhr = null; // CORS not supported
 	}
  	return xhr;
};

// image
deviceapis.utils.getImage = function(id, url, width, height, unit, boxfit, onSuccessCallback, onFailureCallback)
{	
	var postDataJSON = "{";
	postDataJSON += "\"url\":\""+url+"\"";
	postDataJSON += ",";
	postDataJSON += "\"width\":"+width;
	postDataJSON += ",";
	postDataJSON += "\"height\":"+height;
	postDataJSON += ",";
	postDataJSON += "\"unit\":\""+unit+"\"";
	postDataJSON += ",";
	postDataJSON += "\"boxfit\":\""+boxfit+"\"";
	postDataJSON += ",";
	postDataJSON += "\"resolution\":["+deviceapis.device._properties.screenWidth+","+deviceapis.device._properties.screenHeight+"]";
	postDataJSON += ",";
	postDataJSON += "\"diagonal\":\""+deviceapis.device._properties.screenDiagonalSize+"\"";
	postDataJSON += "}";
	
	var XHR = deviceapis._utils.createCORSRequest("POST", deviceapis.utils._imageAdaptorURL);
	XHR.onload = function() {
		var imageJSON = JSON.parse(XHR.responseText); 
		var image = document.getElementById(id);
		image.style.visibility = "visible";
		image.src = "data:image/"+imageJSON.format+";base64,"+imageJSON.data;
	    if (onSuccessCallback != undefined) {
	    	onSuccessCallback();
		}
	};
	XHR.onerror = function() {
		var image = document.getElementById(id);
		image.style.visibility = "hidden";
		image.src = "";
		if (onFailureCallback != undefined) {
	    	onFailureCallback();
		}
	};
	XHR.send(postDataJSON);
};

// Date picker
deviceapis.utils.datepicker = new Object();
deviceapis.utils.datepicker._displayed = false;
//deviceapis.utils.datepicker.input;
//deviceapis.utils.datepicker.onSuccessCallback;
//deviceapis.utils.datepicker.onCancelCallback;
//deviceapis.utils.datepicker.onFailureCallback;

deviceapis.utils.datepicker.display = function(input, onSuccessCallback, onCancelCallback, onFailureCallback, type)
{	
	// Not on iOS
	if (!deviceapis.browserinfo.isDeviceEmulator && !deviceapis.browserinfo.isiOS && !deviceapis.utils.datepicker._displayed) {
		deviceapis.utils.datepicker._displayed = true;
		input.blur(); // prevents native handling of input to be displayed
		deviceapis.utils.datepicker.input = input;
		deviceapis.utils.datepicker.onSuccessCallback = onSuccessCallback;
		deviceapis.utils.datepicker.onCancelCallback = onCancelCallback;
		deviceapis.utils.datepicker.onFailureCallback = onFailureCallback;
		
		if (deviceapis.browserinfo.isAndroid && deviceapis.browserinfo.OSVersion >= 4.4) {
			event.preventDefault(); // disable native datepickers in Android 4.4+ because they are buggy
		}
		
		var inputType;
		if (type != undefined) {
			inputType = type.toUpperCase();
		} else {
			inputType = input.getAttribute("type").toUpperCase();
		}
		
		if (deviceapis.browserinfo.isWindowsPhone) { // patch for WP when no date is currently set
			if (input.value===null || input.value==="") {
				if (inputType==="date") {
					input.value = new Date().toJSON().slice(0,10); // date value set to current date
				} else if (inputType==="time") {
					input.value = new Date().toJSON().slice(11,16); // time value set to current time
				}
			}
		}
		
		callDeviceAPI("DATEPICKER", "type="+inputType+"&value="+input.value+"&minvalue="+input.min+"&maxvalue="+input.max+"&onSuccessCallback=deviceapis.utils.datepicker._display&onCancelCallback=deviceapis.utils.datepicker._displayCancel&onFailureCallback=deviceapis.utils.datepicker._displayError");
		//input.form.reset().disable();
	// iOS
	} else if ((deviceapis.browserinfo.isDeviceEmulator || deviceapis.browserinfo.isiOS) && input.readOnly) {
		input.readOnly = false;
		// simulate a click to trigger native datepicker
    input.blur();
    input.focus();
	}
};

deviceapis.utils.datepicker._display = function(value)
{
	deviceapis.utils.datepicker.input.value = value;
	if (deviceapis.utils.datepicker.onSuccessCallback != undefined) {
		deviceapis.utils.datepicker.onSuccessCallback(value);
	}
	deviceapis.utils.datepicker._displayed = false;
	//input.form.reset().disable();
};

deviceapis.utils.datepicker._displayCancel = function()
{
	if (deviceapis.utils.datepicker.onCancelCallback != undefined) {
		deviceapis.utils.datepicker.onCancelCallback();
	}
	deviceapis.utils.datepicker._displayed = false;
	//input.form.reset().disable();
};

deviceapis.utils.datepicker._displayError = function()
{
	if (deviceapis.utils.datepicker.onFailureCallback != undefined) {
		deviceapis.utils.datepicker.onFailureCallback();
	}
	deviceapis.utils.datepicker._displayed = false;
	//input.form.reset().disable();
};

deviceapis.utils.downloadBytes = function(url, onSuccessCallback, onFailureCallback)
{
	var XMLHttp = null;
	
	var onXMLHttpStateChanged = function() {
		if (XMLHttp.readyState == 4) {
			var response = {};
			if (XMLHttp.status == "304" || XMLHttp.status == "200" || XMLHttp.status == "206" || XMLHttp.status == "0") {
				response.isResponseBody = typeof XMLHttp.responseBody == 'unknown';
				response.Content = response.isResponseBody ? XMLHttp.responseBody : XMLHttp.responseText;
				response.HTTPStatus = XMLHttp.status;
				response.ContentLength = XMLHttp.getResponseHeader("Content-Length");
				response.ContentType = XMLHttp.getResponseHeader("Content-Type");
			}
			XMLHttp = null;

			try {
				var byteData = "";

				if (response.isResponseBody) {
					byteData = response.Content.toArray();
	 			} else {
					byteData = [];
					for (var i = 0; i < response.Content.length; i++ ) {
						// The charset x-user-defined uses the UNICODE Private Area 0xF700-0xF7ff to map its range.
						byteData.push( response.Content.charCodeAt(i) & 0xFF );
					}
	 	 		}

				if ((deviceapis.browserinfo.isWindowsPhone81WRT) && (byteData.length <= 0) && (onFailureCallback != undefined)) {
					// download fails when the server responds an empty data
					onFailureCallback();
				} else if (onSuccessCallback != undefined) {
					onSuccessCallback(byteData);
				}
			} catch(e) {
				if (onFailureCallback != undefined) {
					onFailureCallback();
				}
			}
		}
	};

	if (window.XMLHttpRequest) {
		XMLHttp = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		try {
			XMLHttp = new ActiveXObject('MSXML2.XMLHttp.3.0');
		} catch(e) {
			XMLHttp = null;
		}
	}

	if (XMLHttp) {
		// XMLHttp.onload does not work on WindowsPhone 8.1 WinRT devices when CORS is not set at server side
		if ((typeof(XMLHttp.onload) != 'undefined') && !deviceapis.browserinfo.isWindowsPhone81WRT) {
			XMLHttp.onload = onXMLHttpStateChanged;
		} else {
			XMLHttp.onreadystatechange = onXMLHttpStateChanged;
		}

		XMLHttp.open("GET", url, true);

		if (XMLHttp.overrideMimeType) {
			XMLHttp.overrideMimeType('text/plain; charset=x-user-defined');
		}
		
		XMLHttp.send(null);
	} else {
		if (onFailureCallback != undefined) {
			onFailureCallback();
		}
	}
};

// function.name declaration if not defined (required due to non-support by IE / WP devices)
if (!(function f() {}).name) {
	Object.defineProperty(Function.prototype, 'name', {
		get: function() {
			var name = this.toString().match(/^\s*function\s*(\w*)\s*\(/)[1];
			Object.defineProperty(this, 'name', { value: name });
			return name;
		}
	});
}
/*global deviceapis */
/*global callDeviceAPI */

// Onload
deviceapis._onload = function()
{
    // 1) initialize layout management 
    deviceapis.webview.layout._initialize(deviceapis._onload1);
};
deviceapis._onload1 = function()
{
	// 2) load application id 
	deviceapis.application.getID(deviceapis._onload2);
};
deviceapis._onload2 = function()
{
	// 3) load application version
	deviceapis.application.getVersion(deviceapis._onload3);
};
deviceapis._onload3 = function()
{
	// 4) load device information
	deviceapis.device.getProperties(deviceapis._onload4);
};
deviceapis._onload4 = function()
{
	// 5) load engine information
	deviceapis._engine.getProperties(deviceapis._onload5);
};
deviceapis._onload5 = function()
{
	// 6) initialize hybrid app bridge
	deviceapis._bridge._initialize(deviceapis._onload6);
};
deviceapis._onload6 = function()
{
	// 7) check notifications
	if (deviceapis.googleanalytics == undefined) {
		deviceapis.notification._check(deviceapis._setReady);
	} else {
		deviceapis.notification._check(deviceapis._onloadGA);
	}
};

// Google Analytics init
deviceapis._onloadGA = function()
{
	// load Google Analytics client ID
	deviceapis.context.load("gaclientid", deviceapis._startInitGA);
};
deviceapis._startInitGA = function(clientID)
{
	if (clientID != "") {
		deviceapis.googleanalytics.clientID = clientID;
		deviceapis._endInitGA();
	} else {
		deviceapis.googleanalytics.clientID = deviceapis.googleanalytics._generateClientID();
		deviceapis.context.save("gaclientid", deviceapis.googleanalytics.clientID, deviceapis._endInitGA);
	}
};
deviceapis._endInitGA = function()
{
	deviceapis._setReady();
};

// readiness detection
deviceapis._isDOMReady = false;

deviceapis._DOMContentLoaded = function() {
	document.removeEventListener("DOMContentLoaded", deviceapis._DOMContentLoaded, false);	
	if (!deviceapis._isDOMReady) {
		deviceapis._isDOMReady = true;
		deviceapis._onload();
	}
};

if (/complete|loaded/.test(document.readyState)) {
	deviceapis._onload();
} else {
	document.addEventListener("DOMContentLoaded", deviceapis._DOMContentLoaded, false);
	window.addEventListener("load", deviceapis._DOMContentLoaded, false); // fallback to window.onload()
	
}
