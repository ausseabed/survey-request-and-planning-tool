<template>
  <form-wrapper :validator="$v" :messages="validationMessagesOverride">

    <q-page padding class="docs-input row justify-center">
      <q-page-sticky
        position="top-right"
        :offset="hippRequest.id ? [18, 18+66] : [18, 18]"
        style="z-index:100" >

        <div class="row q-gutter-x-sm">
          <q-btn
            round
            color="primary"
            @click="submit"
            icon="save"
          >
            <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 4]">Save summary</q-tooltip>
          </q-btn>
          <q-btn
            @click="generateReport({id: hippRequest.id, templateType: 'HIPP Request'})"
            :disable="!hippRequest.id"
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
            :href="`/api/report-template/generate/HIPP Request/${hippRequest.id}?format=csv`"
            :disable="!hippRequest.id"
            round
            color="primary"
            icon="dehaze">
            <q-tooltip>
              Download as CSV
            </q-tooltip>
          </q-btn>
          <q-btn :disable="!hippRequest.id"
            round
            color="primary"
            @click="deleteHippRequest"
            icon="delete"
          >
            <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 4]">Delete project</q-tooltip>
          </q-btn>
        </div>
      </q-page-sticky>

      <div style="width: 900px; max-width: 90vw;" class="column q-gutter-md no-wrap">
        <div v-if="!hippRequest.id" class="text-h5"> New HIPP Request </div>
        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> Basic </div>
          </q-card-section>
          <q-card-section>
            <form-field-validated-input
              name="hippRequest.name"
              attribute="name"
              label="Name"
              :value="hippRequest.name"
              @input="update({path:'hippRequest.name', value:$event})"
              @blur="$v.hippRequest.name.$touch"
              type="text"
              >
            </form-field-validated-input>

            <form-field-validated-select
              name="hippRequest.requestingAgencies"
              attribute="Requesting Agencies"
              label="Requesting Agencies"
              multiple use-chips
              :value="hippRequest.requestingAgencies"
              @input="update({path:'hippRequest.requestingAgencies', value:$event})"
              :options="organisations"
              option-label="name"
              option-value="id"
              @blur="$v.hippRequest.requestingAgencies.$touch"
              >
            </form-field-validated-select>

            <form-field-validated-input
              name="hippRequest.requestorName"
              attribute="Requestor’s Name"
              label="Requestor’s Name"
              :value="hippRequest.requestorName"
              @input="update({path:'hippRequest.requestorName', value:$event})"
              @blur="$v.hippRequest.requestorName.$touch"
              type="text"
              >
            </form-field-validated-input>

            <form-field-validated-input
              name="hippRequest.pointOfContactEmail"
              label="Contact email"
              attribute="Contact email"
              :value="hippRequest.pointOfContactEmail"
              @input="update({path:'hippRequest.pointOfContactEmail', value:$event})"
              @blur="$v.hippRequest.pointOfContactEmail.$touch"
              type="email"
              >
            </form-field-validated-input>

            <form-field-validated-input
              name="hippRequest.pointOfContactPhone"
              label="Contact phone number"
              attribute="Contact phone number"
              hint="Optional"
              :value="hippRequest.pointOfContactPhone"
              @input="update({path:'hippRequest.pointOfContactPhone', value:$event})"
              @blur="$v.hippRequest.pointOfContactPhone.$touch"
              type="text"
              >
            </form-field-validated-input>

            <div class="column col-12 q-pt-md">
              <div class="date-range-field-label">Date range</div>
              <div class="row q-col-gutter-md">
                <form-field-validated-date
                  class="col-xs-12 col-sm-6"
                  name="hippRequest.requestDateStart"
                  attribute="Start date"
                  label="Start date (YYYY/MM/DD)"
                  :date="hippRequest.requestDateStart"
                  @updated-date="update({path:'hippRequest.requestDateStart', value:$event})"
                  @blur="$v.hippRequest.requestDateStart.$touch"
                  >
                </form-field-validated-date>

                <form-field-validated-date
                  class="col-xs-12 col-sm-6"
                  name="hippRequest.requestDateEnd"
                  attribute="End date"
                  label="End date (YYYY/MM/DD)"
                  :date="hippRequest.requestDateEnd"
                  @updated-date="update({path:'hippRequest.requestDateEnd', value:$event})"
                  @blur="$v.hippRequest.requestDateEnd.$touch"
                  >
                </form-field-validated-date>
              </div>
            </div>


            <form-field-validated-input
              name="hippRequest.comments"
              attribute="Comments"
              label="Comments"
              hint="Optional"
              :value="hippRequest.comments"
              @input="update({path:'hippRequest.comments', value:$event})"
              @blur="$v.hippRequest.comments.$touch"
              type="textarea"
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
              name="hippRequest.areaName"
              attribute="Area Name"
              label="Name of the Area to be surveyed"
              :value="hippRequest.areaName"
              @input="update({path:'hippRequest.areaName', value:$event})"
              @blur="$v.hippRequest.areaName.$touch"
              type="text"
              >
            </form-field-validated-input>

            <q-field
              label="Area of interest (optional)"
              stack-label
              >
              <div class="column full-width">
                <div ref="mapDiv" id="mapDiv" style="height:350px;"></div>
                <div class="row full-width justify-between items-center q-pb-sm">
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
                    Drag and drop shapefile (zip) or geojson onto map, or click the draw shape button in map to manually create request area.
                  </div>
                  <div class="map-buttons q-gutter-sm col">
                    <div class="row justify-between q-gutter-sm">
                      <div class="col">
                        <q-btn class="no-margin full-width" icon="cloud_upload" label="Upload"
                          :disable="addingFile"
                          @click="selectAreaOfInterestFile">
                        </q-btn>
                      </div>
                      <div class="col">
                        <input type="file" id="dataPath" v-on:change="setAreaOfInterestFile" ref="fileInput" hidden />
                        <q-btn class="no-margin full-width" icon="clear" label="Clear"
                          :disable="!hippRequest.areaOfInterest"
                          @click="update({path:'hippRequest.areaOfInterest', value:undefined })">
                        </q-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-field>

            <div class="row q-col-gutter-md q-pt-md">
              <form-field-validated-input
                class="col-xs-12 col-sm-6"
                name="hippRequest.area"
                attribute="Area"
                label="Area (eg; km^2)"
                hint="Optional"
                :value="hippRequest.area"
                @input="update({path:'hippRequest.area', value:$event})"
                @blur="$v.hippRequest.area.$touch"
                type="text"
                >
              </form-field-validated-input>

              <form-field-validated-input
                class="col-xs-12 col-sm-6"
                disable
                attribute="Calculated area"
                hint="Area calculated from area of interest"
                label="Calculated area"
                :value="calculatedArea"
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
              name="hippRequest.businessJustification"
              attribute="Business Justification"
              label="Business Justification"
              hint="Optional"
              :value="hippRequest.businessJustification"
              @input="update({path:'hippRequest.businessJustification', value:$event})"
              @blur="$v.hippRequest.businessJustification.$touch"
              type="textarea"
              >
            </form-field-validated-input>

            <form-field-validated-input
              name="hippRequest.costBenefit"
              attribute="Cost Benefit"
              label="Cost Benefit"
              hint="Optional"
              :value="hippRequest.costBenefit"
              @input="update({path:'hippRequest.costBenefit', value:$event})"
              @blur="$v.hippRequest.costBenefit.$touch"
              type="textarea"
              >
            </form-field-validated-input>
          </q-card-section>
        </q-card>


        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> Quality </div>
          </q-card-section>
          <q-card-section class="column q-col-gutter-md">
            <form-field-validated-select
              class="col-12"
              multiple
              name="hippRequest.surveyQualityRequirements"
              attribute="Survey Quality Requirements"
              label="Survey Quality Requirements"
              :value="hippRequest.surveyQualityRequirements"
              @input="update({path:'hippRequest.surveyQualityRequirements', value:$event})"
              :options="surveyQualityRequirements"
              option-label="label"
              option-value="value"
              emit-value map-options
              @blur="$v.hippRequest.surveyQualityRequirements.$touch"
              clearable
              >
            </form-field-validated-select>

            <form-field-validated-input
              name="hippRequest.surveyQualityRequirementsComments"
              attribute="Survey Quality Requirements Comments"
              label="Survey Quality Requirements Comments"
              hint="Optional"
              :value="hippRequest.surveyQualityRequirementsComments"
              @input="update({path:'hippRequest.surveyQualityRequirementsComments', value:$event})"
              @blur="$v.hippRequest.surveyQualityRequirementsComments.$touch"
              type="textarea"
              >
            </form-field-validated-input>

            <form-field-validated-select
              class="col-12"
              multiple
              name="hippRequest.chartProductQualityImpactRequirements"
              attribute="Chart Product Quality Impact Requirements"
              label="Chart Product Quality Impact Requirements"
              :value="hippRequest.chartProductQualityImpactRequirements"
              @input="update({path:'hippRequest.chartProductQualityImpactRequirements', value:$event})"
              :options="chartProductQualityImpactRequirements"
              option-label="label"
              option-value="value"
              emit-value map-options
              @blur="$v.hippRequest.chartProductQualityImpactRequirements.$touch"
              clearable
              >
            </form-field-validated-select>

            <form-field-validated-input
              name="hippRequest.chartProductQualityImpactRequirementsComments"
              attribute="Chart Product Quality Impact Requirements Comments"
              label="Chart Product Quality Impact Requirements Comments"
              hint="Optional"
              :value="hippRequest.chartProductQualityImpactRequirementsComments"
              @input="update({path:'hippRequest.chartProductQualityImpactRequirementsComments', value:$event})"
              @blur="$v.hippRequest.chartProductQualityImpactRequirementsComments.$touch"
              type="textarea"
              >
            </form-field-validated-input>

          </q-card-section>
        </q-card>

        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> Risk </div>
          </q-card-section>
          <q-card-section class="column q-col-gutter-md items-stretch">

            <risk-widget
              :risk-matrix="riskMatrix"
              :risk-data="hippRequest.riskData"
              @updated-risks="risksUpdated($event)"
              >
            </risk-widget>

            <form-field-validated-input
              name="hippRequest.riskIssues"
              attribute="Risk Issues"
              label="Risk Issues"
              hint="Optional"
              :value="hippRequest.riskIssues"
              @input="update({path:'hippRequest.riskIssues', value:$event})"
              @blur="$v.hippRequest.riskIssues.$touch"
              type="textarea"
              >
            </form-field-validated-input>

          </q-card-section>
        </q-card>


        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> Moratorium </div>
          </q-card-section>
          <q-card-section class="row q-col-gutter-md">
            <q-field
              class="col-xs-12 col-sm-6"
              stack-label
              label="Subject to moratorium"
              hint="Optional"
              bottom-slots>
              <q-checkbox
                :value="hippRequest.hasMoratorium"
                @input="update({path:'hippRequest.hasMoratorium', value: $event})"
                />
            </q-field>

            <form-field-validated-date
              class="col-xs-12 col-sm-6"
              v-if="hippRequest.hasMoratorium"
              name="hippRequest.moratoriumDate"
              attribute="Date moratorium ends"
              label="Date moratorium ends (YYYY/MM/DD)"
              :date="hippRequest.moratoriumDate"
              @updated-date="update({path:'hippRequest.moratoriumDate', value:$event})"
              @blur="$v.hippRequest.moratoriumDate.$touch"
              >
            </form-field-validated-date>
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
import * as hippMutTypes
  from '../../store/modules/hipp-request/hipp-request-mutation-types'
