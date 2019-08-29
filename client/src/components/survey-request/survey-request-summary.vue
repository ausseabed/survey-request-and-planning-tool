<template>
  <form-wrapper
    :validator="$v"
    :messages="validationMessagesOverride"
    class="full-height scroll"
  >

    <q-page padding class="docs-input row justify-center">
      <q-page-sticky
        position="top-right"
        :offset="surveyRequest.id ? [18, 18+66] : [18, 18]"
        style="z-index:100" >

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
          <q-btn
            @click="generateReport({id: surveyRequest.id, templateType: 'HIPP Request'})"
            :disable="!surveyRequest.id"
            :loading="reportDownloading"
            round
            color="primary"
            icon="description">
            <q-tooltip>
              Download HIPP Request report
            </q-tooltip>
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
          <q-btn
            type="a"
            :href="`/api/report-template/generate/HIPP Request/${surveyRequest.id}?format=csv`"
            :disable="!surveyRequest.id"
            round
            color="primary"
            icon="dehaze">
            <q-tooltip>
              Download as CSV
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="!readonly"
            :disable="!surveyRequest.id"
            round
            color="primary"
            @click="deleteSurveyRequestClick"
            icon="delete"
          >
            <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 4]">Delete HIPP request</q-tooltip>
          </q-btn>
        </div>
      </q-page-sticky>

      <div style="width: 900px; max-width: 90vw;" class="column q-gutter-md no-wrap">
        <record-state
          v-if="this.surveyRequest.id"
          class="full-width"
          :entity-type="`hipp-request`"
          :entity-id="surveyRequest.id"
          :validation-callback="recordStateValidationCallback"
          :disable="dirty"
          @updated-state="stateUpdated($event)"
          >
        </record-state>
        <div v-if="!surveyRequest.id" class="text-h5"> New HIPP Request </div>
        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> Requester’s Details </div>
          </q-card-section>
          <q-card-section>

            <form-field-validated-select
              name="surveyRequest.custodians"
              attribute="Custodian"
              label="Custodian"
              multiple use-chips
              :value="surveyRequest.custodians"
              @input="update({path:'surveyRequest.custodians', value:$event})"
              :options="custodians"
              option-label="name"
              option-value="id"
              @blur="$v.surveyRequest.custodians.$touch"
              :readonly="readonly"
              >
            </form-field-validated-select>

            <form-field-validated-select
              name="surveyRequest.organisations"
              label="Organisations"
              multiple
              use-chips
              use-input
              input-debounce="200"
              autocomplete="new-password"
              @filter="filterOrganisationFunction"
              :value="surveyRequest.organisations"
              @input="update({path:'surveyRequest.organisations', value:$event})"
              :options="organisationsList"
              option-label="name"
              option-value="id"
              @blur="$v.surveyRequest.organisations.$touch"
              :readonly="readonly"
              >
            </form-field-validated-select>

            <form-field-validated-input
              name="surveyRequest.requestorName"
              attribute="Requestor’s Name"
              label="Requestor’s Name"
              :value="surveyRequest.requestorName"
              @input="update({path:'surveyRequest.requestorName', value:$event})"
              @blur="$v.surveyRequest.requestorName.$touch"
              type="text"
              :readonly="readonly"
              >
            </form-field-validated-input>

            <form-field-validated-input
              name="surveyRequest.requestorPosition"
              attribute="Requestor’s Position"
              label="Requestor’s Position"
              :value="surveyRequest.requestorPosition"
              @input="update({path:'surveyRequest.requestorPosition', value:$event})"
              @blur="$v.surveyRequest.requestorPosition.$touch"
              type="text"
              :readonly="readonly"
              >
            </form-field-validated-input>

            <form-field-validated-input
              name="surveyRequest.pointOfContactEmail"
              label="Contact email"
              attribute="Contact email"
              :value="surveyRequest.pointOfContactEmail"
              @input="update({path:'surveyRequest.pointOfContactEmail', value:$event})"
              @blur="$v.surveyRequest.pointOfContactEmail.$touch"
              type="email"
              :readonly="readonly"
              >
            </form-field-validated-input>

            <form-field-validated-input
              name="surveyRequest.pointOfContactPhone"
              label="Contact phone number"
              attribute="Contact phone number"
              :value="surveyRequest.pointOfContactPhone"
              @input="update({path:'surveyRequest.pointOfContactPhone', value:$event})"
              @blur="$v.surveyRequest.pointOfContactPhone.$touch"
              type="text"
              :readonly="readonly"
              >
            </form-field-validated-input>

          </q-card-section>
        </q-card>

        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> Area of Interest </div>
          </q-card-section>
          <q-card-section>

            <form-field-validated-input
              name="surveyRequest.name"
              attribute="Area Name"
              label="Name of the Area to be surveyed"
              :value="surveyRequest.name"
              @input="update({path:'surveyRequest.name', value:$event})"
              @blur="$v.surveyRequest.name.$touch"
              type="text"
              :readonly="readonly"
              >
            </form-field-validated-input>

            <form-field-validated
              borderless
              label="Area of interest"
              stack-label
              bottom-slots
              attribute="Area of interest"
              name="surveyRequest.areaOfInterest"
              >
              <div class="column full-width">
                <div ref="mapDiv" id="mapDiv" style="height:350px;"></div>
                <div
                  class="row full-width justify-between items-center q-pb-sm">
                  <template v-if="!readonly">
                    <div v-if="drawingAreaOfInterest"
                      class="q-body-1 text-faded col">
                      Click endpoint to complete line
                    </div>
                    <div v-else-if="addingFile" class="q-body-1 text-faded col column">
                      <div class="q-body-1 text-faded"> Processing file </div>
                      <q-linear-progress indeterminate />
                    </div>
                    <div v-else
                      class="q-body-1 text-faded col">
                      Drag and drop shapefile or geojson onto map. Note: Shapefiles must be uploaded as a single zip file including all shapefile 'sidecar' files.
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
                          :href="`/api/hipp-request/${surveyRequest.id}/geometry`"
                          :disable="!surveyRequest.id || addingFile || !surveyRequest.areaOfInterest || dirty"
                        >
                          <q-tooltip>
                            {{!surveyRequest.id || addingFile || !surveyRequest.areaOfInterest || dirty ? "Must save request before download" : "Download Area of Interest"}}
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
                            :disable="!surveyRequest.areaOfInterest"
                            @click="update({path:'surveyRequest.areaOfInterest', value:undefined })">
                            <q-tooltip>
                              Clear Area of Interest
                            </q-tooltip>
                          </q-btn>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </form-field-validated>

            <div class="row q-col-gutter-md q-pt-md">
              <form-field-validated-input
                class="col-xs-12 col-sm-6"
                name="surveyRequest.area"
                attribute="Area"
                label="Area (eg; km^2)"
                hint="Optional"
                :value="surveyRequest.area"
                @input="update({path:'surveyRequest.area', value:$event})"
                @blur="$v.surveyRequest.area.$touch"
                type="text"
                :readonly="readonly"
                >
              </form-field-validated-input>

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


          </q-card-section>
        </q-card>


        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> Business </div>
          </q-card-section>
          <q-card-section class="column q-col-gutter-md">
            <form-field-validated-input
              name="surveyRequest.businessJustification"
              attribute="Business Justification"
              label="Business Justification"
              :value="surveyRequest.businessJustification"
              @input="update({path:'surveyRequest.businessJustification', value:$event})"
              @blur="$v.surveyRequest.businessJustification.$touch"
              type="textarea"
              :readonly="readonly"
              >
            </form-field-validated-input>

          </q-card-section>
        </q-card>


        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> Survey Requirements </div>
          </q-card-section>
          <q-card-section class="column q-col-gutter-md">

            <!-- options-selected-class="text-secondary" -->
            <form-field-validated-select-multiple-check
              multiple
              name="surveyRequest.purposes"
              attribute="Request purpose"
              :value="surveyRequest.purposes"
              @input="updateSurveyRequest({path:'purposes', value:$event})"
              :options="requestPurposeOptions"
              label="Purpose"
              clearable
              option-label="name"
              option-value="id"
              emit-values map-options
              @blur="$v.surveyRequest.purposes.$touch"
              :readonly="readonly"
            >
            </form-field-validated-select-multiple-check>

            <form-field-validated-select-multiple-check
              class="col-12"
              multiple
              name="surveyRequest.surveyQualityRequirements"
              attribute="Survey Quality Requirements"
              label="Survey Quality Requirements"
              :value="surveyRequest.surveyQualityRequirements"
              @input="updateSurveyRequest({path:'surveyQualityRequirements', value:$event})"
              :options="surveyQualityRequirements"
              option-label="name"
              option-value="id"
              emit-value map-options
              @blur="$v.surveyRequest.surveyQualityRequirements.$touch"
              clearable
              :readonly="readonly"
              >
            </form-field-validated-select-multiple-check>

            <form-field-validated-input
              name="surveyRequest.surveyQualityRequirementsComments"
              attribute="Survey Quality Requirements Comments"
              label="Survey Quality Requirements Comments"
              hint="Optional"
              :value="surveyRequest.surveyQualityRequirementsComments"
              @input="update({path:'surveyRequest.surveyQualityRequirementsComments', value:$event})"
              @blur="$v.surveyRequest.surveyQualityRequirementsComments.$touch"
              type="textarea"
              :readonly="readonly"
              >
            </form-field-validated-input>

            <form-field-validated-select-multiple-check
              class="col-12"
              multiple
              name="surveyRequest.chartProductQualityImpactRequirements"
              attribute="Chart Product Quality Impact Requirements"
              label="Chart Product Quality Impact Requirements"
              :value="surveyRequest.chartProductQualityImpactRequirements"
              @input="updateSurveyRequest({path:'chartProductQualityImpactRequirements', value:$event})"
              :options="chartProductQualityImpactRequirements"
              option-label="name"
              option-value="value"
              emit-value map-options
              @blur="$v.surveyRequest.chartProductQualityImpactRequirements.$touch"
              clearable
              :readonly="readonly"
              >
            </form-field-validated-select-multiple-check>

            <form-field-validated-input
              name="surveyRequest.chartProductQualityImpactRequirementsComments"
              attribute="Chart Product Quality Impact Requirements Comments"
              label="Chart Product Quality Impact Requirements Comments"
              hint="Optional"
              :value="surveyRequest.chartProductQualityImpactRequirementsComments"
              @input="update({path:'surveyRequest.chartProductQualityImpactRequirementsComments', value:$event})"
              @blur="$v.surveyRequest.chartProductQualityImpactRequirementsComments.$touch"
              type="textarea"
              :readonly="readonly"
              >
            </form-field-validated-input>

            <form-field-validated-select-multiple-check
              class="col-12"
              multiple
              name="surveyRequest.dataCaptureTypes"
              attribute="Data to Capture"
              label="Data to Capture"
              :value="surveyRequest.dataCaptureTypes"
              @input="updateSurveyRequest({path:'dataCaptureTypes', value:$event})"
              :options="dataCaptureTypes"
              option-label="name"
              option-value="id"
              @blur="$v.surveyRequest.dataCaptureTypes.$touch"
              clearable
              :readonly="readonly"
              >
            </form-field-validated-select-multiple-check>

          </q-card-section>
        </q-card>

        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> General </div>
          </q-card-section>
          <q-card-section class="column q-col-gutter-md items-stretch">

            <form-field-validated-input
              name="surveyRequest.comments"
              attribute="Comments"
              label="Comments"
              hint="Optional"
              :value="surveyRequest.comments"
              @input="update({path:'surveyRequest.comments', value:$event})"
              @blur="$v.surveyRequest.comments.$touch"
              type="textarea"
              :readonly="readonly"
              >
            </form-field-validated-input>

            <div class="column col-12 q-pt-md">
              <div class="date-range-field-label">Date range</div>
              <div class="row q-col-gutter-md">
                <form-field-validated-date
                  class="col-xs-12 col-sm-6"
                  name="surveyRequest.requestDateStart"
                  attribute="Start date"
                  label="Start date (YYYY/MM/DD)"
                  :date="surveyRequest.requestDateStart"
                  @updated-date="update({path:'surveyRequest.requestDateStart', value:$event})"
                  @blur="$v.surveyRequest.requestDateStart.$touch"
                  :readonly="readonly"
                  >
                </form-field-validated-date>

                <form-field-validated-date
                  class="col-xs-12 col-sm-6"
                  name="surveyRequest.requestDateEnd"
                  attribute="End date"
                  label="End date (YYYY/MM/DD)"
                  :date="surveyRequest.requestDateEnd"
                  @updated-date="update({path:'surveyRequest.requestDateEnd', value:$event})"
                  @blur="$v.surveyRequest.requestDateEnd.$touch"
                  :readonly="readonly"
                  >
                </form-field-validated-date>
              </div>
            </div>

          </q-card-section>
        </q-card>


        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> Risk </div>
          </q-card-section>
          <q-card-section class="column q-col-gutter-md items-stretch">

            <risk-widget
              :risk-matrix="riskMatrix"
              :risk-data="surveyRequest.riskData"
              :readonly="readonly"
              @updated-risks="risksUpdated($event)"
              :can-view-priority="hasPermission('canViewRiskPriority')"
              :single-risk="true"
              >
            </risk-widget>

            <form-field-validated-input
              name="surveyRequest.riskIssues"
              attribute="Risk Issues"
              label="Risk Issues"
              hint="Optional"
              :value="surveyRequest.riskIssues"
              @input="update({path:'surveyRequest.riskIssues', value:$event})"
              @blur="$v.surveyRequest.riskIssues.$touch"
              type="textarea"
              :readonly="readonly"
              >
            </form-field-validated-input>

          </q-card-section>
        </q-card>


        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> Moratorium </div>
          </q-card-section>
          <q-card-section >
            <div class="column">
              <div class="row q-col-gutter-md">
                <q-field
                  class="col-xs-12 col-sm-6"
                  stack-label
                  label="Subject to moratorium"
                  hint="Optional"
                  bottom-slots
                  :readonly="readonly"
                  >
                  <q-checkbox
                    :value="surveyRequest.hasMoratorium"
                    @input="update({path:'surveyRequest.hasMoratorium', value: $event})"
                    />
                </q-field>

                <form-field-validated-date
                  class="col-xs-12 col-sm-6"
                  v-if="surveyRequest.hasMoratorium"
                  name="surveyRequest.moratoriumDate"
                  attribute="Date moratorium ends"
                  label="Date moratorium ends (YYYY/MM/DD)"
                  :date="surveyRequest.moratoriumDate"
                  @updated-date="update({path:'surveyRequest.moratoriumDate', value:$event})"
                  @blur="$v.surveyRequest.moratoriumDate.$touch"
                  :readonly="readonly"
                  >
                </form-field-validated-date>
              </div>

              <form-field-validated-input
                v-if="surveyRequest.hasMoratorium"
                name="surveyRequest.moratoriumComment"
                attribute="Moratorium Comments"
                label="Moratorium Comments"
                hint="Optional"
                :value="surveyRequest.moratoriumComment"
                @input="update({path:'surveyRequest.moratoriumComment', value:$event})"
                @blur="$v.surveyRequest.moratoriumComment.$touch"
                type="textarea"
                :readonly="readonly"
                >
              </form-field-validated-input>
            </div>

          </q-card-section>
        </q-card>

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
import { errorHandler } from './../mixins/error-handling'
import { permission } from './../mixins/permission'
import * as hippMutTypes
  from '../../store/modules/survey-request/survey-request-mutation-types'
