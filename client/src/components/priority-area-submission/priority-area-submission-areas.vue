<template>
  <div class="scroll">
    <div class="column q-px-md q-gutter-y-sm">
      <div class="column q-gutter-y-sm">
        <div v-if="!readonly" class="col q-gutter-sm">
          <div>
            This tool allows users to create an Area of Interest (AOI)
            submission by either:
          </div>
          <div>
            Uploading a zipped shapefile of polygons which include, at a minimum,
            ingestible fields: Area of Interest name ('NAME') and assigned priority
            ('PRIORITY') -  (High, Medium, Low, or NA). Supported formats: .shp,
            GeoJSON, KML, GML.
          </div>
          <div>
            Or using the map window to draw a polygon. Submissions can be made with
            either a single polygon or multiple polygons but should be constrained
            to a single geographic area with new submissions being used for different
            geographic areas. Users can toggle preloaded layers on and off or add a
            custom web map service to assist with their planning.
          </div>
          <div>
            Subsequent forms within the tool build the associated metadata required
            for each AOI. For more information please refer to the help file.
          </div>
        </div>
        <div v-if="!readonly" class="row q-gutter-x-md">
          <q-uploader
            class="col"
            label="Upload Area of Interest spatial data files (max 30MB)"
            flat
            bordered
            :multiple="false"
            accept=".zip,.json,.geojson,.kml,.gml"
            :max-total-size="30000000"
            :auto-expand="true"
            :auto-upload="true"
            url="/api/priority-area/upload/"
            method="PUT"
            :form-fields="[
              {
                name: 'priorityAreaSubmissionId',
                value: priorityAreaSubmission.id,
              },
            ]"
            @uploaded="uploadedPriorityAreas"
            :disable="isProcessing"
          >
          </q-uploader>

          <q-card flat bordered class="col-auto" style="width: 300px">
            <template v-if="task == undefined">
              <q-card-section
                class="fit column justify-center items-center"
                style="color: #616161"
              >
                Awaiting upload to process
              </q-card-section>
            </template>
            <template v-else-if="isProcessing">
              <q-card-section class="fit column justify-center">
                <div class="row q-gutter-x-md">
                  <q-circular-progress
                    :indeterminate="task.progressType == 'INDETERMINATE'"
                    :value="task.progress"
                    :show-value="task.progressType != 'INDETERMINATE'"
                    font-size="20px"
                    size="50px"
                    class="text-grey-5"
                    color="grey-5"
                  />
                  <div class="column">
                    <div class="main-page-sub-title">Processing</div>
                    <div style="color: #616161">{{ task.statusMessage }}</div>
                  </div>
                </div>
              </q-card-section>
            </template>
            <template v-else-if="task.state == 'FAILED'">
              <q-card-section class="fit column justify-center">
                <div class="row q-gutter-x-md">
                  <q-avatar
                    icon="error_outline"
                    text-color="red"
                    size="50px"
                    font-size="40px"
                  >
                  </q-avatar>
                  <div class="column">
                    <div class="main-page-sub-title">Processing failed</div>
                    <div style="color: #616161">{{ task.errorMessage }}</div>
                  </div>
                </div>
              </q-card-section>
            </template>
            <template v-else-if="task.state == 'COMPLETED'">
              <q-card-section class="fit column justify-center">
                <div class="row q-gutter-x-md">
                  <q-avatar
                    icon="check_circle_outline"
                    text-color="grey-5"
                    size="50px"
                    font-size="40px"
                  >
                  </q-avatar>
                  <div class="column">
                    <div class="main-page-sub-title">Processing complete</div>
                    <div style="color: #616161">
                      {{
                        task.output.priorityAreaIds.length +
                        " areas of interest created"
                      }}
                    </div>
                  </div>
                </div>
              </q-card-section>
            </template>
          </q-card>
        </div>
        <div v-if="!readonly" class="row q-gutter-x-md">
          <div>OR</div>
        </div>
        <div v-if="!readonly" class="row">
          <div class="column full-width q-gutter-y-sm">
            <l-map
              style="min-height: 400px"
              class="col rounded-borders"
              ref="aoiDefinitionMap"
              :zoom="zoom"
              :center="center"
              :options="{ attributionControl: false }"
              @click="mapClicked"
            >
              <l-wms-tile-layer
                :base-url="mapBaseUrl"
                layers="World_Bathymetry_Image"
                name="WorldBathymetry Image"
                layer-type="base"
              >
              </l-wms-tile-layer>
              <l-wms-tile-layer
                v-if="showSurveyLayer"
                base-url="map/wms"
                layers="Survey_Plans"
                name="Upcoming Surveys"
                :transparent="true"
                :opacity="0.5"
                format="image/png"
              >
              </l-wms-tile-layer>
              <l-wms-tile-layer
                v-if="showAoiLayer"
                base-url="map/wms"
                layers="areas_of_interest"
                name="areas_of_interest"
                :transparent="true"
                :opacity="0.5"
                format="image/png"
              >
              </l-wms-tile-layer>
              <l-wms-tile-layer
                v-if="showMarineParksLayer"
                base-url="map/wms"
                layers="Marine_Parks"
                name="Marine Parks"
                :transparent="true"
                :opacity="0.5"
                format="image/png"
              >
              </l-wms-tile-layer>
              <l-wms-tile-layer
                v-if="userWms && userWmsLayer"
                :base-url="userWmsUrlProxy"
                :layers="userWmsLayer.value"
                :name="userWmsLayer.value"
                :transparent="true"
                :opacity="0.5"
                format="image/png"
                ref="userWmsMapLayer"
              >
              </l-wms-tile-layer>
              <l-geo-json
                v-if="otherPasGeometry && showOtherPasLayer"
                :geojson="otherPasGeometry"
                :optionsStyle="otherPasMapStyle"
              />
              <l-layer-group ref="popz">
                <l-popup
                  :latLng="sfgLatLng"
                  :options="{ maxWidth: 300, minWidth: 100 }"
                >
                  <span>{{ sfgText[0] }}</span> <br />
                  <span>{{ sfgText[1] }}</span>
                </l-popup>
              </l-layer-group>
              <template v-if="sfg">
                <l-geo-json :geojson="sfg" :optionsStyle="sfgStyle">
                </l-geo-json>
              </template>
              <l-control position="topleft">
                <div class="column q-gutter-y-xs">
                  <q-btn
                    size="sm"
                    color="white"
                    padding="xs"
                    :icon="isActive ? 'app:pan' : 'app:draw'"
                    @click="flipActive"
                  >
                    <q-tooltip>
                      {{
                        isActive
                          ? "Click to switch back to pan mode"
                          : "Click to start drawing area of interest"
                      }}
                    </q-tooltip>
                  </q-btn>
                </div>
              </l-control>
              <l-control :position="'topright'">
                <q-card flat bordered class="q-pa-xs" style="max-width: 300px">
                  {{
                    isActive
                      ? "Click and hold mouse button to draw area of interest polygon. Clicking existing polygons will remove them."
                      : "Click draw icon to begin creating area of interest."
                  }}
                </q-card>
              </l-control>
              <l-control :position="'bottomright'">
                <q-btn
                  :disable="polygons.length == 0"
                  color="primary"
                  @click="saveAoiPolygons"
                >
                  Save area of interest
                </q-btn>
              </l-control>
              <l-freedraw
                v-model="polygons"
                :mode="mode"
                :options="{ color: 'red' }"
              />
              <l-control position="bottomleft">
                <div class="column text-white">
                  <q-checkbox
                    v-model="showSurveyLayer"
                    label="Show upcoming survey layer"
                    size="xs"
                    dark
                  >
                  </q-checkbox>
                  <q-checkbox
                    v-model="showAoiLayer"
                    label="Show published areas of interest"
                    size="xs"
                    dark
                  >
                  </q-checkbox>
                  <q-checkbox
                    v-model="showMarineParksLayer"
                    label="Show marine parks layer"
                    size="xs"
                    dark
                  >
                  </q-checkbox>
                  <q-checkbox
                    v-model="showOtherPasLayer"
                    label="Show my organisation submissions"
                    size="xs"
                    dark
                  >
                  </q-checkbox>
                </div>
              </l-control>
            </l-map>
            <div class="column col-auto">
              <div class="row">Custom WMS base layer</div>
              <div class="row q-col-gutter-x-sm">
                <div class="column col">
                  <q-input
                    outlined
                    clearable
                    dense
                    v-model="userWms"
                    label="Web Mapping Service GetCapabilities URL"
                    hint="eg; https://warehouse.ausseabed.gov.au/geoserver/wms"
                  />
                </div>

                <div class="column" style="min-width: 260px">
                  <q-select
                    outlined
                    v-model="userWmsLayer"
                    :options="wmsLayerOptions"
                    label="Layer name"
                    dense
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <q-separator />

        <div class="column q-gutter-y-xs">
          <div class="row justify-between items-center">
            <div class="main-page-sub-title">Areas of Interest</div>
          </div>

          <div v-if="loadingPriorityAreaData" class="column">
            <div style="color: #616161">Loading Areas of Interest</div>
            <q-linear-progress
              size="25px"
              :value="loadingPriorityAreaDataProgress"
              color="grey-5"
            >
              <div class="absolute-full flex flex-center">
                <q-badge
                  color="white"
                  text-color="grey-5"
                  :label="progressLabel"
                />
              </div>
            </q-linear-progress>
          </div>
          <div
            class="column items-center"
            v-if="_.get(priorityAreaSubmission, 'priorityAreas.length') == 0"
          >
            <div class="main-page-title">No areas of interest provided</div>
            <div style="color: #616161">
              Drag and drop geojson or zipped shapefile to upload area above.
            </div>
          </div>
          <div v-else class="column q-gutter-y-sm">
            <priority-area
              ref="priorityAreaComponents"
              v-for="(priorityArea, index) of priorityAreaSubmission.priorityAreas"
              :key="priorityArea.id"
              :priority-area="priorityArea"
              :index="index"
              :count="priorityAreaSubmission.priorityAreas.length"
              @priority-area-value-changed="priorityAreaValueChanged"
              @priority-area-deleted="priorityAreaDeleted"
              :readonly="readonly"
              @priority-area-apply-to-all="priorityAreaApplytoAll"
              :validator="validator"
            >
            </priority-area>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
