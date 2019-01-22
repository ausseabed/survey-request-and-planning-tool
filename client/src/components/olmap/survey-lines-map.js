const ol = require('openlayers');
require('openlayers/dist/ol.css');
import Vue from 'vue'

var shp = require('shpjs');
var surveyLinesMap = function (target, options) {
  return {
    initMap: function () {
      var source = new ol.source.Vector();
      var sourceIntersecting = new ol.source.Vector();
      var dragAndDropInteraction = new ol.interaction.DragAndDrop({
        formatConstructors: [
          ol.format.GPX,
          ol.format.GeoJSON,
          ol.format.IGC,
          ol.format.KML,
          ol.format.TopoJSON
        ]
      });
      var drawInteraction = new ol.interaction.Draw({
        source: source,
        type: 'LineString'
      });

      /**
       * @constructor
       * @extends {module:ol/control/Control~Control}
       * @param {Object=} opt_options Control options.
       */
      var DrawLineControl = (function (Control) {
        function DrawLineControl(opt_options) {
          var options = opt_options || {};

          var button = document.createElement('button');
          button.innerHTML = '<i class="material-icons">timeline</i>';

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

        if ( Control ) DrawLineControl.__proto__ = Control;
        DrawLineControl.prototype =
          Object.create( Control && Control.prototype );
        DrawLineControl.prototype.constructor = DrawLineControl;

        DrawLineControl.prototype.handleDrawPolygon =
          function handleDrawPolygon () {
            startDrawInteraction();
          };

        return DrawLineControl;
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
        interactions: ol.interaction.defaults().extend(
          [dragAndDropInteraction]),
        controls: ol.control.defaults().extend([
          new DrawLineControl(),
        ]),
        layers: [
          new ol.layer.Tile({
            source: baseMap
          }),
          new ol.layer.Vector({
            source: source,
            style: new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'rgba(255, 0, 0, 0.1)'
              }),
              stroke: new ol.style.Stroke({
                color: 'rgba(255, 0, 0, 0.6)',
                width: 2
              }),
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                  color: '#ffcc33'
                })
              })
            })
          }),
          new ol.layer.Vector({
            source: sourceIntersecting,
            style: new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'rgba(0, 0, 0, 0.07)'
              }),
              stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.15)',
                width: 2
              }),
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                  color: '#ffcc33'
                })
              })
            })
          })
        ],
        target: target,      // Get the dom element
        view: new ol.View({
          projection: 'EPSG:4326',
          center: [134.354806, -26.374398],
          zoom: 3
        })
      });

      function startDrawInteraction() {
        map.addInteraction(drawInteraction);
      }

      drawInteraction.on('drawend', (event) => {
        map.removeInteraction(drawInteraction);
        if (typeof this.onAdd === 'function') {
          // refer https://gis.stackexchange.com/questions/268811/get-feature-from-ol-interaction-draw-on-drawend
          var feature = event.feature;
          var features = this.source.getFeatures();
          features = features.concat(feature);
          var writer = new ol.format.GeoJSON();
          var geojsonStr = writer.writeFeatures(features);

          this.onAdd(JSON.parse(geojsonStr));
        }
      }, source);

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
                this.onAdd(JSON.parse(geojsonStr));
              }

            }.bind(this));
          }).bind(this);
          reader.readAsArrayBuffer(event.file);
        }
        else {
          features = event.features;
          this.addFeatures(source, features);

          if (typeof this.onAdd === 'function') {
            var writer = new ol.format.GeoJSON();
            var geojsonStr = writer.writeFeatures(features);
            this.onAdd(JSON.parse(geojsonStr));
          }
        }
      }, source);

      this.map = map;
      this.map.once('postrender', function (event) {
        if (options && options.initialized) {
          options.initialized(event);
        }
      });
      this.source = source;
      this.sourceIntersecting = sourceIntersecting;
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
    addGeojsonFeature: function (geojson) {
      var olf = (new ol.format.GeoJSON()).readFeatures(geojson);

      this.source.addFeatures(olf);
      this.map.getView().fit(this.source.getExtent());
    },
    fit: function() {
      // fits view to area of interest geom if available, then survey lines
      // theory being survey lines will always be within area of interest.
      if (this.sourceIntersecting.getFeatures().length != 0) {
        this.map.getView().fit(this.sourceIntersecting.getExtent());
      } else if (this.sourceIntersecting.getFeatures().length != 0) {
        this.map.getView().fit(this.source.getExtent());
      }
    },
    setGeojsonFeatureIntersecting: function (geojson) {
      this.sourceIntersecting.clear();
      if (geojson) {
        const olf = (new ol.format.GeoJSON()).readFeatures(geojson);
        this.sourceIntersecting.addFeatures(olf);
      }
    },
    addFeatures: function (source, features) {
      if (features && features.length > 0) {
        source.clear();
        source.addFeatures(features);
        this.map.getView().fit(source.getExtent());
      }
    },
    onAdd: null,
    onExtentsChange: null,
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

export default surveyLinesMap;
