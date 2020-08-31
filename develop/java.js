$(document).foundation();
$(document).ready(function() {
    // Note: This example requires that you consent to location sharing when
    // prompted by your browser. If you see the error "The Geolocation service
    // failed.", it means you probably did not give permission for the browser to
    // locate you.
        let map, infoWindow;

        var userLocation = [
            {lat : 0},
            {long : 0},
        ];
      

        initMap();

        function initMap() {
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
            const control = document.getElementById("floating-panel");
            control.style.display = "block";
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
    
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
            const end = "Austin,tx";
            // alert(document.getElementById("end").value);
           
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

})