<template>

  <div class="row justify-center">
    <div v-if="loading">Loading...</div>

    <q-page padding class="docs-input row justify-center">
      <q-page-sticky
        position="bottom-right"
        :offset="[18, 18]"
        style="z-index:100">

        <q-btn
          round
          color="primary"
          @click="submit"
          icon="fas fa-save"
        />
      </q-page-sticky>

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

            <div v-if="techSpec.surveyType == 'Monitoring'">
              <q-field
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
            </div>

            <q-field :label-width="2"
                     inset="full"
                     label="Survey classification">
              <q-select filter
                        autofocus-filter
                        :value="techSpec.surveyClassification"
                        @change="UPDATE({path:'techSpec.surveyClassification', value: $event})"
                        :options="surveyClassificationOptions"/>
            </q-field>

          </q-card-main>
          <q-card-separator />
          <q-card-main dense>

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

          </q-card-main>
          <q-card-separator />
          <q-card-main dense>

            <q-field :label-width="2"
                     inset="full"
                     label="Is the data capture time sensitive">
              <q-checkbox :value="techSpec.timeSensitive"
                       @input="UPDATE({path:'techSpec.timeSensitive', value: $event})"
                       />
            </q-field>

            <q-field v-if="techSpec.timeSensitive"
                     :label-width="2"
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

            <div class="overflow-hidden" v-if="techSpec.groundTruthing">
              <div class="row gutter-x-xs">
                <div class="col-8">
                  <q-field :label-width="3"
                           inset="full"
                           label="Ground truthing method">
                    <q-select :value="techSpec.groundTruthingMethod"
                              @change="UPDATE({path:'techSpec.groundTruthingMethod', value: $event})"
                              :options="groundTruthingMethodOptions"/>
                  </q-field>
                </div>

                <div class="col-4">
                  <q-field v-if="techSpec.groundTruthingMethod ? techSpec.groundTruthingMethod.toLowerCase() == 'other' : false"
                           :label-width="1"
                           class="auto"
                           helper="Provide other ground truthing method"
                           >
                    <q-input :value="techSpec.groundTruthingMethodOther"
                             @input="UPDATE({path:'techSpec.groundTruthingMethodOther', value: $event})"
                             type="text" />
                  </q-field>
                </div>
              </div>
            </div>

            <q-field v-if="techSpec.groundTruthing"
                     :label-width="2"
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

          </q-card-main>
          <q-card-separator />
          <q-card-main dense>

            <!-- MAP -->
            <q-field :label-width="2"
                     inset="full"
                     label="Initial survey lines">
              <div ref="mapDivSurveyLines" id="mapDivSurveyLines" style="height:350px;"></div>
              <div class="row full-width justify-between items-center">
                <div v-if="drawingSurveyLine"
                  class="q-body-1 text-faded col">
                  Click endpoint to complete line
                </div>
                <div v-else
                  class="q-body-1 text-faded col">
                  Drag and drop shapefile (zip) or geojson onto map, or click the draw line button in map to manually create survey lines.
                </div>
                <div class="row col-auto">
                  <q-btn icon="cloud_upload" label="Upload"
                    @click="selectSurveyLinesFile">
                  </q-btn>
                  <input type="file" id="dataPath" v-on:change="setSurveyLinesFile" ref="fileInput" hidden />
                  <q-btn icon="clear" label="Clear"
                    :disable="!techSpec.surveyLines"
                    @click="SET_SURVEY_LINES( undefined )">
                  </q-btn>
                </div>

              </div>
            </q-field>

          </q-card-main>
          <q-card-separator />
          <q-card-main dense>

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


            <div class="overflow-hidden">
              <div class="row gutter-x-xs">
                <div class="col-8">
                  <q-field :label-width="3"
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
                </div>

                <div class="col-4">
                  <q-field v-if="techSpec.positioningRequirement ? techSpec.positioningRequirement.toLowerCase() == 'other' : false"
                           :label-width="1"
                           class="auto"

                           helper="Please provide other positioning requirement"
                           >
                    <q-input :value="techSpec.positioningRequirementOther"
                             @input="UPDATE({path:'techSpec.positioningRequirementOther', value: $event})"
                             type="text" />
                  </q-field>
                </div>


              </div>

            </div>


          </q-card-main>
        </q-card>

        <q-card inline class="full-width">
          <q-card-title> Survey technical requirements </q-card-title>
          <q-card-main dense>

            <q-field :label-width="2"
                     inset="full"
                     label="Overlap"
                     :error="$v.techSpec.overlap.$error"
                     error-label="Overlap is required"
                     >
              <q-input :value="techSpec.overlap"
                       @input="UPDATE({path:'techSpec.overlap', value: $event})"
                       type="text"
                       @blur="$v.techSpec.overlap.$touch"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Grid size">
              <q-input :value="techSpec.gridSize"
                       @input="UPDATE({path:'techSpec.gridSize', value: $event})"
                       type="text" />
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Swath width"
                     :error="$v.techSpec.swathWidth.$error"
                     error-label="Swath width is required"
                     >
              <q-input :value="techSpec.swathWidth"
                       @input="UPDATE({path:'techSpec.swathWidth', value: $event})"
                       type="text"
                       @blur="$v.techSpec.swathWidth.$touch"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Line spacing">
              <q-input :value="techSpec.lineSpacing"
                       @input="UPDATE({path:'techSpec.lineSpacing', value: $event})"
                       type="text" />
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Max survey speed">
              <q-input :value="techSpec.maxSurveySpeed"
                       @input="UPDATE({path:'techSpec.maxSurveySpeed', value: $event})"
                       type="text" />
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Sounding density">
              <q-input :value="techSpec.soundingDensity"
                       @input="UPDATE({path:'techSpec.soundingDensity', value: $event})"
                       type="text" />
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Resolution"
                     :error="$v.techSpec.resolution.$error"
                     error-label="Resolution is required"
                     >
              <q-input :value="techSpec.resolution"
                       @input="UPDATE({path:'techSpec.resolution', value: $event})"
                       type="text"
                       @blur="$v.techSpec.resolution.$touch"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Horizontal Accuracy (@95% confidence)"
                     :error="$v.techSpec.horizontalAccuracy.$error"
                     error-label="Horizontal Accuracy is required"
                     >
              <q-input :value="techSpec.horizontalAccuracy"
                       @input="UPDATE({path:'techSpec.horizontalAccuracy', value: $event})"
                       type="text"
                       @blur="$v.techSpec.horizontalAccuracy.$touch"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Vertical Accuracy (@95% confidence)"
                     :error="$v.techSpec.verticalAccuracy.$error"
                     error-label="Vertical Accuracy is required"
                     >
              <q-input :value="techSpec.verticalAccuracy"
                       @input="UPDATE({path:'techSpec.verticalAccuracy', value: $event})"
                       type="text"
                       @blur="$v.techSpec.verticalAccuracy.$touch"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Horizontal reference system"
                     :error="$v.techSpec.horizontalReferenceSystem.$error"
                     error-label="Horizontal reference system is required"
                     >
              <q-select :value="techSpec.horizontalReferenceSystem"
                        @change="UPDATE({path:'techSpec.horizontalReferenceSystem', value: $event})"
                        :options="horizontalReferenceSystems"
                        @blur="$v.techSpec.horizontalReferenceSystem.$touch"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Vertical reference system"
                     :error="$v.techSpec.verticalReferenceSystem.$error"
                     error-label="Vertical reference system is required"
                     >
              <q-select :value="techSpec.verticalReferenceSystem"
                        @change="UPDATE({path:'techSpec.verticalReferenceSystem', value: $event})"
                        :options="verticalReferenceSystems"
                        @blur="$v.techSpec.verticalReferenceSystem.$touch"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Sounding datumn"
                     :error="$v.techSpec.soundingDatum.$error"
                     error-label="Souding datumn is required"
                     >
              <q-select :value="techSpec.soundingDatum"
                        @change="UPDATE({path:'techSpec.soundingDatum', value: $event})"
                        :options="soundingDatums"
                        @blur="$v.techSpec.soundingDatum.$touch"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Spheroid"
                     :error="$v.techSpec.spheroid.$error"
                     error-label="Spheroid is required"
                     >
              <q-select :value="techSpec.spheroid"
                        @change="UPDATE({path:'techSpec.spheroid', value: $event})"
                        :options="spheroids"
                        @blur="$v.techSpec.spheroid.$touch"/>
            </q-field>
          </q-card-main>
        </q-card>

        <q-card inline class="full-width">
          <q-card-title> Delivery requirements </q-card-title>
          <q-card-main dense>

            <q-field :label-width="2"
                     inset="full"
                     label="Delivery method"
                     :error="$v.techSpec.deliveryMethods.$error"
                     error-label="Delivery method is required"
                     >
             <q-option-group
               type="checkbox"
               :value="techSpec.deliveryMethods"
               :options="deliveryMethodOptions"
               @change="UPDATE({path:'techSpec.deliveryMethods', value: $event})"
               @blur="$v.techSpec.deliveryMethods.$touch"
             />
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Delivery requirements"
                     :error="$v.techSpec.deliveryRequirements.$error"
                     error-label="Delivery requirements is required"
                     >
              <q-input :value="techSpec.deliveryRequirements"
                       @input="UPDATE({path:'techSpec.deliveryRequirements', value: $event})"
                       type="textarea"
                       @blur="$v.techSpec.deliveryRequirements.$touch"/>
            </q-field>

          </q-card-main>
        </q-card>

        <q-card inline class="full-width">
          <q-card-title> Reporting </q-card-title>
          <q-card-main dense>

            <q-field :label-width="2"
                     inset="full"
                     label="Progress report requirements">
              <q-input :value="techSpec.progressReportRequirements"
                       @input="UPDATE({path:'techSpec.progressReportRequirements', value: $event})"
                       type="textarea" />
            </q-field>

          </q-card-main>
        </q-card>


        <q-card inline class="full-width">
          <q-card-title> Other requirements </q-card-title>
          <q-card-main dense>

            <q-field :label-width="2"
                     inset="full"
                     label="Tidal gauges to be installed">
              <q-checkbox :value="techSpec.tidalGauges"
                       @input="UPDATE({path:'techSpec.tidalGauges', value: $event})"
                       />
            </q-field>


            <!-- MAP -->
            <q-field :label-width="2"
                     inset="full"
                     label="Location of gauges">
              <div ref="mapDivTidalGauge" id="mapDivTidalGauge" style="height:350px;"></div>
              <div class="row full-width justify-between items-center">
                <div
                  class="q-body-1 text-faded col">
                  Drag and drop shapefile (zip) or geojson onto map, or click the draw point button in map to manually create tidal gauge locations.
                </div>
                <div class="row col-auto">
                  <q-btn icon="cloud_upload" label="Upload"
                    @click="selectTidalGaugeFile">
                  </q-btn>
                  <input type="file" id="dataPath" v-on:change="setTidalGaugeFile" ref="fileInputTg" hidden />
                  <q-btn icon="clear" label="Clear"
                    :disable="!techSpec.tidalGaugeLocations"
                    @click="SET_TIDAL_GAUGE_LOCATIONS( undefined )">
                  </q-btn>
                </div>

              </div>
            </q-field>

            <q-field :label-width="3"
                     inset="full"
                     label="Tidal infrastructure requirements">
              <q-input :value="techSpec.tidalInfrastructureRequirements"
                       @input="UPDATE({path:'techSpec.tidalInfrastructureRequirements', value: $event})"
                       type="textarea" />
            </q-field>

            <q-field :label-width="3"
                     inset="full"
                     label="Requirements for approvals or permits needed">
              <q-input :value="techSpec.approvalPermitRequirements"
                       @input="UPDATE({path:'techSpec.approvalPermitRequirements', value: $event})"
                       type="textarea" />
            </q-field>

            <q-field :label-width="3"
                     inset="full"
                     label="Requirements for object detection (if any)">
              <q-input :value="techSpec.objectDetectionRequirements"
                       @input="UPDATE({path:'techSpec.objectDetectionRequirements', value: $event})"
                       type="textarea" />
            </q-field>

            <q-field :label-width="3"
                     inset="full"
                     label="Requirements for Positioning">
              <q-input :value="techSpec.positioningRequirements"
                       @input="UPDATE({path:'techSpec.positioningRequirements', value: $event})"
                       type="textarea" />
            </q-field>

            <q-field :label-width="3"
                     inset="full"
                     label="Requirements for data gaps">
              <q-input :value="techSpec.dataGapRequirements"
                       @input="UPDATE({path:'techSpec.dataGapRequirements', value: $event})"
                       type="textarea" />
            </q-field>

            <q-field :label-width="3"
                     inset="full"
                     label="Information on any existing risks to the data collection">
              <q-input :value="techSpec.existingRisks"
                       @input="UPDATE({path:'techSpec.existingRisks', value: $event})"
                       type="textarea" />
            </q-field>

            <q-field :label-width="3"
                     inset="full"
                     label="Additional requirements">
              <q-input :value="techSpec.additionalRequirements"
                       @input="UPDATE({path:'techSpec.additionalRequirements', value: $event})"
                       type="textarea" />
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
  from '../../store/modules/request-status'
