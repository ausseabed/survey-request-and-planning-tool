<template>
  <form-wrapper :validator="$v" :messages="validationMessagesOverride"
    class="row justify-center">

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
          class="q-ml-sm"
        />
        <q-btn :disable="!id"
          round
          color="primary"
          @click="deleteProject"
          icon="fas fa-trash"
          class="q-ml-sm"
        >
        </q-btn>
      </q-page-sticky>

      <div style="width: 900px; max-width: 90vw;">
        <q-card inline style="width:100%">
          <q-card-title> Basic </q-card-title>
          <q-card-main dense>
            <form-field-validated :label-width="2"
                     inset="full"
                     name="surveyName"
                     label="Survey name"
                     helper="Name of data collection survey">
              <q-input :value="surveyName"
                       @input="update('projectMetadata.surveyName', $event)"
                       @blur="$v.surveyName.$touch"
                       type="text" />
            </form-field-validated>

            <q-field :label-width="2"
                     inset="full"
                     label="Survey ID"
                     helper="Optional">
              <q-input :value="surveyId"
                       @input="update('projectMetadata.surveyId', $event)"
                       type="text" />
            </q-field>

            <q-field
              label="Status" :label-width="2" inset="full"
            >
              <q-option-group
                type="radio" inline
                :value="projectStatus"
                color="secondary"
                @change="update('projectMetadata.projectStatus', $event)"
                :options="projectStatusOptions"
              />
            </q-field>


            <form-field-validated :label-width="2"
                     name="projectOrganisations"
                     inset="full"
                     label="Organisations">
               <div class="row" >
                 <q-input class="col-10" v-model="orgSearchTerms" placeholder="Start typing an organisation name"
                   @blur="$v.projectOrganisations.$touch">
                   <q-autocomplete @search="searchOrganisation" @selected="selectedOrganisation" />
                 </q-input>
                 <q-btn flat icon="add"
                   :disable="orgSearchTerms.length == 0"
                   @click="createNewOrganisation">
                   <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">
                    Create <strong>new</strong> organisation using entered text.
                  </q-tooltip>
                 </q-btn>
               </div>

               <template v-if="projectOrganisations.length == 0">
                 <p class="q-body-2 text-center" style="padding:5px">No organisations selected</p>
               </template>
               <template v-else>
                 <q-list-header>Participating organisations</q-list-header>
                 <q-list dense>
                   <q-item dense
                     v-for="organisation in projectOrganisations"
                     :key="organisation.id">
                     <q-item-main :label="organisation.name" />
                     <q-item-side right>
                       <q-btn flat icon="close"
                         @click="removeOrganisation(organisation)">
                         <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">
                          Remove organisation from this project. Does not delete organisation.
                        </q-tooltip>
                       </q-btn>
                     </q-item-side>
                   </q-item>
                 </q-list>
               </template>
            </form-field-validated>

            <q-field :label-width="2"
                     inset="full"
                     icon="fas fa-user"
                     label="Contact person"
                     :error="$v.contactPerson.$error"
                     error-label="Contact person is required">
              <q-input :value="contactPerson"
                       @input="update('projectMetadata.contactPerson', $event)"
                       @blur="$v.contactPerson.$touch"
                       type="textarea" />
            </q-field>

            <form-field-validated :label-width="2"
                     inset="full"
                     name="email"
                     icon="fas fa-envelope"
                     label="Contact email">
              <q-input
                       :value="email"
                       @input="update('projectMetadata.email', $event)"
                       @blur="$v.email.$touch"
                       type="email" />
            </form-field-validated>
          </q-card-main>
        </q-card>

        <q-card inline style="width:100%">
          <q-card-title> Area of Interest </q-card-title>
          <q-card-main>
            <div ref="mapDiv" id="mapDiv" style="height:350px;"></div>

            <div class="row">
              <template v-if="!matchingProjMetas">
                <p class="col-6 items-center q-body-2 text-center" style="padding:5px">Run check to identify intersecting surveys</p>
              </template>
              <template v-else-if="matchingProjMetas.length == 0">
                <p class="col-6 items-center q-body-2 text-center" style="padding:5px">No intersecting surveys</p>
              </template>
              <template v-else>
                <div class="column col-6">
                  <q-list-header>Intersecting surveys</q-list-header>
                  <q-list highlight dense
                    @mouseleave.native="mouseleaveMatchingProjMeta">
                    <q-item dense
                      tag="a" class="interescting-project-links"
                      :href="`/survey/${matchingProjMeta.id}/summary`"
                      target="_blank"
                      v-for="matchingProjMeta in matchingProjMetas"
                      :key="matchingProjMeta.id"
                      @mouseover.native="mouseoverMatchingProjMeta(matchingProjMeta)"
                      >
                      <q-item-main :label="matchingProjMeta.surveyName" />
                      <!-- <q-item-side right>
                        <q-btn flat icon="close"
                          @click="removeOrganisation(organisation)">
                          <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">
                           Remove organisation from this project. Does not delete organisation.
                         </q-tooltip>
                        </q-btn>
                      </q-item-side> -->
                    </q-item>
                  </q-list>

                </div>
              </template>

              <div class="col-6">
                <div class="row justify-between gutter-xs no-margin">
                  <div class="col">
                    <q-btn class="no-margin full-width" icon="fas fa-check" label="Check AoI"
                      :disable="!canCheckGeometry"
                      @click="checkGeometry">
                    </q-btn>
                  </div>
                  <div class="col">
                    <q-btn class="no-margin full-width" icon="cloud_upload" label="Upload"
                      @click="selectAoiFile">
                    </q-btn>
                    <input type="file" id="dataPath" v-on:change="setAoiFile" ref="fileInput" hidden />
                  </div>
                  <div class="col">
                    <q-btn class="no-margin full-width" icon="clear" label="Clear"
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

          </q-card-main>
        </q-card>

        <q-card inline style="width:100%">
          <q-card-title> Survey Purpose </q-card-title>
          <q-card-main dense>

            <q-field :label-width="2"
                     inset="full"
                     label="Category"
                     :error="$v.selectedSurveyApplicationGroup.$error"
                     error-label="Survey application is required">
              <q-select filter
                        autofocus-filter
                        :value="selectedSurveyApplicationGroup"
                        @change="setSelectedSurveyApplicationGroup($event)"
                        :options="surveyApplicationGroupOptions"
                        @blur="$v.selectedSurveyApplicationGroup.$touch"/>
            </q-field>
            <!-- v-if="selectedSurveyApplicationGroup" -->
            <q-field :label-width="2"
                     inset="full"
                     label="Purpose"
                     :error="$v.selectedSurveyApplication.$error"
                     error-label="Survey application is required">
              <q-select filter
                        autofocus-filter
                        :value="selectedSurveyApplication"
                        @change="setSelectedSurveyApplication($event)"
                        :options="surveyApplicationOptions"
                        @blur="$v.selectedSurveyApplication.$touch"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Statement of Expected Survey Quality"
                     helper="Optional">
              <q-input :value="quality"
                       @input="update('projectMetadata.quality', $event)"
                       type="textarea" />
            </q-field>
          </q-card-main>
        </q-card>


        <q-card inline style="width:100%">
          <q-card-title> Supplier </q-card-title>
          <q-card-main dense>

            <q-field :label-width="2"
                     inset="full"
                     label="Contract number"
                     helper="Optional">
              <q-input :value="contractNumber"
                       @input="update('projectMetadata.contractNumber', $event)"
                       type="text" />
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Tenderer"
                     helper="Optional">
              <q-select filter
                        autofocus-filter
                        :value="tenderer"
                        @change="setSelectedTenderer($event)"
                        :options="organisationOptions"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Surveyors"
                     helper="Optional">
              <q-select multiple filter
                        autofocus-filter
                        :value="surveyors"
                        @change="setSelectedSurveyors($event)"
                        :options="organisationOptions"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Vessel"
                     helper="Optional">
              <q-input :value="vessel"
                       @input="update('projectMetadata.vessel', $event)"
                       type="text" />
            </q-field>

            <form-field-validated :label-width="2"
                     name="projectInstrumentTypes"
                     inset="full"
                     label="Instrument type">
              <q-select multiple
                        :value="projectInstrumentTypes"
                        @change="setInstrumentTypes($event)"
                        :options="instrumentTypeOptions"
                        @blur="$v.projectInstrumentTypes.$touch"/>
            </form-field-validated>

            <form-field-validated :label-width="2"
                     name="projectDataCaptureTypes"
                     inset="full"
                     label="Data to capture">
              <q-select multiple
                        :value="projectDataCaptureTypes"
                        @change="setDataCaptureTypes($event)"
                        :options="dataCaptureTypeOptions"
                        @blur="$v.projectDataCaptureTypes.$touch"/>
            </form-field-validated>

            <q-field :label-width="2"
                     inset="full"
                     label="Start date"
                     :error="$v.startDate.$error"
                     error-label="Start date is required">
              <q-datetime-picker
                :value="startDate"
                type="date"
                format-model="date"
                @change="setStartDate($event)"
                @blur="$v.startDate.$touch" />
            </q-field>
          </q-card-main>
        </q-card>

        <q-card inline style="width:100%">
          <q-card-title> Additional Information </q-card-title>
          <q-card-main dense>

            <q-field :label-width="2"
                     inset="full"
                     label="Comments"
                     helper="Optional">
              <q-input :value="comment"
                       @input="update('projectMetadata.comment', $event)"
                       type="textarea" />
            </q-field>
          </q-card-main>
        </q-card>


      </div>
    </q-page>


  </form-wrapper>
