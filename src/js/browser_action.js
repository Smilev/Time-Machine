var waybackdate, 
	calendar;

function refreshCalendar() {
	var date="";
	if (waybackdate) {
		date= dateTransform(waybackdate);
	} 
	calendar.val(date);
}

function setDate() {
	var timestamp = getTimestamp(calendar.val());

	chrome.extension.sendMessage({
		timestamp : timestamp
	}, function(response) {
		waybackdate = response.waybackdate;
		refreshCalendar();
	});
}

function removeDate() {
	chrome.extension.sendMessage({
		removeDate : true
	}, function(response) {
		waybackdate = response.waybackdate;
		refreshCalendar();
	});
}

function getTimestamp(date){
	return date.split("-").join("");
}

function dateTransform(timestamp) {
    return [timestamp.substr(0,4),timestamp.substr(4,2),timestamp.substr(-2,2)].join('-');
}

$(document).ready(function() {
	
	calendar = $('#datePicker');
	
	chrome.extension.sendMessage({
		getDate : true
	}, function(response) {
		waybackdate = response.waybackdate;
		refreshCalendar();
	});

	$('#setDateButton').click(function() {
		setDate();
	});
	
	$('#removeDateButton').click(function() {
		removeDate();
	});

	calendar.focus();
});