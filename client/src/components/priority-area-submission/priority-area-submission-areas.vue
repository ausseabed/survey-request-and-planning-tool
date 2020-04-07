<template>
  <form-wrapper
    :validator="$v"
    class="scroll"
  >
    <div> Areas </div>
  </form-wrapper>


</template>

<script>
import Vue from 'vue';
const _ = require('lodash');
import { mapActions, mapGetters, mapMutations } from 'vuex';

import { errorHandler } from './../mixins/error-handling';
import { permission } from './../mixins/permission';

import * as pasMutTypes from '../../store/modules/priority-area-submission/priority-area-submission-mutation-types';

export default Vue.extend({
  mixins: [errorHandler, permission],

  mounted() {
    this.fetchData();
  },

  methods: {

    ...mapMutations('priorityAreaSubmission', {
      'updatePriorityAreaSubmissionValue': pasMutTypes.UPDATE_ACTIVE_PRIORITY_AREA_SUBMISSION_VALUE,
      'setDirty': pasMutTypes.SET_DIRTY,
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

  validations() {
    return {
      priorityAreaSubmission: {

      }
    }
  },

  computed: {
    ...mapGetters('priorityAreaSubmission',{
      'priorityAreaSubmission': 'activePriorityAreaSubmission',
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
