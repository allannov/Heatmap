// Replace with your API key
const apiKey = 'your_google_maps_api_key';

// Initialize the Google Maps client
const client = new google.maps.Client({ key: apiKey });

// Function to create a heatmap layer with customizable parameters
async function createHeatmapLayer(data, gradient, radius, opacity) {
  // Clear the map to remove any previous heatmaps
  map.layers.clear();

  // Initialize the heatmap data
  const heatmapData = [];

  // Process the received data
  for (const row of data) {
    const latitude = row['latitude'];
    const longitude = row['longitude'];
    const signalStrength = row['signal_strength'];

    // Add the data to the heatmap
    heatmapData.push({ location: new google.maps.LatLng(latitude, longitude), weight: signalStrength });
  }

  // Create the heatmap layer with customizable parameters
  const heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    map: map,
    gradient: gradient, // Set the color gradient
    radius: radius, // Set the radius of the data point
    opacity: opacity // Set the opacity of the data points
  });

  // Add the heatmap layer to the map
  heatmap.setMap(map);
}

// Initialize the map
const map = new google.maps.Map(document.getElementById('map'), {
  zoom: 12,
  center: { lat: 40.7128, lng: -74.0060 }
});

// Call the function to create the heatmap layer with custom parameters
createHeatmapLayer(received_data, ['rgba(0, 255, 255, 0)', 'rgba(0, 255, 255, 1)', 'rgba(0, 191, 255, 1)', 'rgba(0, 127, 255, 1)', 'rgba(0, 63, 255, 1)', 'rgba(0, 0, 255, 1)', 'rgba(0, 0, 223, 1)', 'rgba(0, 0, 191, 1)', 'rgba(0, 0, 159, 1)', 'rgba(0, 0, 127, 1)', 'rgba(63, 0, 91, 1)', 'rgba(127, 0, 63, 1)', 'rgba(191, 0, 31, 1)', 'rgba(255, 0, 0, 1)'], 10, 0.7);

// Function to download the CSV file
async function downloadCSV() {
  const link = document.createElement('a');
  link.href = 'received_data.csv';
  link.download = 'received_data.csv';
  link.style.display = 'none';
  link.click();
}

// Initialize the map and create the heatmap layer
window.onload = async () => {
  try {
    const result = await client.geocode({ 'latitude': 40.7128, 'longitude': -74.0060 });
    const location = result.results[0].geometry.location;
    map.setCenter(location);
    map.setZoom(12);
  } catch (error) {
    console.error('Error initializing map:', error);
  }

  createHeatmapLayer(received_data);
};

// Button to trigger the download of the CSV file
const downloadButton = document.createElement('button');
downloadButton.textContent = 'Download CSV';
downloadButton.addEventListener('click', downloadCSV);
document.body.appendChild(downloadButton);
