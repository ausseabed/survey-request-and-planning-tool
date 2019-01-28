<template>
  <div class="row justify-center">
    <q-scroll-observable @scroll="hasScrolled"></q-scroll-observable>

    <div inline style="width: 900px; max-width: 90vw;">
      <div class="row justify-between">
        <q-breadcrumbs separator=">" color="light">
          <q-breadcrumbs-el label="Home" icon="home" to="/" />
          <q-breadcrumbs-el label="Project Metadata" icon="fas fa-clipboard-list" />
        </q-breadcrumbs>
        <div class="row">
          <q-btn icon="fas fa-save" label="Save"
            @click="submit">
          </q-btn>
          <q-btn icon="fas fa-trash" label="Delete"
            @click="deleteProject">
          </q-btn>
          <q-btn label="Specifications" icon="arrow_forward"
            :disable="!id"
            :to="'/survey-technical-specification/' + id">
            <q-tooltip v-if="!id" anchor="bottom middle" self="top middle" :offset="[10, 10]">
              Save project to view specifications.
            </q-tooltip>
          </q-btn>

        </div>
      </div>
    </div>



    <q-page padding class="docs-input row justify-center">
      <transition
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
      >
        <q-page-sticky
          v-if="showFloatingButtons"
          position="bottom-right"
          :offset="[18, 18]"
          style="z-index:100">

          <q-btn
            round
            color="primary"
            @click="submit"
            icon="fas fa-save"
          />
          <q-btn :disable="!id"
            round
            color="primary"
            :to="'/survey-technical-specification/' + id"
            icon="arrow_forward"
          >
            <q-tooltip :offset="[10, 10]">
              Switch to technical specifications
            </q-tooltip>
          </q-btn>
        </q-page-sticky>
      </transition>

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
                       @input="update('projectMetadata.surveyName', $event)"
                       @blur="$v.surveyName.$touch"
                       type="text" />
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Survey ID">
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


            <q-field :label-width="2"
                     inset="full"
                     label="Organisations"
                     :error="$v.surveyName.$error"
                     error-label="Survey name is required">
               <div class="row" >
                 <q-input class="col-10" v-model="orgSearchTerms" placeholder="Start typing an organisation name">
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
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     icon="fas fa-user"
                     label="Contact person"
                     :error="$v.contactPerson.$error"
                     error-label="Contact person is required">
              <q-input :value="contactPerson"
                       @change="update('projectMetadata.contactPerson', $event)"
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
                       @change="update('projectMetadata.email', $event)"
                       @blur="$v.email.$touch"
                       type="email" />
            </q-field>
          </q-card-main>
        </q-card>

        <q-card inline style="width:100%">
          <q-card-title> Area of Interest </q-card-title>
          <q-card-main>
            <div ref="mapDiv" id="mapDiv" style="height:350px;"></div>

            <div class="row">
              <template v-if="!matchingProjMetas">
                <p class="col-10 items-center q-body-2 text-center" style="padding:5px">Run check to indentify intersecting surveys</p>
              </template>
              <template v-else-if="matchingProjMetas.length == 0">
                <p class="col-10 items-center q-body-2 text-center" style="padding:5px">No intersecting surveys</p>
              </template>
              <template v-else>
                <div class="column col-10">
                  <q-list-header>Intersecting surveys</q-list-header>
                  <q-list highlight dense
                    @mouseleave.native="mouseleaveMatchingProjMeta">
                    <q-item dense
                      v-for="matchingProjMeta in matchingProjMetas"
                      :key="matchingProjMeta.id"
                      @mouseover.native="mouseoverMatchingProjMeta(matchingProjMeta)"
                      :to="'/project-metadata/' + matchingProjMeta.id">
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

              <q-item-side right class="column col-2">
                <q-item-tile class="self-end">
                  <q-btn icon="fas fa-check" label="Check AoI"
                    :disable="!canCheckGeometry"
                    @click="checkGeometry">
                  </q-btn>
                </q-item-tile>
              </q-item-side>

            </div>
            <div v-if="$v.areaOfInterest.$error" style="color:red;">
              Area of Interest has not been provided.
            </div>

          </q-card-main>
        </q-card>

        <q-card inline style="width:100%">
          <q-card-title> Other </q-card-title>
          <q-card-main dense>

            <q-field :label-width="2"
                     inset="full"
                     label="Contract number">
              <q-input :value="contractNumber"
                       @input="update('projectMetadata.contractNumber', $event)"
                       type="text" />
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Tenderer">
              <q-select filter
                        autofocus-filter
                        :value="tenderer"
                        @change="setSelectedTenderer($event)"
                        :options="organisationOptions"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Surveyors">
              <q-select multiple filter
                        autofocus-filter
                        :value="surveyors"
                        @change="setSelectedSurveyors($event)"
                        :options="organisationOptions"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Vessel">
              <q-input :value="vessel"
                       @input="update('projectMetadata.vessel', $event)"
                       type="text" />
            </q-field>

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

            <q-field :label-width="4"
                     inset="full"
                     label="Survey purpose - sector"
                     :error="$v.selectedSurveyApplicationGroup.$error"
                     error-label="Survey application is required">
              <q-select filter
                        autofocus-filter
                        :value="selectedSurveyApplicationGroup"
                        @change="setSelectedSurveyApplicationGroup($event)"
                        :options="surveyApplicationGroupOptions"
                        @blur="$v.selectedSurveyApplicationGroup.$touch"/>
            </q-field>

            <q-field :label-width="4"
                     inset="full"
                     label="Survey purpose - Application area"
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
                     label="Instrument type"
                     :error="$v.projectInstrumentTypes.$error"
                     error-label="Instrument type(s) is required">
              <q-select multiple
                        :value="projectInstrumentTypes"
                        @change="setInstrumentTypes($event)"
                        :options="instrumentTypeOptions"
                        @blur="$v.projectInstrumentTypes.$touch"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Data to capture"
                     :error="$v.projectDataCaptureTypes.$error"
                     error-label="Data type(s) to capture are required">
              <q-select multiple
                        :value="projectDataCaptureTypes"
                        @change="setDataCaptureTypes($event)"
                        :options="dataCaptureTypeOptions"
                        @blur="$v.projectDataCaptureTypes.$touch"/>
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Quality">
              <q-input :value="quality"
                       @input="update('projectMetadata.quality', $event)"
                       type="textarea" />
            </q-field>

            <q-field :label-width="2"
                     inset="full"
                     label="Comments">
              <q-input :value="comment"
                       @input="update('projectMetadata.comment', $event)"
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

