<template>
  <div class="column q-pa-md q-gutter-y-sm">
    <div>
      Thankyou for providing your areas of interest to the AusSeabed community.
      Below is a mapped view of your areas as they have been provided today. If
      you have any questions, please contact us on
      <a href="mailto:ausseabed@ga.gov.au">ausseabed@ga.gov.au</a>. These areas
      will be incorporated in the national priorities layer on the AusSeabed
      data portal. More information on this process can be found
      <a href="http://www.ausseabed.gov.au/about/initiatives/priorities">here</a
      >.
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

export default Vue.extend({
  mixins: [errorHandler, permission],

  components: {
    LMap,
    LControlLayers,
    LLayerGroup,
    "l-wms-tile-layer": LWMSTileLayer
  },

  async mounted() {},

  methods: {
    isValid() {
      return this.acknowledged;
      // this.$v.$touch();
      // return !this.$v.$error;
    },

    geometrySet(info) {
      const layerBounds = info.getBounds().pad(0.2);
      const map = this.$refs.priorityAreaConfirmationMap;
      map.setBounds(layerBounds);
    },

    updatePasGeometry(pasId) {
      Vue.axios
        .get(`api/priority-area-submission/${pasId}/geometry`)
        .then(res => {
          this.pasGeometry = res.data;
        });
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
    }
  },

  data() {
    return {
      acknowledged: false,
      zoom: 4,
      mapStyle: { color: "red", weight: 3 },
      pasGeometry: undefined
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
      }
    },
    $priorityAreaSubmission: {
      handler(newPas, oldPas) {
        this.updatePasGeometry(newPas.id);
      }
    }
  }
});
</script>


<style scoped lang="stylus">
.checkbox-div {
  border: 1px solid red;
}
</style>
