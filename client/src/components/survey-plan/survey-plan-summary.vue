<template>
  <form-wrapper
    :validator="$v"
    :messages="validationMessagesOverride"
    class="full-height scroll"
  >

    <q-page padding class="docs-input row justify-center">
      <q-page-sticky
        position="top-right"
        :offset="id ? [18, 18+66] : [18, 18]"
        style="z-index:100">

        <div class="row q-gutter-x-sm">
          <q-btn
            v-if="!readonly"
            round
            color="primary"
            @click="submit"
            icon="save"
          >
            <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 4]">Save summary</q-tooltip>
          </q-btn>

          <!-- <q-btn
            @click="generateReport({id: surveyPlan.id, templateType: 'Plan'})"
            :disable="!surveyPlan.id"
            :loading="reportDownloading"
            round
            color="primary"
            icon="description">
            <q-tooltip>
              Download survey plan report
            </q-tooltip>
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
          <q-btn
            type="a"
            :href="`/api/report-template/generate/Plan/${surveyPlan.id}?format=csv`"
            :disable="!surveyPlan.id"
            round
            color="primary"
            icon="dehaze">
            <q-tooltip>
              Download as CSV
            </q-tooltip>
          </q-btn> -->

          <q-btn :disable="!id"
            v-if="!readonly"
            round
            color="primary"
            @click="deleteSurveyPlan"
            icon="delete"
          >
            <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 4]">Delete plan</q-tooltip>
          </q-btn>
        </div>
      </q-page-sticky>

      <div style="width: 900px; max-width: 90vw;" class="column q-gutter-md no-wrap">
        <record-state
          ref="recordState"
          v-if="surveyPlan.id"
          class="full-width"
          :entity-type="`survey-plan`"
          :entity-id="surveyPlan.id"
          :validation-callback="recordStateValidationCallback"
          :disable="dirty"
          @updated-state="stateUpdated($event)"
          >
        </record-state>
        <div v-if="!surveyPlan.id" class="text-h5"> New Plan </div>
        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> Basic </div>
          </q-card-section>
          <q-card-section>
            <form-field-validated-input
              name="surveyName"
              label="Survey name"
              hint="Name of data collection survey"
              :value="surveyName"
              @input="update('surveyPlan.surveyName', $event)"
              @blur="$v.surveyName.$touch"
              type="text"
              :readonly="readonly"
              >
            </form-field-validated-input>

            <q-field
              stack-label
              label="Public"
              hint="Make survey plan visible to all users"
              bottom-slots
              :readonly="readonly"
              >
              <q-checkbox
                :value="surveyPlan.public"
                @input="update('surveyPlan.public', $event)"
                :disable="readonly"
                />
            </q-field>

            <q-input
              label="Survey ID"
              hint="Optional"
              :value="surveyId"
              @input="update('surveyPlan.surveyId', $event)"
              type="text"
              :readonly="readonly"
              >
            </q-input>

            <q-field label="Status" stack-label>
              <template v-slot:control>
                <q-option-group
                  type="radio" inline
                  :value="surveyPlanStatus"
                  color="secondary"
                  @input="update('surveyPlan.status', $event)"
                  :options="surveyPlanStatusOptions"
                  :disable="readonly"
                />
              </template>
            </q-field>

            <form-field-validated-select
              name="surveyPlanCustodians"
              label="Survey plan custodian(s)"
              class="col-10"
              multiple use-chips
              :value="surveyPlanCustodians"
              @input="setSurveyPlanCustodians($event)"
              :options="custodianOptions"
              option-label="name"
              option-value="id"
              @blur="$v.surveyPlanCustodians.$touch"
              :readonly="readonly"
              >
            </form-field-validated-select>

            <form-field-validated-select
              name="surveyPlan.organisations"
              label="Commissioning organisation(s)"
              multiple
              use-chips
              use-input
              input-debounce="200"
              @filter="filterOrganisationFunction"
              :value="surveyPlan.organisations"
              @input="setSurveyPlanOrganisations($event)"
              :options="organisationsList"
              option-label="name"
              option-value="id"
              @blur="$v.surveyPlan.organisations.$touch"
              :readonly="readonly"
              >
            </form-field-validated-select>

            <form-field-validated-input
              label="Other organisations (if not listed above)"
              hint="Optional"
              :value="surveyPlan.otherOrganisations"
              @input="update('surveyPlan.otherOrganisations', $event)"
              type="text"
              :readonly="readonly"
              >
            </form-field-validated-input>

            <q-input
              icon="fas fa-user"
              label="Contact person"
              :error="$v.contactPerson.$error"
              error-message="Contact person is required"
              :value="contactPerson"
              @input="update('surveyPlan.contactPerson', $event)"
              @blur="$v.contactPerson.$touch"
              type="text"
              :readonly="readonly"
              >
            </q-input>

            <form-field-validated-input
              inset="full"
              name="email"
              icon="fas fa-envelope"
              label="Contact email"
              :value="email"
              @input="update('surveyPlan.email', $event)"
              @blur="$v.email.$touch"
              type="email"
              :readonly="readonly"
              >
            </form-field-validated-input>
          </q-card-section>
        </q-card>

        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6">Survey Plan</div>
          </q-card-section>
          <q-card-section class="column">
            <l-map
              style="min-height: 400px"
              class="col rounded-borders"
              ref="surveyPlanMap"
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
              <l-geo-json
                v-if="higlightedIntersectingSurveyPlan"
                :geojson="higlightedIntersectingSurveyPlan"
                :optionsStyle="higlightedIntersectingSurveyPlanMapStyle"
              />
              <l-geo-json
                v-if="intersectingSurveyPlans"
                :geojson="intersectingSurveyPlans"
                :optionsStyle="intersectingSurveyPlansMapStyle"
              />
              <l-geo-json
                v-if="surveyPlan.areaOfInterest"
                ref="surveyPlanLayer"
                :geojson="surveyPlan.areaOfInterest"
                :optionsStyle="surveyPlanMapStyle"
                
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

            <div class="row">
              <template v-if="!readonly">
                <div v-if="addingFile" class="q-body-1 text-faded col column">
                  <div class="q-body-1 text-faded"> Processing file </div>
                  <q-linear-progress indeterminate />
                </div>
                <div v-else
                  class="q-body-1 text-faded col">
                  Click the upload button to load the survey plan area. Note: Shapefiles must be uploaded as a single zip file including all shapefile 'sidecar' files.
                </div>
              </template>
              <template v-else>
                <div col></div>
              </template>

              <div class="map-buttons q-gutter-sm col-auto">
                <div class="row justify-between q-gutter-sm">
                  <div class="col">
                    <q-btn
                      outline
                      class="no-margin full-width"
                      icon="cloud_download"
                      type="a"
                      :href="`/api/survey-plan/${surveyPlan.id}/geometry`"
                      :disable="!surveyPlan.id || addingFile || !surveyPlan.areaOfInterest || dirty"
                    >
                      <q-tooltip>
                        {{!surveyPlan.id || addingFile || !surveyPlan.areaOfInterest || dirty ? "Must save plan before download" : "Download Area of Interest"}}
                      </q-tooltip>
                    </q-btn>
                  </div>

                  <template v-if="!readonly">
                    <div class="col">
                      <q-btn outline class="no-margin full-width" icon="cloud_upload"
                        :disable="addingFile"
                        @click="selectAreaOfInterestFile">
                        <q-tooltip>
                          Upload Area of Interest
                        </q-tooltip>
                      </q-btn>
                    </div>
                    <div class="col">
                      <input
                        type="file"
                        accept=".zip,.json,.geojson"
                        id="dataPath"
                        v-on:change="setAreaOfInterestFile"
                        ref="fileInput"
                        hidden
                      />
                      <q-btn outline class="no-margin full-width" icon="clear"
                        :disable="!surveyPlan.areaOfInterest"
                        @click="update('surveyPlan.areaOfInterest', undefined)">
                        <q-tooltip>
                          Clear Area of Interest
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </template>
                </div>
              </div>

            </div>

            <div class="row q-col-gutter-md q-pt-md">

              <form-field-validated-input
                class="col-xs-12 col-sm-6"
                disable
                attribute="Calculated area"
                hint="Area calculated from area of interest"
                label="Calculated area"
                :value="calculatedArea"
                :readonly="readonly"
                >
              </form-field-validated-input>
            </div>

            <div v-if="$v.areaOfInterest.$error" style="color:red;">
              Area of Interest has not been provided.
            </div>

            <q-separator class="q-my-md" style="height:1px"/>

            <div class="column">
              <div class="row justify-between">
                <div class="text-subtitle1">Intersecting plans</div>
                <div class="row q-gutter-sm">
                  <q-btn flat class="" icon="check" label="Run check"
                    :disable="!areaOfInterest"
                    @click="checkGeometry">
                  </q-btn>
                  <q-btn flat class="" icon="clear" label="Clear results"
                    :disable="!matchingProjMetas || matchingProjMetas.length == 0"
                    @click="clearIntersectionCheckResults">
                  </q-btn>
                </div>
              </div>
              <div
                v-if="!intersectionCheckRun"
                class="row justify-center items-center"
                style="min-height:50px"
              >
                <div>Check has not been run.</div>
              </div>
              <div
                v-else-if="matchingProjMetas.length == 0"
                class="row justify-center items-center"
                style="min-height:50px"
              >
                <div>No intersecting survey plans found.</div>
              </div>
              <div v-else>
                <q-list highlight
                  @mouseleave.native="mouseleaveMatchingProjMeta">
                  <template
                    v-for="matchingProjMeta in matchingProjMetas"
                  >
                    <q-item
                      tag="a" class="interescting-project-links"
                      :href="`/survey-plan/${matchingProjMeta.id}/summary`"
                      target="_blank"
                      :key="matchingProjMeta.id"
                      @mouseover.native="mouseoverMatchingProjMeta(matchingProjMeta)"
                    >
                      <q-item-section top avatar>
                        <q-avatar
                          text-color="white"
                          font-size="28px"
                          rounded
                          :icon="surveyPlanStatusIconDetails(matchingProjMeta.status).icon"
                          :color="surveyPlanStatusIconDetails(matchingProjMeta.status).color"
                        />
                        <!-- <q-avatar :icon="recordStateDetails(matchingProjMeta.recordState).icon" /> -->
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{matchingProjMeta.surveyName | capitalize}}</q-item-label>
                        <q-item-label caption>{{matchingProjMeta.status}}</q-item-label>
                      </q-item-section>

                      <q-item-section side top>
                        <q-item-label caption>{{matchingProjMeta.startDate | dateString}}</q-item-label>
                        <q-icon
                          :name="recordStateDetails(matchingProjMeta.recordState).icon"
                        >
                          <q-tooltip>
                            {{ recordStateDetails(matchingProjMeta.recordState).label }}
                          </q-tooltip>
                        </q-icon>
                      </q-item-section>

                    </q-item>
                  </template>
                </q-list>
              </div>


            </div>

          </q-card-section>
        </q-card>

        <q-card class="full-width">
          <q-card-section>
            <div  class="text-h6">Survey Purpose</div>
          </q-card-section>
          <q-card-section dense>

            <q-select
              label="Category"
              filter
              autofocus-filter
              :value="selectedSurveyApplicationGroup"
              @input="setSelectedSurveyApplicationGroup($event)"
              :options="surveyApplicationGroups"
              bottom-slots
              @blur="$v.selectedSurveyApplicationGroup.$touch"
              :error="$v.selectedSurveyApplicationGroup.$error"
              error-message="Survey application is required"
              :readonly="readonly"
              >
            </q-select>

            <div class="row" v-if="selectedSurveyApplicationGroup == 'Other'">
              <div class="col-1">
              </div>
              <div class="col-11">
                <form-field-validated-input
                  name="surveyApplicationGroupNameOther"
                  label="Name"
                  class="optional-name-fields"
                  :value="surveyApplicationGroupNameOther"
                  @input="setSurveyApplicationGroupNameOther($event)"
                  @blur="$v.surveyApplicationGroupNameOther.$touch"
                  type="text"
                  :readonly="readonly"
                  >
                </form-field-validated-input>
              </div>
            </div>

            <!-- v-if="selectedSurveyApplicationGroup" -->
            <q-select
              label="Purpose"
              :error="$v.selectedSurveyApplication.$error"
              error-message="Survey application is required"
              :value="selectedSurveyApplication"
              @input="setSelectedSurveyApplication($event)"
              :options="surveyApplications"
              option-label="name"
              option-value="id"
              bottom-slots
              @blur="$v.selectedSurveyApplication.$touch"
              :readonly="readonly"
              >
            </q-select>

            <div class="row" v-if="selectedSurveyApplication && selectedSurveyApplication.name == 'Other'">
              <div class="col-1">
              </div>
              <div class="col-11">
                <form-field-validated-input
                  name="surveyApplicationNameOther"
                  label="Name"
                  class="optional-name-fields"
                  :value="surveyApplicationNameOther"
                  @input="setSurveyApplicationNameOther($event)"
                  @blur="$v.surveyApplicationNameOther.$touch"
                  type="text"
                  :readonly="readonly"
                  >
                </form-field-validated-input>
              </div>
            </div>

            <q-input
              label="Statement of Expected Survey Quality"
              hint="Optional"
              :value="quality"
              @input="update('surveyPlan.quality', $event)"
              type="textarea"
              autogrow
              :readonly="readonly"
              >
            </q-input>

          </q-card-section>
        </q-card>


        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6">Supplier</div>
          </q-card-section>
          <q-card-section>

            <q-input
              label="Contract number"
              hint="Optional"
              :value="contractNumber"
              @input="update('surveyPlan.contractNumber', $event)"
              type="text"
              :readonly="readonly"
              >
            </q-input>

            <q-input
              label="Tenderer"
              hint="Optional"
              :value="tenderer"
              @input="update('surveyPlan.tenderer', $event)"
              type="text"
              :readonly="readonly"
              >
            </q-input>

            <q-input
              label="Surveyors"
              hint="Optional"
              :value="surveyors"
              @input="update('surveyPlan.surveyors', $event)"
              type="text"
              :readonly="readonly"
              >
            </q-input>

            <q-input
              label="Vessel"
              hint="Optional"
              :value="vessel"
              @input="update('surveyPlan.vessel', $event)"
              type="text"
              :readonly="readonly"
              >
            </q-input>

            <q-field
              class="column q-py-md"
              :error="$v.surveyPlanInstrumentTypes.$error || $v.surveyPlanDataCaptureTypes.$error"
              :error-message="getInstrumentAndDataCaptureTypeError()"
              bottom-slots
              :readonly="readonly"
              >
              <div class="row q-col-gutter-md q-mb-sm">
                <div class="column col-xs-12 col-sm-6">
                  <div class="datatype-column-heading">Instrument type</div>
                  <q-list bordered padding dense class="col">
                    <q-item
                      v-for="instType of instrumentTypes"
                      :key="instType.id"
                      tag="label" v-ripple>
                      <q-item-section side top>
                        <q-checkbox
                          :value="instrumentSelected(instType)"
                          @input="setSelectedInstrument(instType)"
                          :disable="readonly"
                          />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label class="cb-label">{{instType.name}}</q-item-label>
                        <q-item-label caption>
                          {{instrumentDescription(instType)}}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <div class="column col-xs-12 col-sm-6 ">
                  <div class="datatype-column-heading">Data to capture</div>
                  <q-list bordered padding dense class="col">
                    <q-item
                      v-for="dataCaptType of dataCaptureTypeOptions"
                      :key="dataCaptType.id"
                      :disable="dataCaptType.disable"
                      tag="label" v-ripple>
                      <q-item-section side top>
                        <q-checkbox
                          :value="dataCaptureTypeSelected(dataCaptType)"
                          @input="setSelectedDataCaptureType(dataCaptType)"
                          :disable="dataCaptType.disable || readonly"
                          />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="cb-label">{{dataCaptType.name}}</q-item-label>
                        <q-item-label caption>
                          {{dataCaptType.displayName}}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </q-field>

            <div class="column col-12 q-pt-md">
              <div class="date-range-field-label">Date range</div>
              <div class="row q-col-gutter-md">
                <form-field-validated-date
                  class="col-xs-12 col-sm-6"
                  name="surveyPlan.startDate"
                  attribute="Start date"
                  label="Start date (YYYY/MM/DD)"
                  :date="surveyPlan.startDate"
                  @updated-date="update('surveyPlan.startDate', $event)"
                  @blur="$v.surveyPlan.startDate.$touch"
                  :readonly="readonly"
                  >
                </form-field-validated-date>

                <form-field-validated-date
                  class="col-xs-12 col-sm-6"
                  name="surveyPlan.endDate"
                  attribute="End date"
                  label="End date (YYYY/MM/DD)"
                  :date="surveyPlan.endDate"
                  @updated-date="update('surveyPlan.endDate', $event)"
                  @blur="$v.surveyPlan.endDate.$touch"
                  :readonly="readonly"
                  hint="Optional"
                  >
                </form-field-validated-date>
              </div>
            </div>

          </q-card-section>
        </q-card>

        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> Additional Information </div>
          </q-card-section>
          <q-card-section>
            <q-input
              label="Comments"
              hint="Optional"
              autogrow
              :value="comment"
              @input="update('surveyPlan.comment', $event)"
              type="textarea"
              :readonly="readonly"
              >
            </q-input>
          </q-card-section>
        </q-card>

        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> Moratorium </div>
          </q-card-section>
          <q-card-section class="row q-col-gutter-md">
            <q-field
              class="col-12 col-md-6"
              stack-label
              label="Subject to moratorium"
              hint="Optional"
              bottom-slots
              :readonly="readonly"
              >
              <q-checkbox
                :value="surveyPlan.hasMoratorium"
                @input="update('surveyPlan.hasMoratorium', $event)"
                :disable="readonly"
                />
            </q-field>

            <form-field-validated-input
              class="col-12 col-md-6"
              v-if="surveyPlan.hasMoratorium"
              filled
              name="surveyPlan.moratoriumDate"
              attribute="Date moratorium ends"
              label="Date moratorium ends (YYYY/MM/DD)"
              :value="formattedMoratoriumDate"
              @input="setFormattedMoratoriumDate($event)"
              @blur="$v.surveyPlan.moratoriumDate.$touch"
              :readonly="readonly"
              >

                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy>
                    <q-date
                      :value="formattedMoratoriumDate"
                      @input="setFormattedMoratoriumDate($event)"
                      @blur="$v.surveyPlan.moratoriumDate.$touch"
                      />
                  </q-popup-proxy>
                </q-icon>

            </form-field-validated-input>
          </q-card-section>
        </q-card>

        <div v-if="!readonly" class="full-width row justify-between">
          <div class="row justify-start q-gutter-sm">
            <q-btn
              color="primary"
              label="Save"
              icon="save"
              @click="submit"
            />
            <q-btn
              color="primary"
              :label="dirty ? 'Exit without saving' : 'Exit'"
              icon="close"
              :to="'/'"
            />
            <q-btn
              color="red"
              label="Delete"
              icon="delete"
              :disable="readonly"
              @click="deleteSurveyPlan"
            />
          </div>

          <q-btn
            :disable="readonly || dirty"
            color="primary"
            label="Finalise"
            @click="finaliseClicked"
          >
            <q-tooltip v-if="dirty">Survey Plan must be saved before finalising</q-tooltip>
          </q-btn>
        </div>

      </div>
    </q-page>

    <confirm-navigation id="confirmNavigation" ref="confirmNavigation"></confirm-navigation>
  </form-wrapper>