import surveyLinesMap from './../olmap/survey-lines-map';
import tidalGaugeMap from './../olmap/tidal-gauge-map';

export default Vue.extend({
  mixins: [errorHandler],
  beforeMount() {
    this.getFormData();
  },

  mounted() {
    var slmap = surveyLinesMap(this.$refs.mapDivSurveyLines, {
      basemap: "osm"
    })
    slmap.initMap();
    this.mapSurveyLines = slmap;
    this.mapSurveyLines.onAdd = (geojson) => {
      this.SET_SURVEY_LINES( geojson );
    }
    this.mapSurveyLines.drawStart = () => {
      this.drawingSurveyLine = true;
    }
    this.mapSurveyLines.drawEnd = () => {
      this.drawingSurveyLine = false;
    }

    var tgmap = tidalGaugeMap(this.$refs.mapDivTidalGauge, {
      basemap: "osm"
    })
    tgmap.initMap();
    this.mapTidalGauge = tgmap;
    this.mapTidalGauge.onAdd = (geojson) => {
      this.SET_TIDAL_GAUGE_LOCATIONS( geojson );
    }

    this.fetchData();
  },

  methods: {
    ...mapMutations('techSpec', [
      types.UPDATE,
      types.RESET_TECH_SPEC,
      types.SET_SURVEY_LINES,
      types.SET_TIDAL_GAUGE_LOCATIONS,
    ]),

    fetchData () {
      const id = this.$route.params.id;
      this.$store.dispatch(
        'projectMetadata/getProjectMetadata', { id: id })
      this.$store.dispatch('techSpec/getTechSpec', { id: id }).then(no => {
        if (this.requestStatus == RequestStatus.SUCCESS) {
          // then all good, tech spec existed and it is loaded
        } else if (this.requestStatus == RequestStatus.ERROR) {
          this.RESET_TECH_SPEC();
          this.UPDATE({path:'techSpec.id', value:id});
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
      this.$store.dispatch('techSpec/getValidDeliveryMethods');
      this.$store.dispatch('techSpec/getHorizontalReferenceSystems');
      this.$store.dispatch('techSpec/getVerticalReferenceSystems');
      this.$store.dispatch('techSpec/getSoundingDatums');
      this.$store.dispatch('techSpec/getSpheroids');
    },

    selectSurveyLinesFile () {
      this.$refs.fileInput.click();
    },
    setSurveyLinesFile (event) {
      console.log(event);
      this.mapSurveyLines.addFile(event.target.files[0]);
    },
    selectTidalGaugeFile () {
      this.$refs.fileInputTg.click();
    },
    setTidalGaugeFile (event) {
      console.log(event);
      this.mapTidalGauge.addFile(event.target.files[0]);
    },

    hasScrolled (scroll) {
      this.showFloatingButtons = scroll.position > 30;
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
      'validDeliveryMethods',
      'horizontalReferenceSystems',
      'verticalReferenceSystems',
      'soundingDatums',
      'spheroids',
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
    deliveryMethodOptions: function () {
      const opts = this.validDeliveryMethods.map(oo => {
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

      overlap: { required },
      swathWidth: { required },
      resolution: { required },
      horizontalAccuracy: { required },
      verticalAccuracy: { required },
      horizontalReferenceSystem: { required },
      verticalReferenceSystem: { required },
      soundingDatum: { required },
      spheroid: { required },
      deliveryMethods: { required },
      deliveryRequirements: { required },

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
      this.mapSurveyLines.clear();
      if (newSurveyLines) {
        this.mapSurveyLines.addGeojsonFeature(newSurveyLines);
        this.mapSurveyLines.fit();
      }
    },
    'techSpec.tidalGaugeLocations': function (newTidalGaugeLocations, oldTidalGaugeLocations) {
      this.mapTidalGauge.clear();
      if (newTidalGaugeLocations) {
        this.mapTidalGauge.addGeojsonFeature(newTidalGaugeLocations);
        this.mapTidalGauge.fit();
      }
    },
    'projectMetadata.areaOfInterest': function (newAoi, oldAoi) {
      if (newAoi) {
        this.mapSurveyLines.setGeojsonFeatureIntersecting(newAoi);
        this.mapSurveyLines.fit();

        this.mapTidalGauge.setGeojsonFeatureIntersecting(newAoi);
        this.mapTidalGauge.fit();
      }
    }


  },

  data() {
    return {
      orgSearchTerms: '',
      loading: false,
      mapSurveyLines:undefined,
      mapTidalGauge:undefined,
      surveyLinesFile: undefined,
      drawingSurveyLine: false,
      showFloatingButtons: false,
    }
  }
});

</script>
