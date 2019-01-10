<template>
  <div class="row justify-center">
    <div inline style="width: 900px; max-width: 90vw;">
      <div class="row justify-between">
        <q-breadcrumbs separator=">" color="light">
          <q-breadcrumbs-el label="Home" icon="home" to="/" />
          <q-breadcrumbs-el label="UAV" icon="toys" to="/uav" />
          <q-breadcrumbs-el label="Project Metadata" icon="fas fa-clipboard-list" />
        </q-breadcrumbs>
        <q-btn icon="fas fa-save" label="Save"
          @click="submit">
        </q-btn>
      </div>
    </div>



    <q-page padding class="docs-input row justify-center">
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
                       @change="update('surveyName', $event)"
                       @blur="$v.surveyName.$touch"
                       type="textarea" />
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
                       @change="update('contactPerson', $event)"
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
                       @change="update('email', $event)"
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
                      :to="'/uav/project-metadata/' + matchingProjMeta.id">
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

          </q-card-main>
        </q-card>

        <q-card inline style="width:100%">
          <q-card-title> Other </q-card-title>
          <q-card-main dense>
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
                     label="Instrument type">
              <q-select multiple
                        :value="projectInstrumentTypes"
                        @change="setInstrumentTypes($event)"
                        :options="instrumentTypeOptions" />
            </q-field>

            <q-field :label-width="4"
                     label="Data capture type">
              <q-select multiple
                        :value="projectDataCaptureTypes"
                        @change="setDataCaptureTypes($event)"
                        :options="dataCaptureTypeOptions" />
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

import { required, email } from 'vuelidate/lib/validators';

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
          'uav_projectmetadata/getProjectMetadata', { id: this.$route.params.id })
        .then(projectMetadata => {
          this.patchSelectLists(projectMetadata);
          this.map.addGeojsonFeature(projectMetadata.areaOfInterest);
          this.canCheckGeometry = true;
        });
      } else {
        this.$store.commit('uav_projectmetadata/reset');
      }
    },

    update(key, event) {
      this.$store.commit('uav_projectmetadata/update', {
        path: key,
        value: event
      })
    },

    setStartDate(startDate) {
      this.$store.commit('uav_projectmetadata/setStartDate', startDate);
    },

    setAoi(geojson) {
      this.$store.commit('uav_projectmetadata/setAoi', geojson);
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
    },

    setInstrumentTypes(instrumentTypes) {
      this.$store.commit(
        'uav_projectmetadata/setInstrumentTypes',
        instrumentTypes);
    },

    setDataCaptureTypes(dataCaptureTypes) {
      this.$store.commit(
        'uav_projectmetadata/setDataCaptureTypes',
        dataCaptureTypes);
    },

    submit() {
      this.$v.$touch()

      if (this.$v.$error) {
        this.$q.notify('Please review fields')
        return
      }

      this.$store.dispatch('uav_projectmetadata/save').then(pmd => {
        this.patchSelectLists(pmd);
        this.$router.replace({ path: `/uav/project-metadata/${pmd.id}` })
      });
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
          'uav_projectmetadata/addOrganisation',filteredOrgs[0]);
        return;
      }

      // create a new organisation using the name entered into the autocomplete
      // input element. When the org has been created add it to this project.
      let org = {
        name: this.orgSearchTerms,
      }

      this.$store.dispatch('organisation/saveOrganisation', org)
      .then(newOrg => {
        this.$store.commit('uav_projectmetadata/addOrganisation',newOrg);
        this.$q.notify(`Created new organisation ${newOrg.name}`);
        this.orgSearchTerms = "";
      }, error => {
        console.error("Failed to save organisation");
      });
    },

    checkGeometry() {
      // Send geojson to server to check for interescting surveys
      this.$store.dispatch(
        'uav_projectmetadata/checkAoi', { id: this.id })
      .then(matchingProjMetas => {
        console.log(matchingProjMetas);
        this.matchingProjMetas = matchingProjMetas;
        const areaOfInterests = matchingProjMetas.map(mpm => {
          return mpm.areaOfInterest;
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
    },

    saveOrganisation(organisation) {
      this.$store.dispatch('organisation/saveOrganisation', organisation)
      .then(response => {
        console.log(`Org saved ${organisation}`);
      }, error => {
        console.error("Failed to save organisation");
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

      this.$store.commit('uav_projectmetadata/addOrganisation',org);
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
      this.$store.commit('uav_projectmetadata/removeOrganisation',org);
    },

    mouseleaveMatchingProjMeta() {
      //clears selection in map
      this.map.highlightFeatureIndex(-1);
    },

    mouseoverMatchingProjMeta(matchingProjMeta) {
      const index = this.matchingProjMetas.findIndex(mpm => {
        return mpm.id == matchingProjMeta.id;
      });
      if (index != -1) {
        this.map.highlightFeatureIndex(index);
      }
    }
  },

  computed: {
    ...mapGetters({
      id: 'uav_projectmetadata/id',
      surveyName: 'uav_projectmetadata/surveyName',
      contactPerson: 'uav_projectmetadata/contactPerson',
      email: 'uav_projectmetadata/email',
      startDate: 'uav_projectmetadata/startDate',
      areaOfInterest: 'uav_projectmetadata/areaOfInterest',
      projectOrganisations: 'uav_projectmetadata/organisations',
      projectInstrumentTypes: 'uav_projectmetadata/instrumentTypes',
      projectDataCaptureTypes: 'uav_projectmetadata/dataCaptureTypes',
      organisations: 'organisation/organisations',
      instrumentTypes: 'instrumentType/instrumentTypes',
      dataCaptureTypes: 'dataCaptureType/dataCaptureTypes',
    }),
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
    }
  },

  validations: {
    surveyName: { required },
    contactPerson: { required },
    email: { required, email },

    startDate: { required },
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
    }
  }
});

</script>
