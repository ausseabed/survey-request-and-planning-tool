const ol = require('openlayers');
require('openlayers/dist/ol.css');
import Vue from 'vue'
import _ from 'lodash'
import simplify from '@turf/simplify'
const spawn = require('threads').spawn;
import * as MapConstants from './map-constants'

var shp = require('shpjs');
var OlMap = function (target, options) {
  return {
    initMap: async function (includeDrawButton) {
      if (_.isNil(includeDrawButton)) {
        includeDrawButton = true;
      }
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

      //
      // WMTS layer works, but leaves blue lines all over the map. Workaround
      // is to use Esri Tile server.
      //
      // var parser = new ol.format.WMTSCapabilities();
      // var gcResult = await fetch(MapConstants.WMTS_GET_CAPABILITIES_URL)
      // .then(function(response) {
      //   return response.text();
      // }).then(function(text) {
      //   var result = parser.read(text);
      //   return result;
      // });
      // var gcOptions = ol.source.WMTS.optionsFromCapabilities(gcResult, {
      //   layer: 'NationalMap_Colour_Topographic_Base_World_WM',
      //   matrixSet: 'EPSG:4326'
      // });
      // var baseMap = new ol.source.WMTS((gcOptions));

      var baseMap = new ol.source.TileArcGISRest({
        url: MapConstants.WMTS_MAPSERVER_URL,
        attributions: [new ol.Attribution({
          html: MapConstants.MAP_ATTRIBUTION_HTML
        })],
      })

      var center = [
        (MapConstants.WMTS_DEFAULT_EXTENT[0] + MapConstants.WMTS_DEFAULT_EXTENT[2] / 2),
        (MapConstants.WMTS_DEFAULT_EXTENT[1] + MapConstants.WMTS_DEFAULT_EXTENT[3] / 2)
      ];

      let controls = []
      if (includeDrawButton) {
        controls.push(new DrawPolygonControl())
      }

      var map = new ol.Map({
        interactions: ol.interaction.defaults().extend(
          [dragAndDropInteraction, selectInteraction]),
        controls: ol.control.defaults().extend(controls),
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
          center: center,
          zoom: 3
        })
      });

      // fit to the default extents, then zoom in one level
      map.getView().fit(MapConstants.WMTS_DEFAULT_EXTENT);
      map.getView().setZoom(map.getView().getZoom() + 1);

      var startDrawInteraction = () => {
        map.addInteraction(drawInteraction);
        if (typeof this.drawStart === 'function') {
          this.drawStart();
        }
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
        if (typeof this.drawEnd === 'function') {
          this.drawEnd();
        }
      }, source);

      dragAndDropInteraction.on('addfeatures', (event) => {
        console.log("drop")
        this.addFile(event.file)
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
    addFileInBackground: function (file) {
      // THIS ONLY WORKS IN DEV
      // in a prod build the babel transpliation seems to mess with variable
      // and method naming resulting in a bunch of 'XXXXX is undefined'
      // possible solution: https://webpack.js.custodian/loaders/worker-loader/
      if (typeof this.onFileAddStart === 'function') {
        this.onFileAddStart();
      }
      // use a web worker to run the shp load and simplification operation
      // this should run quicker, and allows the UI to be responsive while
      // processing is occuring
      const thread = spawn(function(input, done) {
        // including theses dependencies via `require(...)` doesn't work
        // hence the following
        importScripts('https://unpkg.com/shpjs@latest/dist/shp.js');
        importScripts('https://npmcdn.com/@turf/turf@5.1.6/turf.min.js');
        let fileFeatures = undefined;
        file = input.file;

        var ext = file.name.split('.').pop();
        var features = null;
        if (ext == 'zip') {
          var reader = new FileReader();
          reader.onload = function (e) {
            shp(e.target.result).then(function (geojson) {
              var smplOptions = {tolerance: 0.0005, highQuality: false};
              var simpleGeojson = turf.simplify(geojson, smplOptions);
              done({ features : simpleGeojson});
            });
          };
          reader.readAsArrayBuffer(file);
        } else {
          const reader = new FileReader();
          reader.onload = (event) => {
            const jsonObj = JSON.parse(event.target.result);
            done({ features : jsonObj});
          };
          reader.readAsText(file);
        }
      });

      thread
      .send({ file : file })
      .on('message', (response) => {
        const fileFeatures = (new ol.format.GeoJSON()).readFeatures(response.features);
        if (typeof this.onAdd === 'function') {
          var writer = new ol.format.GeoJSON();
          var geojsonStr = writer.writeFeatures(fileFeatures);
          this.onAdd(JSON.parse(geojsonStr));
        }

        if (typeof this.onFileAddDone === 'function') {
          this.onFileAddDone();
        }
        thread.kill();
      })

    },
    addFile: function (file) {
      if (typeof this.onFileAddStart === 'function') {
        this.onFileAddStart();
      }

      var ext = file.name.split('.').pop();
      var features = null;
      if (ext == 'zip') {
        var reader = new FileReader();
        reader.onload = (function (e) {
          shp(e.target.result).then(function (geojson) {

            var smplOptions = {tolerance: 0.0005, highQuality: false};
            geojson = simplify(geojson, smplOptions);
            features = (new ol.format.GeoJSON()).readFeatures(geojson);

            this.addFeatures(this.source, features);

            if (typeof this.onAdd === 'function') {
              var writer = new ol.format.GeoJSON();
              var geojsonStr = writer.writeFeatures(features);
              this.onAdd(JSON.parse(geojsonStr));
            }

            if (typeof this.onFileAddDone === 'function') {
              this.onFileAddDone();
            }

          }.bind(this));
        }).bind(this);
        reader.readAsArrayBuffer(file);
      } else if (ext == 'json' || ext == 'geojson') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const jsonObj = JSON.parse(event.target.result);
          features = jsonObj;
          var olf = (new ol.format.GeoJSON()).readFeatures(features);

          this.addFeatures(this.source, olf);

          if (typeof this.onAdd === 'function') {
            // var writer = new ol.format.GeoJSON();
            // var geojsonStr = writer.writeFeatures(features);
            this.onAdd(features);
          }
          if (typeof this.onFileAddDone === 'function') {
            this.onFileAddDone();
          }
        };
        reader.readAsText(file);
      } else {
        // then we don't know what the file is, or how to support it so let the
        // user know.
        let msg = "Supported formats are geojson (.json, .geojson) and zipped shapefiles (.zip)"
        if (ext == 'shp') {
          msg = "To upload a shapefile please include the shapefile and associated 'sidecar' (.shx, .prj, .dbx, etc) files into a single zip file."
        }

        if (typeof this.onFileAddDone === 'function') {
          this.onFileAddDone();
        }

        if (typeof this.onFileAddBad === 'function') {
          this.onFileAddBad(msg);
        } else {
          console.error(msg);
        }
      }

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
    fit: function() {
      // fits view to area of interest geom if available, then survey lines
      // theory being survey lines will always be within area of interest.
      if (this.sourceIntersecting.getFeatures().length != 0) {
        this.map.getView().fit(this.sourceIntersecting.getExtent());
      } else if (this.sourceIntersecting.getFeatures().length != 0) {
        this.map.getView().fit(this.source.getExtent());
      }
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
    onFileAddStart: null,
    onFileAddDone: null,
    onFileAddBad: null,
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
    getArea: function () {
      var currentProj = this.map.getView().getProjection();
      var metersProj = ol.proj.get('EPSG:3857');


      var features = this.source.getFeatures();
      var totalArea = 0.0;
      features.forEach(feature => {
        var featureGeom = feature.getGeometry();

        if (
          featureGeom instanceof ol.geom.Polygon ||
          featureGeom instanceof ol.geom.MultiPolygon
        ) {
          var geomClone = featureGeom.clone();
          geomClone.transform(currentProj, metersProj);
          totalArea += ol.Sphere.getArea(geomClone);
        }

      });
      return totalArea;
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
