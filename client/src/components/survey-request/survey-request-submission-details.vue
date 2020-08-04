<template>
  <div class="column col">

    <template v-if="recordState.state == 'submitted'">
      <q-card-section class="column q-gutter-y-sm col-auto">
        <div>
          Thankyou for your submission. A member of the assessment team will
          be in touch with you throughout the assessment peroid to provide
          updates.
        </div>
      </q-card-section>

      <q-card-section class="column q-gutter-y-sm col-auto">
        <div>
          Your submission details are as follows:
        </div>
        <div>
          Submission Date: {{ recordState.created | dateValue | moment("D MMMM YYYY") }}
        </div>
      </q-card-section>
    </template>
    <template v-else>
      <q-card-section class="column q-gutter-y-sm col-auto">
        <div>No submission has been made.</div>
      </q-card-section>
    </template>

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
  ],

  mounted() {
    this.fetchData();
  },

  methods: {

    fetchData() {

    },

  },

  watch: {

  },

  computed: {
    ...mapGetters('recordState', [
      'recordState',
    ]),
  },

  data() {
    return {

    }
  },

});
</script>


<style scoped lang="stylus">

</style>
