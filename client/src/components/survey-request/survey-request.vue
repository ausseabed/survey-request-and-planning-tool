<template>
  <q-page
    :style-fn="heightTweak"
    class="column items-center"
  >
    <div
      class="column q-px-sm q-pt-sm q-gutter-y-sm fit"
      style="max-width: 900px;"
    >
      <div class="row justify-between">
        <record-state
          ref="recordState"
          v-if="surveyRequest.id"
          entity-type="survey-request"
          :entity-id="surveyRequest.id"
          :disable="dirty"
          @updated-state="stateUpdated($event)"
          class="col-auto"
          :validationCallback="recordStateValidationCallback"
          >
        </record-state>
        <!-- Empty div ensures the logo is right aligned even when no
             record state is displayed -->
        <div></div>
        <img height="48px" src="~/assets/aho-logo-small.png" />
      </div>
      <div>
        The HydroScheme Industry Partnership Program (HIPP) is an enduring partnership, with a request timeframe domain of 5-10 years. It aims to boost Australia's hydrographic industry capability allowing partners to acquire maritime survey data for the production of digital maps of Australia's seas and coastal areas.
      </div>

      <q-card class="col column">
        <q-tabs
          v-model="tab"
          align="left"
          class="col-auto bg-secondary text-white"
        >
          <q-route-tab
            name="survey-request-registration"
            :to="{name: 'survey-request-registration', params: {id: $route.params.id}}"
            exact
            class="q-tab__label"
          >
            Request <br/> Registration
          </q-route-tab>
          <q-route-tab
            name="survey-request-business-case"
            :to="{name: 'survey-request-business-case', params: {id: $route.params.id}}"
            exact
            class="q-tab__label"
          >
            Request <br/> Business Case
          </q-route-tab>
          <q-route-tab
            name="survey-request-areas-of-interest"
            :to="{name: 'survey-request-areas-of-interest', params: {id: $route.params.id}}"
            exact
            class="q-tab__label"
          >
            Area(s) <br/> of Interest
          </q-route-tab>
          <q-route-tab
            name="survey-request-sub-area-details"
            :to="{name: 'survey-request-sub-area-details', params: {id: $route.params.id}}"
            exact
            class="q-tab__label"
          >
            Sub-Area <br/> details
          </q-route-tab>
          <q-route-tab
            name="survey-request-sub-area-data-types"
            label=""
            :to="{name: 'survey-request-sub-area-data-types', params: {id: $route.params.id}}"
            exact
            class="q-tab__label"
          >
            Sub-Area <br/> data types
          </q-route-tab>
          <q-route-tab
            name="survey-request-summary"
            :to="{name: 'survey-request-summary', params: {id: $route.params.id}}"
            exact
            class="q-tab__label"
          >
            Request <br/> Summary
          </q-route-tab>
          <q-route-tab
            name="survey-request-submission-details"
            label=""
            :to="{name: 'survey-request-submission-details', params: {id: $route.params.id}}"
            exact
            class="q-tab__label"
          >
            Request <br/> Submission details
          </q-route-tab>
        </q-tabs>
        <div class="col-auto fat-spacer bg-secondary"></div>
        <router-view
          class="col"
          ref="srComp"
          :readonly="stateReadonly"
          :validationIntent="validationIntent"
        >
        </router-view>
      </q-card>
      <div class="row justify-between col-auto">
        <div class="row justify-start q-gutter-sm">
          <q-btn
            color="primary"
            label="Save"
            icon="save"
            @click="saveClicked(false, true)"
          />
          <q-btn
            color="primary"
            :label="dirty ? 'Exit without saving' : 'Exit'"
            icon="close"
            :to="'/'"
          />
        </div>
        <q-btn
          v-if="surveyRequest && $route.name === 'survey-request-summary'"
          :disable="published"
          color="primary"
          label="Publish"
          @click="publishClicked()"
        />
        <q-btn
          v-else
          color="primary"
          label="Save and next"
          icon-right="forward"
          @click="saveClicked(true, true)"
        />
      </div>
    </div>

    <confirm-navigation id="confirmNavigation" ref="confirmNavigation"></confirm-navigation>
  </q-page>
</template>

<script>
import Vue from 'vue';
const _ = require('lodash');
import { mapActions, mapGetters, mapMutations } from 'vuex';

import { errorHandler } from './../mixins/error-handling';
import { permission } from './../mixins/permission';
import { DirtyRouteGuard } from './../mixins/dirty-route-guard';

import * as srMutTypes from '../../store/modules/survey-request/survey-request-mutation-types';

// what the route gets changed to after save and continue is clicked
const NEXT_ROUTES = {
  'survey-request-registration': 'survey-request-business-case',
  'survey-request-business-case': 'survey-request-areas-of-interest',
  'survey-request-areas-of-interest': 'survey-request-sub-area-details',
  'survey-request-sub-area-details': 'survey-request-sub-area-data-types',
  'survey-request-sub-area-data-types': 'survey-request-summary',
  'survey-request-summary': 'survey-request-submission-details',
  'survey-request-submission-details': 'survey-request-submission-details',
};

