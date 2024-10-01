// Initialize the map
var map = L.map('map').setView([17.385044, 78.486671], 13);

// Set OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Variables to store the selected start and end points
var startPoint = null;
var endPoint = null;
var control = null;
var routeLine = null;
var vehicleMarker = null;

// Custom car icon
var carIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/743/743928.png', // Replace with your car icon URL
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Add event listener for map clicks
map.on('click', function(e) {
  if (!startPoint) {
    startPoint = e.latlng;
    L.marker(startPoint).addTo(map).bindPopup('Starting Point').openPopup();
    document.getElementById('status').innerText = 'Now select an ending point.';
  } else if (!endPoint) {
    endPoint = e.latlng;
    L.marker(endPoint).addTo(map).bindPopup('Ending Point').openPopup();
    document.getElementById('status').innerText = 'Calculating route...';

    // Calculate route using Leaflet Routing Machine
    control = L.Routing.control({
      waypoints: [
        L.latLng(startPoint.lat, startPoint.lng),
        L.latLng(endPoint.lat, endPoint.lng)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
      createMarker: function() { return null; }, // Prevent default markers
    }).addTo(map);

    control.on('routesfound', function(e) {
      var routes = e.routes;
      var summary = routes[0].summary;

      // Draw the route on the map
      routeLine = L.polyline(routes[0].coordinates, { color: 'blue' }).addTo(map);

      document.getElementById('status').innerText = 'Click "Start" to begin vehicle movement.';
      document.getElementById('start-button').disabled = false;
    });

    control.on('routingerror', function(e) {
      console.error(e);
      document.getElementById('status').innerText = 'Routing error. Please try again.';
    });
  }
});

// Start vehicle movement when the button is clicked
document.getElementById('start-button').addEventListener('click', function() {
  if (startPoint && endPoint && routeLine) {
    document.getElementById('status').innerText = 'Vehicle is moving...';
    moveVehicleAlongRoute(routeLine.getLatLngs());
  }
});

// Function to move the vehicle along the route
function moveVehicleAlongRoute(latlngs) {
  if (vehicleMarker) {
    map.removeLayer(vehicleMarker);
  }

  var index = 0;
  vehicleMarker = L.marker(latlngs[index], { icon: carIcon }).addTo(map);

  var interval = setInterval(function() {
    index++;
    if (index < latlngs.length) {
      vehicleMarker.setLatLng(latlngs[index]);
    } else {
      clearInterval(interval);
      document.getElementById('status').innerText = 'Vehicle has reached the destination.';
    }
  }, 100); // Adjust the interval for speed
}
