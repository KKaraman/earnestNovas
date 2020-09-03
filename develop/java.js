
$(document).foundation();

console.log("running");
let map, infoWindow;

var userLocation = [
    {lat : 0},
    {long : 0},
];

var endLocation = [
    {lat: 0},
    {long: 0},
]; 

//initMap();

function initMap() {
  
console.log("running init");
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    map = new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: 0,
            lng: 0
        },
        zoom: 7
    });
    infoWindow = new google.maps.InfoWindow(); // Try HTML5 geolocation.
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("right-panel"));
    // const control = document.getElementById("floating-panel");
    // control.style.display = "block";
    // map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

    const onChangeHandler = function() {
      calculateAndDisplayRoute(directionsService, directionsRenderer);
    };

    // document
    // //   .getElementById("start")
    //   .addEventListener("click", onChangeHandler);
    // document
    // //   .getElementById("end")
    //   .addEventListener("change", onChangeHandler);

    $(document).on("click", "#choiceButton", function(event) {
        event.preventDefault();
        console.log("Choice button clicked");
        // calculateAndDisplayRoute(directionsService, directionsRenderer);
        onChangeHandler();
    })

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                infoWindow.setPosition(pos);
                userLocation.lat = pos.lat;
                // alert(userLocation.lat);
                userLocation.long = pos.lng;
                // alert(userLocation.long);

                infoWindow.setContent("You are here");
                infoWindow.open(map);
                map.setCenter(pos);
                
                //insert directions

            },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}



function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation ?
        "Error: The Geolocation service failed." :
        "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    // const start = document.getElementById("start").value;
    const start = userLocation.lat+","+userLocation.long;
    
    
   
    // const end = document.getElementById("end").value;
    var end = endLocation.lat+","+ endLocation.long;
    // alert(document.getElementById("end").value);
    
console.log("running CAD");
   
    directionsService.route(
      {
        // origin: start,
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }

$(document).ready(function() {

    var yelpToken = `9Ne2ihRPJ8cQ2d861NnTtiS8Zi6HfYG8OWhoJJVU5FjHVlcmLqcWu15TtVz3Cr2uZYI0VeSH6KOkr_6IkvOMC8kqwB8O3sKn4v3Ph9nG-iM6BrNaIXOoGUmYcbBFX3Yx`;
    var corsProxy = 'https://cors-anywhere.herokuapp.com/';
    var yelpCategory = '';
    var yelpLocation = 'houston';
    var startingLong = -95.3698;
    var startingLat = 29.7604;
    var yelpURL = "";
    var yelpLimit = 5;
    var geoResultsLimit = 10;
    var geoMinPopulation = 50000;
    var geoRadiusMiles;


    // event listener for the submit button
    $('#submit-btn').on('click', function() {
        yelpCategory = $('#activity').val();
        geoRadiusMiles = $('#distance').val();

        //  check if either of the boxes are un selected. 
        if (yelpCategory === "Default" || geoRadiusMiles === "Default") {

            console.log("SELECT SOMETHING");
        } else { getGeoData(yelpCategory, geoRadiusMiles); }
    });


    // function to get cities / areas within a radius
    function getGeoData(yelpCategory, geoRadiusMiles) {
        $.ajax({
            url: `https://wft-geo-db.p.rapidapi.com/v1/geo/locations/${startingLat}${startingLong}/nearbyCities?limit=${geoResultsLimit}&minPopulation=${geoMinPopulation}&radius=${geoRadiusMiles}`,
            method: "GET",
            "headers": {
                "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
                "x-rapidapi-key": "b03379d354msh5b83b89eb078c59p12584ajsn5b67c822900b"
            }
        }).then(function(obj) {
            var len = obj.data.length - 1;
            var randmonIndex = Math.floor(Math.random() * (len - 1) + 1);

            // var locName = obj.data[randmonIndex].name;
            // var locDistance = `DIST: ${obj.data[randmonIndex].distance}`;
            var locLat = obj.data[randmonIndex].latitude;
            var locLong = obj.data[randmonIndex].longitude;


            // call the yelp API's
            yelpURL = `${corsProxy}https://api.yelp.com/v3/businesses/search?term=${yelpCategory}&latitude=${locLat}&longitude=${locLong}&limit=${yelpLimit}`;
            $.ajax({
                url: yelpURL,
                method: "GET",
                headers: { "Authorization": 'Bearer ' + yelpToken }
            }).then(function(yelpObj) {
                console.log("<----------Yelp--------->");
                console.log(yelpObj);
                var busArray = yelpObj.businesses;
                displayYelpData(busArray);
                
                
            });


        });

    }





    // get the array returned from the yelp api passed to this fuction, then loops through it
    function displayYelpData(array) {
        $('#results-container').html("");
        array.forEach(function(item) {
            // console.log(item);
            var busName = item.name;
            var busImageURL = item.image_url;
            var lat = item.coordinates.latitude;
            var long = item.coordinates.longitude;
            var busPhone = item.display_phone;
            var displayAddress = formatAddress(item.location.display_address);
            console.log(long)
            console.log(lat)

            var clodeBlock = `
        <div class="card" style="width: 80%;" >
            <div class="card-section">
        <div class="card-divider"><h3>${busName}</h3></div>
        <h6>${displayAddress}</h6>
        <h6>${busPhone}</h6>
        <div class="card-image">
        <img src="${busImageURL}">
        </div>
        </div>
        </div>`;

            $('#results-container').append(clodeBlock);

        });

    }


    // format the address for display 
    function formatAddress(addressArray) {
        console.log(addressArray);
        var address = "";
        addressArray.forEach(function(item) {
            address = address + " " + item;

        });
        return address;
        console.log(address);
    }


});
