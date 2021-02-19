let map, infoWindow, marker;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 6
  });
  marker = new google.maps.Marker({
    position : null,
    map : map,
    icon : './static/img/icon_resize.png'
  });
  getLocation();
}

function getLocation(){
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      position => {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        $.get('https://roads.googleapis.com/v1/nearestRoads', {
          key: 'AIzaSyAsviPjZmttywhWoL1ybbl_q3dyav2M5CU',
          points: pos.lat.toString() + ',' + pos.lng.toString()
        }, function(data){
          console.log(data);
        }
        );
        console.log(pos);
        marker.setPosition(pos);
        map.setCenter(pos);
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
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}