<template>
  <div class="row justify-center">
    <div inline style="width: 900px; max-width: 90vw;">
      <div class="row justify-between">
        <q-breadcrumbs separator=">" color="light">
          <q-breadcrumbs-el label="Home" icon="home" to="/" />
          <q-breadcrumbs-el label="Survey Technical Specifications" icon="fas fa-clipboard-list" />
        </q-breadcrumbs>
        <div class="row">
          <q-btn icon="arrow_back" label="Project Metadata"
            :to="'/project-metadata/' + techSpec.projectMetadataId">
          </q-btn>
          <q-btn icon="fas fa-save" label="Save"
            @click="submit">
          </q-btn>
        </div>
      </div>
    </div>

    <div v-if="loading">Loading...</div>

    <q-page padding class="docs-input row justify-center">
      <div style="width: 900px; max-width: 90vw;">
        <q-card inline style="width:100%">
          <q-card-title> Survey Requirements </q-card-title>
          <q-card-main dense>

            <q-field
              label="Survey type" :label-width="2" inset="full"
              :error="$v.techSpec.surveyType.$error"
              error-label="Survey type is required"
            >
              <q-option-group
                type="radio" inline
                :value="techSpec.surveyType"
                @change="UPDATE({path:'techSpec.surveyType', value: $event})"
                :options="surveyTypeOptions"
                @blur="$v.techSpec.surveyType.$touch"
              />
            </q-field>

            <q-field v-if="techSpec.surveyType == 'Monitoring'"
                     :label-width="2"
                     inset="full"
                     label="Frequency of surveys">
              <q-input :value="techSpec.surveyFrequency"
                       @input="UPDATE({path:'techSpec.surveyFrequency', value: $event})"
                       type="text" />
            </q-field>

            <q-field v-if="techSpec.surveyType == 'Monitoring'"
                     :label-width="2"
                     inset="full"
                     label="Requirements">
              <q-input :value="techSpec.requirements"
                       @input="UPDATE({path:'techSpec.requirements', value: $event})"
                       type="text" />
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Survey classification">
              <q-select filter
                        autofocus-filter
                        :value="techSpec.surveyClassification"
                        @change="UPDATE({path:'techSpec.surveyClassification', value: $event})"
                        :options="surveyClassificationOptions"/>
            </q-field>




            <q-field :label-width="2"
                     inset="full"
                     label="Features of interest"
                     :error="$v.techSpec.featuresOfInterest.$error"
                     error-label="Features of interest is required">
              <q-input :value="techSpec.featuresOfInterest"
                       @input="UPDATE({path:'techSpec.featuresOfInterest', value: $event})"
                       type="text"
                       @blur="$v.techSpec.featuresOfInterest.$touch"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Vessel type">
              <q-input :value="techSpec.vesselType"
                       @input="UPDATE({path:'techSpec.vesselType', value: $event})"
                       type="text" />
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Depth range"
                     :error="$v.techSpec.depthRange.$error"
                     error-label="Depth range is required">
              <q-input :value="techSpec.depthRange"
                       @input="UPDATE({path:'techSpec.depthRange', value: $event})"
                       type="text"
                       @blur="$v.techSpec.depthRange.$touch"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Frequency [range]">
              <q-input :value="techSpec.frequencyRange"
                       @input="UPDATE({path:'techSpec.frequencyRange', value: $event})"
                       type="textarea" />
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Is the data capture time sensitive">
              <q-checkbox :value="techSpec.timeSensitive"
                       @input="UPDATE({path:'techSpec.timeSensitive', value: $event})"
                       />
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Requirements (if data capture is time sensitive)">
              <q-input :value="techSpec.timeSensitiveRequirements"
                       @input="UPDATE({path:'techSpec.timeSensitiveRequirements', value: $event})"
                       type="textarea" />
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Is ground truthing required">
              <q-checkbox :value="techSpec.groundTruthing"
                       @input="UPDATE({path:'techSpec.groundTruthing', value: $event})"
                       />
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Ground truthing method">
              <q-select filter
                        autofocus-filter
                        :value="techSpec.groundTruthingMethod"
                        @change="UPDATE({path:'techSpec.groundTruthingMethod', value: $event})"
                        :options="groundTruthingMethodOptions"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Requirements for ground truthing">
              <q-input :value="techSpec.groundTruthingRequirements"
                       @input="UPDATE({path:'techSpec.groundTruthingRequirements', value: $event})"
                       type="textarea" />
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Mapping converage requirements">
              <q-input :value="techSpec.mappingCoverageRequirements"
                       @input="UPDATE({path:'techSpec.mappingCoverageRequirements', value: $event})"
                       type="textarea" />
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Initial survey lines">
              <div ref="mapDiv" id="mapDiv" style="height:350px;"></div>
              <div class="row full-width justify-end">
                <q-btn icon="fas fa-check" label="Clear"
                  :disable="!techSpec.surveyLines"
                  @click="SET_SURVEY_LINES( undefined )">
                </q-btn>
              </div>

            </q-field>
            <!-- Map goes here -->
            <!-- <div ref="mapDiv" id="mapDiv" style="height:350px;"></div> -->

            <q-field :label-width="2"
                     inset="full"
                     label="Environmental conditions"
                     :error="$v.techSpec.environmentalConditions.$error"
                     error-label="Environmental conditions is required"
                     >
              <q-input :value="techSpec.environmentalConditions"
                       @input="UPDATE({path:'techSpec.environmentalConditions', value: $event})"
                       type="textarea"
                       @blur="$v.techSpec.environmentalConditions.$touch"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Positioning requirement"
                     :error="$v.techSpec.positioningRequirement.$error"
                     error-label="Positioning requirement is required"
                     >
              <q-select :value="techSpec.positioningRequirement"
                        @change="UPDATE({path:'techSpec.positioningRequirement', value: $event})"
                        :options="positioningRequirementsOptions"
                        @blur="$v.techSpec.positioningRequirement.$touch"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Positioning requirement - other">
              <q-input :value="techSpec.positioningRequirementOther"
                       @input="UPDATE({path:'techSpec.positioningRequirementOther', value: $event})"
                       type="text" />
            </q-field>

          </q-card-main>
        </q-card>



      </div>
    </q-page>


  </div>