export default Vue.extend({
  mixins: [errorHandler],
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
          if (projectMetadata.surveyApplication) {
            this.setSelectedSurveyApplication(
              projectMetadata.surveyApplication);
          }
          this.map.addGeojsonFeature(projectMetadata.areaOfInterest);
          this.canCheckGeometry = true;
        });
      } else {
        this.$store.commit('projectMetadata/reset');
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

    setSelectedSurveyApplication(surveyApplication) {
      this.$store.commit('surveyApplication/setSelectedSurveyApplication',
        surveyApplication);
    },

    setSelectedSurveyApplicationGroup(group) {
      // can't dispatch from a mutation, so do it here instead
      this.$store.commit('surveyApplication/setSelectedSurveyApplicationGroup',
        group);
      this.$store.dispatch('surveyApplication/getSurveyApplications');
    },

    setSelectedSurveyApplication(surveyApplication) {
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
        this.$router.replace({ path: `/project-metadata/${pmd.id}` })
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
        this.$store.commit('projectMetadata/reset');
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
      const opts = this.dataCaptureTypes.map(pit => {
        return {label: pit.name, value: pit};
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
    projectInstrumentTypes: {
      required,
      minLength:minLength(1)
    },
    projectDataCaptureTypes: {
      required,
      minLength:minLength(1)
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
    }
  },

  data() {
    return {
      map: null,
      canCheckGeometry: false,
      orgSearchTerms: '',
      matchingProjMetas:undefined,
      showFloatingButtons: false,
    }
  }
});

</script>
