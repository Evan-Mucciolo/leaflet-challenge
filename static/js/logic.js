// get data - significant earthquakes in the past 30 days
// add a .then(functionName) eventually to run code
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson').then(createMarkers);

// Need to plot all earthquakes based on their latitude and longitude
// size of the map markers should reflect earthquake magnitude
// color(opascity) of the map markers should reflect earthquake depth

// build a function that creates the map
function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
        "Street Map": streetmap
    };

    // Create an overlayMaps object to hold the eqrthquakes layer.
    let overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Create the map object with options.
    let map = L.map("map", {
        center: [40.73, -74.0059],
        zoom: 2,
        layers: [streetmap, earthquakes]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    
    // Add legend
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend');
        let depths = [0, 10, 30, 50, 70, 90];
        let labels = [];

        div.innerHTML += 'Earthquake Depth in Meters'

        // loop through our depth intervals and generate a label with a colored square for each interval
        for (let i = 0; i < depths.length; i++) {
            let pigment = depths[i] + 1
            div.innerHTML +=
                '<li style="background:' + circleColors(pigment) + '"> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br></li>' : '+');
                
        }
        

        return div;
    };

    legend.addTo(map);

}

// Build a function that creates markers
function createMarkers(response) {

    // pull the features section from the data that contains the earthquake data
    let quakeData = response.features;

    // initialize the array to hold the earthquake markers
    let quakeMarkers = [];

    // loop through the earthquake data
    for (let i = 0; i < quakeData.length; i++){

        // Create a holdover array to store data
        let tempQuakeArray = quakeData[i]
        // Gather desired data
        let lon = tempQuakeArray.geometry.coordinates[0]
        let lat = tempQuakeArray.geometry.coordinates[1]
        let depth = tempQuakeArray.geometry.coordinates[2]
        let magnitude = tempQuakeArray.properties.mag
        let place = tempQuakeArray.properties.place
           
        // grab color
        let circleColor = circleColors(depth)
        
        // Create Markers
        let quakeMarker = L.circle([lat,lon], {
            radius: (magnitude * 10000),
            color: circleColor,
            fillColor: circleColor,
            opacity: 1
            
        }).bindPopup(
            "<h3>Quake Info</h3> <b>Earthquake Location:</b> " + place + "<br>" + "<b>Magnitude: </b>" + magnitude + "<br><b>Depth: </b>" + depth +" Meters"
        )
        
        // Push Markers to Markers array
        quakeMarkers.push(quakeMarker)
    };

    createMap(L.layerGroup(quakeMarkers))

}

function circleColors(depth){
    if (depth > 90){
        return '#FF5F65';
    } else if (depth > 70) {
        return '#FCA35D';
    } else if (depth > 50) {
        return '#FDB72A'
    } else if (depth > 30) {
        return '#F7DB11'
    } else if (depth > 10) {
        return '#DCF400'
    } else if (depth <= 10) {
        return '#A3F600'
    }

}