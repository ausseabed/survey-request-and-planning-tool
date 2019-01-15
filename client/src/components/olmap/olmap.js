const ol = require('openlayers');
require('openlayers/dist/ol.css');
import Vue from 'vue'

var shp = require('shpjs');
var OlMap = function (target, options) {
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
      var selectInteraction = new ol.interaction.Select({
        condition:ol.events.condition.never,
        style: function(feature, resolution) {
          return new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(0, 0, 0, 0.2)'
            }),
            stroke: new ol.style.Stroke({
              color: 'rgba(0, 0, 0, 0.4)',
              width: 3
            }),
            image: new ol.style.Circle({
              radius: 7,
              fill: new ol.style.Fill({
                color: '#ffcc33'
              })
            })
          })
        }
      });
      var drawInteraction = new ol.interaction.Draw({
        source: source,
        type: 'Polygon'
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
            startDrawInteraction();
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
        interactions: ol.interaction.defaults().extend(
          [dragAndDropInteraction, selectInteraction]),
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
                color: 'rgba(0, 0, 0, 0.1)'
              }),
              stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.3)',
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
      this.map.getView().on('propertychange', (event) => {
        let extents = undefined;
        switch (event.key) {
          case 'resolution':
            extents = this.getExtents();
            break;
          case 'center':
            extents = this.getExtents();
            break;
        }
        if (typeof this.onExtentsChange === 'function' && extents) {
          this.onExtentsChange(extents);
        }
      });
      this.source = source;
      this.sourceIntersecting = sourceIntersecting;
      this.selectInteraction = selectInteraction;
    },
    getExtents: function() {
      return this.map.getView().calculateExtent();
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
    setGeojsonFeatureIntersecting: function (geojsons) {
      this.sourceIntersecting.clear();
      geojsons.forEach(geojson => {
        const olf = (new ol.format.GeoJSON()).readFeatures(geojson);
        olf[0].set('id',geojson.id);
        this.sourceIntersecting.addFeatures(olf);
      });
    },
    addFeatures: function (source, features) {
      if (features && features.length > 0) {
        source.clear();
        source.addFeatures(features);
        this.map.getView().fit(source.getExtent());
      }
    },
    highlightFeatureId: function (id){
      this.selectInteraction.getFeatures().clear();
      if (!id) {
        return;
      }
      const feat = this.sourceIntersecting.getFeatures().find((f) => {
        return f.get('id') == id;
      });
      this.selectInteraction.getFeatures().push(feat);
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
      if (this.sourceIntersecting) {
        this.sourceIntersecting.clear();
      }
    },
    destroy: function () {
      this.map.setTarget(null);
      this.map = null;
    }
  }
};

export default OlMap;
