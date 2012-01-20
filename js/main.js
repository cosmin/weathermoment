function displayWeatherIcon(url) {
    $("#weather #icon").html("<img src='" + url + "' />");
}

function displayDegreesC(degrees) {
    $("#weather #temp #degreesC").html(degrees + "<span class='degrees'>&deg;C</span>");
}

function displayDegreesF(degrees) {
    $("#weather #temp #degreesF").html(degrees + "<span class='degrees'>&deg;F</span>");
}

function lookupWeather(lat, lon) {
    var apiKey = "1e04dcb515041519121901";
    var url = "http://free.worldweatheronline.com/feed/weather.ashx?lat=" + lat + "&lon=" + lon + "&format=json&num_of_days=1&key=" + apiKey + "&callback=?";
    $.getJSON(url, function(d) {
        var current_condition = d.data.current_condition[0];
        var iconUrl = current_condition.weatherIconUrl[0].value;
        displayWeatherIcon(iconUrl);

        displayDegreesC(current_condition.temp_C)
        displayDegreesF(current_condition.temp_F);
    });
}

function addAddressToMap(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
            var address = results[0].formatted_address;
            $("#address").html(address);
        }
    } else {
        $("#address").html("Failed to determine address");
    }
}

function displayMap(lat, lon) {
    var mapCenter = new google.maps.LatLng(lat, lon);
    $("#gps").html('GPS: <span id="lat">' + lat.toFixed(4) + 
                   '</span>, <span class="lon">' + lon.toFixed(4) + 
                   '</span>');

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng': mapCenter}, addAddressToMap);
}

function locationError(message) {
    $("#error").html("<h1>Unable to determine your location: " + message + "</h1>");
}

function loadLocation(callback) {
    if (navigator.geolocation) 
    {
        navigator.geolocation.getCurrentPosition( 
            function (position) {  
                callback(position.coords.latitude,position.coords.longitude);
            }, 
            function (error)
            {
                switch(error.code) 
                {
                case error.TIMEOUT:
                    locationError("timeout");
                    break;
                case error.POSITION_UNAVAILABLE:
                    locationError('Position unavailable');
                    break;
                case error.PERMISSION_DENIED:
                    locationError('Permission denied');
                    break;
                case error.UNKNOWN_ERROR:
                    locationError('Unknown error');
                    break;
                }
            }
        );
    } else {
        locationError("Location not supported by browser");
    }
}

function fakeLocation() {
    var imgUrl = "http://www.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png";

    displayWeatherIcon(imgUrl);
    displayDegreesF(64);
    displayDegreesC(18);
}

$(document).ready(function() {
    loadLocation(function(lat, lon) {
        lookupWeather(lat, lon);
        displayMap(lat, lon);
    });
    //fakeLocation();
});