</template>
<script>
import Vue from 'vue'
import { date } from 'quasar'
import { mapActions, mapGetters, mapMutations } from 'vuex'
const _ = require('lodash');
import { DirtyRouteGuard } from './../mixins/dirty-route-guard'
import { permission } from './../mixins/permission'
import { errorHandler } from './../mixins/error-handling'
import * as custodianMutTypes
  from '../../store/modules/custodian/custodian-mutation-types'
import * as organisationMutTypes
  from '../../store/modules/organisation/organisation-mutation-types'
import * as pmMutTypes
  from '../../store/modules/survey-plan/survey-plan-mutation-types'

import { surveyPlanStatusIconDetails, recordStateDetails } from './../utils'

const timespan = require('readable-timespan');
timespan.set({
  lessThanFirst: 'now',
  millisecond: false
});

import { required, email, minLength } from 'vuelidate/lib/validators';

var shp = require('shpjs');
import simplify from '@turf/simplify';
import { latLng, Util } from "leaflet";
import {
  LMap,
  LWMSTileLayer,
  LControlLayers,
  LLayerGroup,
  LPopup,
} from "vue2-leaflet";
import area from '@turf/area';

import * as MapConstants from "../olmap/map-constants";
import { surveyPlan } from 'src/store/modules/survey-plan/survey-plan-getters';

