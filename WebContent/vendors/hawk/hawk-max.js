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
/*global console */

// Device APIs
deviceapis._calls = new Object();
deviceapis._calls.queue = new Array();
deviceapis._bridge = new Object();

function callDeviceAPI(API, parameters)
{
	if (deviceapis.browserinfo.isDeviceEmulator) {
		// Desktop Chrome - UXFME Device Emulator
		deviceapis._calls.add("http://stz/deviceAPI/"+API+"?"+parameters);
	} else if ((deviceapis.browserinfo.userAgent.indexOf("Windows Phone")>=0) || (deviceapis.browserinfo.userAgent.indexOf("Windows NT ")>=0)) {
		deviceapis._calls.add("http://stz/deviceAPI/"+API+"?"+parameters);
	} else if ((deviceapis.browserinfo.userAgent.indexOf("iPhone")>=0) || (deviceapis.browserinfo.userAgent.indexOf("iPad")>=0) || (deviceapis.browserinfo.userAgent.indexOf("Android")>=0)) {
		deviceapis._calls.add("stz://deviceAPI/"+API+"?"+parameters);
	} else if (deviceapis.browserinfo.userAgent.indexOf("BlackBerry")>=0) {
		deviceapis._calls.add("stz:///deviceAPI/"+API+"?"+parameters);
	} else if (deviceapis.browserinfo.userAgent.indexOf("Windows")>=0) { // emulator
		deviceapis._calls.add("stz://deviceAPI/"+API+"?"+parameters);
	} else {
		console.error("Platform not supported.");
	}
}

deviceapis._calls.add = function(call)
{
	deviceapis._calls.queue.push(call);
	if (deviceapis._calls.queue.length===1) { // no call in progress
		if (deviceapis.browserinfo.isDeviceEmulator) {
			// Desktop Chrome - UXFME Device Emulator
			var xhr = new XMLHttpRequest();
			xhr.open("GET", call);
			xhr.send();
		} else if ((deviceapis.browserinfo.userAgent.indexOf("Windows Phone")>=0) || (deviceapis.browserinfo.userAgent.indexOf("Windows NT ")>=0)) {
			window.external.notify(call);
		} else {
			document.location.href = call;
		}
	}
};

deviceapis._calls.next = function()
{
	deviceapis._calls.queue.splice(0, 1);
	if (deviceapis._calls.queue.length>0) { // pending call
		if (deviceapis.browserinfo.isDeviceEmulator) {
			// Desktop Chrome - UXFME Device Emulator
			var xhr = new XMLHttpRequest();
			xhr.open("GET", deviceapis._calls.queue[0]);
			xhr.send();
		} else if ((deviceapis.browserinfo.userAgent.indexOf("Windows Phone")>=0) || (deviceapis.browserinfo.userAgent.indexOf("Windows NT ")>=0)) {
			window.external.notify(deviceapis._calls.queue[0]);
		} else {
			document.location.href = deviceapis._calls.queue[0];
		}
	}
};

