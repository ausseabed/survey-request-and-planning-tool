<template>
  <div class="scroll">
    <div class="column q-px-md q-gutter-y-sm">
      <div class="column q-gutter-y-sm">
        <div
          v-if="!readonly"
          class="col"
        >
          The priority area tool also allows you to upload a simple shape file or geojson of named polygons that can then be profiled in the table below. If there is additional information that you would like to be provided when a user reviews the priorities, please upload it via the "additional readme file" function below the table. The readme file will be provided as an optional file to download or view when they are interacting with its related polygon(s).
        </div>
        <div
          v-if="!readonly"
          class="row q-gutter-x-md"
        >
          <q-uploader
            class="col"
            label="Upload Priority Area spatial data files (max 30MB)"
            flat bordered
            :multiple="false"
            accept=".zip,.json"
            :max-total-size="30000000"
            :auto-expand="true"
            :auto-upload="true"
            url="/api/priority-area/upload/"
            method="PUT"
            :form-fields="[{name: 'priorityAreaSubmissionId', value: priorityAreaSubmission.id}]"
            @uploaded="uploadedPriorityAreas"
            :disable="isProcessing"
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

        <q-separator/>

        <div class="column q-gutter-y-xs">

          <div class="row justify-between items-center">
            <div class="main-page-sub-title">Priority Areas</div>
            <q-btn
              v-if="_.get(priorityAreaSubmission, 'priorityAreas.length') > 0"
              type="a"
              :href="`/api/priority-area-submission/${priorityAreaSubmission.id}/shp`"
              round flat icon="cloud_download">
              <q-tooltip>
                Download all Priority Areas
              </q-tooltip>
            </q-btn>
          </div>

          <div v-if="loadingPriorityAreaData" class="column">
            <div style="color:#616161">Loading Priority Areas</div>
            <q-linear-progress size="25px" :value="loadingPriorityAreaDataProgress" color="grey-5">
              <div class="absolute-full flex flex-center">
                <q-badge color="white" text-color="grey-5" :label="progressLabel" />
              </div>
            </q-linear-progress>
          </div>
          <div class="column items-center" v-if="_.get(priorityAreaSubmission, 'priorityAreas.length') == 0">
            <div class="main-page-title">No priority areas provided</div>
            <div style="color:#616161">Drag and drop geojson or zipped shapefile to upload area above.</div>
          </div>
          <div v-else class="column q-gutter-y-sm">
            <priority-area
              ref="priorityAreaComponents"
              v-for="priorityArea of priorityAreaSubmission.priorityAreas"
              :key="priorityArea.id"
              :priority-area="priorityArea"
              @priority-area-value-changed="priorityAreaValueChanged"
              @priority-area-deleted="priorityAreaDeleted"
              :readonly="readonly"
              @priority-area-apply-to-all="priorityAreaApplytoAll"
            >
            </priority-area>
          </div>
        </div>


      </div>
    </div>
  </div>


</template>

<script>
import Vue from 'vue';
const _ = require('lodash');
import { mapActions, mapGetters, mapMutations } from 'vuex';

import { errorHandler } from './../mixins/error-handling';
import { permission } from './../mixins/permission';

import * as pasMutTypes from '../../store/modules/priority-area-submission/priority-area-submission-mutation-types';

import PriorityArea from './priority-area';

