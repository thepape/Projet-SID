var geocoder;
var map;
var infoWindow;
var bounds;

function initMap() {
    bounds = new google.maps.LatLngBounds();
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 6
    });
    infoWindow = new google.maps.InfoWindow();
    google.maps.event.addListener(map, 'click', function() {
        infoWindow.close();
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function geocodeAddress() {
    var lis=document.getElementById('legende').getElementsByTagName("li");
    for(var i=0; i<lis.length; i++)
    {

        var addresse = lis[i].innerHTML.slice(6, lis[i].length) + " "+ document.getElementById('input_ville').value + " FRANCE";
        (function(address) {

            var colors = lis[i].style.color;
            var color = rgb2hex(colors);
            var circle = {
                //path: 'M -1,0 A 1,1 0 0 0 1,0 1,1 0 0 0 -1,0 z',
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: color,
                fillOpacity: 1,
                scale: 13,
                strokeColor: "#888888",
                strokeWeight: 3
            };
            geocoder.geocode({
                'address': addresse
            }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location,
                        title: addresse,
                        icon: circle
                    });

                    infoWindow(marker, map, address);
                    bounds.extend(marker.getPosition());
                    map.fitBounds(bounds);
                }
                else{
                    console.log("ca marche po");
                }
            });
        })(addresse);


    }
    function infoWindow(marker, map, address) {
        google.maps.event.addListener(marker, 'click', function () {
            var html = "<div><h3>" + address + "</h3></div>";
            iw = new google.maps.InfoWindow({content: html, maxWidth: 350});
            iw.open(map, marker);
        });
    }
    $.ajaxSetup({async: true});

}

function rgb2hex(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

