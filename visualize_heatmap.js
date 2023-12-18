// Replace with your API key
const apiKey = 'your_google_maps_api_key';

// Initialize the Google Maps client
const client = new google.maps.Client({ key: apiKey });

// Function to create a heatmap layer with customizable parameters
async function createHeatmapLayer(data, gradient, radius, opacity) {
  // Clear the map to remove any previous heatmaps
  map.layers.clear();


   try {
    // Fetch the data from the CSV file
    const response = await fetch('received_data.csv');
    if (response.ok) {
       const data = await response.text();
     
      // Initialize the heatmap data
        const heatmapData = [];
        // Process the received data
        for (const row of data) {
          const latitude = row['latitude'];
          const longitude = row['longitude'];
          const signalStrength = row['signal_strength'];
        }
    }
   }

    // Add the data to the heatmap
    heatmapData.push({ location: new google.maps.LatLng(latitude, longitude), weight: signalStrength });
  }

  // Create the heatmap layer with customizable parameters
  const heatmap = new google.maps.visualization.HeatLayer({
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
const map = new google.maps.Map(document.getElementById('map')

// Function to download the CSV file
async function downloadCSV() {
  const link = document.createElement('a');
  link.href = 'received_data.csv';
  link.download = 'received_data.csv';
  link.style.display = 'none';
  link.click();
}

// Button to trigger the download of the CSV file
const downloadButton = document.createElement('button');
downloadButton.textContent = 'Download CSV';
downloadButton.addEventListener('click', downloadCSV);
document.body.appendChild(downloadButton);
