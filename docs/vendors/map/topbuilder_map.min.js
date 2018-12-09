//map
function initialize() {
	var mapCanvas = document.getElementById('map');
	var mapOptions = {
		center: new google.maps.LatLng(23.8813551, 90.388463),
		zoom: 13,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel:false,
	}
	var map = new google.maps.Map(mapCanvas, mapOptions)
}
google.maps.event.addDomListener(window, 'load', initialize);