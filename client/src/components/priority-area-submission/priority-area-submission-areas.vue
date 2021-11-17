<template>
  <div class="scroll">
    <div class="column q-px-md q-gutter-y-sm">
      <div class="column q-gutter-y-sm">
        <div v-if="!readonly" class="col">
          The National Area of Interest tool provides the option to upload a
          spatial file or to use the map controller to develop the area of
          interest information within the tool.
        </div>
        <div v-if="!readonly" class="row q-gutter-x-md">
          <q-uploader
            class="col"
            label="Upload Area of Interest spatial data files (max 30MB)"
            flat
            bordered
            :multiple="false"
            accept=".zip,.json"
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
        <div v-if="!readonly" class="row q-gutter-x-md">
          <div class="row full-width q-gutter-x-md">
            <l-map
              style="min-height: 400px"
              class="col rounded-borders"
              ref="aoiDefinitionMap"
              :zoom="zoom"
              :center="center"
              :options="{ attributionControl: false }"
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
                layers="ASB_SPT"
                name="Upcoming Surveys"
                :transparent="true"
                format="image/png"
              >
              </l-wms-tile-layer>
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
                    v-model="showOrganisationSubmissionsLayer"
                    label="Show my organisations submissions"
                    size="xs"
                    dark
                  >
                  </q-checkbox>
                </div>
              </l-control>
            </l-map>
            <div class="column col-auto q-gutter-y-sm">
              <q-card flat bordered style="max-width: 300px">
                <div class="q-pa-sm">
                  The National Area of Interest tool allows for the organisation
                  to profile multiple areas of interest as per the model below:
                </div>
                <div class="q-pa-sm">
                  <q-img src="~/assets/aoi-model.png"> </q-img>
                </div>
                <div class="q-pa-sm">
                  An area of interest can consist of one or many spatial bounds
                  (polygons). An area of interest should be contained within a
                  single geographic area. Read the help file for more
                  information.
                </div>
              </q-card>
              <q-card flat bordered style="max-width: 300px">
                <div class="q-pa-sm">User added WMS stuff goes here</div>
              </q-card>
            </div>
          </div>
        </div>

        <q-separator />

        <div class="column q-gutter-y-xs">
          <div class="row justify-between items-center">
            <div class="main-page-sub-title">Areas of Interest</div>
            <q-btn
              v-if="_.get(priorityAreaSubmission, 'priorityAreas.length') > 0"
              type="a"
              :href="`/api/priority-area-submission/${priorityAreaSubmission.id}/shp`"
              round
              flat
              icon="cloud_download"
            >
              <q-tooltip> Download all Areas of Interest </q-tooltip>
            </q-btn>
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
              v-for="priorityArea of priorityAreaSubmission.priorityAreas"
              :key="priorityArea.id"
              :priority-area="priorityArea"
              @priority-area-value-changed="priorityAreaValueChanged"
              @priority-area-deleted="priorityAreaDeleted"
              :readonly="readonly"
              @priority-area-apply-to-all="priorityAreaApplytoAll"
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
import { mapActions, mapGetters, mapMutations } from "vuex";
import { latLng } from "leaflet";
import { LMap, LWMSTileLayer, LControlLayers, LLayerGroup } from "vue2-leaflet";

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

  props: ["readonly"],

  components: {
    "priority-area": PriorityArea,
    LMap,
    LControlLayers,
    LLayerGroup,
    "l-wms-tile-layer": LWMSTileLayer,
    "l-freedraw": LFreeDraw
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    ...mapActions("priorityAreaSubmission", [
      "getPreferredTimeframeOptions",
      "getPriorityOptions",
      "getRequiredDataQualityOptions",
      "getRiskRatingOptions"
    ]),

    ...mapMutations("priorityAreaSubmission", {
      addPriorityAreas: pasMutTypes.ADD_PRIORITY_AREAS,
      removePriorityArea: pasMutTypes.REMOVE_PRIORITY_AREA,
      updatePriorityAreaSubmissionValue:
        pasMutTypes.UPDATE_ACTIVE_PRIORITY_AREA_SUBMISSION_VALUE,
      setDirty: pasMutTypes.SET_DIRTY
    }),

    fetchData() {
      this.getPreferredTimeframeOptions();
      this.getPriorityOptions();
      this.getRequiredDataQualityOptions();
      this.getRiskRatingOptions();

      if (!_.isNil(this.priorityAreaSubmission.uploadTaskId)) {
        this.taskTickCount = 0;
        this.updateTaskStatus(this.priorityAreaSubmission.uploadTaskId);
      }
    },

    isValid() {
      // we perform map, then reduce, so that the `isValid` method
      // is called on all priority area components. Doing the only the reduce
      // will stop calling isValid after the first non-valid component.
      if (_.isNil(this.$refs.priorityAreaComponents)) {
        // if there are no priority areas, then its valid
        return true;
      }
      let allValid = this.$refs.priorityAreaComponents
        .map(comp => comp.isValid())
        .reduce((sum, next) => sum && next, true);

      return allValid;
    },

    priorityAreaValueChanged({ priorityArea, propertyName, value }) {
      const paIndex = this.priorityAreaSubmission.priorityAreas.indexOf(
        priorityArea
      );
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
        .then(res => {
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
        .catch(err => {
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

    priorityAreaApplytoAll({ propertyName, value }) {
      for (const [
        paIndex,
        pa
      ] of this.priorityAreaSubmission.priorityAreas.entries()) {
        const path = `priorityAreas[${paIndex}].${propertyName}`;
        this.updatePriorityAreaSubmissionValue({ path: path, value: value });
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
      let polygonsCoords = this.polygons.map(poly => {
        let polyCoords = poly.map(coord => {
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
        .then(res => {
          let tid = res.data.taskId;
          this.updateTaskStatus(tid);
        })
        .catch(err => {
          if (err.response.status == 404) {
            // then no task has been provided, this is ok.
          } else {
            console.error(err);
          }
        });

      this.polygons = [];
    }
  },

  watch: {
    "priorityAreaSubmission.uploadTaskId": function(newId, oldId) {
      this.fetchData();
    },
    "task.state": function(newState, oldState) {
      if (newState == "COMPLETED") {
        this.addTaskPriorityAreasToSubmission();
      }
    }
  },

  validations() {
    return {
      priorityAreaSubmission: {}
    };
  },

  computed: {
    ...mapGetters("priorityAreaSubmission", {
      priorityAreaSubmission: "activePriorityAreaSubmission"
    }),

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
    }
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
      showOrganisationSubmissionsLayer: false,
      polygons: [],
      isActive: false
    };
  },

  beforeRouteLeave(to, from, next) {
    if (!_.isNil(this.taskTimeout)) {
      clearTimeout(this.taskTimeout);
    }
    next();
  }
});
</script>


<style scoped lang="stylus"></style>
