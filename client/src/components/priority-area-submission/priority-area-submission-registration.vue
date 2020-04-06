<template>
  <form-wrapper
    :validator="$v"
    class="scroll"
  >
    <div class="column q-pa-md">
      <form-field-validated-input
        name="priorityAreaSubmission.contactPerson"
        label="Contact Person"
        attribute="Contact Person"
        hint="Contact person from the commissioning organisation"
        :value="priorityAreaSubmission.contactPerson"
        @input="updatePriorityAreaSubmissionValue({path:'contactPerson', value:$event})"
        type="text"
        @blur="$v.priorityAreaSubmission.contactPerson.$touch"
        >
      </form-field-validated-input>
      <div v-for="n in 100" :key="n" class="q-py-xs">
        Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.
      </div>
    </div>
  </form-wrapper>
</template>

<script>
import Vue from 'vue';
const _ = require('lodash');
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { required, minLength } from 'vuelidate/lib/validators';

import { errorHandler } from './../mixins/error-handling';
import { permission } from './../mixins/permission';

import * as pasMutTypes from '../../store/modules/priority-area-submission/priority-area-submission-mutation-types';

export default Vue.extend({
  mixins: [errorHandler, permission],

  mounted() {
    this.fetchData();
  },

  methods: {
    ...mapActions('organisation', [
      'getOrganisations',
    ]),

    ...mapMutations('priorityAreaSubmission', {
      'updatePriorityAreaSubmissionValue': pasMutTypes.UPDATE_ACTIVE_PRIORITY_AREA_SUBMISSION_VALUE,
      'setDirty': pasMutTypes.SET_DIRTY,
    }),

    fetchData() {
      this.getOrganisations();
    },
  },

  watch: {

  },

  validations() {
    return {
      priorityAreaSubmission: {
        contactPerson: { required },
      }
    }
  },

  computed: {
    ...mapGetters('priorityAreaSubmission',{
      'priorityAreaSubmission': 'activePriorityAreaSubmission',
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
