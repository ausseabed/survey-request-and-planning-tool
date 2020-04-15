<template>
  <form-wrapper
    :validator="$v"
    class="scroll"
  >
    <div class="column q-pa-md q-gutter-y-sm">
      <div class="row q-gutter-x-md">
        <div class="col">
          The priority area tool also allows you to upload a simple shape file or geojson of named polygons that can then be profiled in the table below. If there is additional information that you would like to be provided when a user reviews the priorities, please upload it via the "additional readme file" function below the table. The readme file will be provided as an optional file to download or view when they are interacting with its related polygon(s).
        </div>
        <q-uploader
          class="col-auto"
          label="Upload Priority Area spatial data files"
          flat bordered
          :multiple="false"
          accept=".zip,.json"
          :auto-expand="true"
          :auto-upload="true"
          url="/api/priority-area/upload/"
          method="PUT"
          :form-fields="[{name: 'priorityAreaSubmissionId', value: priorityAreaSubmission.id}]"
        >

        </q-uploader>
      </div>
    </div>
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
