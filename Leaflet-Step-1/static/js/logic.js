console.log("logic.js loaded!"); 

// Create initial map object
var quakeMap = L.map("map", {
    center:[37.0902, -95.7129],
    zoom: 4
}); 

// Add a tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512, 
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
}).addTo(quakeMap);

// Function to determine marker color based on earthquake magnitude
function markerColor(magnitude){
    switch(true){
        case (magnitude <= 1):
            return '#ccff66';
            break;
        case (magnitude <= 2):
            return '#ffff66';
            break;
        case (magnitude <= 3):
            return '#ff9933';
            break;
        case (magnitude <= 4):
            return '#ff5050';
            break;
        case (magnitude <= 5):
            return '#ff0066';
            break;
        case (magnitude > 5):
            return '#990099';
            break;
        default:
            return '#cccccc';
            break;
    }
}

// Function to determine marker radius based on earthquake magnitude
function markerRadius(magnitude){
    switch(true) {
    case (magnitude <= 1):
        return 5;
        break;
    case (magnitude <= 2):
        return 7;
        break;
    case (magnitude <= 3):
        return 9;
        break;
    case (magnitude <= 4):
        return 11;
        break;
    case (magnitude <= 5):
        return 13;
        break;
    case (magnitude > 5):
        return 15;
        break;
    default:
        return 1;
        break;
    }
}

var geoJSON = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(geoJSON).then(function(data){
    L.geoJson(data, {
        pointToLayer: function(feature, latlong) {

            // Create a circle marker
            return L.circleMarker(latlong, {
                radius: markerRadius(feature.properties.mag),
                fillColor: markerColor(feature.properties.mag),
                color: "#0000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><span>Magnitude: ${feature.properties.mag}</span>`)
        }
    }).addTo(quakeMap);

    function getColor(d) {
        return  d > 5 ? '#990099':
                d > 4 ? '#ff0066':
                d > 3 ? '#ff5050':
                d > 2 ? '#ff9933':
                d > 1 ? '#ffff66':
                        '#ccff66';
    }

    var legend = L.control({position: "bottomleft"});
    legend.onAdd = function () {

        var div = L.DomUtil.create("div", "info legend");
            mag = [0, 1, 2, 3, 4, 5],

        div.innerHTML += "<h4>Magnitude Level</h4><hr>"

        for (var i = 0; i < mag.length; i++) {
            div.innerHTML +=
            '<i style="background:' + getColor(mag[i] + 1) + '"></i> ' +
            mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+'); 
        }
        return div;
    };
    legend.addTo(quakeMap);
});