// custom validators
const validDataCaptureType = (value, vm) => {
  let badDcts = value.filter(dct => {
    return !vm.validDataCaptureTypeIds.has(dct.id);
  });
  return badDcts.length == 0;
};
const validSurveyApplicationGroupNameOther = (value, vm) => {
  if (vm.selectedSurveyApplicationGroup == 'Other') {
    // is other selected, then must provide a name
    return !(_.isNil(value) || value.length == 0);
  } else {
    // then an existing group has been selected, so mark as valid even
    // if no other field has been presented.
    return true;
  }
}
const validSurveyApplicationNameOther = (value, vm) => {
  if (_.isNil(vm.selectedSurveyApplication)) {
    return true;
  } else if (vm.selectedSurveyApplication.name == 'Other') {
    // is other selected, then must provide a name
    return !(_.isNil(value) || value.length == 0);
  } else {
    // then an existing group has been selected, so mark as valid even
    // if no other field has been presented.
    return true;
  }
}
const validMoratorium = (value, vm) => {
  if (vm.hasMoratorium) {
    // only needs date if the moratorium check has been set
    return !_.isNil(vm.moratoriumDate)
  } else {
    return true
  }
};

const otherSurveyPurpose = {
  name: 'Other',
  group: 'Other',
  userSubmitted: true,
  id: null,
}

