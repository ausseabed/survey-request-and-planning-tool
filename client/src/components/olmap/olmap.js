const ol = require('openlayers');
require('openlayers/dist/ol.css');
import Vue from 'vue'

var shp = require('shpjs');
var OlMap = function (target, options) {
  return {
    initMap: function () {
      var source = new ol.source.Vector();
      var dragAndDropInteraction = new ol.interaction.DragAndDrop({
        formatConstructors: [
          ol.format.GPX,
          ol.format.GeoJSON,
          ol.format.IGC,
          ol.format.KML,
          ol.format.TopoJSON
        ]
      });

      /**
       * @constructor
       * @extends {module:ol/control/Control~Control}
       * @param {Object=} opt_options Control options.
       */
      var DrawPolygonControl = (function (Control) {
        function DrawPolygonControl(opt_options) {
          var options = opt_options || {};

          var button = document.createElement('button');
          button.innerHTML = '<i class="fas fa-draw-polygon"></i>';

          var element = document.createElement('div');
          element.className = 'draw-polygon ol-unselectable ol-control';
          element.appendChild(button);

          Control.call(this, {
            element: element,
            target: options.target
          });

          button.addEventListener(
            'click', this.handleDrawPolygon.bind(this), false);
        }

        if ( Control ) DrawPolygonControl.__proto__ = Control;
        DrawPolygonControl.prototype =
          Object.create( Control && Control.prototype );
        DrawPolygonControl.prototype.constructor = DrawPolygonControl;

        DrawPolygonControl.prototype.handleDrawPolygon =
          function handleDrawPolygon () {
            toggleDrawInteraction();
          };

        return DrawPolygonControl;
      }(ol.control.Control));

      var baseMap = null;
      if (options && options.basemap) {
        switch (options.basemap) {
          case "osm":
            baseMap = new ol.source.OSM();
            break;

          default:
            baseMap = new ol.source.OSM();
            break;
        }
      }

      if (!baseMap) {
        baseMap = new ol.source.OSM();
      }

      var map = new ol.Map({
        interactions: ol.interaction.defaults().extend([dragAndDropInteraction]),
        controls: ol.control.defaults().extend([
          new ol.control.FullScreen(),
          new DrawPolygonControl(),
        ]),
        layers: [
          new ol.layer.Tile({
            source: baseMap
          }),
          new ol.layer.Vector({
            source: source,
            style: new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
              }),
              stroke: new ol.style.Stroke({
                color: '#rgba(255, 0, 0, 0.2)',
                width: 2
              }),
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                  color: '#ffcc33'
                })
              })
            })
          })],
        target: target,      // Get the dom element
        view: new ol.View({
          projection: 'EPSG:4326',
          center: [134.354806, -26.374398],
          zoom: 3
        })
      });

      var draw = undefined; // global so we can remove it later
      function toggleDrawInteraction() {
        if (draw) {
          map.removeInteraction(draw);
          draw = undefined;
        } else {
          draw = new ol.interaction.Draw({
            source: source,
            type: 'Polygon'
          });
          map.addInteraction(draw);
        }
      }

      dragAndDropInteraction.on('addfeatures', (event) => {
        var ext = event.file.name.split('.').pop();
        var features = null;
        if (ext == 'zip') {
          var reader = new FileReader();
          reader.onload = (function (e) {
            shp(e.target.result).then(function (geojson) {
              features = (new ol.format.GeoJSON()).readFeatures(geojson);
              this.addFeatures(source, features);

              if (typeof this.onAdd === 'function') {
                var writer = new ol.format.GeoJSON();
                var geojsonStr = writer.writeFeatures(features);
                this.onAdd(geojsonStr);
              }

            }.bind(this));
          }).bind(this);
          reader.readAsArrayBuffer(event.file);
        }
        else {
          features = event.features;
          this.addFeatures(source, features);
        }
      }, source);

      this.map = map;
      this.map.once('postrender', function (event) {
        if (options && options.initialized) {
          options.initialized(event);
        }
      });
      this.source = source;
    },
    addGeojsonUrl: function (url) {
      // Add geojson from url
      //this.addFeatures(this.source, (new ol.format.GeoJSON()).readFeatures(url));
      Vue.axios.get(url, {
        transformRequest: [
          (data, headers) => {
            delete headers.Authorization
            return data
          }]
      })
        .then((geojson) => {
          var features = (new ol.format.GeoJSON()).readFeatures(geojson.data);
          this.addFeatures(this.source, features);
        });
    },
    addFeatures: function (source, features) {
      if (features && features.length > 0) {
        source.clear();
        source.addFeatures(features);
        this.map.getView().fit(source.getExtent());
      }
    },
    onAdd: null,
    set: function (value) {
      if (value) {
        this.addFeatures(this.source, (new ol.format.GeoJSON()).readFeatures(JSON.parse(value)));
        this.map.getView().fit(this.source.getExtent(), this.map.getSize());
      }
    },
    get: function () {
      var features = this.source.getFeatures();
      if (features.length > 0) {
        var writer = new ol.format.GeoJSON();
        return writer.writeFeatures(features);
      }
      else {
        return null;
      }
    },
    clear: function () {
      if (this.source) {
        this.source.clear();
      }
    },
    destroy: function () {
      this.map.setTarget(null);
      this.map = null;
    }
  }
};

export default OlMap;
