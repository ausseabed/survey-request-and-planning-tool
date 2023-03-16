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
        <div class="row">
          <img height="48px" src="~/assets/aho-logo-small.png" />
          <img height="48px" src="~/assets/hipp-logo-small.png" />
        </div>
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
            v-for="tabInfo in tabs"
            :key="tabInfo.name"
            :name="tabInfo.name"
            :to="{name: tabInfo.route, params: {id: $route.params.id}}"
            exact
            class="q-tab__label"
          >
            <div v-bind:class="{ 'red-tab-label': !tabValid(tabInfo.name) , 'rounded-borders': !tabValid(tabInfo.name) }">
              <template>
                {{ tabInfo.label[0] }}
              </template>
              <template>
              </br> {{ tabInfo.label[1] }}
              </template>
            </div>
          </q-route-tab>
        </q-tabs>
        <div class="col-auto fat-spacer bg-secondary"></div>
        <form-wrapper
          :validator="$v"
          class="column col"
        >
          <!-- <q-scroll-area class="col column"> -->
            <router-view
              class="col"
              ref="srComp"
              :readonly="stateReadonly"
              :validationIntent="validationIntent"
              :validator = "$v"
            >
            </router-view>
          <!-- </q-scroll-area> -->
        </form-wrapper>


      </q-card>
      <div class="row justify-between col-auto">
        <div class="row justify-start q-gutter-sm">
          <q-btn
            color="primary"
            label="Save"
            icon="save"
            @click="saveClicked(false, true)"
            :disable="stateReadonly || !userCanEdit"
          />
          <q-btn
            color="primary"
            :label="dirty ? 'Exit without saving' : 'Exit'"
            icon="close"
            :to="'/'"
          />
          <q-btn
            v-if="userCanEdit"
            color="red"
            label="Delete"
            icon="delete"
            :disable="stateReadonly"
            @click="deleteClicked"
          />
        </div>
        <q-btn
          v-if="surveyRequest && $route.name === 'survey-request-summary'"
          :disable="submitted"
          color="primary"
          label="Submit"
          @click="submitClicked()"
        />
        <q-btn
          v-else-if="$route.name !== 'survey-request-submission-details'"
          color="primary"
          label="Save and next"
          icon-right="forward"
          @click="saveClicked(true, true)"
          :disable="stateReadonly || !userCanEdit"
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

import { required, minLength, email } from 'vuelidate/lib/validators';
import { errorHandler } from './../mixins/error-handling';
import { permission } from './../mixins/permission';
import { DirtyRouteGuard } from './../mixins/dirty-route-guard';

import * as srMutTypes from '../../store/modules/survey-request/survey-request-mutation-types';


const TABS_INFO = [
  {
    name: 'survey-request-registration',
    label: ['Request', 'Registration'],
    route: 'survey-request-registration',
    nextRoute: 'survey-request-business-case',
    saveValidations: {
      surveyRequest: {
        name: { required },
        custodians: { required, minLength:minLength(1) },
        organisation: { },
        organisations: { },
        requestorName: { },
        requestorPosition: { },
        pointOfContactEmail: { email },
      }
    },
    submitValidations: {
      surveyRequest: {
        name: { required },
        custodians: { required, minLength:minLength(1) },
        organisation: { required },
        organisations: { },
        requestorName: { required },
        requestorPosition: { required },
        pointOfContactEmail: { required, email },
      }
    },
  },
  {
    name: 'survey-request-business-case',
    label: ['Request', 'Business Case'],
    route: 'survey-request-business-case',
    nextRoute: 'survey-request-areas-of-interest',
    saveValidations: {
      surveyRequest: {
        businessJustification: { },
        costBenefit: { },
        additionalFundingAvailable: { },
        hasMoratorium: { },
        moratoriumDate: {},
        moratoriumComment: {},
      }
    },
    submitValidations: {
      surveyRequest: {
        businessJustification: { required },
        costBenefit: { required },
        additionalFundingAvailable: { },
        hasMoratorium: { },
        moratoriumDate: { },
        moratoriumComment: { },
      }
    },
  },
  {
    name: 'survey-request-areas-of-interest',
    label: ['Area(s)', 'of Interest'],
    route: 'survey-request-areas-of-interest',
    nextRoute: 'survey-request-sub-area-details',
    saveValidations: {
      surveyRequest: {
        aois: {
          $each: {
            name: { required }
          }
        }
      }
    },
    submitValidations: {
      surveyRequest: {
        aois: {
          required, minLength:minLength(1),
        }
      }
    },
  },
  {
    name: 'survey-request-sub-area-details',
    label: ['Sub-Area', 'details'],
    route: 'survey-request-sub-area-details',
    nextRoute: 'survey-request-sub-area-info',
    saveValidations: {
      surveyRequest: {}
    },
    submitValidations: {
      surveyRequest: {
        aois: {
          $each: {
            surveyStandard: { required },
            overallRisk: { required },
            preferredTimeframe: { required },
            dataTypesToCapture: {required },
          }
        }
      }
    },
  },
  {
    name: 'survey-request-sub-area-info',
    label: ['Sub-Area', 'Information'],
    route: 'survey-request-sub-area-info',
    nextRoute: 'survey-request-summary',
    saveValidations: {
      surveyRequest: {
        furtherInformation: {},
        riskIssues: {},
      }
    },
    submitValidations: {
      surveyRequest: {
        furtherInformation: {},
        riskIssues: {},
      }
    },
  },
  {
    name: 'survey-request-summary',
    label: ['Request', 'Summary'],
    route: 'survey-request-summary',
    nextRoute: 'survey-request-submission-details',
    saveValidations: {
      surveyRequest: {}
    },
    submitValidations: {
      surveyRequest: {
        acknowledged: {
          checked: value => value === true
        }
      }
    },
  },
  {
    name: 'survey-request-submission-details',
    label: ['Request', 'Submission details'],
    route: 'survey-request-submission-details',
    nextRoute: 'survey-request-submission-details',
    saveValidations: {
      surveyRequest: {}
    },
    submitValidations: {
      surveyRequest: {}
    },
  }
]


