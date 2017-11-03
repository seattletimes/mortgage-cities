//load our custom elements
require("component-leaflet-map");
require("component-responsive-frame");

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

// ICH code for popup template if needed----------
var ich = require("icanhaz");
var templateFile = require("./_popup.html");
ich.addTemplate("popup", templateFile);

var onEachFeature = function(feature, layer) {
  layer.bindPopup(ich.popup(feature.properties))
};

var data = require("./mortgage-map.geo.json");
var all = "percent"; 

data.features.forEach(function(f) {
	["percent"].forEach(function(prop) {
		f.properties[prop] = (f.properties[prop]).toFixed(1);
	});
});

var getColor = function(d) {
    var value = d[all];
    // console.log(value)
    if (typeof value != "undefined") {
      // condition ? if-true : if-false;
     return value >= 40 ? '#270011' :
     		value >= 30 ? '#7a044d' :
            value >= 20 ? '#c127a4' :
            value >= 10 ? '#f47dae' :
             '#fcc5c0' ;
    } else {
      return "gray"
    }
  };

  function geojsonMarkerOptions(feature) {

  return {
    radius: 6,
    fillColor: getColor(feature.properties),
    // fillColor: "#fe9929",
    color: "black",
    weight: 1,
    fillOpacity: 0.6,
  }
};

var geojson = L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
    },
    style: geojsonMarkerOptions,
    onEachFeature: onEachFeature
}).addTo(map);


 map.scrollWheelZoom.disable();

 map.fitBounds(geojson.getBounds());