import * as custodianMutTypes
  from '../../store/modules/custodian/custodian-mutation-types'
import * as organisationMutTypes
  from '../../store/modules/organisation/organisation-mutation-types'
import OlMap from './../olmap/olmap';
import { required, email, minLength, minValue, maxValue }
  from 'vuelidate/lib/validators';

import RiskWidget from '../controls/risk/risk-widget';

const timespan = require('readable-timespan');
timespan.set({
  lessThanFirst: 'now',
  millisecond: false
});

import axios from 'axios';
const path = require('path');

// custom validators
const validMoratorium = (value, vm) => {
  if (vm.hasMoratorium) {
    // only needs date if the moratorium check has been set
    return !_.isNil(vm.moratoriumDate)
  } else {
    return true
  }
};

export default Vue.extend({
  mixins: [DirtyRouteGuard, errorHandler, permission],
  components: {
    'risk-widget': RiskWidget,
  },
  beforeMount() {
    this.getFormData();
  },

  async mounted() {
    var olmap = OlMap(this.$refs.mapDiv, {
      basemap: "osm"
    })
    await olmap.initMap(false);
    this.map = olmap;
    this.map.onAdd = (geojson) => {
      this.update({
        path: "surveyRequest.areaOfInterest",
        value: Object.freeze(geojson)
      });
      this.updateFromGeojson(geojson);
    }
    this.map.onFileAddStart = () => {
      this.addingFile = true;
    }
    this.map.onFileAddDone = () => {
      this.addingFile = false;
    }
    this.map.drawStart = () => {
      this.drawingAreaOfInterest = true;
    }
    this.map.drawEnd = () => {
      this.drawingAreaOfInterest = false;
    }
    this.map.onFileAddBad = (msg) => {
      this.$q.dialog({
        title: 'Error adding file',
        message: msg,
        ok: 'Ok'
      })
    }

    this.fetchData();
  },

  methods: {
    ...mapActions('surveyRequest', [
      'getSurveyRequest',
      'saveSurveyRequest',
      'getRiskMatrix',
      'getChartProductQualityImpactRequirements',
      'getSurveyQualityRequirements',
      'deleteSurveyRequest',
      'getGeojsonAttributeMap',
    ]),
    ...mapActions('custodian', [
      'getCustodians',
    ]),
    ...mapActions('reportTemplate', [
      'generateReport',
    ]),
    ...mapActions('requestPurpose', [
      'getRequestPurposes',
    ]),
    ...mapActions('dataCaptureType', [
      'getDataCaptureTypes',
    ]),
    ...mapActions('organisation', [
      'getOrganisations',
    ]),
    ...mapMutations('surveyRequest', {
      'setDirty': hippMutTypes.SET_DIRTY,
      'update': hippMutTypes.UPDATE,
      'resetSurveyRequest': hippMutTypes.RESET_HIPP_REQUEST,
      'updateSurveyRequest': hippMutTypes.UPDATE_HIPP_REQUEST,
    }),
    ...mapMutations('custodian', {
      'setDeletedCustodians': custodianMutTypes.SET_DELETED_CUSTODIANS,
    }),
    ...mapMutations('organisation', {
      'setOrganisationFilter': organisationMutTypes.SET_FILTER,
    }),

    fetchData () {
      if (this.$route.params.id) {
        // if id given, then load this hipp request
        this.loadingData = true
        this.getSurveyRequest({ id: this.$route.params.id }).then(hr => {
          this.loadingData = false
        })
      } else {
        // a new hipp request so clear whatever is in store
        this.resetSurveyRequest()
      }
    },

    setFormattedRequestDate(requestDate) {
      if (_.isNil(requestDate)) {
        this.update({path:'surveyRequest.requestDate', value:undefined})
        return
      }
      let d = Date.parse(requestDate)
      this.update({path:'surveyRequest.requestDate', value:d})
    },

    setFormattedMoratoriumDate(requestDate) {
      this.tmpMoratoriumDateEntry = requestDate;
      // check if no text provided, or if the string contains two / chars
      if (_.isNil(requestDate) || (requestDate.match(/\//g) || []).length != 2) {
        this.update({path:'surveyRequest.moratoriumDate', value:undefined})
        return
      }
      let d = Date.parse(requestDate)
      if (_.isNaN(d)) {
        this.update({path:'surveyRequest.moratoriumDate', value:undefined})
        return
      }
      this.update({path:'surveyRequest.moratoriumDate', value:d})
    },

    submit() {
      this.validationIntent = 'save';

      this.$v.$touch()

      if (this.$v.$error) {
        this.notifyError('Please review fields')
        return
      }

      const isNew = (
        _.isNil(this.surveyRequest.id) ||
        this.surveyRequest.id.length == 0)

      this.saveSurveyRequest().then((hr) => {
        if (isNew) {
          this.$router.replace({ path: `/hipp-request/${hr.id}/summary` })
        }
        this.notifySuccess('Saved HIPP Request')
      })
    },

    deleteSurveyRequestClick() {
      if (this.surveyRequest.id) {
        // an existing id indicated this project has been saved, so check
        // with user if they really want to delete project.
        this.$q.dialog({
          title: 'Delete HIPP Request',
          message: `HIPP Request ${this.surveyRequest.name} will be deleted`,
          ok: 'Delete',
          cancel: 'Cancel'
        }).onOk(() => {
          this.deleteSurveyRequest({ id: this.surveyRequest.id })
          .then(pmd => {
            this.notifySuccess('Deleted HIPP Request');
            this.$router.replace({ path: `/` });
          });
        })
      } else {
        // no id, so hasn't been saved. I this case reset form and go back
        // to main page.
        this.resetSurveyRequest()
        this.$router.replace({ path: `/` })
      }
    },

    getFormData() {
      this.stateReadonly = true;
      // only get non-deleted custodians
      this.setDeletedCustodians(false);
      // gets the list of all custodians, not just those associated to this project
      this.getCustodians();

      // get misc lists for populating drop downs
      this.getRiskMatrix();
      this.getChartProductQualityImpactRequirements();
      this.getSurveyQualityRequirements();
      this.getRequestPurposes();
      this.getDataCaptureTypes({
        params: {
          userSubmitted: false,
          request: true,
        }
      });
      this.getGeojsonAttributeMap();
      this.getOrganisations();
    },

    selectAreaOfInterestFile () {
      this.$refs.fileInput.click();
    },
    setAreaOfInterestFile (event) {
      console.log(event);
      this.map.addFile(event.target.files[0]);
    },
    risksUpdated(event) {
      let path = `surveyRequest.riskData${event.path}`
      this.update({path:path, value:event.value})
    },
    stateUpdated(state) {
      if (_.isNil(state)) {
        this.stateReadonly = true
      } else {
        this.stateReadonly = state.readonly
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

    updateFromGeojson(geojson) {
      if (geojson.features.length == 0) {
        console.log("no features")
        return
      }
      // only process first feature. The HIPP request form only supports
      // single features
      const feature = geojson.features[0];
      const props = feature.properties;
      let propCount = 0;

      // count how many properties we know what to do with that are in the
      // geojson. May be the AHO DB name or the entity attribute name.
      this.geojsonAttributeMap.forEach(mi => {
        const entityAttrName = mi[0];
        const jsonAttrName = mi[1];
        if (_.has(props, jsonAttrName)) {
          propCount += 1;
        }
        if (_.has(props, entityAttrName)) {
          propCount += 1;
        }
      });

      if (propCount == 0) {
        // if there's no properties that we understand, then just return.
        return
      }

      // ask the user if they want to apply changes
      this.$q.dialog({
        title: 'Apply properties from upload',
        message: `The uploaded geometry contains properties that can be used to update the request form fields. Would you like to apply these properties?`,
        ok: 'Apply',
        cancel: 'Skip'
      }).onOk(() => {
        this.geojsonAttributeMap.forEach(mi => {
          const entityAttrName = mi[0];
          const jsonAttrName = mi[1];
          let value = undefined;
          if (_.has(props, jsonAttrName)) {
            value = _.get(props, jsonAttrName)
          } else if (_.has(props, entityAttrName)) {
            value = _.get(props, entityAttrName)
          }

          this.updateSurveyRequest({
            path:entityAttrName,
            value:value,
          })
        });
      })

    },

    filterOrganisationFunction(val, update, abort) {
      this.setOrganisationFilter(val)
      this.getOrganisations().then((orgs) => {
        update()
      })
    },
  },

  computed: {
    ...mapGetters('surveyRequest', [
      'surveyRequest',
      'dirty',
      'riskMatrix',
      'chartProductQualityImpactRequirements',
      'surveyQualityRequirements',
      'geojsonAttributeMap',
    ]),
    ...mapGetters('custodian', [
      'custodians',
    ]),
    ...mapGetters('reportTemplate', [
      'reportDownloading',
    ]),
    ...mapGetters('requestPurpose', [
      'requestPurposes',
    ]),
    ...mapGetters('dataCaptureType', [
      'dataCaptureTypes',
    ]),
    ...mapGetters('organisation', {
      organisationsList: 'organisations',
    }),
    readonly: function() {
      if (
        this.hasPermission('canAddSurveyRequest') &&
        _.isNil(this.surveyRequest.id)
      ) {
        // user has permission to add new request, and this is a new request
        // this is a new request, so no need to worry about record state
        return false
      }

      if (this.stateReadonly) {
        // if the state says read only
        return true
      }
      if (this.hasPermission('canEditAllSurveyRequests')) {
        // can edit all projects
        return false
      }
      else if (
        this.hasPermission('canEditCustodianSurveyRequests') &&
        this.hasCustodianLink('surveyRequest.custodians')
      ) {
        // can only edit hipp requests that are linked to user
        return false
      } else {
        return true
      }
    },
    formattedRequestDate: function() {
      if (_.isNil(this.surveyRequest.requestDate)) {
        return undefined;
      }
      const d = new Date();
      d.setTime(this.surveyRequest.requestDate);
      let formattedString = date.formatDate(d, 'YYYY/MM/DD')
      return formattedString
    },
    formattedMoratoriumDate: function() {
      if (_.isNil(this.tmpMoratoriumDateEntry) && !_.isNil(this.surveyRequest.moratoriumDate)) {
        const d = new Date();
        d.setTime(this.surveyRequest.moratoriumDate);
        let formattedString = date.formatDate(d, 'YYYY/MM/DD')
        this.tmpMoratoriumDateEntry = formattedString
      }
      return this.tmpMoratoriumDateEntry
    },
    calculatedArea: function() {
      if (_.isNil(this.map)) {
        return undefined
      } else {
        let calcArea = this.map.getArea()
        let strArea = undefined
        if (calcArea > 10000) {
          strArea = `${Math.round(calcArea / 1000000 * 100) / 100} km²`
        } else {
          strArea = `${Math.round(calcArea * 100) / 100} m²`
        }
        return strArea
      }

    },
    requestPurposeOptions: function() {
      if (_.isNil(this.requestPurposes) || this.requestPurposes.length == 0) {
        return []
      } else {
        const groupedPurposes = _.groupBy(this.requestPurposes, 'group')
        let groupedPurposesList = _.values(groupedPurposes)
        // remove all zero length entries
        groupedPurposesList = groupedPurposesList.filter(item => {
          return item.length > 0
        })
        // now sort them based on the groupOrder attribute
        groupedPurposesList.sort((a,b) => {
          return a[0].groupOrder - b[0].groupOrder
        })
        const options = []
        for (const pl of groupedPurposesList) {
          options.push({
            disable: true,
            group: pl[0].group,
          })
          pl.sort((a,b) => {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
          })
          for (const p of pl) {
            options.push({
              name: p.name,
              id: p.id,
              value: p,
              description: undefined,
            })
          }
        }
        return options
      }
    }

  },

  validations() {
    if (this.validationIntent == 'save') {
      return {
        surveyRequest: {
          name: { required },
          custodians: { required, minLength:minLength(1) },
          organisations: { },
          requestorName: { required },
          requestorPosition: { },
          pointOfContactEmail: { required, email },
          pointOfContactPhone: {},
          requestDateStart: { },
          requestDateEnd: { },
          comments: {},
          area: {},
          areaOfInterest: { },
          businessJustification: {},
          moratoriumDate: {},
          moratoriumComment: {},
          purposes: { },
          dataCaptureTypes: { },

          surveyQualityRequirements: { },
          surveyQualityRequirementsComments: {},
          chartProductQualityImpactRequirements: { },
          chartProductQualityImpactRequirementsComments: {},

          riskIssues: {},
        }
      }
    } else if (this.validationIntent == 'final') {
      return {
        surveyRequest: {
          name: { required },
          custodians: { required, minLength:minLength(1) },
          organisations: {
            required,
            minLength:minLength(1)
          },
          requestorName: { required },
          requestorPosition: { },
          pointOfContactEmail: { required, email },
          pointOfContactPhone: { required },
          requestDateStart: { required, maxValue:maxValue(this.surveyRequest.requestDateEnd) },
          requestDateEnd: { required, minValue:minValue(this.surveyRequest.requestDateStart) },
          comments: {},
          area: {},
          areaOfInterest: { required },
          businessJustification: { required },
          moratoriumDate: {},
          moratoriumComment: {},
          purposes: { },
          dataCaptureTypes: { },

          surveyQualityRequirements: { required, minLength:minLength(1) },
          surveyQualityRequirementsComments: {},
          chartProductQualityImpactRequirements: { required, minLength:minLength(1) },
          chartProductQualityImpactRequirementsComments: {},

          riskIssues: {},
        }
      }
    }
  },

  watch: {
    // update data if route changes to a new id
    '$route': function (newRoute, oldRoute) {
      if (this.id == newRoute.params.id) {
        // then we've only set the url, no need to fetch new data
      } else {
        this.fetchData();
      }
    },
    'surveyRequest.hasMoratorium': function (newM, oldM) {
      this.$v.surveyRequest.moratoriumDate.$touch()
    },
    'surveyRequest.areaOfInterest': function (newArea, oldArea) {
      this.map.clear();
      if (newArea) {
        this.map.addGeojsonFeature(newArea);
      }
    },
  },

  data() {
    return {
      addingFile: false,
      drawingAreaOfInterest: false,
      loadingData: false,
      map: undefined,
      stateReadonly: true,
      tmpMoratoriumDateEntry: undefined,
      validationIntent: 'save', // `save` or `final`
      validationMessagesOverride: {
        validMoratorium: "Must provide valid moratorium date",
        minValue: '{attribute} is before start date.',
        maxValue: '{attribute} is after end date.',
      }
    }
  }
});

</script>

<style>
.date-range-field-label {
  color: rgba(0,0,0,0.6);
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
}

.request-purpose-group-item {
    border-top-color: rgba(0, 0, 0, 0.12);
    border-top-style: solid;
    border-top-width: 1px;
}
</style>