import * as orgMutTypes
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
  mixins: [DirtyRouteGuard, errorHandler],
  components: {
    'risk-widget': RiskWidget
  },
  beforeMount() {
    this.getFormData();
  },

  async mounted() {
    var olmap = OlMap(this.$refs.mapDiv, {
      basemap: "osm"
    })
    await olmap.initMap();
    this.map = olmap;
    this.map.onAdd = (geojson) => {
      this.update({
        path: "hippRequest.areaOfInterest",
        value: Object.freeze(geojson)
      });
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

    this.fetchData();
  },

  methods: {
    ...mapActions('hippRequest', [
      'getHippRequest',
      'saveHippRequest',
      'getRiskMatrix',
      'getChartProductQualityImpactRequirements',
      'getSurveyQualityRequirements',
    ]),
    ...mapActions('organisation', [
      'getOrganisations',
    ]),
    ...mapActions('reportTemplate', [
      'generateReport',
    ]),
    ...mapMutations('hippRequest', {
      'setDirty': hippMutTypes.SET_DIRTY,
      'update': hippMutTypes.UPDATE,
      'resetHippRequest': hippMutTypes.RESET_HIPP_REQUEST,
    }),
    ...mapMutations('organisation', {
      'setDeletedOrganisations': orgMutTypes.SET_DELETED_ORGANISATIONS,
    }),

    fetchData () {
      if (this.$route.params.id) {
        // if id given, then load this hipp request
        this.loadingData = true
        this.getHippRequest({ id: this.$route.params.id }).then(hr => {
          this.loadingData = false
        })
      } else {
        // a new hipp request so clear whatever is in store
        this.resetHippRequest()
      }
    },

    setFormattedRequestDate(requestDate) {
      if (_.isNil(requestDate)) {
        this.update({path:'hippRequest.requestDate', value:undefined})
        return
      }
      let d = Date.parse(requestDate)
      this.update({path:'hippRequest.requestDate', value:d})
    },

    setFormattedMoratoriumDate(requestDate) {
      this.tmpMoratoriumDateEntry = requestDate;
      // check if no text provided, or if the string contains two / chars
      if (_.isNil(requestDate) || (requestDate.match(/\//g) || []).length != 2) {
        this.update({path:'hippRequest.moratoriumDate', value:undefined})
        return
      }
      let d = Date.parse(requestDate)
      if (_.isNaN(d)) {
        this.update({path:'hippRequest.moratoriumDate', value:undefined})
        return
      }
      this.update({path:'hippRequest.moratoriumDate', value:d})
    },

    submit() {
      this.$v.$touch()

      if (this.$v.$error) {
        this.notifyError('Please review fields')
        return
      }

      const isNew = (
        _.isNil(this.hippRequest.id) ||
        this.hippRequest.id.length == 0)

      this.saveHippRequest().then((hr) => {
        if (isNew) {
          this.$router.replace({ path: `/hipp-request/${hr.id}/summary` })
        }
        this.notifySuccess('Saved HIPP Request')
      })
    },

    deleteHippRequest() {
      if (this.hippRequest.id) {
        // an existing id indicated this project has been saved, so check
        // with user if they really want to delete project.
        this.$q.dialog({
          title: 'Delete HIPP Request',
          message: `HIPP Request ${this.hippRequest.name} will be deleted`,
          ok: 'Delete',
          cancel: 'Cancel'
        }).onOk(() => {
          // this.$store.dispatch(
          //   'projectMetadata/deleteProjectMetadata',
          //   { id: this.id }
          // ).then(pmd => {
          //   this.notifySuccess('Deleted project');
          //   this.$router.replace({ path: `/` });
          // });
        })
      } else {
        // no id, so hasn't been saved. I this case reset form and go back
        // to main page.
        this.resetHippRequest()
        this.$router.replace({ path: `/` })
      }
    },

    getFormData() {
      // only get non-deleted organisations
      this.setDeletedOrganisations(false);
      // gets the list of all orgs, not just those associated to this project
      this.getOrganisations();

      // get misc lists for populating drop downs
      this.getRiskMatrix();
      this.getChartProductQualityImpactRequirements();
      this.getSurveyQualityRequirements();
    },

    selectAreaOfInterestFile () {
      this.$refs.fileInput.click();
    },
    setAreaOfInterestFile (event) {
      console.log(event);
      this.map.addFile(event.target.files[0]);
    },
    risksUpdated(event) {
      let path = `hippRequest.riskData${event.path}`
      this.update({path:path, value:event.value})
    }
  },

  computed: {
    ...mapGetters('hippRequest', [
      'hippRequest',
      'dirty',
      'riskMatrix',
      'chartProductQualityImpactRequirements',
      'surveyQualityRequirements',
    ]),
    ...mapGetters('organisation', [
      'organisations',
    ]),
    ...mapGetters('reportTemplate', [
      'reportDownloading',
    ]),
    formattedRequestDate: function() {
      if (_.isNil(this.hippRequest.requestDate)) {
        return undefined;
      }
      const d = new Date();
      d.setTime(this.hippRequest.requestDate);
      let formattedString = date.formatDate(d, 'YYYY/MM/DD')
      return formattedString
    },
    formattedMoratoriumDate: function() {
      if (_.isNil(this.tmpMoratoriumDateEntry) && !_.isNil(this.hippRequest.moratoriumDate)) {
        const d = new Date();
        d.setTime(this.hippRequest.moratoriumDate);
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
          strArea = `${Math.round(calcArea / 1000000 * 100) / 100} km^2`
        } else {
          strArea = `${Math.round(calcArea * 100) / 100} m^2`
        }
        return strArea
      }

    }

  },

  validations() {
    return {
      hippRequest: {
        name: { required, minLength:minLength(1) },
        requestingAgencies: { required, minLength:minLength(1) },
        requestorName: { required },
        pointOfContactEmail: { required, email },
        pointOfContactPhone: {},
        requestDateStart: { required, maxValue:maxValue(this.hippRequest.requestDateEnd) },
        requestDateEnd: { required, minValue:minValue(this.hippRequest.requestDateStart) },
        comments: {},
        areaName: {required},
        area: {},
        businessJustification: {},
        costBenefit: {},
        moratoriumDate: {validMoratorium},

        surveyQualityRequirements: { required, minLength:minLength(1) },
        surveyQualityRequirementsComments: {},
        chartProductQualityImpactRequirements: { required, minLength:minLength(1) },
        chartProductQualityImpactRequirementsComments: {},

        riskIssues: {},
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
    'hippRequest.hasMoratorium': function (newM, oldM) {
      this.$v.hippRequest.moratoriumDate.$touch()
    },
    'hippRequest.areaOfInterest': function (newArea, oldArea) {
      this.map.clear();
      if (newArea) {
        this.map.addGeojsonFeature(newArea);
      }
    },
  },

  data() {
    return {
      addingFile: false,
      loadingData: false,
      drawingAreaOfInterest: false,
      map: undefined,
      tmpMoratoriumDateEntry: undefined,
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
</style>