export default Vue.extend({
  mixins: [DirtyRouteGuard, errorHandler, permission],

  components: {
    LMap,
    LControlLayers,
    LLayerGroup,
    LPopup,
    "l-wms-tile-layer": LWMSTileLayer,
  },

  beforeMount() {
    this.getFormData();
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    ...mapActions('reportTemplate', [
      'generateReport',
    ]),
    ...mapActions('organisation', [
      'getOrganisations',
    ]),
    ...mapMutations('surveyPlan', {
      'setDirty': pmMutTypes.SET_DIRTY,
      'setSurveyPlanCustodians': pmMutTypes.SET_CUSTODIANS,
      'setSurveyPlanOrganisations': pmMutTypes.SET_ORGANISATIONS,
      'updateSurveyPlan': pmMutTypes.UPDATE,
    }),
    ...mapMutations('surveyPlan', [
      pmMutTypes.RESET_SURVEY_PLAN,
      pmMutTypes.SET_START_DATE,
      pmMutTypes.SET_TENDERER,
      pmMutTypes.SET_SURVEYORS,
      pmMutTypes.SET_AOI,
      pmMutTypes.SET_INSTRUMENT_TYPES,
      pmMutTypes.SET_DATA_CAPTURE_TYPES,
      pmMutTypes.SET_SURVEY_APPLICATION_ID_OTHER,
      pmMutTypes.SET_SURVEY_APPLICATION_NAME_OTHER,
      pmMutTypes.SET_SURVEY_APPLICATION_GROUP_NAME_OTHER,
      pmMutTypes.SET_SURVEY_APPLICATION,
      pmMutTypes.REMOVE_CUSTODIAN,
    ]),
    ...mapMutations('custodian', {
      'setDeletedCustodians': custodianMutTypes.SET_DELETED_CUSTODIANS,
    }),
    ...mapMutations('organisation', {
      'setOrganisationFilter': organisationMutTypes.SET_FILTER,
    }),

    surveyPlanStatusIconDetails: surveyPlanStatusIconDetails,
    recordStateDetails: recordStateDetails,

    instrumentSelected(instrumentType) {
      const found = this.surveyPlanInstrumentTypes.find((selectedIt) => {
        return selectedIt.id == instrumentType.id;
      })

      return !_.isNil(found)
    },
    setSelectedInstrument(instrumentType) {
      const isSelected = this.instrumentSelected(instrumentType);
      if (isSelected) {
        // then remove it from the list
        const newSurveyPlanInstrumentTypes = this.surveyPlanInstrumentTypes.filter((pit) => {
          return !(pit.id === instrumentType.id);
        });
        this.setInstrumentTypes(newSurveyPlanInstrumentTypes);
      } else {
        // then add it to the list. Made slightly more complicated by
        // having to do so via mutation
        let newSurveyPlanInstrumentTypes = _.clone(this.surveyPlanInstrumentTypes)
        newSurveyPlanInstrumentTypes.push(instrumentType);
        this.setInstrumentTypes(newSurveyPlanInstrumentTypes);
      }
      this.$v.surveyPlanInstrumentTypes.$touch()
    },

    instrumentDescription(instrumentType) {
      const dataTypeNames = instrumentType.dataCaptureTypes.map((dct) => {
        return dct.name;
      })
      const s = dataTypeNames.length == 1 ? '' : 's'
      return `Data type${s} - ` + dataTypeNames.join(', ');
    },

    dataCaptureTypeSelected(dct) {
      const found = this.surveyPlanDataCaptureTypes.find((selectedDct) => {
        return selectedDct.id == dct.id;
      })
      return !_.isNil(found)
    },
    setSelectedDataCaptureType(dct) {
      const isSelected = this.dataCaptureTypeSelected(dct);
      if (isSelected) {
        // then remove it from the list
        const newDcts = this.surveyPlanDataCaptureTypes.filter((pit) => {
          return !(pit.id === dct.id);
        });
        this.setDataCaptureTypes(newDcts);
      } else {
        // then add it to the list. Made slightly more complicated by
        // having to do so via mutation
        let newDcts = _.clone(this.surveyPlanDataCaptureTypes);
        newDcts.push(dct);
        this.setDataCaptureTypes(newDcts);
      }
      this.$v.surveyPlanDataCaptureTypes.$touch()
    },
    getInstrumentAndDataCaptureTypeError() {
      // both the intrument type and data capture type lists have a number
      // of validators, however they are both included in the same field and
      // therefore only have on error message display. This method merges
      // the errors present in both lists for display to the user.
      if (this.$v.surveyPlanInstrumentTypes.$error) {
        if (
          !this.$v.surveyPlanInstrumentTypes.required ||
          !this.$v.surveyPlanInstrumentTypes.minLength
          ) {
          return "At least one instrument type is required"
        } else {
          return "Invalid instrument type selection"
        }
      } else if (this.$v.surveyPlanDataCaptureTypes.$error) {
        if (
          !this.$v.surveyPlanDataCaptureTypes.required ||
          !this.$v.surveyPlanDataCaptureTypes.minLength
          ) {
          return "At least one data capture type is required"
        } else if (!this.$v.surveyPlanDataCaptureTypes.validDataCaptureType) {
          return "Data type(s) cannot be captured by selected instruments."
        } else {
          return "Invalid instrument type selection"
        }
      }
      return undefined
    },


    fetchData () {
      this.matchingProjMetas = undefined;

      this.setSurveyApplicationGroupNameOther(undefined)
      this.setSurveyApplicationNameOther(undefined)
      this.setSurveyApplicationIdOther(undefined)

      if (this.$route.params.id) {
        this.$store.dispatch(
          'surveyPlan/getSurveyPlan', { id: this.$route.params.id })
        .then(surveyPlan => {
          if (!_.isNil(surveyPlan.surveyApplication)) {
            this.$store.commit('surveyApplication/setSelectedSurveyApplicationGroup',
              surveyPlan.surveyApplication.group);

            if (surveyPlan.surveyApplication.userSubmitted) {
              let saName = surveyPlan.surveyApplication.name;
              let saId = surveyPlan.surveyApplication.id;
              let saGroup = surveyPlan.surveyApplication.group;

              this.setSurveyApplicationNameOther(saName);
              this.setSurveyApplicationIdOther(saId);

              if (this.surveyApplicationGroups.includes(saGroup)) {
                this.setSelectedSurveyApplicationGroup(
                  saGroup);
              } else {
                this.setSurveyApplicationGroupNameOther(saGroup);
                this.setSelectedSurveyApplicationGroup(
                  otherSurveyPurpose.group);
              }
              this.setSelectedSurveyApplication(
                otherSurveyPurpose);

            } else {
              this.setSelectedSurveyApplication(
                surveyPlan.surveyApplication);
            }
          }
        });
      } else {
        if (_.isNil(this.$route.query.reset) || this.$route.query.reset) {
          // don't reset the metadata if the `reset` query param is set to
          // true. It's likely the survey plan metadata has been pre-populated with
          // some information we care about (such as from a hipp request)
          this.RESET_SURVEY_PLAN();
        }
        // need to clear the selected options here, otherwise they persist
        // to a new survey
        this.$store.commit(
          'surveyApplication/setSelectedSurveyApplicationGroup',
          undefined);
        this.$store.commit(
          'surveyApplication/setSelectedSurveyApplication',
          undefined);

        this.prefill();
      }
    },

    prefill() {
      this.updateSurveyPlan({
        path: "surveyPlan.email",
        value: this.currentUser.email,
      });
      this.updateSurveyPlan({
        path: "surveyPlan.contactPerson",
        value: this.currentUser.name,
      });
      if (!_.isNil(this.currentUser.custodian)) {
        let cust = this.currentUser.custodian;
        this.setSurveyPlanCustodians([cust]);

        this.setOrganisationFilter(cust.name);
        this.getOrganisations().then((orgsData) => {
          const orgs = orgsData.data;
          if (orgs.length > 0) {
            this.setSurveyPlanOrganisations([orgs[0]])
          } else {
            this.setSurveyPlanOrganisations([orgs[0]])
            this.notifyInfo(
              "Could not match current users custodian to organisation"
            );
          }
        });
      }
    },

    update(key, event) {
      this.updateSurveyPlan({
        path: key,
        value: event
      })
    },

    setFormattedStartDate(startDate) {
      let d = Date.parse(startDate)
      this.setStartDate(d)
    },

    setStartDate(startDate) {
      this.SET_START_DATE(startDate)
    },

    setFormattedMoratoriumDate(requestDate) {
      this.tmpMoratoriumDateEntry = requestDate;
      // check if no text provided, or if the string contains two / chars
      if (_.isNil(requestDate) || (requestDate.match(/\//g) || []).length != 2) {
        this.update('surveyPlan.moratoriumDate', undefined)
        return
      }
      let d = Date.parse(requestDate)
      if (_.isNaN(d)) {
        this.update('surveyPlan.moratoriumDate', undefined)
        return
      }
      this.update('surveyPlan.moratoriumDate', d)
    },

    setSelectedSurveyApplicationGroup(group) {
      this.$store.commit('surveyApplication/setSelectedSurveyApplicationGroup',
        group);

      // if the other survey purpose category is selected, then the survey
      // purpose must be the "Other" purpose too.
      if (this.selectedSurveyApplicationGroup == otherSurveyPurpose.group) {
        this.setSelectedSurveyApplication(otherSurveyPurpose);
      } else {
        this.setSelectedSurveyApplication(undefined);
      }
    },

    setSelectedSurveyApplication(surveyApplication) {
      this.$store.commit('surveyApplication/setSelectedSurveyApplication',
          surveyApplication);
    },

    setSelectedTenderer(custodian) {
      this.SET_TENDERER(custodian);
    },

    setSelectedSurveyors(custodians) {
      this.SET_SURVEYORS(custodians);
    },

    setAoi(geojson) {
      this.SET_AOI(geojson);
      this.$v.areaOfInterest.$touch();

      this.matchingProjMeta = [];
    },

    setInstrumentTypes(instrumentTypes) {
      this.SET_INSTRUMENT_TYPES(instrumentTypes)
      this.$v.surveyPlanDataCaptureTypes.$touch()
    },

    setDataCaptureTypes(dataCaptureTypes) {
      this.SET_DATA_CAPTURE_TYPES(dataCaptureTypes)
    },

    setSurveyApplicationIdOther(name) {
      return this.SET_SURVEY_APPLICATION_ID_OTHER(name)
    },
    setSurveyApplicationNameOther(name) {
      return this.SET_SURVEY_APPLICATION_NAME_OTHER(name)
    },
    setSurveyApplicationGroupNameOther(name) {
      return this.SET_SURVEY_APPLICATION_GROUP_NAME_OTHER(name)
    },

    submit() {
      this.validationIntent = 'save';

      this.$v.$touch()

      if (this.$v.$error) {
        this.notifyError('Please review fields')
        return
      }

      // before sending to the server, update the surveyPlan survey
      // application to account for it possibly being a user submitted
      // survey purpose.
      if (!_.isNil(this.selectedSurveyApplication)) {
        let sa = _.cloneDeep(this.selectedSurveyApplication);
        if (sa.userSubmitted) {
          sa.group = this.selectedSurveyApplicationGroup == "Other" ? this.surveyApplicationGroupNameOther : this.selectedSurveyApplicationGroup;
          sa.name = this.selectedSurveyApplication.name == "Other" ? this.surveyApplicationNameOther : this.selectedSurveyApplication.name;
          sa.id = this.surveyApplicationIdOther;
        }
        this.SET_SURVEY_APPLICATION(sa)
      }

      const isNew = _.isNil(this.id) || (this.id.length == 0);

      this.$store.dispatch('surveyPlan/save')
      .then(pmd => {
        this.setDirty(false);
        if (isNew) {
          this.$router.replace({ path: `/survey-plan/${pmd.id}/summary` })
        }
        this.notifySuccess('Saved plan');
      })
      .catch(err => {
        this.notifyError(`Failed to save plan (${err.message})`, err);
      });
    },

    deleteSurveyPlan() {
      if (this.id) {
        // an existing id indicated this survey plan has been saved, so check
        // with user if they really want to delete survey plan.
        this.$q.dialog({
          title: 'Delete plan',
          message: `Plan ${this.surveyName} will be deleted`,
          ok: 'Delete',
          cancel: 'Cancel'
        }).onOk(() => {

          this.$store.dispatch(
            'surveyPlan/deleteSurveyPlan',
            { id: this.id }
          ).then(pmd => {
            this.notifySuccess('Deleted plan');
            this.$router.replace({ path: `/` });
          });
        });
      } else {
        // no id, so hasn't been saved. I this case reset form and go back
        // to main page.
        this.RESET_SURVEY_PLAN()
        this.$router.replace({ path: `/` });
      }
    },

    finaliseClicked() {
      this.validationIntent = 'final';
      this.$v.$touch();

      if (this.$v.$error) {
        this.notifyError('Please review fields');
        return;
      }

      this.$refs.recordState
        .transitionRecordState("FINALISE")
        .then((sp) => {
          this.notifySuccess("Survey Plan finalised");
        })
        .catch((err) => {
          this.notifyError(
            `Failed to finalise Survey Plan`,
            err
          );
        });
    },

    checkGeometry() {
      // Send geojson to server to check for interescting surveys
      this.$store.dispatch(
        'surveyPlan/checkAoi', { id: this.id })
      .then(matchingProjMetas => {
        this.intersectionCheckRun = true;
        this.matchingProjMetas = matchingProjMetas;
        const areaOfInterests = matchingProjMetas.map(mpm => {
          let f = mpm.areaOfInterest;
          f.id = mpm.id;
          return f;
        });
        this.intersectingSurveyPlans = areaOfInterests
      })
      .catch((e) => {
        this.notify('negative', 'Error uploading Aoi to server.')
      });
    },

    clearIntersectionCheckResults() {
      this.intersectionCheckRun = false;
      this.matchingProjMetas = undefined;
      this.intersectingSurveyPlans = undefined;
    },

    selectAreaOfInterestFile () {
      this.$refs.fileInput.click();
    },
    setAreaOfInterestFile (event) {
      this.addFile(event.target.files[0]);
    },
    onFileAddStart() {
      this.addingFile = true;
    },
    onFileAddDone() {
      this.addingFile = false;
    },
    onFileAddBad(msg) {
      this.notifyError(msg);
    },
    onAdd(geojson) {
      console.log(geojson);
    },
    addFile (file) {
      this.onFileAddStart();

      var ext = file.name.split('.').pop();
      var features = null;
      if (ext == 'zip') {
        var reader = new FileReader();
        reader.onload = (function (e) {
          shp(e.target.result).then(function (geojson) {

            var smplOptions = {tolerance: 0.0005, highQuality: false};
            geojson = simplify(geojson, smplOptions);

            console.log(geojson)

            this.update('surveyPlan.areaOfInterest', geojson)

            this.onFileAddDone();

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
          this.onAdd(features);
          this.onFileAddDone();
        };
        reader.readAsText(file);
      } else {
        // then we don't know what the file is, or how to support it so let the
        // user know.
        let msg = "Supported formats are geojson (.json, .geojson) and zipped shapefiles (.zip)"
        if (ext == 'shp') {
          msg = "To upload a shapefile please include the shapefile and associated 'sidecar' (.shx, .prj, .dbx, etc) files into a single zip file."
        }

        this.onFileAddDone();
        this.onFileAddBad(msg);
      }
    },

    getFormData() {
      this.stateReadonly = true;
      // only get non-deleted custodians
      this.setDeletedCustodians(null);
      // gets the list of all custodians, not just those associated to this survey plan
      this.$store.dispatch('custodian/getCustodians');
      this.$store.dispatch('surveyPlan/getSurveyPlanStatuses');
      // get data capture types, but only those not created by users (eg; the
      // default system defined ones.
      this.$store.dispatch(
        'dataCaptureType/getDataCaptureTypes',
        {params: {
          userSubmitted: false,
          plan: true,
        }}
      );
      this.$store.dispatch(
        'instrumentType/getInstrumentTypes',
        {params: {
          userSubmitted: false
        }}
      );
      this.$store.dispatch(
        'surveyApplication/getSurveyApplicationGroups'
      ).then(surveyAppGroups => {
        surveyAppGroups.push("Other");
        this.$store.commit('surveyApplication/setSurveyApplicationGroups',
          surveyAppGroups);
      });

      this.getOrganisations();
    },

    parseCustodians() {
      return this.custodians.map(custodian => {
        return {
          label: custodian.name,
          value: custodian.name
        }
      })
    },
    removeCustodian(custodian) {
      this.REMOVE_CUSTODIAN(custodian)
      this.$v.surveyPlanCustodians.$touch();
    },

    mouseleaveMatchingProjMeta() {
      //clears selection in map
      this.higlightedIntersectingSurveyPlan = undefined;
      // this.map.highlightFeatureId(undefined);
    },

    mouseoverMatchingProjMeta(matchingProjMeta) {
      // debugger
      let newHighlightedItem = undefined;
      for (const f of this.intersectingSurveyPlans) {
        if (f.id == matchingProjMeta.id) {
          newHighlightedItem = f
        }
      }
      this.higlightedIntersectingSurveyPlan = newHighlightedItem
    },

    stateUpdated({newState, oldState}) {
      if (_.isNil(newState)) {
        this.stateReadonly = true
      } else {
        this.stateReadonly = newState.readonly
      }
    },
    recordStateValidationCallback(recordStateEvent) {
      if (recordStateEvent == 'FINALISE') {
        this.validationIntent = 'final';

        this.$v.$touch();

        if (this.$v.$error) {
          this.notifyError('Please review fields');
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },

    filterOrganisationFunction(val, update, abort) {
      this.setOrganisationFilter(val)
      this.getOrganisations().then((orgs) => {
        update()
      })
    },

    getFeatureInfoUrl: function (latlng, layerName) {
      // Construct a GetFeatureInfo request URL given a point
      const mapObject = this.$refs.surveyPlanMap.mapObject;

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

    geometrySet(info) {
      const layerBounds = info.getBounds().pad(0.2);
      const map = this.$refs.surveyPlanMap;
      map.setBounds(layerBounds);
    },
  },

  computed: {
    ...mapGetters({
      surveyPlan: 'surveyPlan/surveyPlan',
      id: 'surveyPlan/id',
      surveyName: 'surveyPlan/surveyName',
      surveyPlanStatus: 'surveyPlan/status',
      surveyPlanStatuses: 'surveyPlan/surveyPlanStatuses',
      contactPerson: 'surveyPlan/contactPerson',
      email: 'surveyPlan/email',
      comment: 'surveyPlan/comment',
      quality: 'surveyPlan/quality',
      vessel: 'surveyPlan/vessel',
      startDate: 'surveyPlan/startDate',
      areaOfInterest: 'surveyPlan/areaOfInterest',
      surveyPlanCustodians: 'surveyPlan/custodians',
      surveyPlanInstrumentTypes: 'surveyPlan/instrumentTypes',
      surveyPlanDataCaptureTypes: 'surveyPlan/dataCaptureTypes',
      surveyPlanSurveyApplication: 'surveyPlan/surveyApplication',
      custodians: 'custodian/custodians',
      instrumentTypes: 'instrumentType/instrumentTypes',
      dataCaptureTypes: 'dataCaptureType/dataCaptureTypes',
      surveyApplicationGroups: 'surveyApplication/surveyApplicationGroups',
      surveyApplications: 'surveyApplication/surveyApplications',
      selectedSurveyApplication: 'surveyApplication/selectedSurveyApplication',
      selectedSurveyApplicationGroup: 'surveyApplication/selectedSurveyApplicationGroup',
      surveyId: 'surveyPlan/surveyId',
      contractNumber: 'surveyPlan/contractNumber',
      surveyors: 'surveyPlan/surveyors',
      tenderer: 'surveyPlan/tenderer',
      surveyApplicationIdOther: 'surveyPlan/surveyApplicationIdOther',
      surveyApplicationNameOther: 'surveyPlan/surveyApplicationNameOther',
      surveyApplicationGroupNameOther: 'surveyPlan/surveyApplicationGroupNameOther',
      dirty: 'surveyPlan/dirty',
    }),
    ...mapGetters('reportTemplate', [
      'reportDownloading',
    ]),
    ...mapGetters('organisation', {
      organisationsList: 'organisations',
      organisationsCount: 'count',
    }),
    readonly: function() {
      if (
        this.hasPermission('canAddSurveyPlan') &&
        _.isNil(this.id)
      ) {
        // user has permission to add new survey plans, and this is a new survey plans
        return false
      }

      if (this.stateReadonly) {
        // if the state says read only
        return true
      }

      if (this.hasPermission('canEditAllSurveyPlans')) {
        // can edit all survey plans
        return false
      } else  if (
        this.hasPermission('canEditCustodianSurveyPlans') &&
        this.hasCustodianLink('surveyPlanCustodians')
      ) {
        // can only edit survey plans that are linked to user
        return false
      } else {
        return true
      }
    },

    calculatedArea: function() {
      if (_.isNil(this.surveyPlan.areaOfInterest)) {
        return undefined
      } else {
        let calcArea = area(this.surveyPlan.areaOfInterest)
        let strArea = undefined
        if (calcArea > 10000) {
          strArea = `${Math.round(calcArea / 1000000 * 100) / 100} km²`
        } else {
          strArea = `${Math.round(calcArea * 100) / 100} m²`
        }
        return strArea
      }
    },

    validDataCaptureTypeIds: function() {
      if (_.isNil(this.instrumentTypes)) {
        return []
      }
      let ids = new Set();
      for (const selectedInstType of this.surveyPlanInstrumentTypes) {
        // find the instrument type from the instrument type store, because
        // here it has the list of associated data capture types
        const instType = this.instrumentTypes.find((it) => {
          return it.id === selectedInstType.id;
        })
        const itdcts = instType.dataCaptureTypes.map((dct) => {
          return dct.id
        })
        itdcts.forEach(item => ids.add(item))
      }
      return ids
    },
    formattedStartDate: function() {
      const d = new Date();
      d.setTime(this.startDate);
      let formattedString = date.formatDate(d, 'YYYY/MM/DD')
      return formattedString
    },
    surveyPlanStatusOptions: function () {
      const opts = this.surveyPlanStatuses.map(pit => {
        return {label: pit, value: pit};
      });
      return opts;
    },
    dataCaptureTypeOptions: function () {
      let selectedIds = new Set();
      for (const selectedDct of this.surveyPlanDataCaptureTypes) {
        selectedIds.add(selectedDct.id);
      }
      // generate a display name to inform users why they can't select
      // a specific data collection type.
      const opts = this.dataCaptureTypes.map(pit => {
        let name =
          this.validDataCaptureTypeIds.has(pit.id) ?
            undefined :
            `Not valid for selected instrument type`;
        pit.disable = !(this.validDataCaptureTypeIds.has(pit.id) || selectedIds.has(pit.id))
        pit.displayName = name
        return pit;
      });
      return opts;
    },
    custodianOptions: function () {
      const custodians = this.custodians.filter(custodian => {
        return !custodian.deleted;
      });
      return custodians;
    },
    formattedMoratoriumDate: function() {
      if (_.isNil(this.tmpMoratoriumDateEntry) && !_.isNil(this.surveyPlan.moratoriumDate)) {
        const d = new Date();
        d.setTime(this.surveyPlan.moratoriumDate);
        let formattedString = date.formatDate(d, 'YYYY/MM/DD')
        this.tmpMoratoriumDateEntry = formattedString
      }
      return this.tmpMoratoriumDateEntry
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

  },

  validations() {
    if (this.validationIntent == 'save') {
      return {
        surveyName: { required },
        contactPerson: { required },
        email: { required, email },
        areaOfInterest: { },
        selectedSurveyApplication: {  },
        surveyApplicationNameOther: {  },
        selectedSurveyApplicationGroup: {  },
        surveyApplicationGroupNameOther: {  },
        surveyPlanCustodians: {
          required,
          minLength:minLength(1)
        },
        surveyPlanInstrumentTypes: { },
        surveyPlanDataCaptureTypes: { },
        surveyPlan: {
          startDate: { },
          endDate: { },
          moratoriumDate: { },
          organisations: { },
        },
      }
    } else if (this.validationIntent == 'final') {
      return {
        surveyName: { required },
        contactPerson: { required },
        email: { required, email },
        areaOfInterest: {required },
        selectedSurveyApplication: { required },
        surveyApplicationNameOther: { validSurveyApplicationNameOther },
        selectedSurveyApplicationGroup: { required },
        surveyApplicationGroupNameOther: { validSurveyApplicationGroupNameOther },
        surveyPlanCustodians: {
          required,
          minLength:minLength(1)
        },
        surveyPlanInstrumentTypes: {
          required,
          minLength:minLength(1)
        },
        surveyPlanDataCaptureTypes: {
          required,
          minLength:minLength(1),
          validDataCaptureType
        },
        surveyPlan: {
          startDate: { required },
          endDate: { },
          moratoriumDate: {validMoratorium},
          organisations: {
            required,
            minLength:minLength(1)
          },
        },
      }
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
    'areaOfInterest': function (newAoi, oldAoi) {
      // need to use setTimeout as this watched is called before the layer
      // is updated, therefore the bounds get set to the last geom
      setTimeout(() => {
        if (newAoi) {
          let aoiBounds = this.$refs.surveyPlanLayer.getBounds().pad(0.2)
          this.$refs.surveyPlanMap.fitBounds(aoiBounds)
        }
      });
      this.matchingProjMetas = [];
    },
    'selectedSurveyApplicationGroup': function (newAoi, oldAoi) {
      this.$store.dispatch('surveyApplication/getSurveyApplications')
      .then(surveyApps => {
        surveyApps.push(otherSurveyPurpose);
        this.$store.commit(
          'surveyApplication/setSurveyApplications',
          surveyApps);
      });
    },
    'selectedSurveyApplication': function (newSa, oldSa) {
      // isNil check is required for when watch called during initiasation
      // of form. Calling the mutation results in a dirty state which shouln't
      // be the case on form load.
      if (!_.isNil(newSa) && !_.isNil(oldSa) && newSa.id != oldSa.id) {
        this.SET_SURVEY_APPLICATION(newSa)
      }

    },
    'surveyPlan.hasMoratorium': function (newM, oldM) {
      this.$v.surveyPlan.moratoriumDate.$touch()
    },
  },

  data() {
    return {
      addingFile: false,
      intersectionCheckRun: false,
      // map: null,

      zoom: 3,
      intersectingSurveyPlansMapStyle: { color: "red", weight: 1 },
      intersectingSurveyPlans: undefined,
      higlightedIntersectingSurveyPlanMapStyle: { color: "red", weight: 3 },
      higlightedIntersectingSurveyPlan: undefined,
      surveyPlanMapStyle: { color: "yellow", weight: 2 },
      sfgStyle: { color: "orange", weight: 2 },
      sfgText: ["", ""],
      sfgLatLng: undefined,
      sfg: undefined,
      showSurveyLayer: true,
      showAoiLayer: false,
      showMarineParksLayer: false,
      showOtherPasLayer: false,
      showOrganisationSubmissionsLayer: false,
      uploadEnabled: true,

      custodianSearchTerms: '',
      matchingProjMetas:undefined,
      stateReadonly: true,
      tmpMoratoriumDateEntry: undefined,
      validationIntent: 'save', // `save` or `final`
      validationMessagesOverride: {
        validDataCaptureType:
          "Selected data capture types are not valid for instrument.",
        validSurveyApplicationNameOther: "Survey purpose name is required.",
        validSurveyApplicationGroupNameOther:
          "Survey purpose category name is required.",
        validMoratorium: "Must provide valid moratorium date"
      }
    }
  }
});

</script>
<style>

.interescting-project-links {
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  color: black;
}

.optional-name-fields {
  margin-top: -24px !important;
}

.q-select {
  overflow: hidden;
}

.datatype-column-heading {
  font-weight: 500;
  color: #656565;
}

.cb-label {
  color: rgb(38, 38, 38);
}

</style>
