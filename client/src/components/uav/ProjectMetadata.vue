<template>
  <div class="row justify-center">
    <div inline style="width: 900px; max-width: 90vw;">
      <div class="row justify-between">
        <q-breadcrumbs separator=">" color="light">
          <q-breadcrumbs-el label="Home" icon="home" to="/" />
          <q-breadcrumbs-el label="UAV" icon="toys" to="/uav" />
          <q-breadcrumbs-el label="Project Metadata" icon="fas fa-clipboard-list" />
        </q-breadcrumbs>
        <q-btn icon="fas fa-save" label="Save"
          @click="submit">
        </q-btn>
      </div>
    </div>



    <q-page padding class="docs-input row justify-center">
      <div style="width: 900px; max-width: 90vw;">
        <q-card inline style="width:100%">
          <q-card-title> Basic </q-card-title>
          <q-card-main dense>
            <q-field :label-width="2"
                     inset="full"
                     label="Survey name"
                     :error="$v.surveyName.$error"
                     error-label="Survey name is required"
                     helper="Name of data collection survey">
              <q-input :value="surveyName"
                       @change="update('surveyName', $event)"
                       @blur="$v.surveyName.$touch"
                       type="textarea" />
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     icon="fas fa-user"
                     label="Contact person"
                     :error="$v.contactPerson.$error"
                     error-label="Contact person is required">
              <q-input :value="contactPerson"
                       @change="update('contactPerson', $event)"
                       @blur="$v.contactPerson.$touch"
                       type="textarea" />
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     icon="fas fa-envelope"
                     :error="$v.email.$error"
                     error-label="Please provide a valid email address"
                     label="Contact email">
              <q-input
                       :value="email"
                       @change="update('email', $event)"
                       @blur="$v.email.$touch"
                       type="email" />
            </q-field>
          </q-card-main>
        </q-card>

        <q-card inline style="width:100%">
          <q-card-title> Area of Interest </q-card-title>
          <q-card-main>
            <div ref="mapDiv" id="mapDiv" style="height:350px;"></div>
            <q-item-side right>
              <q-item-tile class="self-end">
                <q-btn icon="fas fa-check" label="Check AoI"
                  :disable="!canCheckGeometry"
                  @click="checkGeometry">
                </q-btn>
              </q-item-tile>
            </q-item-side>
          </q-card-main>
        </q-card>
      </div>
    </q-page>


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

import { required, email } from 'vuelidate/lib/validators';

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
      console.log("geojson feature");
      console.log(geojson);
      this.canCheckGeometry = true;
      this.setAoi(geojson);
    }

    if (this.aoiUrl) { this.map.addGeojsonUrl(this.aoiUrl) }

    if (!this.id) {
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

    setAoi(geojson) {
      this.$store.commit('uav_projectmetadata/setAoi', geojson);
    },

    submit() {
      this.$v.$touch()

      if (this.$v.$error) {
        this.$q.notify('Please review fields')
        return
      }

      // due to the validation we keep a local data then set it to the
      // vuex store on submit
      // TODO - ideally the validation would be performed on the store data

      this.$store.dispatch('uav_projectmetadata/save')
    },

    checkGeometry() {
      // Send geojson to server to check for interescting surveys
      this.$store.dispatch(
        'uav_projectmetadata/checkAoi', { id: this.id })
        .catch((e) => {
          this.notify('negative', 'Error uploading Aoi to server.')
        });
    }
  },

  computed: {
    ...mapGetters({
      id: 'uav_projectmetadata/id',
      surveyName: 'uav_projectmetadata/surveyName',
      contactPerson: 'uav_projectmetadata/contactPerson',
      email: 'uav_projectmetadata/email',
      areaOfInterest: 'uav_projectmetadata/areaOfInterest',
    })
  },

  validations: {
    surveyName: { required },
    contactPerson: { required },
    email: { required, email },
  },

  data() {
    return {
      map: null,
      canCheckGeometry: false,
    }
  }
});

</script>