// Specific hybrid app bridge to circumvent severe memory leaks on WP8.1 WinRT, and on W10 as well
// -----------------------------------------------------------------------------------------------
// Initialization of the alternate native to web channel. Applied on WP8.1 WinRT only.
deviceapis._bridge._initialize = function(callback) {
	// For now, only applied to WP8.1 WinRT to patch severe memory leaks (there is a leak each time RME inject javascript code in the webview).
	// This alternate bridging cannot work with distant web content.
	// Also enabled for Windows 10 UWP for the same reason
	if ( (deviceapis.browserinfo.isWindowsPhone81WRT || deviceapis.browserinfo.isWindows10Mobile || deviceapis.browserinfo.isWindows10) && (document.location.protocol === "ms-local-stream:") ) {
		// Send web command to RME in order to request for this specific bridge
		var parameters = {
			onResultURI: "deviceapis._bridge._onResultURI",
			resultCallback : "deviceapis._bridge._onResultAvailable"
		};
		callDeviceAPI("WEBCMD.BRIDGING", "pipeJS=deviceapis._calls.next()&initialize=" + encodeURIComponent(JSON.stringify(parameters)));
			
		// Do not wait for bridging API callback to ensure backward compatibility (in addition, let the RME decide whether it will use the alternate bridging or not).
		// During the specific bridging initialization phase, device api calls will use standard way but memory leaks will be non significant
		// When bridging will be initialized successfully:
		//	- _onResultURI ils invoked to know the URI to connect to in order to retrieve device api result (the javascript code to inject)
		//	- _onResultAvailable is invoked to tell that a device api result is available, must be downloaded and executed
	}
	
	// continue
	callback();	
};
// Function called by RME to provide the URI to connect to in order to retrieve device api result data
deviceapis._bridge._onResultURI = function(resultURI) {
	// Save the URI to connect to in order to retrieve the device api results 
	deviceapis._bridge._resultURI = resultURI;
	
	// Init the counter of pending data and the xhr obejct
	deviceapis._bridge._pendingResultCount = 0;
	deviceapis._bridge._currentXhr = null;
	deviceapis._bridge._scheduler = null;
	
	// Init the iframe
	deviceapis._bridge._frame = null;
	deviceapis._bridge._frameWnd = null;
	deviceapis._bridge._frameWeight = 0;
	deviceapis._bridge._iframeContent = "<html><head></head><body><script>function invokeFunc(jsString){eval('parent.' + jsString);}</script></body></html>";
};
// Function called by RME to indicates that there is data to retrieve on the bridge
deviceapis._bridge._onResultAvailable = function() {
	// A device api result is available
	deviceapis._bridge._pendingResultCount++;
	
	// Discard potential scheduled call to processResult before calling processResult from here
	if (deviceapis._bridge._scheduler != null) {
		clearTimeout(deviceapis._bridge._scheduler);
		deviceapis._bridge._scheduler = null;
	}
	
	// Load the javascript data
	deviceapis._bridge._processResult();
};
// Function to retrieve device api result data
deviceapis._bridge._processResult = function() {
	// Reset scheduler
	deviceapis._bridge._scheduler = null;
	
	// Check if busy since we do not want to launch javascript injection simultaneously (no more than 1 xhr + 1 iframe at one time)
	if (deviceapis._bridge._currentXhr === null) {
		// Load the javascript data to inject
		try {
			// To minimize impact on performance, do not use usual anonymous onreadystatechange to avoid heavy closure and deep call stack
			var xhr = new XMLHttpRequest();
			deviceapis._bridge._currentXhr = xhr;
			xhr.open('GET', deviceapis._bridge._resultURI, true);
			xhr.onreadystatechange = deviceapis._bridge._xhrOnreadystatechange;
			xhr.send(null);
		} catch(err) {
			// should not fail, maybe in case of rme bug or too many simultaneous xhr...			
			// Ready to process next data
			deviceapis._bridge._currentXhr = null;			
			// Retry
			deviceapis._bridge._scheduler = setTimeout(deviceapis._bridge._processResult, 200);
		}
	}
};
// XMLHttpRequest.onreadystatechange implementation
deviceapis._bridge._xhrOnreadystatechange = function() {
	if (deviceapis._bridge._currentXhr.readyState === 4) {
		// One device api result has been retrieved
		deviceapis._bridge._pendingResultCount--;
		
		// Interpret result
		var jsCodeToExecute = deviceapis._bridge._currentXhr.responseText;
		if (jsCodeToExecute.length > 0) {
			deviceapis._bridge._interpretResult(jsCodeToExecute);
		}
		
		// Ready to process next data
		deviceapis._bridge._currentXhr = null;
		
		// Request processing of further data if any
		if (deviceapis._bridge._pendingResultCount > 0) {
			// Use setTimeout to avoid deep call stack, exit from the xhr context, and save some processing time to let the script engine do other things
			deviceapis._bridge._scheduler = setTimeout(deviceapis._bridge._processResult, 50);
		}
	}
};
// Function to interpret retrieved device api result data
deviceapis._bridge._interpretResult = function(jsCodeToExecute) {
	// eval() is leaking, more precisely any memory related to eval() is lost. At the end, it makes the app crash on WP because the amount of
	// memory allocated for the app is quite low on this platform.
	// To circumvent this, we will execute eval() in a dedicated iframe. Used memory will be freed when this iframe is deleted.
	// Note that using eval() in this iframe is limited to evaluate a function call only because it has to be called in parent frame context.
	
	// To minimize impact on performance we will try to reuse the iframe because iframe creation, initialization and deletion is significantly slow.
	// The iframe is reused until a threshold is reached. This threshold is defined as the amount of javascript loaded in the iframe.
	
	// Get size of this new js string
	var jsCodeSize = jsCodeToExecute.length;
	
	// Check if an iframe can be reused. Release the previous one if too many js loaded into it
	var deleteFrameOnExit = false;
	if ( (deviceapis._bridge._frame !== null) && (deviceapis._bridge._frame.parentNode !== null) ) {
		// Compute the iframe weight
		deviceapis._bridge._frameWeight += jsCodeSize;
		// Check if threshold reached (256 kB)
		if (deviceapis._bridge._frameWeight >= 262144) {
			// Release this iframe to free memory. A new iframe will be used.
			deviceapis._bridge._frame.parentNode.removeChild(deviceapis._bridge._frame);
			deviceapis._bridge._frame = null;
			deviceapis._bridge._frameWnd = null;
			deviceapis._bridge._frameWeight = 0;
		}
	}
	
	// If no iframe is available, create an iframe containing the customized eval() function
	if (deviceapis._bridge._frame === null) {
		deviceapis._bridge._frame = document.createElement("iframe");
		deviceapis._bridge._frame.style.display = "none";
		document.body.appendChild(deviceapis._bridge._frame);
		deviceapis._bridge._frameWnd = deviceapis._bridge._frame.contentWindow;
		deviceapis._bridge._frameWnd.document.open();
		deviceapis._bridge._frameWnd.document.write(deviceapis._bridge._iframeContent);
		deviceapis._bridge._frameWnd.document.close();
		deviceapis._bridge._frameWeight = jsCodeSize;
	}
	
	// Execute in iframe
	deviceapis._bridge._frameWnd.invokeFunc(jsCodeToExecute);
	
	// Delete the current iframe if too many memory used (256 kB)
	if (jsCodeSize >= 262144) {
		// Release this iframe to free memory. A new iframe will be used later.
		deviceapis._bridge._frame.parentNode.removeChild(deviceapis._bridge._frame);
		deviceapis._bridge._frame = null;
		deviceapis._bridge._frameWnd = null;
		deviceapis._bridge._frameWeight = 0;
	}
};

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
