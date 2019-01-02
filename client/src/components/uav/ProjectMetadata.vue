<template>
  <div class="row justify-center">
    <div style="width: 900px; max-width: 90vw;">
      <q-breadcrumbs separator=">" color="light">
        <q-breadcrumbs-el label="Home" icon="home" to="/" />
        <q-breadcrumbs-el label="UAV" icon="toys" to="/uav" />
        <q-breadcrumbs-el label="Project Metadata" icon="fas fa-clipboard-list" />
      </q-breadcrumbs>
    </div>
  </div>
</template>
<script>
import './docs-input.styl'
import Vue from 'vue'
import { mapGetters } from 'vuex'
const _ = require('lodash');
import { errorHandler } from './../mixins/error-handling'
const uuidv4 = require('uuid/v4');
const timespan = require('readable-timespan');
timespan.set({
  lessThanFirst: 'now',
  millisecond: false
});
import axios from 'axios';
const path = require('path');

import OlMap from './../olmap/olmap';

export default Vue.extend({
  mixins: [errorHandler],
  beforeMount() {
    if (this.$route.query.id) {
      this.$store.dispatch('uav_tender/getTender', { id: this.$route.query.id });
    }
  },

  mounted() {
    var olmap = OlMap(this.$refs.mapDiv, {
      basemap: "osm"
    })
    olmap.initMap();
    this.map = olmap;
    this.map.onAdd = (geojson) => {
      // Geo json added to map, push it to server
      this.$store.dispatch('uav_tender/putAoi', { id: this.project_details.id, geojson: geojson })
        .catch((e) => {
          this.notify('negative', 'Error uploading Aoi to server.')
        });
    }

    if (this.aoiUrl) { this.map.addGeojsonUrl(this.aoiUrl) }

    if (!this.projectMetadata.id) {
      this.update('id', uuidv4());
    }
  },

  methods: {
    update(key, event) {
      this.$store.commit('uav_projectmetadata/update', {
        path: key,
        value: event
      })
    },
  },

  computed: {
    ...mapGetters({
      projectMetadata: 'uav_projectmetadata/projectMetadata',
    })
  },

  data() {
    return {
      map: null,
    }
  }
});

</script>
