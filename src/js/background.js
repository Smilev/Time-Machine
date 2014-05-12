var 
	waybackdate,
	lastRequestId,
	lastRequestUrl,
	lastTabId,
	wayback_url;

	
if(localStorage['waybackdate']){
	waybackdate = localStorage['waybackdate'];
}
	
chrome.webRequest.onBeforeRequest.addListener(function(data) {
	return redirectToWaybackMachine(data);
}, {
	urls : ["<all_urls>"],
	types : ["main_frame", "sub_frame"]
}, ["blocking"]);


chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if ( typeof request.timestamp !== 'undefined') {
		waybackdate = request.timestamp;
	} else if ( typeof request.removeDate !== 'undefined') {
		waybackdate = null;
		chrome.tabs.update(lastTabId, {url: lastRequestUrl});
	}
	if (waybackdate != localStorage['waybackdate']) {
		updateLocalStorage(waybackdate);
	}
	sendResponse({
		waybackdate : this.waybackdate
	});
}); 

function redirectToWaybackMachine(data) {
	if ( data.requestId !== lastRequestId 
	&& data.url.indexOf("archive.org") == -1
	&& data.url.indexOf("chrome-extension://") == -1		
	&& waybackdate) {
		
		lastRequestId = data.requestId;
		lastRequestUrl = data.url;
		chrome.tabs.getCurrent(function(tab){
			lastTabId = tab.id;
		});
		return{
			redirectUrl : getWaybackURL(data.url)
		};
	}	
}

function getWaybackURL(url) {
	var result = url;
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://archive.org/wayback/available?url=" + url + "&timestamp=" + waybackdate, false);
	xhr.send();
	
	if (xhr.status===200)
	{
		var resp = JSON.parse(xhr.responseText);
		result = resp.archived_snapshots.closest.url;
	} 
	
	return result;
} 

function updateLocalStorage(timestamp){
	localStorage['waybackdate'] = timestamp;
}