const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const data = require('./data.json');

app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));// Serve frontend files

// API endpoint to get vehicle location and route data
app.get('/api/vehicle-location', (req, res) => // Serve the next location from dummy data
  {
  const index = Math.floor(Math.random() * data.length);  // Simulating real-time updates by random location
  res.json({
    currentLocation: data[index],
    route: data.slice(0, index + 1),
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
