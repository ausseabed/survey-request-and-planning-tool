<template>

  <q-scroll-area class="col column">

    <q-card-section class="column q-gutter-y-sm">
      <div>
        A valid HIPP Request requires registration and the addition of at
        least one area of interest. Optional fields are labelled (optional).
        All other fields are mandatory.
      </div>

      <form-field-validated-input
        name="surveyRequest.name"
        attribute="Request Title"
        label="Request Title"
        :value="surveyRequest.name"
        @input="update({path:'surveyRequest.name', value:$event})"
        @blur="$v.surveyRequest.name.$touch"
        type="text"
        :readonly="readonly"
        outlined
        >
      </form-field-validated-input>

      <form-field-validated-select
        name="surveyRequest.organisation"
        label="Requesting Organisation"
        use-input
        input-debounce="200"
        autocomplete="new-password"
        @filter="filterOrganisationFunction"
        :value="surveyRequest.organisation"
        @input="update({path:'surveyRequest.organisation', value:$event})"
        :options="organisationsList"
        option-label="name"
        option-value="id"
        @blur="$v.surveyRequest.organisation.$touch"
        clearable
        :readonly="readonly"
        hint="Primary organisation submitting the request"
        outlined
        >
      </form-field-validated-select>

      <form-field-validated-select
        name="surveyRequest.organisations"
        label="Collaborating Organisation(s)"
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
        clearable
        :readonly="readonly"
        hint="Organisations that are submitting the request"
        outlined
        >
      </form-field-validated-select>

      <form-field-validated-input
        name="surveyRequest.requestorName"
        attribute="Contact Person"
        label="Contact Person"
        :value="surveyRequest.requestorName"
        @input="update({path:'surveyRequest.requestorName', value:$event})"
        @blur="$v.surveyRequest.requestorName.$touch"
        type="text"
        :readonly="readonly"
        hint="Contact person from the requesting organisation"
        outlined
        >
      </form-field-validated-input>

      <form-field-validated-input
        name="surveyRequest.requestorPosition"
        attribute="Contact Person's Role"
        label="Contact Person's Role (Title)"
        :value="surveyRequest.requestorPosition"
        @input="update({path:'surveyRequest.requestorPosition', value:$event})"
        @blur="$v.surveyRequest.requestorPosition.$touch"
        type="text"
        :readonly="readonly"
        outlined
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
        hint="Where possible, please provide an enduring email address such as a group email for contact"
        outlined
        >
      </form-field-validated-input>

      <form-field-validated-select
        name="surveyRequest.custodians"
        attribute="System Record Custodians"
        label="System Record Custodian(s)"
        multiple use-chips
        :value="surveyRequest.custodians"
        @input="update({path:'surveyRequest.custodians', value:$event})"
        :options="custodians"
        option-label="name"
        option-value="id"
        @blur="$v.surveyRequest.custodians.$touch"
        :readonly="readonly"
        hint="Organisations that may contribute to the request in the system"
        outlined
        >
      </form-field-validated-select>

    </q-card-section>

  </q-scroll-area>

</template>

<script>
import Vue from 'vue';
const _ = require('lodash');
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { required, minLength, email } from 'vuelidate/lib/validators';

import { errorHandler } from './../mixins/error-handling';
import { permission } from './../mixins/permission';

import * as organisationMutTypes from '../../store/modules/organisation/organisation-mutation-types';
import * as srMutTypes from '../../store/modules/survey-request/survey-request-mutation-types';

export default Vue.extend({
  mixins: [errorHandler, permission],

  props: [
    'readonly',
    'validationIntent',
    'validator'
  ],

  mounted() {
    this.fetchData();
  },

  methods: {
    ...mapActions('custodian', [
      'getCustodians',
    ]),
    ...mapActions('organisation', [
      'getOrganisations',
    ]),
    ...mapMutations('surveyRequest', {
      'setDirty': srMutTypes.SET_DIRTY,
      'update': srMutTypes.UPDATE,
      'resetSurveyRequest': srMutTypes.RESET_HIPP_REQUEST,
      'updateSurveyRequest': srMutTypes.UPDATE_HIPP_REQUEST,
    }),
    ...mapMutations('organisation', {
      'setOrganisationFilter': organisationMutTypes.SET_FILTER,
    }),

    fetchData() {
      this.getCustodians();
    },

    filterOrganisationFunction(val, update, abort) {
      this.setOrganisationFilter(val);
      this.getOrganisations().then((orgs) => {
        update();
      });
    },

    isValid() {
      this.$v.$touch();
      return !this.$v.$error;
    },
  },

  watch: {

  },

  computed: {
    ...mapGetters('surveyRequest',{
      surveyRequest: 'surveyRequest',
      dirty: 'dirty',
    }),
    ...mapGetters('custodian', [
      'custodians',
    ]),
    ...mapGetters('organisation', {
      organisationsList: 'organisations',
    }),
    $v () {
      return this.validator;
    }
  },

  data() {
    return {

    }
  },

});
</script>


<style scoped lang="stylus">

</style>
