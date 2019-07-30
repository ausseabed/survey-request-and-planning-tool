<template>
  <form-wrapper :validator="$v" :messages="validationMessagesOverride"
    class="row justify-center">

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

          <q-btn
            @click="generateReport({id: projectMetadata.id, templateType: 'Plan'})"
            :disable="!projectMetadata.id"
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
            :href="`/api/report-template/generate/Plan/${projectMetadata.id}?format=csv`"
            :disable="!projectMetadata.id"
            round
            color="primary"
            icon="dehaze">
            <q-tooltip>
              Download as CSV
            </q-tooltip>
          </q-btn>

          <q-btn :disable="!id"
            v-if="!readonly"
            round
            color="primary"
            @click="deleteProject"
            icon="delete"
          >
            <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 4]">Delete plan</q-tooltip>
          </q-btn>
        </div>
      </q-page-sticky>

      <div style="width: 900px; max-width: 90vw;" class="column q-gutter-md no-wrap">
        <record-state
          v-if="projectMetadata.id"
          class="full-width"
          :entity-type="`project-metadata`"
          :entity-id="projectMetadata.id"
          :validation-callback="recordStateValidationCallback"
          :disable="dirty"
          @updated-state="stateUpdated($event)"
          >
        </record-state>
        <div v-if="!projectMetadata.id" class="text-h5"> New Plan </div>
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
              @input="update('projectMetadata.surveyName', $event)"
              @blur="$v.surveyName.$touch"
              type="text"
              :readonly="readonly"
              >
            </form-field-validated-input>

            <q-input
              label="Survey ID"
              hint="Optional"
              :value="surveyId"
              @input="update('projectMetadata.surveyId', $event)"
              type="text"
              :readonly="readonly"
              >
            </q-input>

            <q-field label="Status" stack-label>
              <template v-slot:control>
                <q-option-group
                  type="radio" inline
                  :value="projectStatus"
                  color="secondary"
                  @input="update('projectMetadata.projectStatus', $event)"
                  :options="projectStatusOptions"
                  :disable="readonly"
                />
              </template>
            </q-field>

            <form-field-validated-select
              name="projectOrganisations"
              label="Organisations"
              class="col-10"
              multiple use-chips
              :value="projectOrganisations"
              @input="setProjectOrganisations($event)"
              :options="organisationOptions"
              option-label="name"
              option-value="id"
              @blur="$v.projectOrganisations.$touch"
              :readonly="readonly"
              >
            </form-field-validated-select>

            <q-input
              icon="fas fa-user"
              label="Contact person"
              :error="$v.contactPerson.$error"
              error-message="Contact person is required"
              :value="contactPerson"
              @input="update('projectMetadata.contactPerson', $event)"
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
              @input="update('projectMetadata.email', $event)"
              @blur="$v.email.$touch"
              type="email"
              :readonly="readonly"
              >
            </form-field-validated-input>
          </q-card-section>
        </q-card>

        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> HIPP Request </div>
          </q-card-section>
          <q-card-section>
            <form-field-validated-select
              name="hippRequest"
              label="HIPP request"
              hint="Optional"
              :value="hippRequest"
              @input="update('projectMetadata.hippRequest', $event)"
              :options="hippRequests"
              option-label="name"
              option-value="id"
              @blur="$v.hippRequest.$touch"
              clearable
              :readonly="readonly"
              >
            </form-field-validated-select>
          </q-card-section>
        </q-card>

        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6">Area of Interest</div>
          </q-card-section>
          <q-card-section class="column">
            <div ref="mapDiv" id="mapDiv" style="height:350px;"></div>

            <div class="row">
              <template v-if="!matchingProjMetas">
                <p class="col-6 items-center q-body-2 text-center" style="padding:5px">Run check to identify intersecting surveys</p>
              </template>
              <template v-else-if="matchingProjMetas.length == 0">
                <p class="col-6 items-center q-body-2 text-center" style="padding:5px">No intersecting surveys</p>
              </template>
              <template v-else>
                <div class="column col-6 q-pt-sm">
                  <q-list highlight dense bordered
                    @mouseleave.native="mouseleaveMatchingProjMeta">
                    <q-item-label header>Intersecting surveys</q-item-label>
                    <q-separator />
                    <q-item dense
                      tag="a" class="interescting-project-links"
                      :href="`/survey/${matchingProjMeta.id}/summary`"
                      target="_blank"
                      v-for="matchingProjMeta in matchingProjMetas"
                      :key="matchingProjMeta.id"
                      @mouseover.native="mouseoverMatchingProjMeta(matchingProjMeta)"
                      >
                      <q-item-label>{{matchingProjMeta.surveyName}}</q-item-label>
                    </q-item>
                  </q-list>

                </div>
              </template>

              <div class="col-6">
                <div class="row justify-between q-col-gutter-sm no-margin">
                  <div class="col">
                    <q-btn class="no-margin full-width" icon="check" label="Check"
                      :disable="!areaOfInterest"
                      @click="checkGeometry">
                    </q-btn>
                  </div>
                  <div class="col">
                    <q-btn
                      v-if="!readonly"
                      class="no-margin full-width" icon="cloud_upload" label="Upload"
                      @click="selectAoiFile">
                    </q-btn>
                    <input type="file" id="dataPath" v-on:change="setAoiFile" ref="fileInput" hidden />
                  </div>
                  <div class="col">
                    <q-btn
                      v-if="!readonly"
                      class="no-margin full-width" icon="clear" label="Clear"
                      :disable="!areaOfInterest"
                      @click="setAoi(undefined)">
                    </q-btn>
                  </div>
                </div>
              </div>

            </div>
            <div v-if="$v.areaOfInterest.$error" style="color:red;">
              Area of Interest has not been provided.
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
              @input="update('projectMetadata.quality', $event)"
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
              @input="update('projectMetadata.contractNumber', $event)"
              type="text"
              :readonly="readonly"
              >
            </q-input>

            <q-input
              label="Tenderer"
              hint="Optional"
              :value="tenderer"
              @input="update('projectMetadata.tenderer', $event)"
              type="text"
              :readonly="readonly"
              >
            </q-input>

            <q-input
              label="Surveyors"
              hint="Optional"
              :value="surveyors"
              @input="update('projectMetadata.surveyors', $event)"
              type="text"
              :readonly="readonly"
              >
            </q-input>

            <q-input
              label="Vessel"
              hint="Optional"
              :value="vessel"
              @input="update('projectMetadata.vessel', $event)"
              type="text"
              :readonly="readonly"
              >
            </q-input>

            <q-field
              class="column q-py-md"
              :error="$v.projectInstrumentTypes.$error || $v.projectDataCaptureTypes.$error"
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
                          :disable="dataCaptType.disable"
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
                  name="projectMetadata.startDate"
                  attribute="Start date"
                  label="Start date (YYYY/MM/DD)"
                  :date="projectMetadata.startDate"
                  @updated-date="update('projectMetadata.startDate', $event)"
                  @blur="$v.projectMetadata.startDate.$touch"
                  :readonly="readonly"
                  >
                </form-field-validated-date>

                <form-field-validated-date
                  class="col-xs-12 col-sm-6"
                  name="projectMetadata.endDate"
                  attribute="End date"
                  label="End date (YYYY/MM/DD)"
                  :date="projectMetadata.endDate"
                  @updated-date="update('projectMetadata.endDate', $event)"
                  @blur="$v.projectMetadata.endDate.$touch"
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
              @input="update('projectMetadata.comment', $event)"
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
                :value="projectMetadata.hasMoratorium"
                @input="update('projectMetadata.hasMoratorium', $event)"
                />
            </q-field>

            <form-field-validated-input
              class="col-12 col-md-6"
              v-if="projectMetadata.hasMoratorium"
              filled
              name="projectMetadata.moratoriumDate"
              attribute="Date moratorium ends"
              label="Date moratorium ends (YYYY/MM/DD)"
              :value="formattedMoratoriumDate"
              @input="setFormattedMoratoriumDate($event)"
              @blur="$v.projectMetadata.moratoriumDate.$touch"
              :readonly="readonly"
              >

                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy>
                    <q-date
                      :value="formattedMoratoriumDate"
                      @input="setFormattedMoratoriumDate($event)"
                      @blur="$v.projectMetadata.moratoriumDate.$touch"
                      />
                  </q-popup-proxy>
                </q-icon>

            </form-field-validated-input>
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
import { DirtyRouteGuard } from './mixins/dirty-route-guard'
import { permission } from './mixins/permission'
import { errorHandler } from './mixins/error-handling'
import * as orgMutTypes
  from '../store/modules/organisation/organisation-mutation-types'
