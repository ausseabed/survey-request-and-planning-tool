<template>
  <div class="column">

    <q-card-section class="column q-gutter-y-sm">

      <div>sub area details</div>

    </q-card-section>
  </div>
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
    ...mapMutations('surveyRequest', {
      'setDirty': srMutTypes.SET_DIRTY,
      'update': srMutTypes.UPDATE,
      'resetSurveyRequest': srMutTypes.RESET_HIPP_REQUEST,
      'updateSurveyRequest': srMutTypes.UPDATE_HIPP_REQUEST,
    }),

    fetchData() {

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