export default Vue.extend({
  mixins: [errorHandler, permission],

  props: [
    'readonly',
  ],

  components: {
    'priority-area': PriorityArea,
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    ...mapActions('priorityAreaSubmission', [
      'getPreferredTimeframeOptions',
      'getPriorityOptions',
      'getRequiredDataQualityOptions',
      'getRiskRatingOptions',
    ]),

    ...mapMutations('priorityAreaSubmission', {
      'addPriorityAreas': pasMutTypes.ADD_PRIORITY_AREAS,
      'removePriorityArea': pasMutTypes.REMOVE_PRIORITY_AREA,
      'updatePriorityAreaSubmissionValue': pasMutTypes.UPDATE_ACTIVE_PRIORITY_AREA_SUBMISSION_VALUE,
      'setDirty': pasMutTypes.SET_DIRTY,
    }),

    fetchData() {
      this.getPreferredTimeframeOptions();
      this.getPriorityOptions();
      this.getRequiredDataQualityOptions();
      this.getRiskRatingOptions();

      if (!_.isNil(this.priorityAreaSubmission.uploadTaskId)) {
        this.taskTickCount = 0;
        this.updateTaskStatus(this.priorityAreaSubmission.uploadTaskId);
      }
    },

    isValid() {
      // we perform map, then reduce, so that the `isValid` method
      // is called on all priority area components. Doing the only the reduce
      // will stop calling isValid after the first non-valid component.
      if (_.isNil(this.$refs.priorityAreaComponents)) {
        // if there are no priority areas, then its valid
        return true;
      }
      let allValid = this.$refs.priorityAreaComponents
        .map((comp) => comp.isValid())
        .reduce((sum, next) => sum && next, true);

      return allValid;
    },

    priorityAreaValueChanged({priorityArea, propertyName, value}) {
      const paIndex = this.priorityAreaSubmission.priorityAreas.indexOf(priorityArea);
      const path = `priorityAreas[${paIndex}].${propertyName}`;
      this.updatePriorityAreaSubmissionValue({path:path, value:value});
    },

    priorityAreaDeleted({priorityArea}) {
      this.removePriorityArea(priorityArea.id);
    },

    uploadedPriorityAreas(info) {
      const res = JSON.parse(info.xhr.response);
      this.taskTickCount = 0;
      this.updateTaskStatus(res.taskId);
    },

    updateTaskStatus(taskId) {
      const finishedStates = ["COMPLETED", "FAILED"];
      Vue.axios
        .get(`api/task/${taskId}`)
        .then(res => {
          this.task = res.data;
          this.taskTickCount += 1;

          // dont keep getting task status if the task has finished
          // OR if we've already got the task status 600 times. If this happens
          // and the task didn't finish prior, it's likely the task has failed
          // but the status is not reflecting this.
          if (!finishedStates.includes(this.task.state) && this.taskTickCount < 600) {
            this.taskTimeout = setTimeout(() => this.updateTaskStatus(taskId), 1000);
          }
        }).catch((err) => {
          if (err.response.status == 404) {
            // then no task has been provided, this is ok.
          } else {
            console.error(err);
          }
        });
    },

    async addTaskPriorityAreasToSubmission() {
      this.loadingPriorityAreaData = true;
      let newPaIds = this.task.output.priorityAreaIds;
      let pasWithData = [];
      let count = 0;
      for (const paId of newPaIds) {
        let paRes = await Vue.axios.get(`api/priority-area/${paId}`);
        let pa = paRes.data;
        pa.isNew = true;
        pasWithData.push(pa);
        count += 1;
        this.loadingPriorityAreaDataProgress = count/newPaIds.length;
      }
      this.addPriorityAreas(pasWithData);
      this.loadingPriorityAreaData = false;
    },

    priorityAreaApplytoAll({propertyName, value}) {
      for (const [paIndex, pa] of this.priorityAreaSubmission.priorityAreas.entries()) {
        const path = `priorityAreas[${paIndex}].${propertyName}`;
        this.updatePriorityAreaSubmissionValue({path:path, value:value});
      }
    },
  },

  watch: {
    'priorityAreaSubmission.uploadTaskId': function (newId, oldId) {
      this.fetchData();
    },
    'task.state': function (newState, oldState) {
      if (newState == 'COMPLETED') {
        this.addTaskPriorityAreasToSubmission();
      }
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

    progressLabel () {
      return Math.round(this.loadingPriorityAreaDataProgress * 100) + '%';
    },
  },

  data() {
    return {
      task: undefined,
      taskTickCount: 0,
      taskTimeout: undefined,
      loadingPriorityAreaData: false,
      loadingPriorityAreaDataProgress: 0,
    }
  },

  beforeRouteLeave (to, from, next) {
    if (!_.isNil(this.taskTimeout)) {
      clearTimeout(this.taskTimeout)
    }
    next()
  },

});
</script>


<style scoped lang="stylus">

</style>
