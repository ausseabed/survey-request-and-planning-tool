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
                 <q-select class="col-10"
                           multiple filter
                           autofocus-filter
                           :value="projectOrganisations"
                           :display-value="projectOrganisationsSelectText"
                           @change="setProjectOrganisations($event)"
                           :options="organisationOptions"/>
                 <q-btn flat icon="settings"
                   to="/admin/organisations">
                   <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">
                    Manage organisations
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
                    </q-item>
                  </q-list>

                </div>
              </template>

              <div class="col-6">
                <div class="row justify-between gutter-xs no-margin">
                  <div class="col">
                    <q-btn class="no-margin full-width" icon="fas fa-check" label="Check AoI"
                      :disable="!areaOfInterest"
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

            <div class="row" v-if="selectedSurveyApplicationGroup == 'Other'">
              <div class="col-2">
              </div>
              <div class="col-10">
                <form-field-validated :label-width="1"
                         name="surveyApplicationGroupNameOther"
                         inset="full"
                         label="Name"
                         class="optional-name-fields">
                  <q-input
                    :value="surveyApplicationGroupNameOther"
                    @input="setSurveyApplicationGroupNameOther($event)"
                    @blur="$v.surveyApplicationGroupNameOther.$touch"
                    type="text" />
                </form-field-validated>
              </div>
            </div>

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

            <div class="row" v-if="selectedSurveyApplication && selectedSurveyApplication.name == 'Other'">
              <div class="col-2">
              </div>
              <div class="col-10">
                <form-field-validated :label-width="1"
                         name="surveyApplicationNameOther"
                         inset="full"
                         label="Name"
                         class="optional-name-fields">
                  <q-input
                    :value="surveyApplicationNameOther"
                    @input="setSurveyApplicationNameOther($event)"
                    @blur="$v.surveyApplicationNameOther.$touch"
                    type="text" />
                </form-field-validated>
              </div>
            </div>


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

    <confirm-navigation id="confirmNavigation" ref="confirmNavigation"></confirm-navigation>
  </form-wrapper>
</template>
<script>
import './docs-input.styl'
import Vue from 'vue'
import { filter } from 'quasar'
import { mapGetters, mapMutations } from 'vuex'
const _ = require('lodash');
import { DirtyRouteGuard } from './../mixins/dirty-route-guard'
import { errorHandler } from './../mixins/error-handling'
import * as orgMutTypes
  from '../../store/modules/organisation/organisation-mutation-types'

const timespan = require('readable-timespan');
timespan.set({
  lessThanFirst: 'now',
  millisecond: false
});

import axios from 'axios';
const path = require('path');

import { required, email, minLength } from 'vuelidate/lib/validators';

import OlMap from './../olmap/olmap';

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

const otherSurveyPurpose = {
  name: 'Other',
  group: 'Other',
  userSubmitted: true,
  id: undefined
}

