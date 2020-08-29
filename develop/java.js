{ /* <script> $(document).foundation(); < /script> */ }

$(document).ready(function() {


    var yelpToken = `9Ne2ihRPJ8cQ2d861NnTtiS8Zi6HfYG8OWhoJJVU5FjHVlcmLqcWu15TtVz3Cr2uZYI0VeSH6KOkr_6IkvOMC8kqwB8O3sKn4v3Ph9nG-iM6BrNaIXOoGUmYcbBFX3Yx`;
    var corsProxy = 'https://cors-anywhere.herokuapp.com/';
    var yelpCategory = '';
    var yelpLocation = 'houston';
    var yelpURL = "";
    var yelpLimit = 5;


    // event listener for the submit button
    $('#submit-btn').on('click', function() {
        yelpCategory = $('#activity').val();
        yelpURL = `${corsProxy}https://api.yelp.com/v3/businesses/search?term=${yelpCategory}&location=${yelpLocation}&limit=${yelpLimit}`;

        getYelpData(yelpURL, yelpToken);

    });

    // all the yelp api and get the results 
    function getYelpData(yelpURL, yelpToken) {
        $.ajax({
            url: yelpURL,
            method: "GET",
            headers: { "Authorization": 'Bearer ' + yelpToken }
        }).then(function(yelpObj) {
            console.log("<----------Yelp--------->");
            // console.log(yelpObj);
            var busArray = yelpObj.businesses;

            displayYelpData(busArray);
        });

    }

    // get the array returned from the yelp api passed to this fuction, then loops through it
    function displayYelpData(array) {
        $('#results-container').html("");
        array.forEach(function(item) {
            console.log(item);
            var busName = item.name;
            var busImageURL = item.image_url;
            var lat = item.coordinates.latitude;
            var long = item.coordinates.longitude;
            var busPhone = item.display_phone;

            var clodeBlock = `
        <div class="card-section">
        <h2>NAME: ${busName}</h2>
        <li>LAT: ${lat}</li>
        <li>LONG: ${long}</li>
        <li>PHONE: ${busPhone}</li>
        <img src="${busImageURL}">
        </div>`;

            $('#results-container').append(clodeBlock);

        });

    }


});