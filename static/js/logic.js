
var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 13
  });
  
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


function circleSize(magnitude) {
    return magnitude * 50000;
}

function colors(magnitude) {
    var color = "";
    if (magnitude <= 1) {
      return color = "#83FF00";
    }
    else if (magnitude <= 2) {
      return color = "#FFEC00";
    }
    else if (magnitude <= 3) {
      return color = "#ffbf00";
    }
    else if (magnitude <= 4) {
      return color = "#ff8000";
    }
    else if (magnitude <= 5) {
      return color = "#FF4600";
    }
    else if (magnitude > 5) {
      return color = "#FF0000";
    }
    else {
      return color = "#ff00bf";
    }
  }

d3.json(queryUrl).then(function(data) {

    console.log(data.features);

    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  
  });

  d3.json(queryUrl).then(function(response) {

    response.features.forEach(
        function(earthquake) {
            var lat = earthquake.geometry.coordinates[1];
            var lon = earthquake.geometry.coordinates[0];
            var location = [lat,lon];
            var depth = earthquake.geometry.coordinates[2];
            var magnitude = earthquake.properties.mag;
  
            L.circle(location, {
              fillOpacity: 0.75,
              weight: 0.75,
              color: "black",
              fillColor: depthColor(depth),
              radius: circleSize(magnitude)
            })
            .bindPopup("<h3>"+earthquake.properties.place+
                      "<hr>Magnitude: "+earthquake.properties.mag+
                      "<br>Depth: "+depth)
            .addTo(myMap);
            
        }
    );
    });
    var legend = L.control({position: 'bottomright'});


    legend.onAdd = function (){
        var div = L.DomUtil.create('div', 'info legend');
        var grades = ['-10-10', '10-20', '20-30', '30-40', '40-50', '50+'];
        var colors = [
            'rgb(19, 235, 45)',
            'rgb(138, 206, 0)',
            'rgb(186, 174, 0)',
            'rgb(218, 136, 0)',
            'rgb(237, 91, 0)',
            'rgb(242, 24, 31)'
            ];
        var labels = [];
        // loop through our density intervals and generate a label with a colored square for each interval
        grades.forEach(function(grade, index){
            labels.push("<div class = 'row'><li style=\"background-color: " + colors[index] +  "; width: 20px"+ "; height: 15px" + "\"></li>" + "<li>" + grade + "</li></div>");
        })
      
        div.innerHTML += "<ul>" + labels.join("") +"</ul>";
        return div;
    
    };
    
    legend.addTo(myMap);