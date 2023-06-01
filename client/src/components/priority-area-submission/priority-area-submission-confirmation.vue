<template>
  <div class="column q-pa-md q-gutter-y-sm">
    <div class="row q-gutter-x-sm">
      <div class="col">
        Below is a mapped view of your areas as they have been provided today.
        Click through the buttons below to publish your submission alongside
        other <a href="https://portal.ga.gov.au/restore/8163b137-c621-4e9f-8781-883e6af7a662" target="_blank">Areas of Interest on the AusSeabed portal</a> under Layers<q-icon
          name="arrow_forward"
        />AusSeabed Coordination. If you have any questions, please contact us
        on <a href="mailto:ausseabed@ga.gov.au">ausseabed@ga.gov.au</a>. Thank
        you for your submission!
      </div>
      <div
        class="col-auto download-div row rounded-borders q-pa-sm q-gutter-x-sm"
      >
        <div class="row justify-center items-center">
          <div>
            <q-btn
              type="a"
              :href="`/api/priority-area-submission/${priorityAreaSubmission.id}/shp`"
              round
              flat
              icon="cloud_download"
            >
              <q-tooltip> Download all Areas of Interest </q-tooltip>
            </q-btn>
          </div>
        </div>
        <div style="max-width: 200px">
          Download shapefile containing Areas of Interest and associated
          metadata.
        </div>
      </div>
    </div>

    <div class="col rounded-borders">
      <l-map
        class="col rounded-borders"
        ref="priorityAreaConfirmationMap"
        :zoom="zoom"
        :center="center"
      >
        <!-- <l-tile-layer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
        /> -->
        <l-wms-tile-layer
          :base-url="mapBaseUrl"
          layers="World_Bathymetry_Image"
          name="WorldBathymetry Image"
          layer-type="base"
        >
        </l-wms-tile-layer>
        <l-geo-json
          v-if="pasGeometry"
          :geojson="pasGeometry"
          :optionsStyle="mapStyle"
          @ready="geometrySet"
        />
      </l-map>
    </div>

    <div>
      <div class="q-px-md column">
        <q-checkbox
          @input="
            updatePriorityAreaSubmissionValue({
              path: 'openToCollaboration',
              value: $event,
            })
          "
          :value="priorityAreaSubmission.openToCollaboration"
          label="We are open to collaboration with data collection"
          :disable="readonly"
        />
        <q-checkbox
          style="margin-top: -8px"
          @input="
            updatePriorityAreaSubmissionValue({
              path: 'haveFundsResources',
              value: $event,
            })
          "
          :value="priorityAreaSubmission.haveFundsResources"
          label="We have funds, resources, or expertise to contribute to collaboration"
          :disable="readonly"
        />
      </div>
    </div>

    <div class="checkbox-div rounded-borders">
      <div class="q-pa-md">
        <q-checkbox
          v-if="recordState && !(recordState.state === 'published')"
          v-model="acknowledged"
          label="I acknowledge that I have the authority and delegation to publish these priorities on behalf of the submitting organisation."
        />
        <div v-if="recordState && recordState.state === 'published'">
          Area of Interest Submission has been published
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
const _ = require("lodash");
import { mapActions, mapGetters, mapMutations } from "vuex";

import * as MapConstants from "../olmap/map-constants";
import { errorHandler } from "./../mixins/error-handling";
import { permission } from "./../mixins/permission";

import { latLng } from "leaflet";
import { LMap, LWMSTileLayer, LControlLayers, LLayerGroup } from "vue2-leaflet";

import * as pasMutTypes from "../../store/modules/priority-area-submission/priority-area-submission-mutation-types";

export default Vue.extend({
  mixins: [errorHandler, permission],

  props: ["readonly"],

  components: {
    LMap,
    LControlLayers,
    LLayerGroup,
    "l-wms-tile-layer": LWMSTileLayer,
  },

  async mounted() {},

  methods: {
    ...mapMutations("priorityAreaSubmission", {
      updatePriorityAreaSubmissionValue:
        pasMutTypes.UPDATE_ACTIVE_PRIORITY_AREA_SUBMISSION_VALUE,
      setDirty: pasMutTypes.SET_DIRTY,
    }),

    isValid() {
      return true;
    },

    geometrySet(info) {
      const layerBounds = info.getBounds().pad(0.2);
      const map = this.$refs.priorityAreaConfirmationMap;
      map.setBounds(layerBounds);
    },

    updatePasGeometry(pasId) {
      Vue.axios
        .get(`api/priority-area-submission/${pasId}/geometry`)
        .then((res) => {
          this.pasGeometry = res.data;
        });
    },
  },

  validations() {
    return {
      priorityAreaSubmission: {},
    };
  },

  computed: {
    ...mapGetters("priorityAreaSubmission", {
      priorityAreaSubmission: "activePriorityAreaSubmission",
    }),
    ...mapGetters("recordState", ["recordState"]),
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

    mapBaseUrl() {
      return MapConstants.LEAFLET_BASE_LAYER;
    },
  },

  data() {
    return {
      acknowledged: false,
      zoom: 4,
      mapStyle: { color: "red", weight: 3 },
      pasGeometry: undefined,
    };
  },

  watch: {
    $route: {
      immediate: true,
      handler(newRoute, oldRoute) {
        const pasId = newRoute.params.id;
        if (!_.isNil(pasId)) {
          this.updatePasGeometry(pasId);
        }
      },
    },
    $priorityAreaSubmission: {
      handler(newPas, oldPas) {
        this.updatePasGeometry(newPas.id);
      },
    },
  },
});
</script>


<style scoped lang="stylus">
.checkbox-div {
  border: 1px solid red;
}

.download-div {
  border: 1px solid grey;
}
</style>
