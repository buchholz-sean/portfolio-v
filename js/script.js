window.addEventListener("load", function() {
    console.log("Page loaded");

    var submit = document.getElementById('timesBtn');
    var zipField = document.getElementById('zipField');
    var datePicker = document.getElementById('datePicker');
    var outputHeader = document.getElementById('outputHeader');
    var sunriseOutput = document.getElementById('sunriseOutput');
    var sunsetOutput = document.getElementById('sunsetOutput');

    datePicker.valueAsDate = new Date();

    submit.addEventListener('click', function(e) {
        var queryZip = zipField.value;
        var locApi = `http://maps.googleapis.com/maps/api/geocode/json?address=${queryZip}`;
        getLatLng(locApi);
    })

    function getLatLng(url) {
        var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.onload = function() {
            if (req.status >= 200 && req.status < 400) {
                var data = JSON.parse(req.responseText);
                var lat = data.results[0].geometry.location.lat;
                var lng = data.results[0].geometry.location.lng;
                var city = data.results[0].address_components[1].long_name;
                var state = data.results[0].address_components[2].short_name;
                var query = `lat=${lat}&lng=${lng}`;
                var place = `${city}, ${state}`
                getTimes(query, place);
            } else {
                console.log("Response error: ", req);
            }
        }
        req.onerror = function() {
            console.log("Connection error");
        }
        req.send();
    }

    function getTimes(loc, place) {
        var queryDate = datePicker.value;
        console.log(queryDate);
        var url = `https://api.sunrise-sunset.org/json?${loc}&date=${queryDate}&formatted=0`
        var req = new XMLHttpRequest();
        var dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        var queryAsDate = new Date(queryDate);
        var dateString = queryAsDate.toLocaleDateString("en-US", dateOptions);
        req.open('GET', url, true);
        req.onload = function() {
            if (req.status >= 200 && req.status < 400) {
                var data = JSON.parse(req.responseText);
                var timeOptions = {
                    hour12: 'true',
                    hour: 'numeric',
                    minute: '2-digit'
                }
                var sunrise = new Date(data.results.sunrise).toLocaleTimeString("en-US", timeOptions);
                var sunset = new Date(data.results.sunset).toLocaleTimeString("en-US", timeOptions);
                renderOutput(dateString, place, sunrise, sunset);
            } else {
                console.log("Response error: ", req);
            }
        }
        req.onerror = function() {
            console.log("Connection error");
        }
        req.send();
    }

    function renderOutput(date, loc, sunrise, sunset) {
        var sunriseString = [
            "Get up early to watch the ",
            "Don't miss the ",
            "You can see the "
        ];
        var sunsetString = [
            "Stay up and catch the ",
            "Be sure to take time for the ",
            "You're going to love tonight's "
        ];
        var sunriseIndex = getRandomArbitrary(0, sunriseString.length);
        var sunsetIndex = getRandomArbitrary(0, sunsetString.length);
        var header = `On ${date} in ${loc}:`;
        outputHeader.innerHTML = header;
        sunriseOutput.innerHTML = `<p>${sunriseString[sunriseIndex]}sunrise at ${sunrise}</p>`;
        sunsetOutput.innerHTML = `<p>${sunsetString[sunsetIndex]}sunset at ${sunset}</p>`;
    }

    // Geolocation api
    //
    // checkLoc.addEventListener('click', function(e){
    //     if (!navigator.geolocation) {
    //         output.innerHTML = '<p>No Geolocation available :[</p>';
    //         return;
    //     }
    //     function success(position){
    //         var lat = position.coords.latitude;
    //         var long = position.coords.longitude;
    //         output.innerHTML = '<p>Latitude: ' + lat + '</p><p>Longitude: ' + long + '</p>';
    //     }
    //     function error(err) {
    //         if (err.code == 1) {
    //             output.innerHTML = '<p>User said no!</p>';
    //         } else if (err.code == 2) {
    //             output.innerHTML = '<p>Position unavailable!</p>';
    //         } else {
    //             output.innerHTML = '<p>Timeout</p>';
    //         }
    //     }
    //
    //     output.innerHTML = '<p>Locating...</p>';
    //
    //     navigator.geolocation.getCurrentPosition(success, error);
    // })

    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
})
