$(document).foundation();

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