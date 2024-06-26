<template>
  <q-scroll-area class="col column">
    <q-card-section class="column q-pa-md q-gutter-y-sm">
      <div>
        The HIPP Request form will allow you to add and define as many survey
        requested areas as you choose, called sub-areas. Please refer to the
        online HELP to determine whether you need to define one survey area or
        many. A valid request must contain at least one requested area and
        all area should be contained within a defined geographic
        area (for example all located within the same bay, gulf, strait, sea
        etc). Requests that contain areas that are not spatially related will
        be returned to the requestor for review.
      </div>

      <div
        v-if="!readonly"
        class="row q-gutter-x-md"
      >
        <q-uploader
          class="col"
          label="Upload Requested Area spatial data files (max 30MB)"
          flat bordered
          :multiple="false"
          accept=".zip,.json,.geojson,.kml,.gml"
          :max-total-size="30000000"
          :auto-expand="true"
          :auto-upload="true"
          url="/api/survey-request-aoi/upload/"
          method="PUT"
          :form-fields="[{name: 'surveyRequestId', value: surveyRequest.id}]"
          @uploaded="uploadedAreas"
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
                    {{task.output.surveyRequestAoiIds.length + " Requested Area entries created"}}
                  </div>
                </div>
              </div>
            </q-card-section>
          </template>

        </q-card>
      </div>

    </q-card-section>

    <q-card-section>
      <div class="column q-gutter-y-xs">
        <div class="row justify-between items-center">
          <div class="main-page-sub-title">Requested Areas</div>
          <div>
            <q-btn
              v-if="_.get(surveyRequest, 'aois.length') > 0"
              @click="onDeleteAll"
              round flat icon="delete_sweep">
              <q-tooltip>
                Delete all areas
              </q-tooltip>
            </q-btn>
            <q-btn
              v-if="_.get(surveyRequest, 'aois.length') > 0"
              type="a"
              :href="`/api/survey-request/${surveyRequest.id}/shp`"
              round flat icon="cloud_download">
              <q-tooltip>
                Download all requested areas
              </q-tooltip>
            </q-btn>
          </div>
        </div>

        <div v-if="loadingAreaOfInterestData" class="column">
          <div style="color:#616161">Loading Requested Areas</div>
          <q-linear-progress size="25px" :value="loadingAreaOfInterestProgress" color="grey-5">
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="grey-5" :label="progressLabel" />
            </div>
          </q-linear-progress>
        </div>
        <div class="column items-center" v-if="_.get(surveyRequest, 'aois.length') == 0">
          <div class="main-page-title">No requested areas provided</div>
          <div style="color:#616161">Drag and drop geojson or zipped shapefile to upload area above.</div>
        </div>
        <div v-else class="column q-gutter-y-sm">
          <area-of-interest
            ref="aoiComponents"
            v-for="(aoi, index) of surveyRequest.aois"
            :key="aoi.id"
            :aoi="aoi"
            :index="index"
            @aoi-value-changed="aoiValueChanged"
            @aoi-deleted="aoiDeleted"
            :readonly="readonly"
            :validator="validator"
          >
          </area-of-interest>
        </div>
      </div>
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

import AreaOfInterest from './area-of-interest';

export default Vue.extend({
  mixins: [errorHandler, permission],

  props: [
    'readonly',
    'validationIntent',
    'validator'
  ],

  components: {
    'area-of-interest': AreaOfInterest,
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    ...mapMutations('surveyRequest', {
      'setDirty': srMutTypes.SET_DIRTY,
      'update': srMutTypes.UPDATE,
      'updateSurveyRequest': srMutTypes.UPDATE_HIPP_REQUEST,
      'resetSurveyRequest': srMutTypes.RESET_HIPP_REQUEST,
      'updateSurveyRequest': srMutTypes.UPDATE_HIPP_REQUEST,
      'addAois': srMutTypes.ADD_AOIS,
      'removeAoi': srMutTypes.REMOVE_AOI,
      'removeAllAoi': srMutTypes.REMOVE_ALL_AOI,
    }),

    fetchData() {
      if (!_.isNil(this.surveyRequest.uploadTaskId)) {
        this.taskTickCount = 0;
        this.updateTaskStatus(this.surveyRequest.uploadTaskId);
      }
    },

    isValid() {
      this.$v.$touch();
      return !this.$v.$error;
    },

    aoiValueChanged({aoi, propertyName, value}) {
      const aoiIndex = this.surveyRequest.aois.indexOf(aoi);
      const path = `aois[${aoiIndex}].${propertyName}`;
      this.updateSurveyRequest({path:path, value:value});
    },

    aoiDeleted({aoi}) {
      this.removeAoi(aoi.id);
    },

    onDeleteAll() {
      this.$q
      .dialog({
        title: "Delete all areas",
        message: `All requested areas will be removed from this submission. Submission details will not be deleted.`,
        ok: "Delete",
        cancel: "Cancel",
      })
      .onOk(() => {
        this.removeAllAoi();
      });
    },

    uploadedAreas(info) {
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

    async addTaskAreasOfInteresToRequest() {
      this.loadingAreaOfInterestData = true;
      let newIds = this.task.output.surveyRequestAoiIds;
      let withData = [];
      let count = 0;
      for (const nid of newIds) {
        let aoiRes = await Vue.axios.get(`api/survey-request-aoi/${nid}`);
        let aoi = aoiRes.data;
        aoi.isNew = true;
        withData.push(aoi);
        count += 1;
        this.loadingAreaOfInterestProgress = count/newIds.length;
      }
      this.addAois(withData);
      this.loadingAreaOfInterestData = false;
    }
  },

  watch: {
    'surveyRequest.uploadTaskId': function (newId, oldId) {
      this.fetchData();
    },
    'task.state': function (newState, oldState) {
      if (newState == 'COMPLETED') {
        this.addTaskAreasOfInteresToRequest();
      }
    }
  },

  computed: {
    ...mapGetters('surveyRequest',{
      surveyRequest: 'surveyRequest',
      dirty: 'dirty',
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
      return Math.round(this.loadingAreaOfInterestProgress * 100) + '%';
    },

    $v () {
      return this.validator;
    }
  },

  data() {
    return {
      task: undefined,
      taskTickCount: 0,
      taskTimeout: undefined,
      loadingAreaOfInterestData: false,
      loadingAreaOfInterestProgress: 0,
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
