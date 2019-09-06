<template>

  <div class="row justify-center fit">

    <div style="width: 900px; max-width: 900px;" class="column no-wrap fit">
      <div class="column q-pa-md fit">
        <record-state
          v-if="this.surveyRequest.id"
          class="full-width q-pb-sm"
          :entity-type="`survey-request`"
          :entity-id="surveyRequest.id"
          :validation-callback="recordStateValidationCallback"
          @updated-state="stateUpdated($event)"
          >
        </record-state>

        <q-card class="col column">
          <q-card-section>
            <div class="text-h6"> Linked Plans </div>
          </q-card-section>
          <q-separator style="height:1px;"/>
          <q-card-section class="column col no-padding">
            <div v-if="loading" class="row justify-center fit">
              <div class="column justify-center text-light">
                <q-circular-progress
                  indeterminate
                  size="80px"
                  class="q-ma-md"
                />
              </div>
            </div>
            <div
              v-else-if="!surveyPlanList || surveyPlanList.length == 0"
              class="row justify-center fit"
              >
              <div class="column justify-center text-light">
                No survey plans have been created for this HIPP Request.
              </div>
            </div>
            <q-scroll-area
              v-else
              class="fit">
              <q-list no-border padding>

                <q-item clickable
                  v-for="pm in surveyPlanList"
                  :key="pm.id"
                  class="column"
                  @click="clickPlan(pm)"
                >
                  <div class="row items-start justify-start" style="min-height:100px;">
                    <q-item-section
                      avatar
                      v-if="linking"
                    >
                      <q-icon v-if="isLinked(pm)" name="check_box" ></q-icon>
                      <q-icon v-else name="check_box_outline_blank" ></q-icon>
                    </q-item-section>
                    <q-item-section class="row col">
                      <div class="column justify-start q-pb-sm">
                        <q-item-label>{{pm.surveyName}}</q-item-label>
                        <q-item-label caption>{{pm.surveyPlanStatus}}</q-item-label>
                        <q-item-label caption>{{pm.startDate | dateString}}</q-item-label>
                      </div>
                    </q-item-section>

                    <q-item-section class="col-sm-6 col-xs-12 thumbnail-background tn-img-parent rounded-borders justify-center">
                      <q-img
                        contain
                        style="max-width:80%;max-height:200px;"
                        class="self-center"
                        spinner-color="white"
                        :src="`api/survey-plan/${pm.id}/thumbnail`">
                      </q-img>
                      <div class="top-left q-pa-sm rounded-borders" style="background-color:rgba(255, 255, 255, 0.5);">
                        <div class="text-light">Survey Plan AOI</div>
                      </div>
                    </q-item-section>

                  </div>
                </q-item>

              </q-list>

            </q-scroll-area>

          </q-card-section>
          <q-separator style="height:1px;"/>
          <q-card-section
            v-if="!readonly"
            class="row justify-end">
            <q-btn
              v-if="linking"
              flat label="Done"
              @click="done()"
              >
            </q-btn>
            <q-btn
              v-if="!linking"
              flat icon="link" label="Modify linked plans"
              @click="linkPlan()"
              >
            </q-btn>
            <q-btn
              v-if="!linking && this.hasPermission('canAddSurveyPlan')"
              flat icon="add" label="Add plan"
              @click="addSurveyPlan()"
              >
            </q-btn>
          </q-card-section>
        </q-card>
      </div>

    </div>

  </div>
</template>
<script>
import Vue from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
const _ = require('lodash');
import { errorHandler } from '../mixins/error-handling'
import { permission } from './../mixins/permission'
import { date } from 'quasar'
import * as pmMutTypes
  from '../../store/modules/survey-plan/survey-plan-mutation-types'
import { RequestStatus } from '../../store/modules/request-status'

import axios from 'axios';
const path = require('path');


