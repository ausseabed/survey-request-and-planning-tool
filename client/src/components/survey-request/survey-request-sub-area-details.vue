<template>
  <form-wrapper
    :validator="$v"
    class="scroll"
  >
    <div class="column q-pa-md q-gutter-y-sm">

      <div>sub area details</div>

    </div>
  </form-wrapper>
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
  ],

  mounted() {
    this.fetchData();
  },

  methods: {
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

  validations() {
    return {};
  },

  computed: {
    ...mapGetters('surveyRequest',{
      surveyRequest: 'surveyRequest',
      dirty: 'dirty',
    }),
    ...mapGetters('organisation', {
      organisationsList: 'organisations',
    }),
  },

  data() {
    return {

    }
  },

});
</script>


<style scoped lang="stylus">

</style>