</template>
<script>
import './docs-input.styl'
import Vue from 'vue'
import { filter } from 'quasar'
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

import { required, email, minLength } from 'vuelidate/lib/validators';

import OlMap from './../olmap/olmap';
import FormFieldValidated from '../controls/form-field-validated';

const validDataCaptureType = (value, vm) => {
  let badDcts = value.filter(dct => {
    return !vm.validDataCaptureTypeIds.has(dct.id);
  });
  return badDcts.length == 0;
};

export default Vue.extend({
  mixins: [errorHandler],
  components: {
    'form-field-validated': FormFieldValidated
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
      this.canCheckGeometry = true;
      this.setAoi(geojson);
    }

    this.fetchData();

    if (this.aoiUrl) { this.map.addGeojsonUrl(this.aoiUrl) }
  },

  methods: {
    fetchData () {
      this.matchingProjMetas = undefined;
      this.map.clear();
      if (this.$route.params.id) {
        this.$store.dispatch(
          'projectMetadata/getProjectMetadata', { id: this.$route.params.id })
        .then(projectMetadata => {
          this.patchSelectLists(projectMetadata);
          this.setSelectedSurveyApplication(
            projectMetadata.surveyApplication);
          this.map.addGeojsonFeature(projectMetadata.areaOfInterest);
          this.canCheckGeometry = true;
        });
      } else {
        this.$store.commit('projectMetadata/resetProjectMetadata');
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
      this.$store.commit('projectMetadata/update', {
        path: key,
        value: event
      })
    },

    setStartDate(startDate) {
      this.$store.commit('projectMetadata/setStartDate', startDate);
    },

    setSelectedSurveyApplicationGroup(group) {
      // can't dispatch from a mutation, so do it here instead
      this.$store.commit('surveyApplication/setSelectedSurveyApplicationGroup',
        group);
      this.$store.dispatch('surveyApplication/getSurveyApplications');
    },

    setSelectedSurveyApplication(surveyApplication) {
      if (_.isNil(surveyApplication)) {
        this.$store.commit('surveyApplication/setSelectedSurveyApplicationGroup',
          undefined);
        this.$store.commit('surveyApplication/setSelectedSurveyApplication',
          undefined);
          return;
      }
      this.$store.commit('surveyApplication/setSelectedSurveyApplicationGroup',
        surveyApplication.group);
      this.$store.dispatch('surveyApplication/getSurveyApplications')
      .then(surveyApps => {
        this.$store.commit('surveyApplication/setSelectedSurveyApplication',
          surveyApplication);
      });

      this.$store.commit('projectMetadata/setSurveyApplication',
        surveyApplication);
    },

    setSelectedTenderer(organisation) {
      this.$store.commit('projectMetadata/setTenderer',
        organisation);
    },

    setSelectedSurveyors(organisations) {
      this.$store.commit('projectMetadata/setSurveyors',
        organisations);
    },

    setAoi(geojson) {
      this.$store.commit('projectMetadata/setAoi', geojson);
      this.$v.areaOfInterest.$touch();
    },

    patchSelectLists(projectMetadata) {
      // The q-select component seems to rely on the fact that its options
      // values equal that of the model values array. Equal in this case means
      // object equality. The problem here is we have a list of all options
      // fetched from the server, and a seperate server request provides the
      // list of selected options. The selected option objects appear the same
      // as the all option objects (same values), but they are not the same
      // objects.
      // To fix this we replace the current list of selected objects with the
      // appropriate objects from the all option list.
      // This could all be avoided if quasar provided some kind of comparison
      // function hook :-/

      // TODO - everything here should probably be in the vuex store
      if (projectMetadata.instrumentTypes) {
        const instTypes = projectMetadata.instrumentTypes.map(outerIt => {
          return this.instrumentTypes.find(innerIt => {
            return outerIt.id == innerIt.id;
          })
        });
        this.setInstrumentTypes(instTypes);
      }

      if (projectMetadata.dataCaptureTypes) {
        const dataCapTypes = projectMetadata.dataCaptureTypes.map(outerDct => {
          return this.dataCaptureTypes.find(innerDct => {
            return outerDct.id == innerDct.id;
          })
        });
        this.setDataCaptureTypes(dataCapTypes);
      }

      if (projectMetadata.tenderer) {
        const org = this.organisations.find(o => {
          return o.id == projectMetadata.tenderer.id;
        });
        this.setSelectedTenderer(org);
      }

      if (projectMetadata.surveyors) {
        const orgs = projectMetadata.surveyors.map(outerOrg => {
          return this.organisations.find(innerOrg => {
            return outerOrg.id == innerOrg.id;
          })
        });
        this.setSelectedSurveyors(orgs);
      }
    },

    setInstrumentTypes(instrumentTypes) {
      this.$store.commit(
        'projectMetadata/setInstrumentTypes',
        instrumentTypes);
      this.$v.projectDataCaptureTypes.$touch();
    },

    setDataCaptureTypes(dataCaptureTypes) {
      this.$store.commit(
        'projectMetadata/setDataCaptureTypes',
        dataCaptureTypes);
    },

    submit() {
      this.$v.$touch()

      if (this.$v.$error) {
        this.$q.notify('Please review fields')
        return
      }

      this.$store.dispatch('projectMetadata/save').then(pmd => {
        this.patchSelectLists(pmd);
        this.$router.replace({ path: `/survey/${pmd.id}/summary` })
        this.notifySuccess('Saved project metadata');
      });
    },

    deleteProject() {
      if (this.id) {
        // an existing id indicated this project has been saved, so check
        // with user if they really want to delete project.
        this.$q.dialog({
          title: 'Delete project',
          message: `Project ${this.surveyName} will be deleted`,
          ok: 'Delete',
          cancel: 'Cancel'
        }).then(() => {

          this.$store.dispatch(
            'projectMetadata/deleteProjectMetadata',
            { id: this.id }
          ).then(pmd => {
            this.notifySuccess('Deleted project');
            this.$router.replace({ path: `/` });
          });
        }).catch(() => {
          // Picked "Cancel" or dismissed, nothing to do (just catch error)
        });
      } else {
        // no id, so hasn't been saved. I this case reset form and go back
        // to main page.
        this.$store.commit('projectMetadata/resetProjectMetadata');
        this.$router.replace({ path: `/` });
      }
    },

    createNewOrganisation() {
      let filteredOrgs = filter(
        this.orgSearchTerms,
        {field: 'name', list: this.organisations});

      if (filteredOrgs.length != 0) {
        // here we check if user is attempting to create a new org with
        // an existing name. If they are, then just add if to the selected
        // list and return.
        this.$store.commit(
          'projectMetadata/addOrganisation',filteredOrgs[0]);
        return;
      }

      // create a new organisation using the name entered into the autocomplete
      // input element. When the org has been created add it to this project.
      let org = {
        name: this.orgSearchTerms,
      }

      this.$store.dispatch('organisation/saveOrganisation', org)
      .then(newOrg => {
        this.$store.commit('projectMetadata/addOrganisation',newOrg);
        this.notifySuccess(`Created new organisation ${newOrg.name}`);
        this.orgSearchTerms = "";
      }, error => {
        console.error("Failed to save organisation");
      });
    },

    checkGeometry() {
      // Send geojson to server to check for interescting surveys
      this.$store.dispatch(
        'projectMetadata/checkAoi', { id: this.id })
      .then(matchingProjMetas => {
        console.log(matchingProjMetas);
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
      // gets the list of all orgs, not just those associated to this project
      this.$store.dispatch('organisation/getOrganisations');
      this.$store.dispatch('projectMetadata/getProjectStatuses');
      // get data capture types, but only those not created by users (eg; the
      // default system defined ones.
      this.$store.dispatch(
        'dataCaptureType/getDataCaptureTypes',
        {params: {
          userSubmitted: false
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
      )
    },

    searchOrganisation(terms, done) {
      setTimeout(() => {
        let filteredOrgs =
          filter(terms, {field: 'label', list: this.parseOrganisations()});
        done(filteredOrgs)
      }, 0)
    },
    selectedOrganisation(item, keyboard) {
      if (keyboard) {
        //use is just navigating list, not actually selecting
        return;
      }
      // item is just has the org name, so get the org object from list
      let org = filter(
        item.label,
        {field: 'name', list: this.organisations})[0];

      //check for duplicate orgs
      const filtered = this.projectOrganisations.filter(o => o.id == org.id)
      if (filtered.length != 0) {
        this.$q.notify(`${org.name} already selected`)
        return;
      }

      this.$store.commit('projectMetadata/addOrganisation',org);
      this.orgSearchTerms = "";

      this.$v.projectOrganisations.$touch();
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
      this.$store.commit('projectMetadata/removeOrganisation',org);
      this.$v.projectOrganisations.$touch();
    },

    mouseleaveMatchingProjMeta() {
      //clears selection in map
      this.map.highlightFeatureId(undefined);
    },

    mouseoverMatchingProjMeta(matchingProjMeta) {
      this.map.highlightFeatureId(matchingProjMeta.id);
    },

    hasScrolled (scroll) {
      this.showFloatingButtons = scroll.position > 30;
    },
  },

  computed: {
    ...mapGetters({
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
      validDataCaptureTypeIds: 'projectMetadata/validDataCaptureTypeIds'
    }),
    projectStatusOptions: function () {
      const opts = this.projectStatuses.map(pit => {
        return {label: pit, value: pit};
      });
      return opts;
    },
    instrumentTypeOptions: function () {
      // select component needs a label and value field
      const opts = this.instrumentTypes.map(pit => {
        return {
          label: pit.name,
          value: pit
        }
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
            pit.name :
            `${pit.name} - not valid for selected instrument type`;
        return {
          label: name,
          value: pit,
          disable: !(this.validDataCaptureTypeIds.has(pit.id) || selectedIds.has(pit.id))
        };
      });
      return opts;
    },
    surveyApplicationGroupOptions: function () {
      const opts = this.surveyApplicationGroups.map(pit => {
        return {label: pit, value: pit};
      });
      return opts;
    },
    surveyApplicationOptions: function () {
      const opts = this.surveyApplications.map(pit => {
        return {label: pit.name, value: pit};
      });
      return opts;
    },
    organisationOptions: function () {
      const opts = this.organisations.map(pit => {
        return {label: pit.name, value: pit};
      });
      return opts;
    },
  },

  validations: {
    surveyName: { required },
    contactPerson: { required },
    email: { required, email },
    areaOfInterest: {required },
    startDate: { required },
    selectedSurveyApplication: { required },
    selectedSurveyApplicationGroup: { required },
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
    },
  },

  data() {
    return {
      map: null,
      canCheckGeometry: false,
      orgSearchTerms: '',
      matchingProjMetas:undefined,
      showFloatingButtons: false,
      validationMessagesOverride: {
        validDataCaptureType:
          "Selected data capture types are not valid for instrument."
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

</style>
