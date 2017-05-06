/*
 * This library exposes function autoUpdate() that will successively
 *	1. check update availability
 *		=>  throws event "CheckUpdateEvent",
 *			then event "CheckUpdateErrorEvent" in case of failure,
 *				else goes to 2.
 *	2. download update
 *		=>  throws event "DownloadUpdateEvent" if an update is available
 *				else event "NoUpdateEvent" if no update is available
 *			then event "DownloadUpdateErrorEvent" in case of failure,
 *				else goes to 3. in case of update
 *					 else event "AccessStoreEvent" in case of release
 *	3. apply update
 *		=>  throws event "ApplyUpdateEvent"
 *			then event "ApplyUpdateErrorEvent" in case of failure,
 *				else "UpdateDoneEvent"
 *
 *	- at least the following event listeners are supposed to be set:
 *		// react to no update (example: disable loading wheel)
 *		document.addEventListener("NoUpdateEvent", function() { ... }, false);
 *		// react to update done (example: inform end-user application will restart from start page)
 *		document.addEventListener("UpdateDoneEvent", function() { ... }, false);
 *	- autoUpdate() is supposed to be called upon deviceapis.ready()
 */

/*global deviceapis */
/*global console */

console.log("[HAWK auto-update] activated");

// 1. check update availability
function autoUpdate()
{
	console.log("[HAWK auto-update] triggered");
	
	// get current version
	console.log("[HAWK auto-update] current version: " + deviceapis.application.version);
	
	// check update availability
	console.log("[HAWK auto-update] checking update availability...");
	deviceapis.application.update.checkAvailability(_downloadUpdate, _notifyCheckUpdateFailure);
	
	// throw event
	var event = document.createEvent("Event");
	event.initEvent("CheckUpdateEvent", true, true);
	document.dispatchEvent(event);
}

function _notifyCheckUpdateFailure()
{
	console.log("[HAWK auto-update] update availability check failed");
	
	// throw event
	var event = document.createEvent("Event");
	event.initEvent("CheckUpdateErrorEvent", true, true);
	document.dispatchEvent(event);
}

// 2. download update
function _downloadUpdate(update)
{
	var event;

	// get update version + mandatory
	var updateVersion = update.version;
	var updateMandatory = update.mandatory;
	var updateRelease = update.release;
	console.log("[HAWK auto-update] update availability checked: version=" + updateVersion + " [mandatory=" + updateMandatory + " | release=" + updateRelease+ "]");
	
	if ((updateVersion!==deviceapis.application.version) && updateMandatory) {
		if (!updateRelease) { // update
			// download update
			console.log("[HAWK auto-update] downloading update...");
			deviceapis.application.update.download(_applyUpdate, _notifyDownloadUpdateFailure);
			
			// throw event
			event = document.createEvent("Event");
			event.initEvent("DownloadUpdateEvent", true, true);
			document.dispatchEvent(event);
		} else { // release
			// download update
			console.log("[HAWK auto-update] downloading release from store...");
			deviceapis.application.update.download(_notifyAccessToSTore);
			
			// throw event
			event = document.createEvent("Event");
			event.initEvent("AccessStoreEvent", true, true);
			document.dispatchEvent(event);
		}
	} else {
		console.log("[HAWK auto-update] no update available.");
		
		// throw event
		event = document.createEvent("Event");
		event.initEvent("NoUpdateEvent", true, true);
		document.dispatchEvent(event);
	}
}

function _notifyDownloadUpdateFailure()
{
	console.log("[HAWK auto-update] update download failed");
	
	// throw event
	var event = document.createEvent("Event");
	event.initEvent("DownloadUpdateErrorEvent", true, true);
	document.dispatchEvent(event);
}

function _notifyAccessToSTore()
{
	console.log("[HAWK auto-update] store accessed");
}

// 3. apply update
function _applyUpdate()
{
	console.log("[HAWK auto-update] update downloaded...");
	
	// applying update
	console.log("[HAWK auto-update] applying update...");
	deviceapis.application.update.apply(_notifyUpdate, _notifyUpdateFailure);
	
	// throw event
	var event = document.createEvent("Event");
	event.initEvent("ApplyUpdateEvent", true, true);
	document.dispatchEvent(event);
}

function _notifyUpdate()
{
	console.log("[HAWK auto-update] update applied");
	
	// throw event
	var event = document.createEvent("Event");
	event.initEvent("UpdateDoneEvent", true, true);
	document.dispatchEvent(event);
}

function _notifyUpdateFailure()
{
	console.log("[HAWK auto-update] update application failed");
	
	// throw event
	var event = document.createEvent("Event");
	event.initEvent("ApplyUpdateErrorEvent", true, true);
	document.dispatchEvent(event);
}