import * as pmMutTypes
  from '../store/modules/project-metadata/project-metadata-mutation-types'
import RecordState from './controls/record-state';

const timespan = require('readable-timespan');
timespan.set({
  lessThanFirst: 'now',
  millisecond: false
});

import axios from 'axios';
const path = require('path');

import { required, email, minLength } from 'vuelidate/lib/validators';

import OlMap from './olmap/olmap';

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
  id: undefined
}

export default Vue.extend({
  mixins: [DirtyRouteGuard, errorHandler, permission],
  components: {
    'record-state': RecordState,
  },

  beforeMount() {
    this.getFormData();
  },

  mounted() {
    var olmap = OlMap(this.$refs.mapDiv, {
      basemap: "osm"
    })
    olmap.initMap();
    this.map = olmap;
    this.map.onAdd = (geojson) => {
      this.setAoi(geojson);
    }

    this.fetchData();

    if (this.aoiUrl) { this.map.addGeojsonUrl(this.aoiUrl) }
  },

  methods: {
    ...mapActions('hippRequest', [
      'getHippRequests'
    ]),
    ...mapActions('reportTemplate', [
      'generateReport',
    ]),
    ...mapMutations('projectMetadata', {
      'setDirty': pmMutTypes.SET_DIRTY,
      'setProjectOrganisations': pmMutTypes.SET_ORGANISATIONS,
      'updateProjectMetadata': pmMutTypes.UPDATE,
    }),
    ...mapMutations('projectMetadata', [
      pmMutTypes.RESET_PROJECT_METADATA,
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
      pmMutTypes.REMOVE_ORGANISATION,
    ]),
    ...mapMutations('organisation', {
      'setDeletedOrganisations': orgMutTypes.SET_DELETED_ORGANISATIONS,
    }),

    instrumentSelected(instrumentType) {
      const found = this.projectInstrumentTypes.find((selectedIt) => {
        return selectedIt.id == instrumentType.id;
      })

      return !_.isNil(found)
    },
    setSelectedInstrument(instrumentType) {
      const isSelected = this.instrumentSelected(instrumentType);
      if (isSelected) {
        // then remove it from the list
        const newProjectInstrumentTypes = this.projectInstrumentTypes.filter((pit) => {
          return !(pit.id === instrumentType.id);
        });
        this.setInstrumentTypes(newProjectInstrumentTypes);
      } else {
        // then add it to the list. Made slightly more complicated by
        // having to do so via mutation
        let newProjectInstrumentTypes = _.clone(this.projectInstrumentTypes)
        newProjectInstrumentTypes.push(instrumentType);
        this.setInstrumentTypes(newProjectInstrumentTypes);
      }
      this.$v.projectInstrumentTypes.$touch()
    },

    instrumentDescription(instrumentType) {
      const dataTypeNames = instrumentType.dataCaptureTypes.map((dct) => {
        return dct.name;
      })
      const s = dataTypeNames.length == 1 ? '' : 's'
      return `Data type${s} - ` + dataTypeNames.join(', ');
    },

    dataCaptureTypeSelected(dct) {
      const found = this.projectDataCaptureTypes.find((selectedDct) => {
        return selectedDct.id == dct.id;
      })
      return !_.isNil(found)
    },
    setSelectedDataCaptureType(dct) {
      const isSelected = this.dataCaptureTypeSelected(dct);
      if (isSelected) {
        // then remove it from the list
        const newDcts = this.projectDataCaptureTypes.filter((pit) => {
          return !(pit.id === dct.id);
        });
        this.setDataCaptureTypes(newDcts);
      } else {
        // then add it to the list. Made slightly more complicated by
        // having to do so via mutation
        let newDcts = _.clone(this.projectDataCaptureTypes);
        newDcts.push(dct);
        this.setDataCaptureTypes(newDcts);
      }
      this.$v.projectDataCaptureTypes.$touch()
    },
    getInstrumentAndDataCaptureTypeError() {
      // both the intrument type and data capture type lists have a number
      // of validators, however they are both included in the same field and
      // therefore only have on error message display. This method merges
      // the errors present in both lists for display to the user.
      if (this.$v.projectInstrumentTypes.$error) {
        if (
          !this.$v.projectInstrumentTypes.required ||
          !this.$v.projectInstrumentTypes.minLength
          ) {
          return "At least one instrument type is required"
        } else {
          return "Invalid instrument type selection"
        }
      } else if (this.$v.projectDataCaptureTypes.$error) {
        if (
          !this.$v.projectDataCaptureTypes.required ||
          !this.$v.projectDataCaptureTypes.minLength
          ) {
          return "At least one data capture type is required"
        } else if (!this.$v.projectDataCaptureTypes.validDataCaptureType) {
          return "Data type(s) cannot be captured by selected instruments."
        } else {
          return "Invalid instrument type selection"
        }
      }
      return undefined
    },


    fetchData () {
      this.matchingProjMetas = undefined;
      this.map.clear();
      if (this.$route.params.id) {
        this.$store.dispatch(
          'projectMetadata/getProjectMetadata', { id: this.$route.params.id })
        .then(projectMetadata => {
          if (!_.isNil(projectMetadata.surveyApplication)) {
            this.$store.commit('surveyApplication/setSelectedSurveyApplicationGroup',
              projectMetadata.surveyApplication.group);

            if (projectMetadata.surveyApplication.userSubmitted) {
              let saName = projectMetadata.surveyApplication.name;
              let saId = projectMetadata.surveyApplication.id;
              let saGroup = projectMetadata.surveyApplication.group;

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
                projectMetadata.surveyApplication);
            }
          }

          if (!_.isNil(projectMetadata.areaOfInterest)) {
            this.map.addGeojsonFeature(projectMetadata.areaOfInterest);
          }
        });
      } else {
        if (_.isNil(this.$route.query.reset) || this.$route.query.reset) {
          // don't reset the metadata if the `reset` query param is set to
          // true. It's likely the project metadata has been pre-populated with
          // some information we care about (such as from a hipp request)
          this.RESET_PROJECT_METADATA();
        }
        // need to clear the selected options here, otherwise they persist
        // to a new survey
        this.$store.commit(
          'surveyApplication/setSelectedSurveyApplicationGroup',
          undefined);
        this.$store.commit(
          'surveyApplication/setSelectedSurveyApplication',
          undefined);
      }
    },

    update(key, event) {
      this.updateProjectMetadata({
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
        this.update('projectMetadata.moratoriumDate', undefined)
        return
      }
      let d = Date.parse(requestDate)
      if (_.isNaN(d)) {
        this.update('projectMetadata.moratoriumDate', undefined)
        return
      }
      this.update('projectMetadata.moratoriumDate', d)
    },

    setSelectedSurveyApplicationGroup(group) {
      this.$store.commit('surveyApplication/setSelectedSurveyApplicationGroup',
        group);

      // if the other survey purpose category is selected, then the survey
      // purpose must be the "Other" purpose too.
      if (this.selectedSurveyApplicationGroup == otherSurveyPurpose.group) {
        this.setSelectedSurveyApplication(otherSurveyPurpose);
      }
    },

    setSelectedSurveyApplication(surveyApplication) {
      this.$store.commit('surveyApplication/setSelectedSurveyApplication',
          surveyApplication);
    },

    setSelectedTenderer(organisation) {
      this.SET_TENDERER(organisation);
    },

    setSelectedSurveyors(organisations) {
      this.SET_SURVEYORS(organisations);
    },

    setAoi(geojson) {
      this.SET_AOI(geojson);
      this.$v.areaOfInterest.$touch();

      this.matchingProjMeta = [];
    },

    setInstrumentTypes(instrumentTypes) {
      this.SET_INSTRUMENT_TYPES(instrumentTypes)
      this.$v.projectDataCaptureTypes.$touch()
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

      // before sending to the server, update the projectMetadata survey
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

      this.$store.dispatch('projectMetadata/save').then(pmd => {
        this.setDirty(false);
        if (isNew) {
          this.$router.replace({ path: `/survey/${pmd.id}/summary` })
        }
        this.notifySuccess('Saved plan');
      });
    },

    deleteProject() {
      if (this.id) {
        // an existing id indicated this project has been saved, so check
        // with user if they really want to delete project.
        this.$q.dialog({
          title: 'Delete plan',
          message: `Plan ${this.surveyName} will be deleted`,
          ok: 'Delete',
          cancel: 'Cancel'
        }).onOk(() => {

          this.$store.dispatch(
            'projectMetadata/deleteProjectMetadata',
            { id: this.id }
          ).then(pmd => {
            this.notifySuccess('Deleted plan');
            this.$router.replace({ path: `/` });
          });
        });
      } else {
        // no id, so hasn't been saved. I this case reset form and go back
        // to main page.
        this.RESET_PROJECT_METADATA()
        this.$router.replace({ path: `/` });
      }
    },

    checkGeometry() {
      // Send geojson to server to check for interescting surveys
      this.$store.dispatch(
        'projectMetadata/checkAoi', { id: this.id })
      .then(matchingProjMetas => {
        this.matchingProjMetas = matchingProjMetas;
        const areaOfInterests = matchingProjMetas.map(mpm => {
          let f = mpm.areaOfInterest;
          f.id = mpm.id;
          return f;
        });
        this.map.setGeojsonFeatureIntersecting(areaOfInterests);
      })
      .catch((e) => {
        this.notify('negative', 'Error uploading Aoi to server.')
      });
    },

    selectAoiFile () {
      this.$refs.fileInput.click();
    },
    setAoiFile (event) {
      this.map.addFile(event.target.files[0]);
    },

    getFormData() {
      this.stateReadonly = true;
      this.getHippRequests();
      // only get non-deleted organisations
      this.setDeletedOrganisations(null);
      // gets the list of all orgs, not just those associated to this project
      this.$store.dispatch('organisation/getOrganisations');
      this.$store.dispatch('projectMetadata/getProjectStatuses');
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
    },

    parseOrganisations() {
      return this.organisations.map(org => {
        return {
          label: org.name,
          value: org.name
        }
      })
    },
    removeOrganisation(org) {
      this.REMOVE_ORGANISATION(org)
      this.$v.projectOrganisations.$touch();
    },

    mouseleaveMatchingProjMeta() {
      //clears selection in map
      this.map.highlightFeatureId(undefined);
    },

    mouseoverMatchingProjMeta(matchingProjMeta) {
      this.map.highlightFeatureId(matchingProjMeta.id);
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
    }
  },

  computed: {
    ...mapGetters({
      projectMetadata: 'projectMetadata/projectMetadata',
      id: 'projectMetadata/id',
      surveyName: 'projectMetadata/surveyName',
      projectStatus: 'projectMetadata/projectStatus',
      projectStatuses: 'projectMetadata/projectStatuses',
      contactPerson: 'projectMetadata/contactPerson',
      email: 'projectMetadata/email',
      comment: 'projectMetadata/comment',
      quality: 'projectMetadata/quality',
      vessel: 'projectMetadata/vessel',
      startDate: 'projectMetadata/startDate',
      areaOfInterest: 'projectMetadata/areaOfInterest',
      projectOrganisations: 'projectMetadata/organisations',
      projectInstrumentTypes: 'projectMetadata/instrumentTypes',
      projectDataCaptureTypes: 'projectMetadata/dataCaptureTypes',
      projectSurveyApplication: 'projectMetadata/surveyApplication',
      organisations: 'organisation/organisations',
      instrumentTypes: 'instrumentType/instrumentTypes',
      dataCaptureTypes: 'dataCaptureType/dataCaptureTypes',
      surveyApplicationGroups: 'surveyApplication/surveyApplicationGroups',
      surveyApplications: 'surveyApplication/surveyApplications',
      selectedSurveyApplication: 'surveyApplication/selectedSurveyApplication',
      selectedSurveyApplicationGroup: 'surveyApplication/selectedSurveyApplicationGroup',
      surveyId: 'projectMetadata/surveyId',
      contractNumber: 'projectMetadata/contractNumber',
      surveyors: 'projectMetadata/surveyors',
      tenderer: 'projectMetadata/tenderer',
      surveyApplicationIdOther: 'projectMetadata/surveyApplicationIdOther',
      surveyApplicationNameOther: 'projectMetadata/surveyApplicationNameOther',
      surveyApplicationGroupNameOther: 'projectMetadata/surveyApplicationGroupNameOther',
      dirty: 'projectMetadata/dirty',
      hippRequest: 'projectMetadata/hippRequest',
    }),
    ...mapGetters('hippRequest', [
      'hippRequests'
    ]),
    ...mapGetters('reportTemplate', [
      'reportDownloading',
    ]),
    readonly: function() {
      if (
        this.hasPermission('canAddProject') &&
        _.isNil(this.id)
      ) {
        // user has permission to add new project, and this is a new project
        return false
      }

      if (this.stateReadonly) {
        // if the state says read only
        return true
      }

      if (this.hasPermission('canEditAllProjects')) {
        // can edit all projects
        return false
      } else  if (
        this.hasPermission('canEditOrgProjects') &&
        this.hasOrganisationLink('projectOrganisations')
      ) {
        // can only edit projects that are linked to user
        return false
      } else {
        return true
      }
    },
    validDataCaptureTypeIds: function() {
      if (_.isNil(this.instrumentTypes)) {
        return []
      }
      let ids = new Set();
      for (const selectedInstType of this.projectInstrumentTypes) {
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
    projectStatusOptions: function () {
      const opts = this.projectStatuses.map(pit => {
        return {label: pit, value: pit};
      });
      return opts;
    },
    dataCaptureTypeOptions: function () {
      let selectedIds = new Set();
      for (const selectedDct of this.projectDataCaptureTypes) {
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
    organisationOptions: function () {
      const orgs = this.organisations.filter(org => {
        return !org.deleted;
      });
      return orgs;
    },
    formattedMoratoriumDate: function() {
      if (_.isNil(this.tmpMoratoriumDateEntry) && !_.isNil(this.projectMetadata.moratoriumDate)) {
        const d = new Date();
        d.setTime(this.projectMetadata.moratoriumDate);
        let formattedString = date.formatDate(d, 'YYYY/MM/DD')
        this.tmpMoratoriumDateEntry = formattedString
      }
      return this.tmpMoratoriumDateEntry
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
        projectOrganisations: {
          required,
          minLength:minLength(1)
        },
        projectInstrumentTypes: { },
        projectDataCaptureTypes: { },
        projectMetadata: {
          startDate: { },
          endDate: { },
          moratoriumDate: { },
        },
        hippRequest: {}
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
        projectOrganisations: {
          required,
          minLength:minLength(1)
        },
        projectInstrumentTypes: {
          required,
          minLength:minLength(1)
        },
        projectDataCaptureTypes: {
          required,
          minLength:minLength(1),
          validDataCaptureType
        },
        projectMetadata: {
          startDate: { required },
          endDate: { },
          moratoriumDate: {validMoratorium},
        },
        hippRequest: {}
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
      this.map.clear();
      if (newAoi) {
        this.map.addGeojsonFeature(newAoi);
        this.map.fit();
      }
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
    'projectMetadata.hasMoratorium': function (newM, oldM) {
      this.$v.projectMetadata.moratoriumDate.$touch()
    },
  },

  data() {
    return {
      map: null,
      orgSearchTerms: '',
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
