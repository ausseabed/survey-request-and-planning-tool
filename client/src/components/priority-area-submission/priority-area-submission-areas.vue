<template>
  <form-wrapper
    :validator="$v"
    class="scroll"
  >
    <div class="column q-px-md q-gutter-y-sm">
      <div class="column q-gutter-y-sm">
        <div class="col">
          The priority area tool also allows you to upload a simple shape file or geojson of named polygons that can then be profiled in the table below. If there is additional information that you would like to be provided when a user reviews the priorities, please upload it via the "additional readme file" function below the table. The readme file will be provided as an optional file to download or view when they are interacting with its related polygon(s).
        </div>
        <div class="row q-gutter-x-md">
          <q-uploader
            class="col"
            label="Upload Priority Area spatial data files"
            flat bordered
            :multiple="false"
            accept=".zip,.json"
            :auto-expand="true"
            :auto-upload="true"
            url="/api/priority-area/upload/"
            method="PUT"
            :form-fields="[{name: 'priorityAreaSubmissionId', value: priorityAreaSubmission.id}]"
            @uploaded="uploadedPriorityAreas"
          >
          </q-uploader>

          <q-card flat bordered class="col-auto" style="width:300px">
            <template v-if="task == undefined">
              <q-card-section
                class="fit column justify-center items-center"
                style="color:#616161"
              >
                Awaiting upload to process
              </q-card-section>
            </template>
            <template v-else-if="isProcessing">
              <q-card-section
                class="fit column justify-center"
              >
                <div class="row q-gutter-x-md">
                  <q-circular-progress
                    :indeterminate="task.progressType == 'INDETERMINATE'"
                    :value="task.progress"
                    :show-value="task.progressType != 'INDETERMINATE'"
                    font-size="20px"
                    size="50px"
                    class="text-grey-5"
                    color="grey-5"
                  />
                  <div class="column">
                    <div class="main-page-sub-title">Processing</div>
                    <div style="color:#616161">{{task.statusMessage}}</div>
                  </div>
                </div>
              </q-card-section>
            </template>
            <template v-else-if="task.state == 'FAILED'">
              <q-card-section
                class="fit column justify-center"
              >
                <div class="row q-gutter-x-md">
                  <q-avatar
                    icon="error_outline"
                    text-color="red"
                    size="50px" font-size="40px">
                  </q-avatar>
                  <div class="column">
                    <div class="main-page-sub-title">Processing failed</div>
                    <div style="color:#616161">{{task.errorMessage}}</div>
                  </div>
                </div>
              </q-card-section>
            </template>
            <template v-else-if="task.state == 'COMPLETED'">
              <q-card-section
                class="fit column justify-center"
              >
                <div class="row q-gutter-x-md">
                  <q-avatar
                    icon="check_circle_outline"
                    text-color="grey-5"
                    size="50px" font-size="40px">
                  </q-avatar>
                  <div class="column">
                    <div class="main-page-sub-title">Processing complete</div>
                    <div style="color:#616161">
                      {{task.output.priorityAreaIds.length + " priority areas created"}}
                    </div>
                  </div>
                </div>
              </q-card-section>
            </template>

          </q-card>
        </div>


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
      if (!_.isNil(this.priorityAreaSubmission.uploadTaskId)) {
        this.updateTaskStatus(this.priorityAreaSubmission.uploadTaskId);
      }
    },

    isValid() {
      this.$v.$touch();
      return !this.$v.$error;
    },

    uploadedPriorityAreas(info) {
      const res = JSON.parse(info.xhr.response);
      console.log(res);
      this.updateTaskStatus(res.taskId);
    },

    updateTaskStatus(taskId) {
      const finishedStates = ["COMPLETED", "FAILED"];
      Vue.axios
        .get(`api/task/${taskId}`)
        .then(res => {
          this.task = res.data;

          if (!finishedStates.includes(this.task.state)) {
            setTimeout(() => this.updateTaskStatus(taskId), 750);
          }
        }).catch((err) => {
          if (err.response.status == 404) {
            // then no task has been provided, this is ok.
          } else {
            console.error(err);
          }
        });
    },
  },

  watch: {
    'priorityAreaSubmission.uploadTaskId': function (newId, oldId) {
      debugger;
      this.fetchData();
    }
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

    isProcessing() {
      if (this.task == undefined) {
        return false;
      } else if (["NOT_STARTED", "STARTED"].includes(this.task.state)) {
        // because "NOT_STARTED" still means the task has been initialised and
        // it is about to start very soon
        return true;
      } else {
        return false;
      }
    },
  },

  data() {
    return {
      task: undefined
    }
  },

});
</script>


<style scoped lang="stylus">

</style>
