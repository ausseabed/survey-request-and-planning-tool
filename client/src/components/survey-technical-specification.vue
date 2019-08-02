<template>

  <form-wrapper
    :validator="$v"
    class="row justify-center full-height scroll"
  >
    <div v-if="loading">Loading...</div>

    <q-page padding class="docs-input row justify-center">
      <q-page-sticky
        v-if="!readOnly"
        position="top-right"
        :offset="[18, 18+66]"
        style="z-index:100">

        <q-btn
          round
          color="primary"
          @click="clear"
          icon="clear"
          class="q-ml-sm"
        >
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 4]"> Clear specifications </q-tooltip>
        </q-btn>

        <q-btn
          round
          color="primary"
          @click="applyDefaults"
          icon="input"
          class="q-ml-sm"
        >
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 4]"> Apply defaults </q-tooltip>
        </q-btn>

        <q-btn
          round
          color="primary"
          @click="submit"
          icon="save"
          class="q-ml-sm"
        >
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 4]">Save specifications</q-tooltip>
        </q-btn>
      </q-page-sticky>

      <div style="width: 900px; max-width: 90vw;" class="column q-gutter-md no-wrap">
        <q-card inline class="full-width">
          <q-card-section>
            <div class="text-h6"> Survey Requirements </div>
          </q-card-section>

          <q-card-section>

            <q-field
              stack-label
              label="Survey type"
              :error="$v.techSpec.surveyType.$error"
              error-message="Survey type is required"
              bottom-slots
              :readonly="readOnly"
            >
              <q-option-group
                type="radio" inline
                :value="techSpec.surveyType"
                @input="UPDATE({path:'techSpec.surveyType', value: $event})"
                :options="surveyTypeOptions"
                @blur="$v.techSpec.surveyType.$touch"
              />
            </q-field>

            <div v-if="techSpec.surveyType == 'Monitoring'">
              <q-input
                label="Frequency of surveys"
                :value="techSpec.surveyFrequency"
                @input="UPDATE({path:'techSpec.surveyFrequency', value: $event})"
                type="text"
                :readonly="readOnly"
                >
              </q-input>

              <q-input
                v-if="techSpec.surveyType == 'Monitoring'"
                label="Requirements"
                :value="techSpec.requirements"
                @input="UPDATE({path:'techSpec.requirements', value: $event})"
                type="text"
                :readonly="readOnly"
                >
              </q-input>
            </div>

            <q-select
              label="Survey classification"
              hint="Optional"
              :value="techSpec.surveyClassification"
              @input="UPDATE({path:'techSpec.surveyClassification', value: $event})"
              :options="surveyClassificationOptions"
              emit-value
              map-options
              option-value="value"
              option-label="label"
              :readonly="readOnly"
              >
            </q-select>

          </q-card-section>
          <q-separator />
          <q-card-section>

            <q-input
              label="Features of interest"
              :error="$v.techSpec.featuresOfInterest.$error"
              error-message="Features of interest is required"
              bottom-slots
              :value="techSpec.featuresOfInterest"
              @input="UPDATE({path:'techSpec.featuresOfInterest', value: $event})"
              type="text"
              @blur="$v.techSpec.featuresOfInterest.$touch"
              :readonly="readOnly"
              >
            </q-input>

            <q-input
              label="Vessel type"
              hint="Optional"
              :value="techSpec.vesselType"
              @input="UPDATE({path:'techSpec.vesselType', value: $event})"
              type="text"
              :readonly="readOnly"
              >
            </q-input>

            <q-input
              label="Depth range"
              :error="$v.techSpec.depthRange.$error"
              error-message="Depth range is required"
              bottom-slots
              :value="techSpec.depthRange"
              @input="UPDATE({path:'techSpec.depthRange', value: $event})"
              type="text"
              @blur="$v.techSpec.depthRange.$touch"
              :readonly="readOnly"
              >
            </q-input>

            <q-input
              label="Frequency [range]"
              hint="Optional"
              :value="techSpec.frequencyRange"
              @input="UPDATE({path:'techSpec.frequencyRange', value: $event})"
              type="textarea"
              autogrow
              :readonly="readOnly"
              >
            </q-input>

          </q-card-section>
          <q-separator />
          <q-card-section>

            <q-field
              stack-label
              label="Is the data capture time sensitive"
              hint="Optional"
              :readonly="readOnly"
              >
              <q-checkbox
                :value="techSpec.timeSensitive"
                @input="UPDATE({path:'techSpec.timeSensitive', value: $event})"
                />
            </q-field>

            <q-input
              v-if="techSpec.timeSensitive"
              label="Requirements (if data capture is time sensitive)"
              hint="Optional"
              :value="techSpec.timeSensitiveRequirements"
              @input="UPDATE({path:'techSpec.timeSensitiveRequirements', value: $event})"
              type="textarea"
              autogrow
              :readonly="readOnly"
              >
            </q-input>

            <q-field
              label="Is ground truthing required"
              stack-label
              :error="$v.techSpec.groundTruthing.$error"
              error-message="Ground truthing is required"
              bottom-slots
              hint="Optional"
              :readonly="readOnly"
              >
              <q-checkbox
                :value="techSpec.groundTruthing"
                @input="UPDATE({path:'techSpec.groundTruthing', value: $event})"
                @blur="$v.techSpec.groundTruthing.$touch"
                />
            </q-field>

            <div class="overflow-hidden" v-if="techSpec.groundTruthing">
              <div class="row q-gutter-x-sm">
                <div class="col-8">
                  <q-select
                    label="Ground truthing method"
                    multiple
                    :value="techSpec.groundTruthingMethod"
                    @input="UPDATE({path:'techSpec.groundTruthingMethod', value: $event})"
                    :options="validGroundTruthingMethods"
                    :readonly="readOnly"
                    >
                  </q-select>
                </div>

                <div class="col">
                  <q-input
                    v-if="techSpec.groundTruthingMethod ? techSpec.groundTruthingMethod.includes('Other') : false"
                    :label-width="1"
                    hint="Provide other ground truthing method"
                    :value="techSpec.groundTruthingMethodOther"
                    @input="UPDATE({path:'techSpec.groundTruthingMethodOther', value: $event})"
                    type="text"
                    :readonly="readOnly"
                    >
                  </q-input>
                </div>
              </div>
            </div>

            <q-input
              v-if="techSpec.groundTruthing"
              label="Requirements for ground truthing"
              :value="techSpec.groundTruthingRequirements"
              @input="UPDATE({path:'techSpec.groundTruthingRequirements', value: $event})"
              type="textarea"
              autogrow
              :readonly="readOnly"
              >
            </q-input>

            <q-input
              label="Mapping coverage requirements"
              hint="Optional"
              :value="techSpec.mappingCoverageRequirements"
              @input="UPDATE({path:'techSpec.mappingCoverageRequirements', value: $event})"
              type="textarea"
              autogrow
              :readonly="readOnly"
              >
            </q-input>

          </q-card-section>
          <q-separator />
          <q-card-section>

            <!-- MAP -->
            <q-field
              label="Initial survey lines (optional)"
              stack-label
              >
              <div class="column">
                <div ref="mapDivSurveyLines" id="mapDivSurveyLines" style="height:350px;"></div>
                <div class="row full-width justify-between items-center q-pb-sm">
                  <div v-if="drawingSurveyLine"
                    class="q-body-1 text-faded col">
                    Click endpoint to complete line
                  </div>
                  <div v-else
                    class="q-body-1 text-faded col">
                    Drag and drop shapefile (zip) or geojson onto map, or click the draw line button in map to manually create survey lines.
                  </div>
                  <div class="map-buttons q-gutter-sm col">
                    <div class="row justify-between q-gutter-sm">
                      <div class="col">
                        <q-btn class="no-margin full-width" icon="cloud_upload" label="Upload"
                          @click="selectSurveyLinesFile">
                        </q-btn>
                      </div>
                      <div class="col">
                        <input type="file" id="dataPath" v-on:change="setSurveyLinesFile" ref="fileInput" hidden />
                        <q-btn class="no-margin full-width" icon="clear" label="Clear"
                          :disable="!techSpec.surveyLines"
                          @click="SET_SURVEY_LINES( undefined )">
                        </q-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-field>

          </q-card-section>
          <q-separator />
          <q-card-section>

            <q-input
              label="Environmental conditions"
              :error="$v.techSpec.environmentalConditions.$error"
              error-message="Environmental conditions is required"
              bottom-slots
              :value="techSpec.environmentalConditions"
              @input="UPDATE({path:'techSpec.environmentalConditions', value: $event})"
              type="textarea"
              autogrow
              @blur="$v.techSpec.environmentalConditions.$touch"
              :readonly="readOnly"
              >
            </q-input>


            <div class="overflow-hidden">
              <div class="row q-gutter-x-sm">
                <div class="col-8">
                  <form-field-validated-select-multiple-check
                    class="col-12"
                    multiple
                    name="techSpec.positioningRequirement"
                    attribute="Positioning requirement"
                    label="Positioning requirement"
                    :value="techSpec.positioningRequirement"
                    @input="UPDATE({path:'techSpec.positioningRequirement', value: $event})"
                    :options="validPositioningRequirements"
                    option-label="name"
                    option-value="id"
                    @blur="$v.techSpec.positioningRequirement.$touch"
                    clearable
                    :readonly="readOnly"
                    >
                  </form-field-validated-select-multiple-check>

                </div>

                <div class="col">
                  <q-input
                    v-if="techSpec.positioningRequirement ? techSpec.positioningRequirement.includes('Other') : false"
                    hint="Please provide other positioning requirement"
                    :value="techSpec.positioningRequirementOther"
                    @input="UPDATE({path:'techSpec.positioningRequirementOther', value: $event})"
                    type="text"
                    :readonly="readOnly"
                    >
                  </q-input>
                </div>
              </div>
            </div>

          </q-card-section>
        </q-card>

        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> Survey technical requirements </div>
          </q-card-section>
          <q-card-section>

            <q-input
              label="Overlap"
              :error="$v.techSpec.overlap.$error"
              error-message="Overlap is required"
              bottom-slots
              :value="techSpec.overlap"
              @input="UPDATE({path:'techSpec.overlap', value: $event})"
              type="text"
              @blur="$v.techSpec.overlap.$touch"
              :readonly="readOnly"
              >
            </q-input>

            <q-input
              label="Grid size"
              hint="Optional"
              :value="techSpec.gridSize"
              @input="UPDATE({path:'techSpec.gridSize', value: $event})"
              type="text"
              :readonly="readOnly"
              >
            </q-input>

            <q-input
              label="Swath width"
              :error="$v.techSpec.swathWidth.$error"
              error-message="Swath width is required"
              bottom-slots
              :value="techSpec.swathWidth"
              @input="UPDATE({path:'techSpec.swathWidth', value: $event})"
              type="text"
              @blur="$v.techSpec.swathWidth.$touch"
              :readonly="readOnly"
              >
            </q-input>

            <q-input
              label="Line spacing"
              hint="Optional"
              :value="techSpec.lineSpacing"
              @input="UPDATE({path:'techSpec.lineSpacing', value: $event})"
              type="text"
              :readonly="readOnly"
              >
            </q-input>

            <q-input
              label="Max survey speed"
              hint="Optional"
              :value="techSpec.maxSurveySpeed"
              @input="UPDATE({path:'techSpec.maxSurveySpeed', value: $event})"
              type="text"
              :readonly="readOnly"
              >
            </q-input>

            <q-input
              label="Sounding density"
              hint="Optional"
              :value="techSpec.soundingDensity"
              @input="UPDATE({path:'techSpec.soundingDensity', value: $event})"
              type="text"
              :readonly="readOnly"
              >
            </q-input>

            <q-input
              label="Resolution (m)"
              :error="$v.techSpec.resolution.$error"
              error-message="Resolution is required"
              bottom-slots
              :value="techSpec.resolution"
              @input="UPDATE({path:'techSpec.resolution', value: $event})"
              type="text"
              @blur="$v.techSpec.resolution.$touch"
              :readonly="readOnly"
              >
            </q-input>

            <q-input
              label="Horizontal Accuracy (@95% confidence)"
              :error="$v.techSpec.horizontalAccuracy.$error"
              error-message="Horizontal Accuracy is required"
              bottom-slots
              :value="techSpec.horizontalAccuracy"
              @input="UPDATE({path:'techSpec.horizontalAccuracy', value: $event})"
              type="text"
              placeholder="in metres"
              @blur="$v.techSpec.horizontalAccuracy.$touch"
              :readonly="readOnly"
              >
            </q-input>

            <q-input
              label="Vertical Accuracy (@95% confidence)"
              :error="$v.techSpec.verticalAccuracy.$error"
              error-message="Vertical Accuracy is required"
              bottom-slots
              :value="techSpec.verticalAccuracy"
              @input="UPDATE({path:'techSpec.verticalAccuracy', value: $event})"
              type="text"
              placeholder="in metres"
              @blur="$v.techSpec.verticalAccuracy.$touch"
              :readonly="readOnly"
              >
            </q-input>

            <q-select
              label="Horizontal reference system"
              :error="$v.techSpec.horizontalReferenceSystem.$error"
              error-message="Horizontal reference system is required"
              bottom-slots
              :value="techSpec.horizontalReferenceSystem"
              @input="UPDATE({path:'techSpec.horizontalReferenceSystem', value: $event})"
              :options="horizontalReferenceSystems"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              @blur="$v.techSpec.horizontalReferenceSystem.$touch"
              :readonly="readOnly"
              >
              <template v-slot:option="scope">
                <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                  >
                  <q-item-section>
                    <q-item-label v-html="scope.opt.label" />
                    <q-item-label caption>{{ scope.opt.sublabel }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select
              label="Vertical reference system"
              :error="$v.techSpec.verticalReferenceSystem.$error"
              error-message="Vertical reference system is required"
              bottom-slots
              :value="techSpec.verticalReferenceSystem"
              @input="UPDATE({path:'techSpec.verticalReferenceSystem', value: $event})"
              :options="verticalReferenceSystems"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              @blur="$v.techSpec.verticalReferenceSystem.$touch"
              :readonly="readOnly"
              >
              <template v-slot:option="scope">
                <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                  >
                  <q-item-section>
                    <q-item-label v-html="scope.opt.label" />
                    <q-item-label caption>{{ scope.opt.sublabel }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select
              label="Sounding datum"
              :error="$v.techSpec.soundingDatum.$error"
              error-message="Sounding datum is required"
              bottom-slots
              :value="techSpec.soundingDatum"
              @input="UPDATE({path:'techSpec.soundingDatum', value: $event})"
              :options="soundingDatums"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              @blur="$v.techSpec.soundingDatum.$touch"
              :readonly="readOnly"
              >
              <template v-slot:option="scope">
                <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                  >
                  <q-item-section>
                    <q-item-label v-html="scope.opt.label" />
                    <q-item-label caption>{{ scope.opt.sublabel }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select
              label="Spheroid"
              :error="$v.techSpec.spheroid.$error"
              error-message="Spheroid is required"
              bottom-slots
              :value="techSpec.spheroid"
              @input="UPDATE({path:'techSpec.spheroid', value: $event})"
              :options="spheroids"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              @blur="$v.techSpec.spheroid.$touch"
              :readonly="readOnly"
              >
              <template v-slot:option="scope">
                <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                  >
                  <q-item-section>
                    <q-item-label v-html="scope.opt.label" />
                    <q-item-label caption>{{ scope.opt.sublabel }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
        </q-card>

        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> Delivery requirements </div>
          </q-card-section>
          <q-card-section>

            <q-field
              label="Delivery method"
              stack-label
              :error="$v.techSpec.deliveryMethods.$error"
              error-message="Delivery method is required"
              bottom-slots
              :readonly="readOnly"
              >
              <q-option-group
                type="checkbox"
                :value="techSpec.deliveryMethods"
                :options="deliveryMethodOptions"
                @input="UPDATE({path:'techSpec.deliveryMethods', value: $event})"
                @blur="$v.techSpec.deliveryMethods.$touch"
              />
            </q-field>

            <q-input
              label="Delivery requirements"
              :error="$v.techSpec.deliveryRequirements.$error"
              error-message="Delivery requirements is required"
              bottom-slots
              :value="techSpec.deliveryRequirements"
              @input="UPDATE({path:'techSpec.deliveryRequirements', value: $event})"
              type="textarea"
              autogrow
              @blur="$v.techSpec.deliveryRequirements.$touch"
              :readonly="readOnly"
              >
            </q-input>

          </q-card-section>
        </q-card>

        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> Reporting </div>
          </q-card-section>
          <q-card-section>

            <q-input
              label="Progress report requirements"
              hint="Optional"
              :value="techSpec.progressReportRequirements"
              @input="UPDATE({path:'techSpec.progressReportRequirements', value: $event})"
              type="textarea"
              autogrow
              :readonly="readOnly"
              >
            </q-input>

          </q-card-section>
        </q-card>


        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> Other requirements </div>
          </q-card-section>
          <q-card-section>

            <q-field
              label="Tidal gauges to be installed"
              stack-label
              hint="Optional"
              :readonly="readOnly"
              >
              <q-checkbox
                :value="techSpec.tidalGauges"
                @input="UPDATE({path:'techSpec.tidalGauges', value: $event})"
                />
            </q-field>


            <!-- MAP -->
            <q-field
              label="Location of gauges (optional)"
              stack-label
              :readonly="readOnly"
              >
              <div class="column">
                <div ref="mapDivTidalGauge" id="mapDivTidalGauge" style="height:350px;"></div>
                <div class="row full-width justify-between items-center q-pb-sm">
                  <div
                    class="q-body-1 text-faded col">
                    Drag and drop shapefile (zip) or geojson onto map, or click the draw point button in map to manually create tidal gauge locations.
                  </div>

                  <div class="map-buttons q-gutter-sm col">
                    <div class="row justify-between q-gutter-sm">
                      <div class="col">
                        <q-btn class="no-margin full-width" icon="cloud_upload" label="Upload"
                          @click="selectTidalGaugeFile">
                        </q-btn>
                      </div>
                      <div class="col">
                        <input type="file" id="dataPath" v-on:change="setTidalGaugeFile" ref="fileInputTg" hidden />
                        <q-btn class="no-margin full-width" icon="clear" label="Clear"
                          :disable="!techSpec.tidalGaugeLocations"
                          @click="SET_TIDAL_GAUGE_LOCATIONS( undefined )">
                        </q-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </q-field>

            <q-input
              label="Tidal infrastructure requirements"
              hint="Optional"
              :value="techSpec.tidalInfrastructureRequirements"
              @input="UPDATE({path:'techSpec.tidalInfrastructureRequirements', value: $event})"
              type="textarea"
              autogrow
              :readonly="readOnly"
              >
            </q-input>

            <q-input
              label="Requirements for approvals or permits needed"
              hint="Optional"
              :value="techSpec.approvalPermitRequirements"
              @input="UPDATE({path:'techSpec.approvalPermitRequirements', value: $event})"
              type="textarea"
              autogrow
              :readonly="readOnly"
              >
            </q-input>

            <q-input
              label="Requirements for object detection (if any)"
              hint="Optional"
              :value="techSpec.objectDetectionRequirements"
              @input="UPDATE({path:'techSpec.objectDetectionRequirements', value: $event})"
              type="textarea"
              autogrow
              :readonly="readOnly"
              >
            </q-input>

            <q-input
              label="Requirements for Positioning"
              hint="Optional"
              :value="techSpec.positioningRequirements"
              @input="UPDATE({path:'techSpec.positioningRequirements', value: $event})"
              type="textarea"
              autogrow
              :readonly="readOnly"
              >
            </q-input>

            <q-input
              label="Requirements for data gaps"
              hint="Optional"
              :value="techSpec.dataGapRequirements"
              @input="UPDATE({path:'techSpec.dataGapRequirements', value: $event})"
              type="textarea"
              autogrow
              :readonly="readOnly"
              >
            </q-input>

            <q-input
              label="Information on any existing risks to the data collection"
              hint="Optional"
              :value="techSpec.existingRisks"
              @input="UPDATE({path:'techSpec.existingRisks', value: $event})"
              type="textarea"
              autogrow
              :readonly="readOnly"
              >
            </q-input>

            <q-input
              label="Additional requirements"
              hint="Optional"
              :value="techSpec.additionalRequirements"
              @input="UPDATE({path:'techSpec.additionalRequirements', value: $event})"
              type="textarea"
              autogrow
              :readonly="readOnly"
              >
            </q-input>

          </q-card-section>
        </q-card>

      </div>
    </q-page>

    <confirm-navigation id="confirmNavigation" ref="confirmNavigation"></confirm-navigation>
  </form-wrapper>
</template>
<script>
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'
const _ = require('lodash');
import { DirtyRouteGuard } from './mixins/dirty-route-guard'
import { permission } from './mixins/permission'
import { errorHandler } from './mixins/error-handling'
import * as types from '../store/modules/tech-spec/tech-spec-mutation-types'
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
  from '../store/modules/request-status'
import surveyLinesMap from './olmap/survey-lines-map';
import tidalGaugeMap from './olmap/tidal-gauge-map';

export default Vue.extend({
  mixins: [DirtyRouteGuard, errorHandler, permission],
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
      types.UPDATE_WITH_DEFAULTS,
      types.RESET_TECH_SPEC,
      types.SET_SURVEY_LINES,
      types.SET_TIDAL_GAUGE_LOCATIONS,
      types.SET_DIRTY,
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
        this.SET_DIRTY(false);
      });

    },

    clear() {
      const defaults = this.projectMetadata.surveyApplication.defaults;
      this.RESET_TECH_SPEC();
      this.notifySuccess("Specifications cleared");
    },

    applyDefaults() {
      const defaults = this.projectMetadata.surveyApplication.defaults;
      if (_.isNil(defaults)) {
        this.notifyError("No defaults available for survey application.");
      } else {
        this.UPDATE_WITH_DEFAULTS(defaults);
        this.notifySuccess("Defaults applied");
      }
    },

    submit() {
      this.$v.$touch()

      if (this.$v.$error) {
        this.notifyError('Please review fields')
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
      'dirty',
    ]),
    ...mapGetters('projectMetadata',[
      'projectMetadata',
    ]),
    readOnly: function() {
      if (this.hasPermission('canEditAllProjects')) {
        // can edit all projects
        return false
      } else if (
        this.hasPermission('canEditOrgProjects') &&
        this.hasOrganisationLink('projectMetadata.organisations')
      ) {
        // can only edit projects that are linked to user
        return false
      } else {
        return true
      }
    },
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
      groundTruthing: { required },
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
    }
  }
});

</script>
<style>
.map-buttons {
  width: 260px;
}
</style>
