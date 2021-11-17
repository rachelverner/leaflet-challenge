// create the URL for the geoJason
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"


// Creating map object
var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 8
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

  d3.json(quakes, function(data) {
    createFeatures(data.features);
    console.log(data.features)
  });

  function createFeatures(quakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
      }

      function radiusSize(magnitude) {
        return magnitude * 5000;
      }

      function circleColor(magnitude) {
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

      var earthquakes = L.geoJSON(quakeData, {
        pointToLayer: function(quakeData, latlng) {
          return L.circle(latlng, {
            radius: radiusSize(quakeData.properties.mag),
            color: circleColor(quakeData.properties.mag),
            fillOpacity: 0.5
          });
        },
        onEachFeature: onEachFeature
      });

      createMap(earthquakes);
    }
    
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
