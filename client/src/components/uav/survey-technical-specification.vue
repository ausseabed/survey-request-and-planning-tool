<template>
  <div class="row justify-center">
    <div inline style="width: 900px; max-width: 90vw;">
      <div class="row justify-between">
        <q-breadcrumbs separator=">" color="light">
          <q-breadcrumbs-el label="Home" icon="home" to="/" />
          <q-breadcrumbs-el label="Survey Technical Specifications" icon="fas fa-clipboard-list" />
        </q-breadcrumbs>
        <div class="row">
          <q-btn icon="arrow_back" label="Project Metadata"
            :to="'/project-metadata/' + techSpec.projectMetadataId">
          </q-btn>
          <q-btn icon="fas fa-save" label="Save"
            @click="submit">
          </q-btn>
        </div>
      </div>
    </div>



    <q-page padding class="docs-input row justify-center">
      <div style="width: 900px; max-width: 90vw;">
        <q-card inline style="width:100%">
          <div v-if="loading">Loading...</div>
          <q-card-title> Basic </q-card-title>
          <q-card-main dense>
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
  from '../../store/modules/tech-spec/tech-spec-state'

export default Vue.extend({
  mixins: [errorHandler],
  beforeMount() {
    this.getFormData();
  },

  mounted() {
    this.fetchData();

  },

  methods: {
    ...mapMutations('techSpec', [
      types.UPDATE,
    ]),

    fetchData () {
      const id = this.$route.params.id;
      this.UPDATE({path:'techSpec.projectMetadataId', value:id});
      this.$store.dispatch('techSpec/getTechSpec', { id: id });

    },

    submit() {
      this.$v.$touch()

      if (this.$v.$error) {
        this.$q.notify('Please review fields')
        return
      }

      this.$store.dispatch('projectMetadata/save').then(pmd => {
        this.notifySuccess('Saved survey technical specifications');
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

    getFormData() {
      // gets the list of all orgs, not just those associated to this project
      this.$store.dispatch('organisation/getOrganisations');
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

  },

  computed: {
    ...mapGetters('techSpec',[
      'techSpec',
      'requestStatus',
      'requestError',
    ]),
    // projectStatusOptions: function () {
    //   const opts = this.projectStatuses.map(pit => {
    //     return {label: pit, value: pit};
    //   });
    //   return opts;
    // },
    // instrumentTypeOptions: function () {
    //   // select component needs a label and value field
    //   const opts = this.instrumentTypes.map(pit => {
    //     return {
    //       label: pit.name,
    //       value: pit
    //     }
    //   });
    //   return opts;
    // },
    // dataCaptureTypeOptions: function () {
    //   const opts = this.dataCaptureTypes.map(pit => {
    //     return {label: pit.name, value: pit};
    //   });
    //   return opts;
    // },
    // surveyApplicationGroupOptions: function () {
    //   const opts = this.surveyApplicationGroups.map(pit => {
    //     return {label: pit, value: pit};
    //   });
    //   return opts;
    // },
    // surveyApplicationOptions: function () {
    //   const opts = this.surveyApplications.map(pit => {
    //     return {label: pit.name, value: pit};
    //   });
    //   return opts;
    // },
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


  },

  data() {
    return {
      orgSearchTerms: '',
      loading: false,
    }
  }
});

</script>