export default Vue.extend({
  mixins: [DirtyRouteGuard, errorHandler, permission],

  async mounted() {
    const id = this.$route.params.id;
    this.id = id;
  },

  methods: {
    ...mapActions('surveyRequest', [
      'getSurveyRequest',
      'saveSurveyRequest',
      'getRiskMatrix',
      'getChartProductQualityImpactRequirements',
      'getSurveyQualityRequirements',
      'deleteSurveyRequest',
      'getGeojsonAttributeMap',
    ]),
    ...mapActions('custodian', [
      'getCustodians',
    ]),
    ...mapActions('reportTemplate', [
      'generateReport',
    ]),
    ...mapActions('requestPurpose', [
      'getRequestPurposes',
    ]),
    ...mapActions('dataCaptureType', [
      'getDataCaptureTypes',
    ]),

    ...mapMutations('surveyRequest', {
      'setDirty': srMutTypes.SET_DIRTY,
      'update': srMutTypes.UPDATE,
      'resetSurveyRequest': srMutTypes.RESET_HIPP_REQUEST,
      'updateSurveyRequest': srMutTypes.UPDATE_HIPP_REQUEST,
    }),

    publishClicked() {
      let srComp = this.$refs.srComp;
      if (!srComp.isValid()) {
        this.notifyError('Please confirm acknowledgement');
        return;
      }

      this.$refs.recordState.transitionRecordState('PUBLISH').then(sr => {
        this.notifySuccess('Survey Request published');
      }).catch((err) => {
        this.notifyError(`Failed to publish Survey Request`);
      });
    },

    submit() {
      this.saveClicked(false, false);
    },

    saveClicked(moveNext, changeRoute) {
      let srComp = this.$refs.srComp;
      if (!srComp.isValid()) {
        this.notifyError('Please review fields');
        return;
      }

      const isNew = _.isNil(this.surveyRequest.id);
      this.saveSurveyRequest(this.surveyRequest).then(sr => {

        const successMsg = isNew ?
          'Survey Request created' :
          'Survey Request updated';
        this.notifySuccess(successMsg);

        if (!changeRoute) {
          // return here and don't do any change to the route (here at least)
          return
        }
        // need to check the route, as it may have already been set to something
        // else via "save and continue".
        const currentId = this.$route.params.id;
        let routeName = this.$route.name;
        routeName = _.isNil(routeName) ? 'survey-request-registration' : routeName;
        if (moveNext) {
          routeName = NEXT_ROUTES[routeName];
        }
        if (isNew || moveNext) {
          // don't push a new route that could be the same as the current
          // route as it produces an error.
          this.$router.push({ name: routeName, params: { id: sr.id } });
        }
      }).catch((err) => {
        this.notifyError(`Failed to save Survey Request`);
      });
    },

    updateActiveSurveyrequest () {
      if (this.id == 'new') {
        let sr = {
          id: undefined,
          name: undefined,
          organisation: undefined,
          organisations: [],
          custodians: [],
          requestorName: undefined,
          requestorPosition: undefined,
          pointOfContactEmail: undefined,
        };
        this.update({path: 'surveyRequest', value: sr})
        this.setDirty(false);
        this.stateReadonly = false;
      } else {
        // id has been included in url, so get and set this survey request
        this.getSurveyRequest({id: this.id});
      }
    },

    stateUpdated(state) {
      if (this.id !== 'new') {
        this.stateReadonly = false;
        this.published = false;
      } else if (_.isNil(state)) {
        this.stateReadonly = true;
        this.published = true;
      } else {
        this.stateReadonly = state.readonly;
        this.published = state.state === 'published';
      }
    },

    heightTweak (offset) {
      return {
        minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh',
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      };
    },

    recordStateValidationCallback(evt) {
      if (evt != 'PUBLISH') {
        return true;
      }
      let srComp = this.$refs.srComp;
      if (this.$route.name !== 'survey-request-submission' || !srComp.isValid()) {
        this.notifyError('Please confirm acknowledgement on confirmation tab');
        return false;
      }
      return true;
    },
  },

  watch: {
    // call again the method if the route changes
    '$route': function (newRoute, oldRoute) {
      const id =  newRoute.params.id;
      this.id = id;
    },
    'id': function (newId, oldId) {
      this.updateActiveSurveyrequest();
    }
  },

  computed: {
    ...mapGetters('surveyRequest', [
      'surveyRequest',
      'dirty',
      'riskMatrix',
      'chartProductQualityImpactRequirements',
      'surveyQualityRequirements',
      'geojsonAttributeMap',
    ]),
    $v() {
      // the dirty route guard wants to call the validation method (touch) to
      // determin if the form is in a valid state. However in this case the
      // form lives in the current child component. This exists solely for the
      // DRG to hook onto.
      let srComp = this.$refs.srComp;
      return srComp.$v;
    }
  },

  data() {
    return {
      tab: undefined,
      id: undefined,
      stateReadonly: true,
      published: true,
      validationIntent: 'save',
    }
  },

});
</script>


<style scoped lang="stylus">

</style>