export default Vue.extend({
  mixins: [DirtyRouteGuard, errorHandler, permission],

  async mounted() {
    const id = this.$route.params.id;
    this.id = id;

    this.fetchData();
  },

  methods: {
    ...mapActions('surveyRequest', [
      'getSurveyRequest',
      'saveSurveyRequest',
      'deleteSurveyRequest',
    ]),
    ...mapActions('custodian', [
      'getCustodians',
    ]),
    ...mapActions('reportTemplate', [
      'generateReport',
    ]),
    ...mapMutations('surveyRequest', {
      'setDirty': srMutTypes.SET_DIRTY,
      'update': srMutTypes.UPDATE,
      'resetSurveyRequest': srMutTypes.RESET_HIPP_REQUEST,
      'updateSurveyRequest': srMutTypes.UPDATE_HIPP_REQUEST,
      'restoreState': srMutTypes.RESTORE,
      'setAcknowledged': srMutTypes.SET_ACKNOWLEDGED,
    }),

    fetchData() {
      this.getCustodians();
    },

    restore() {
      this.restoreState();
    },

    beforeDirtyCheck() {
      this.validationIntent = 'save';
    },

    submitClicked() {
      this.validationIntent = 'submit';
      this.$v.$touch();

      if (this.$v.$error) {
        this.notifyError('Please review field errors on highlighted tabs');
        return;
      }

      this.$refs.recordState.transitionRecordState('SUBMIT').then(sr => {
        this.notifySuccess('Survey Request submitted');

        let nextRouteName = this.getNextRouteName(this.$route.name);
        this.$router.push({ name: nextRouteName, params: { id: sr.id } });
      }).catch((err) => {
        this.notifyError(`Failed to submit Survey Request`);
      });
    },

    submit() {
      this.saveClicked(false, false);
    },

    saveClicked(moveNext, changeRoute) {
      this.validationIntent = 'save';
      this.$v.$touch();

      if (this.$v.$error) {
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
        let nextRouteName = this.getNextRouteName(routeName);
        routeName = _.isNil(routeName) ? 'survey-request-registration' : routeName;
        if (moveNext) {
          routeName = nextRouteName;
        }
        if (isNew || moveNext) {
          // don't push a new route that could be the same as the current
          // route as it produces an error.
          this.$router.push({ name: routeName, params: { id: sr.id } });
        }
      }).catch((err) => {
        this.notifyError(`Failed to save Survey Request`, err);
      });
    },

    deleteClicked() {
      this.$q
        .dialog({
          title: "Delete HIPP Request",
          message: `This HIPP Request will be deleted.`,
          ok: "Delete",
          cancel: "Cancel",
        })
        .onOk(() => {
          this.deleteSurveyRequest({
            id: this.surveyRequest.id,
          }).then((pmd) => {
            this.notifySuccess("Deleted HIPP Request");
            this.$router.replace({ path: `/` });
          });
          console.log("delete confirmed");
        });
    },

    updateActiveSurveyrequest () {
      if (this.id == 'new') {

        // Assume the user wants to assign their own custodian to any new
        // request they create. New users may not have a custodian.
        let defaultCustodians = [];
        if (this.userCustodian) {
          defaultCustodians.push(this.userCustodian)
        }

        let sr = {
          id: undefined,
          name: undefined,
          organisation: undefined,
          organisations: [],
          custodians: defaultCustodians,
          requestorName: undefined,
          requestorPosition: undefined,
          pointOfContactEmail: undefined,
          businessJustification: undefined,
          costBenefit: undefined,
          additionalFundingAvailable: false,
          hasMoratorium: false,
          moratoriumDate: undefined,
          moratoriumComment: undefined,
          acknowledged: false,
        };
        this.update({path: 'surveyRequest', value: sr})
        this.setDirty(false);
        this.stateReadonly = false;
      } else {
        // id has been included in url, so get and set this survey request
        this.getSurveyRequest({id: this.id});
      }
    },

    stateUpdated({newState, oldState}) {
      console.log(`old ${oldState ? oldState.state : 'undef'}   new ${newState.state}`)
      if (this.id === 'new') {
        this.stateReadonly = false;
        this.submitted = false;
      } else if (_.isNil(newState)) {
        this.stateReadonly = true;
        this.submitted = true;
      } else {
        this.stateReadonly = newState.readonly;
        this.submitted = newState.state === 'submitted';
        if (!this.submitted) {
          // to force re acknowledgement after submitted to revised and back to
          // submitted
          this.setAcknowledged(false);
          this.validationIntent = 'save';
        }

        if (oldState && oldState.state !== 'submitted' && newState.state === 'submitted') {
          let nextRouteName = this.getNextRouteName(this.$route.name);
          this.$router.push({ name: nextRouteName, params: { id: this.surveyRequest.id } });
        }
      }
    },

    getNextRouteName(oldRouteName) {
      let routeName = _.isNil(oldRouteName) ? 'survey-request-registration' : oldRouteName;
      const nextRouteName = this.tabs.find((tabInfo) => {
        return routeName == tabInfo.route;
      }).nextRoute;
      return nextRouteName
    },

    heightTweak (offset) {
      return {
        minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh',
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      };
    },

    recordStateValidationCallback(evt) {
      if (evt != 'SUBMIT') {
        return true;
      }
      this.validationIntent = 'submit';

      this.$v.$touch();

      if (this.$v.$error) {
        this.notifyError('Please review field errors on highlighted tabs');
        return false;
      } else {
        return true;
      }

    },

    tabValid(tabName) {
      const tabInfo = this.tabs.find((tabInfo) => {
        return tabName == tabInfo.name;
      });
      let tabValidations = undefined;
      if (this.validationIntent == 'save') {
        tabValidations = tabInfo.saveValidations;
      } else if (this.validationIntent == 'submit') {
        tabValidations = tabInfo.submitValidations;
      }
      if (!tabValidations.surveyRequest) {
        return true;
      }

      const validationNames = Object.keys(tabValidations.surveyRequest)
      let allValid = validationNames
        .map((validationName) => {
          const val = _.get(this.$v.surveyRequest, validationName);
          if (!val) {
            return true;
          }
          return !val.$error;
        })
        .reduce((sum, next) => sum && next, true);

      return allValid;
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
    },
    'tab': function (newTab, oldTab) {
      console.log(`new tab = ${newTab}    old = ${oldTab}`);
    },
  },

  computed: {
    ...mapGetters('surveyRequest', [
      'surveyRequest',
      'dirty',
    ]),
    ...mapGetters('custodian', [
      'custodians',
    ]),
    userCanEdit: function() {
      if (this.hasPermission('canEditAllSurveyRequests')) {
        return true
      } else if (
        this.hasPermission('canEditCustodianSurveyRequests') &&
        this.hasCustodianLink('surveyRequest.custodians')
      ) {
        return true
      } else {
        return false
      }
    },
  },

  validations() {
    if (this.validationIntent == 'save') {
      let routeName = this.$route.name;
      const tabInfo = this.tabs.find((tabInfo) => {
        return routeName == tabInfo.route;
      });
      return tabInfo.saveValidations;
    } else if (this.validationIntent == 'submit') {
      const allValidations = {}
      this.tabs.forEach((tab, i) => {
        _.merge(allValidations, tab.submitValidations)
      });
      return allValidations;
    }
  },

  data() {
    return {
      tab: undefined,
      tabs: TABS_INFO,
      id: undefined,
      stateReadonly: true,
      submitted: true,
      validationIntent: 'save',
    }
  },

});
</script>


<style scoped lang="stylus">

.red-tab-label {
  color: rgba(255, 0, 0, 1.0);
  padding-left: 4px;
  padding-right: 4px;
  background-color: rgba(255,210,210,1.0);
}

</style>
