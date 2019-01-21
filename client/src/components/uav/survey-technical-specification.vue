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

    <div v-if="loading">Loading...</div>

    <q-page padding class="docs-input row justify-center">
      <div style="width: 900px; max-width: 90vw;">
        <q-card inline style="width:100%">
          <q-card-title> Survey metadata </q-card-title>
          <q-card-main dense>

            <q-field
              label="Survey type" :label-width="2" inset="full"
              :error="$v.techSpec.surveyType.$error"
              error-label="Survey type is required"
            >
              <q-option-group
                type="radio" inline
                :value="techSpec.surveyType"
                @change="UPDATE({path:'techSpec.surveyType', value: $event})"
                :options="surveyTypeOptions"
                @blur="$v.techSpec.surveyType.$touch"
              />
            </q-field>

            <q-field v-if="techSpec.surveyType == 'Monitoring'"
                     :label-width="2"
                     inset="full"
                     label="Frequency of surveys">
              <q-input :value="techSpec.surveyFrequency"
                       @input="UPDATE({path:'techSpec.surveyFrequency', value: $event})"
                       type="text" />
            </q-field>

            <q-field v-if="techSpec.surveyType == 'Monitoring'"
                     :label-width="2"
                     inset="full"
                     label="Requirements">
              <q-input :value="techSpec.requirements"
                       @input="UPDATE({path:'techSpec.requirements', value: $event})"
                       type="text" />
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
      this.$store.dispatch(
        'projectMetadata/getProjectMetadata', { id: id })
      this.UPDATE({path:'techSpec.id', value:id});
      this.$store.dispatch('techSpec/getTechSpec', { id: id }).then(no => {
        if (this.requestStatus == RequestStatus.SUCCESS) {
          // then all good, tech spec existed and it is loaded
        } else if (this.requestStatus == RequestStatus.ERROR) {
          const status = this.requestError.response.status;
          if (status == 404) {
            // this is also ok, as it just means the tech spec hasn't been
            // created for this project id yet
          } else {
            this.notifyError(
              `Failed to retrive technical specification (${status})`);
          }
        }
      });

    },

    submit() {
      this.$v.$touch()

      if (this.$v.$error) {
        this.$q.notify('Please review fields')
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
    },



  },

  computed: {
    ...mapGetters('techSpec',[
      'techSpec',
      'requestStatus',
      'requestError',
      'validSurveyTypes',
    ]),
    ...mapGetters('projectMetadata',[
      'projectMetadata',
    ]),
    surveyTypeOptions: function () {
      const opts = this.validSurveyTypes.map(oo => {
        return {label: oo, value: oo};
      });
      return opts;
    },
  },

  validations: {
    techSpec: {
      surveyType: { required },
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


  },

  data() {
    return {
      orgSearchTerms: '',
      loading: false,
    }
  }
});

</script>