const _ = require("lodash");
const convert = require("xml-js");
const url = require("url");
import { mapActions, mapGetters, mapMutations } from "vuex";
import { latLng, Util } from "leaflet";
import {
  LMap,
  LWMSTileLayer,
  LControlLayers,
  LLayerGroup,
  LPopup,
} from "vue2-leaflet";

import LFreeDraw from "vue2-leaflet-freedraw";
import { NONE, ALL } from "leaflet-freedraw";

import { multiPolygon } from "@turf/helpers";

import * as MapConstants from "../olmap/map-constants";
import { errorHandler } from "./../mixins/error-handling";
import { permission } from "./../mixins/permission";

import * as pasMutTypes from "../../store/modules/priority-area-submission/priority-area-submission-mutation-types";

import PriorityArea from "./priority-area";

export default Vue.extend({
  mixins: [errorHandler, permission],

  props: [
    'readonly',
    'validationIntent',
    'validator'
  ],

  components: {
    "priority-area": PriorityArea,
    LMap,
    LControlLayers,
    LLayerGroup,
    LPopup,
    "l-wms-tile-layer": LWMSTileLayer,
    "l-freedraw": LFreeDraw,
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    ...mapActions("priorityAreaSubmission", [
      "getPreferredTimeframeOptions",
      "getPriorityOptions",
      "getEcologicalAreaNameOptions",
    ]),

    ...mapMutations("priorityAreaSubmission", {
      addPriorityAreas: pasMutTypes.ADD_PRIORITY_AREAS,
      removePriorityArea: pasMutTypes.REMOVE_PRIORITY_AREA,
      updatePriorityAreaSubmissionValue:
        pasMutTypes.UPDATE_ACTIVE_PRIORITY_AREA_SUBMISSION_VALUE,
      setDirty: pasMutTypes.SET_DIRTY,
    }),

    fetchData() {
      this.getPreferredTimeframeOptions();
      this.getPriorityOptions();
      this.getEcologicalAreaNameOptions();

      if (!_.isNil(this.priorityAreaSubmission.uploadTaskId)) {
        this.taskTickCount = 0;
        this.updateTaskStatus(this.priorityAreaSubmission.uploadTaskId);
      }
    },

    isValid() {
      this.$v.$touch();
      return !this.$v.$error;
    },

    priorityAreaValueChanged({ priorityArea, propertyName, value }) {
      const paIndex =
        this.priorityAreaSubmission.priorityAreas.indexOf(priorityArea);
      const path = `priorityAreas[${paIndex}].${propertyName}`;
      this.updatePriorityAreaSubmissionValue({ path: path, value: value });
    },

    priorityAreaDeleted({ priorityArea }) {
      this.removePriorityArea(priorityArea.id);
    },

    uploadedPriorityAreas(info) {
      const res = JSON.parse(info.xhr.response);
      this.taskTickCount = 0;
      this.updateTaskStatus(res.taskId);
    },

    updateTaskStatus(taskId) {
      const finishedStates = ["COMPLETED", "FAILED"];
      Vue.axios
        .get(`api/task/${taskId}`)
        .then((res) => {
          this.task = res.data;
          this.taskTickCount += 1;

          // dont keep getting task status if the task has finished
          // OR if we've already got the task status 600 times. If this happens
          // and the task didn't finish prior, it's likely the task has failed
          // but the status is not reflecting this.
          if (
            !finishedStates.includes(this.task.state) &&
            this.taskTickCount < 600
          ) {
            this.taskTimeout = setTimeout(
              () => this.updateTaskStatus(taskId),
              1000
            );
          }
        })
        .catch((err) => {
          if (err.response.status == 404) {
            // then no task has been provided, this is ok.
          } else {
            console.error(err);
          }
        });
    },

    async addTaskPriorityAreasToSubmission() {
      this.loadingPriorityAreaData = true;
      let newPaIds = this.task.output.priorityAreaIds;
      let pasWithData = [];
      let count = 0;
      for (const paId of newPaIds) {
        let paRes = await Vue.axios.get(`api/priority-area/${paId}`);
        let pa = paRes.data;
        pa.isNew = true;
        pasWithData.push(pa);
        count += 1;
        this.loadingPriorityAreaDataProgress = count / newPaIds.length;
      }
      this.addPriorityAreas(pasWithData);
      this.loadingPriorityAreaData = false;
    },

    priorityAreaApplytoAll({ propertyName, value, id, limit }) {
      let limitCount = 0;
      let startUpdating = false;

      for (const [
        paIndex,
        pa,
      ] of this.priorityAreaSubmission.priorityAreas.entries()) {
        if (id == undefined || limit == undefined) {
          // no id, and no limit provided so update all the entries
          const path = `priorityAreas[${paIndex}].${propertyName}`;
          this.updatePriorityAreaSubmissionValue({ path: path, value: value });
        } else {
          if (pa.id == id) {
            startUpdating = true;
          }
          if (startUpdating) {
            const path = `priorityAreas[${paIndex}].${propertyName}`;
            this.updatePriorityAreaSubmissionValue({
              path: path,
              value: value,
            });
            limitCount++;
          }
          if (limitCount > limit) {
            return;
          }
        }
      }
    },

    flipActive() {
      this.isActive = !this.isActive;
    },

    saveAoiPolygons() {
      // the freedraw component `this.polygons` is a list of coordinate
      // lists. We need to convert this from {lat: -33, lng: 104} to arrays
      // such as [104, -33]. geojson assumes more complex polygons (ones with
      // holes) that freedraw doesn't do, so we need to add in an extra level
      // on the arrays (the `return [polyCoords];` bit)
      let polygonsCoords = this.polygons.map((poly) => {
        let polyCoords = poly.map((coord) => {
          return [coord.lng, coord.lat];
        });
        return [polyCoords];
      });
      let mp = multiPolygon(polygonsCoords);

      Vue.axios
        .post(
          `api/priority-area/new-from-geometry/?aoiSubmissionId=${this.priorityAreaSubmission.id}`,
          mp
        )
        .then((res) => {
          let tid = res.data.taskId;
          this.updateTaskStatus(tid);
        })
        .catch((err) => {
          if (err.response.status == 404) {
            // then no task has been provided, this is ok.
          } else {
            console.error(err);
          }
        }).finally(() => {
          this.isActive = false;
        });

      this.polygons = [];
    },

    getWmsLayersRec(getCap, parentName, layerlist) {
      // recursively traverses the getCap object to find layer names. These
      // may be nested, so any layer object that has an attribute of 'name'
      // is regarded as a layer name.
      if (_.isNil(getCap)) {
        return;
      }
      for (const [key, value] of Object.entries(getCap)) {
        if (_.isNil(key) || _.isNil(value)) {
          // skip it
        } else if (
          parentName &&
          parentName.toLowerCase() === "layer" &&
          key.toLowerCase() == "name"
        ) {
          let title = value._text;
          if (getCap.Title && getCap.Title._text) {
            title = getCap.Title._text;
          }
          layerlist.push({ value: value._text, label: title });
        } else if (!_.isNil(value) && Array.isArray(value)) {
          for (const item of value) {
            this.getWmsLayersRec(item, key, layerlist);
          }
        } else if (typeof value === "object" && !_.isNil(value)) {
          this.getWmsLayersRec(value, key, layerlist);
        }
      }
    },

    getWmsLayers(getCapabilitiesUrl) {
      // http://localhost:3001/map/wms?service=WMS&request=GetCapabilities
      if (getCapabilitiesUrl && getCapabilitiesUrl.length != 0) {
        Vue.axios
          .get(getCapabilitiesUrl)
          .then((res) => {
            const getCapabilitiesXml = res.data;

            var options = {
              ignoreComment: true,
              alwaysChildren: true,
              compact: true,
            };
            var getCapabilitiesJson = convert.xml2js(
              getCapabilitiesXml,
              options
            );

            let layerNames = [];
            this.getWmsLayersRec(getCapabilitiesJson, undefined, layerNames);
            this.wmsLayerOptions = layerNames;
            if (layerNames.length > 0) {
              this.userWmsLayer = layerNames[0];
            }
          })
          .catch((error) => {
            // error is possibly due to CORS, and if so will be undefined
            this.notifyError(
              `Failed to fetch GetCapabilties response from server`
            );
            console.log(error);
          });
      } else {
        this.wmsLayerOptions = [];
      }
    },

    getFeatureInfoUrl: function (latlng, layerName) {
      // Construct a GetFeatureInfo request URL given a point
      const mapObject = this.$refs.aoiDefinitionMap.mapObject;

      const lBounds = mapObject.getBounds();
      const wmsBounds = [
        lBounds.getSouth(),
        lBounds.getWest(),
        lBounds.getNorth(),
        lBounds.getEast(),
      ];

      var point = mapObject.latLngToContainerPoint(latlng, mapObject.getZoom()),
        size = mapObject.getSize(),
        params = {
          request: "GetFeatureInfo",
          service: "WMS",
          crs: "EPSG:4326",
          styles: "",
          version: "1.3.0",
          bbox: wmsBounds,
          height: size.y,
          width: size.x,
          layers: layerName,
          query_layers: layerName,
          info_format: "application/json",
        };

      params[params.version === "1.3.0" ? "i" : "x"] = point.x;
      params[params.version === "1.3.0" ? "j" : "y"] = point.y;

      const featureUrl =
        "map/wms" + Util.getParamString(params, "map/wms", true);

      return featureUrl;
    },

    mapClicked(e) {
      if (this.isActive) {
        // then user is in edit mode, so do not respond to any clicks to
        // show feature info
        return;
      }
      this.sfg = undefined;

      let layerName = undefined;
      if (this.showSurveyLayer) {
        layerName = "Survey_Plans";
      } else if (this.showAoiLayer) {
        layerName = "areas_of_interest";
      } else if (this.showMarineParksLayer) {
        layerName = "Marine_Parks";
      }

      this.sfgLatLng = e.latlng;

      const featureInfoUrl = this.getFeatureInfoUrl(e.latlng, layerName);
      Vue.axios.get(featureInfoUrl).then((res) => {
        if (res.data.features.length == 0) {
          this.sfg = undefined;
          this.$refs.popz.mapObject.closePopup();
        } else {
          this.sfg = res.data;
          const aFeature = res.data.features[0];
          if (layerName == "Survey_Plans") {
            this.sfgText = [
              aFeature.properties.Commissioning_Organisations,
              aFeature.properties.Contact_email,
            ];
          } else if (layerName == "areas_of_interest") {
            this.sfgText = [
              aFeature.properties.Submitting_Organisation,
              aFeature.properties.Contact_email,
            ];
          } else if (layerName == "Marine_Parks") {
            this.sfgText = [
              aFeature.properties.netname,
              aFeature.properties.resname,
            ];
          }
          this.$refs.popz.mapObject.openPopup(this.sfgLatLng);
        }
      });
    },
  },

  watch: {
    "priorityAreaSubmission.uploadTaskId": function (newId, oldId) {
      this.fetchData();
    },
    "task.state": function (newState, oldState) {
      if (newState == "COMPLETED") {
        this.addTaskPriorityAreasToSubmission();
      }
    },
    showOtherPasLayer: function(newShow, oldShow) {
      if (newShow) {
        // get the geometry from all the other priority are submissions
        Vue.axios
          .get(
            `api/priority-area-submission/${this.priorityAreaSubmission.id}/geometry?exclude=true`
          )
          .then((res) => {
            this.otherPasGeometry = res.data;
          });
      } else {
        this.otherPasGeometry = undefined;
      }
    },
    userWms: function (newUrl, oldUrl) {
      this.userWmsLayer = undefined;
      this.wmsLayerOptions = [];

      if (!newUrl || newUrl.length == 0) {
        // then user has cleared the url, don't need to get layer list
        return;
      }

      // check the url includes the necessary query string params to
      // get the GetCapabilities response. If these aren't included,
      // add them.
      let parsedUrl;
      try {
        parsedUrl = new URL(newUrl);
      } catch (_) {
        this.notifyError(`Invalid URL`);
        return;
      }

      let searchParams = parsedUrl.searchParams;
      if (!searchParams.get("request")) {
        searchParams.set("request", "GetCapabilities");
      }
      if (!searchParams.get("service")) {
        searchParams.set("service", "WMS");
      }
      parsedUrl.search = searchParams.toString();
      let parsedUrlString = parsedUrl.toString();

      // use the backend proxy as CORS will probably block direct requests
      this.getWmsLayers("api/proxy/" + parsedUrlString);
    },
    userWmsLayer: function (newLayer, oldLayer) {
      if (!newLayer) {
        return;
      }
      // there seems to be an issue with the Vue wrapper around leaflet
      // whereby the reactive layer name is not passed to the underlying
      // leaflet object. As a result it keeps requesting the same map layer
      // regardless of what layer name is set.
      // following code sets the leaflet layer name directly
      const mapVueObject = this.$refs.userWmsMapLayer;
      if (mapVueObject) {
        mapVueObject.mapObject.wmsParams.layers = newLayer.value;
      }
    },
  },

  computed: {
    ...mapGetters("priorityAreaSubmission", {
      priorityAreaSubmission: "activePriorityAreaSubmission",
    }),
    $v () {
      return this.validator;
    },

    isProcessing() {
      if (this.task == undefined) {
        return false;
      } else if (["NOT_STARTED", "STARTED"].includes(this.task.state)) {
        // because "NOT_STARTED" still means the task has been initialised and
        // it is about to start very soon
        return true;
      } else {
        return false;
      }
    },

    progressLabel() {
      return Math.round(this.loadingPriorityAreaDataProgress * 100) + "%";
    },

    mapBaseUrl() {
      return MapConstants.LEAFLET_BASE_LAYER;
    },

    center() {
      var center = latLng(
        (MapConstants.WMTS_DEFAULT_EXTENT[1] +
          MapConstants.WMTS_DEFAULT_EXTENT[3]) /
          2,
        (MapConstants.WMTS_DEFAULT_EXTENT[0] +
          MapConstants.WMTS_DEFAULT_EXTENT[2]) /
          2
      );
      return center;
    },

    mode() {
      return this.isActive ? ALL : NONE;
    },

    userWmsUrlProxy() {
      // leaflet will generate a getMap request with whatever is returned
      // by this function. We therefore need to strip out parts that may confuse
      // a wms server such as having getMap and getCapabilities query params
      let cleanWmsUrl = this.userWms.replaceAll("request=GetCapabilities", "");
      return "api/proxy/" + cleanWmsUrl;
    },
  },

  data() {
    return {
      task: undefined,
      taskTickCount: 0,
      taskTimeout: undefined,
      loadingPriorityAreaData: false,
      loadingPriorityAreaDataProgress: 0,
      zoom: 3,
      mapStyle: { color: "red", weight: 3 },
      showSurveyLayer: true,
      showAoiLayer: false,
      showMarineParksLayer: false,
      showOtherPasLayer: false,
      showOrganisationSubmissionsLayer: false,
      polygons: [],
      isActive: false,
      otherPasGeometry: undefined,
      otherPasMapStyle: { color: "yellow", weight: 2 },
      sfgStyle: { color: "orange", weight: 2 },
      sfgText: ["", ""],
      sfgLatLng: undefined,
      sfg: undefined,
      userWms: undefined,
      userWmsLayer: undefined,
      wmsLayerOptions: [],
    };
  },

  beforeRouteLeave(to, from, next) {
    if (!_.isNil(this.taskTimeout)) {
      clearTimeout(this.taskTimeout);
    }
    next();
  },
});
</script>


<style scoped lang="stylus"></style>