</template>
<script>
import './docs-input.styl'
import Vue from 'vue'
import { filter } from 'quasar'
import { mapGetters, mapMutations } from 'vuex'
const _ = require('lodash');
import { errorHandler } from './../mixins/error-handling'
import * as types from '../../store/modules/tech-spec/tech-spec-mutation-types'
const uuidv4 = require('uuid/v4');

const timespan = require('readable-timespan');
timespan.set({
  lessThanFirst: 'now',
  millisecond: false
});

import axios from 'axios';
const path = require('path');

import { required, email, minLength } from 'vuelidate/lib/validators';
import { RequestStatus }
  from '../../store/modules/tech-spec/tech-spec-state'
import surveyLinesMap from './../olmap/survey-lines-map';

export default Vue.extend({
  mixins: [errorHandler],
  beforeMount() {
    this.getFormData();
  },

  mounted() {
    var slmap = surveyLinesMap(this.$refs.mapDiv, {
      basemap: "osm"
    })
    slmap.initMap();
    this.map = slmap;
    this.map.onAdd = (geojson) => {
      console.log(geojson);
      this.SET_SURVEY_LINES( geojson );
    }

    this.fetchData();

  },

  methods: {
    ...mapMutations('techSpec', [
      types.UPDATE,
      types.SET_SURVEY_LINES,
    ]),

    fetchData () {
      const id = this.$route.params.id;
      this.$store.dispatch(
        'projectMetadata/getProjectMetadata', { id: id })
      this.UPDATE({path:'techSpec.id', value:id});
      this.$store.dispatch('techSpec/getTechSpec', { id: id }).then(no => {
        if (this.requestStatus == RequestStatus.SUCCESS) {
          // then all good, tech spec existed and it is loaded
        } else if (this.requestStatus == RequestStatus.ERROR) {
          const status = this.requestError.response.status;
          if (status == 404) {
            // this is also ok, as it just means the tech spec hasn't been
            // created for this project id yet
          } else {
            this.notifyError(
              `Failed to retrive technical specification (${status})`);
          }
        }
      });

    },

    submit() {
      this.$v.$touch()

      if (this.$v.$error) {
        this.$q.notify('Please review fields')
        return
      }

      this.$store.dispatch('techSpec/saveTechSpec').then(pmd => {
        if (this.requestStatus == RequestStatus.SUCCESS) {
          this.notifySuccess('Saved survey technical specifications');
        } else if (this.requestStatus == RequestStatus.ERROR) {
          const status = this.requestError.response.status;
          this.notifyError(
            `Failed to save technical specification (${status})`);
        }
      });
    },


    getFormData() {
      this.$store.dispatch('techSpec/getValidSurveyTypes');
      this.$store.dispatch('techSpec/getValidSurveyClassifications');
      this.$store.dispatch('techSpec/getValidGroundTruthingMethods');
      this.$store.dispatch('techSpec/getValidPositioningRequirements');
    },



  },

  computed: {
    ...mapGetters('techSpec',[
      'techSpec',
      'requestStatus',
      'requestError',
      'validSurveyTypes',
      'validSurveyClassifications',
      'validGroundTruthingMethods',
      'validPositioningRequirements',
    ]),
    ...mapGetters('projectMetadata',[
      'projectMetadata',
    ]),
    surveyTypeOptions: function () {
      const opts = this.validSurveyTypes.map(oo => {
        return {label: oo, value: oo};
      });
      return opts;
    },
    surveyClassificationOptions: function () {
      const opts = this.validSurveyClassifications.map(oo => {
        return {label: oo, value: oo};
      });
      opts.unshift({label: 'None', value: undefined});
      return opts;
    },
    groundTruthingMethodOptions: function () {
      const opts = this.validGroundTruthingMethods.map(oo => {
        return {label: oo, value: oo};
      });
      return opts;
    },
    positioningRequirementsOptions: function () {
      const opts = this.validPositioningRequirements.map(oo => {
        return {label: oo, value: oo};
      });
      return opts;
    },
  },

  validations: {
    techSpec: {
      surveyType: { required },
      featuresOfInterest: { required },
      depthRange: { required },
      environmentalConditions: { required },
      positioningRequirement: { required },
    }
  },

  watch: {
    // call again the method if the route changes
    '$route': function (newRoute, oldRoute) {
      if (this.id == newRoute.params.id) {
        // then we've only set the url, no need to fetch new data
      } else {
        this.fetchData();
      }
    },
    requestStatus(newRequestStatus, oldRequestStatus) {
      if ((oldRequestStatus == RequestStatus.NOT_REQUESTED ||
           oldRequestStatus == RequestStatus.SUCCESS ||
           oldRequestStatus == RequestStatus.ERROR) &&
           newRequestStatus == RequestStatus.REQUESTED)
      {
        this.loading = true;
      } else {
        this.loading = false;
      }
    },
    'techSpec.surveyLines': function (newSurveyLines, oldSurveyLines) {
      this.map.clear();
      if (newSurveyLines) {
        this.map.addGeojsonFeature(newSurveyLines);
        this.map.fit();
      }
    },
    'projectMetadata.areaOfInterest': function (newAoi, oldAoi) {
      if (newAoi) {
        this.map.setGeojsonFeatureIntersecting(newAoi);
        this.map.fit();
      }
    }


  },

  data() {
    return {
      orgSearchTerms: '',
      loading: false,
      map:undefined,
    }
  }
});

</script>