export default Vue.extend({
  mixins: [DirtyRouteGuard, errorHandler],

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

    ...mapMutations('projectMetadata', {
      'setDirty': 'setDirty',
      'setProjectOrganisations': 'setOrganisations'
    }),
    ...mapMutations('organisation', {
      'setDeletedOrganisations': orgMutTypes.SET_DELETED_ORGANISATIONS,
    }),

    fetchData () {
      this.matchingProjMetas = undefined;
      this.map.clear();
      if (this.$route.params.id) {
        this.$store.dispatch(
          'projectMetadata/getProjectMetadata', { id: this.$route.params.id })
        .then(projectMetadata => {
          this.patchSelectLists(projectMetadata);
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

          this.map.addGeojsonFeature(projectMetadata.areaOfInterest);
          this.setDirty(false);
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

      this.matchingProjMeta = [];
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
        let org = this.organisations.find(o => {
          return o.id == projectMetadata.tenderer.id;
        });
        if (org.deleted) {
          org = undefined;
        }
        this.setSelectedTenderer(org);
      }

      if (projectMetadata.surveyors) {
        let orgs = projectMetadata.surveyors.map(outerOrg => {
          return this.organisations.find(innerOrg => {
            return outerOrg.id == innerOrg.id;
          })
        });
        orgs = orgs.filter(org => {
          return !org.deleted;
        })
        this.setSelectedSurveyors(orgs);
      }

      if (projectMetadata.organisations) {
        let orgs = projectMetadata.organisations.map(outerOrg => {
          const inOrgListOrg = this.organisations.find(innerOrg => {
            return outerOrg.id == innerOrg.id;
          });
          return inOrgListOrg;
        });
        orgs = orgs.filter(org => {
          return !org.deleted;
        })
        this.setProjectOrganisations(orgs);
      }

      this.setDirty(false);
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

    setSurveyApplicationIdOther(name) {
      return this.$store.commit(
        'projectMetadata/setSurveyApplicationIdOther', name);
    },
    setSurveyApplicationNameOther(name) {
      return this.$store.commit(
        'projectMetadata/setSurveyApplicationNameOther', name);
    },
    setSurveyApplicationGroupNameOther(name) {
      return this.$store.commit(
        'projectMetadata/setSurveyApplicationGroupNameOther', name);
    },

    submit() {
      this.$v.$touch()

      if (this.$v.$error) {
        this.$q.notify('Please review fields')
        return
      }

      // before sending to the server, update the projectMetadata survey
      // application to account for it possibly being a user submitted
      // survey purpose.
      let sa = _.cloneDeep(this.selectedSurveyApplication);
      if (sa.userSubmitted) {
        sa.group = this.selectedSurveyApplicationGroup == "Other" ? this.surveyApplicationGroupNameOther : this.selectedSurveyApplicationGroup;
        sa.name = this.selectedSurveyApplication.name == "Other" ? this.surveyApplicationNameOther : this.selectedSurveyApplication.name;
        sa.id = this.surveyApplicationIdOther;
      }
      this.$store.commit('projectMetadata/setSurveyApplication', sa);

      const isNew = _.isNil(this.id) || (this.id.length == 0);

      this.$store.dispatch('projectMetadata/save').then(pmd => {
        this.patchSelectLists(pmd);
        if (isNew) {
          this.$router.replace({ path: `/survey/${pmd.id}/summary` })
        }
        this.notifySuccess('Saved project metadata');
        this.setDirty(false);
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
      ).then(surveyAppGroups => {
        surveyAppGroups.push("Other");
        this.$store.commit('surveyApplication/setSurveyApplicationGroups',
          surveyAppGroups);
      });
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
      validDataCaptureTypeIds: 'projectMetadata/validDataCaptureTypeIds',
      surveyApplicationIdOther: 'projectMetadata/surveyApplicationIdOther',
      surveyApplicationNameOther: 'projectMetadata/surveyApplicationNameOther',
      surveyApplicationGroupNameOther: 'projectMetadata/surveyApplicationGroupNameOther',
      dirty: 'projectMetadata/dirty',
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
      const orgs = this.organisations.filter(org => {
        return !org.deleted;
      });
      const opts = orgs.map(pit => {
        return {label: pit.name, value: pit};
      });
      return opts;
    },
    projectOrganisationsSelectText: function () {
      if (this.projectOrganisations.length == 0) {
        return 'No organisations selected';
      } else {
        return `${this.projectOrganisations.length} organisation${this.projectOrganisations.length > 1 ? 's' : ''} selected`;
      }
    }
  },

  validations: {
    surveyName: { required },
    contactPerson: { required },
    email: { required, email },
    areaOfInterest: {required },
    startDate: { required },
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
        this.$store.commit('projectMetadata/setSurveyApplication', newSa);
      }

    }
  },

  data() {
    return {
      map: null,
      orgSearchTerms: '',
      matchingProjMetas:undefined,
      showFloatingButtons: false,
      validationMessagesOverride: {
        validDataCaptureType:
          "Selected data capture types are not valid for instrument.",
        validSurveyApplicationNameOther: "Survey purpose name is required.",
        validSurveyApplicationGroupNameOther:
          "Survey purpose category name is required."
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
</style>
