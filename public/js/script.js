const socket = io();

console.log('Socket connected:', socket.connected);

// watch position
if (navigator.geolocation) {
  navigator.geolocation.watchPosition((position) => {
    console.log('Geolocation update:', position.coords);
    const { latitude, longitude } = position.coords;
    socket.emit("send-location", { latitude, longitude });
  }, 
  (error) => {
    console.error('Geolocation error:', error);
  },
  {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0, 
  }
  );
} else {
  console.log('Geolocation not supported');
}

const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Street101"
}).addTo(map);

console.log('Map initialized:', map);

let markers = {};

socket.on("receive-location", (data) => {
  console.log('Received location:', data);
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude], 16);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (data) => {
  console.log('User disconnected:', data);
  const { id } = data;
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});