export default Vue.extend({
  mixins: [errorHandler, permission],

  beforeMount() {
    this.SET_SURVEY_PLAN_LIST([])
  },

  mounted() {
    this.stateReadonly = true;
  },

  computed: {
    ...mapGetters('surveyPlan',[
      'surveyPlanList',
      'surveyPlanListFilter',
    ]),
    ...mapGetters('surveyPlan',{
      surveyPlanRequestStatus:'requestStatus'
    }),
    ...mapGetters('surveyRequest',[
      'surveyRequest',
    ]),
    loading() {
      return this.surveyPlanRequestStatus == RequestStatus.REQUESTED
    },
    readonly: function() {
      if (
        this.hasPermission('canAddSurveyRequest') &&
        _.isNil(this.surveyRequest.id)
      ) {
        // user has permission to add new request, and this is a new request
        // this is a new request, so no need to worry about record state
        return false
      }

      if (this.stateReadonly) {
        // if the state says read only
        return true
      }
      if (this.hasPermission('canEditAllSurveyRequests')) {
        // can edit all survey plans
        return false
      }
      else if (
        this.hasPermission('canEditCustodianSurveyRequests') &&
        this.hasCustodianLink('surveyRequest.custodians')
      ) {
        // can only edit hipp requests that are linked to user
        return false
      } else {
        return true
      }
    },
  },

  methods: {
    ...mapActions('surveyRequest', [
      'updatePlanLinks',
    ]),
    ...mapActions('surveyPlan', [
      'getSurveyPlanList',
    ]),
    ...mapMutations('surveyPlan', [
      pmMutTypes.SET_SURVEY_PLAN_LIST_FILTER,
      pmMutTypes.RESET_SURVEY_PLAN,
      pmMutTypes.SET_SURVEY_PLAN_LIST,
    ]),
    ...mapMutations('surveyPlan', {
      'surveyPlanUpdate': pmMutTypes.UPDATE,
      'surveyPlanSetDirty': pmMutTypes.SET_DIRTY,
    }),

    addSurveyPlan() {
      this.RESET_SURVEY_PLAN();
      let clonedHippReq = _.cloneDeep(this.surveyRequest);
      this.surveyPlanUpdate(
        {path:'surveyPlan.surveyRequest', value:clonedHippReq}
      );
      this.surveyPlanSetDirty(false);
      this.$router.push({ path: `/survey-plan/new`, query: {reset:false} })
    },

    linkPlan() {
      this.linking = true;
      this.SET_SURVEY_PLAN_LIST([])
      this.SET_SURVEY_PLAN_LIST_FILTER(undefined)

      this.getSurveyPlanList()
      .then((planList) => {
        this.linkedPlans = []
        planList.forEach((plan) => {
          if (plan.surveyRequest && plan.surveyRequest.id == this.surveyRequest.id) {
            this.linkedPlans.push(plan);
          }
        })
      })
    },

    async clickPlan(plan) {
      if (this.linking) {
        if (this.isLinked(plan)) {
          const updateResp = await this.updatePlanLink(plan, false)
          this.linkedPlans = this.linkedPlans.filter((p) => {
            return p.id != plan.id
          })
          this.notifySuccess("Plan successfully unlinked")
        } else {
          const updateResp = await this.updatePlanLink(plan, true)
          this.linkedPlans.push(plan);
          const msg = updateResp.reLinkedCount != 0 ?
            "Plan relinked" :
            "Plan linked"
          this.notifySuccess(msg)
        }
      } else {
        const planUrl = `/survey-plan/${plan.id}/summary/`
        this.$router.push({ path: planUrl})
      }
    },

    updatePlanLink(plan, linked) {
      const payload = {
        id: this.surveyRequest.id,
        linkedPlans: [{
          id: plan.id,
          linked: linked,
        }],
      }
      return this.updatePlanLinks(payload)
    },

    isLinked(plan) {
      const linkedPlan = this.linkedPlans.find((p) => {
        return p.id == plan.id
      });
      return linkedPlan ? true : false
    },

    done() {
      this.linking = false
      let hrfilter = {'survey-request': this.surveyRequest.id}
      this.SET_SURVEY_PLAN_LIST_FILTER(hrfilter)
      this.getSurveyPlanList()
    },

    stateUpdated(state) {
      if (_.isNil(state)) {
        this.stateReadonly = true
      } else {
        this.stateReadonly = state.readonly
      }
    },

    recordStateValidationCallback(recordStateEvent) {
      if (this.linking) {
        this.notifyError('Please complete link modification');
        return false
      } else {
        return true
      }
    },
  },

  watch: {
    'surveyRequest.id': {
      handler: function (newId, oldId) {
        let hrfilter = _.isNil(newId) ? undefined : {'survey-request': newId}
        this.SET_SURVEY_PLAN_LIST_FILTER(hrfilter)
      },
      immediate: true,
    },
    'surveyPlanListFilter': {
      handler: function (newFilter, oldFilter) {
        if (!_.isNil(this.surveyRequest.id)) {
          this.getSurveyPlanList()
        }
      },
      immediate: true,
    },
  },

  data() {
    return {
      linking: false,
      linkedPlans: [],
      stateReadonly: true,
    }
  }
});

</script>

<style>
.thumbnail-background {
  background: #efefef;
  margin-left: 0px !important;
  position: relative;
}
.thumbnail {
  display: block;
    max-width:230px;
    max-height:95px;
    width: auto;
    height: auto;
}
.top-left {
  position: absolute;
  top: 8px;
  left: 16px;
}

.tn-img-parent {
  width: 100px;
}

.tn-img {
  display: block;
  width: 100%;
  height: auto;
}

</style>
