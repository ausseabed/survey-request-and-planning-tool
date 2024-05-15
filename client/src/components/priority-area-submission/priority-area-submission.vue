<template>
  <q-page :style-fn="heightTweak" class="column items-center">
    <div
      v-if="!errorFetching"
      class="column q-px-sm q-pt-sm q-gutter-y-sm fit"
      style="max-width: 900px"
    >
      <h5 style="margin-bottom: -8px; margin-top: 12px;">{{ priorityAreaSubmission.submissionName }}</h5>
      <div class="row justify-between items-end">
        <record-state
          ref="recordState"
          v-if="priorityAreaSubmission.id"
          entity-type="priority-area-submission"
          :entity-id="priorityAreaSubmission.id"
          :disable="dirty"
          @updated-state="stateUpdated($event)"
          class="col-auto"
          :validationCallback="recordStateValidationCallback"
        >
        </record-state>
        <div>* denotes mandatory field</div>
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
            :to="{name: tabInfo.route, params: {id: priorityAreaSubmission.id}}"
            exact
            class="q-tab__label"
          >
            <div v-bind:class="{ 'red-tab-label': !tabValid(tabInfo.name) , 'rounded-borders': !tabValid(tabInfo.name) }">
              <template>
                {{ tabInfo.label[0] }}
              </template>
            </div>
          </q-route-tab>

        </q-tabs>
        <div class="col-auto fat-spacer bg-secondary"></div>
        <form-wrapper
          :validator="$v"
          class="column col"
        >
          <router-view
            class="col"
            ref="pasComp"
            :readonly="stateReadonly"
            :validationIntent="validationIntent"
            :validator = "$v"
          >
          </router-view>
        </form-wrapper>
      </q-card>
      <div class="row justify-between col-auto">
        <div class="row justify-start q-gutter-sm">
          <q-btn
            color="primary"
            label="Save"
            icon="save"
            :disable="stateReadonly"
            @click="saveClicked(false, true)"
          />
          <q-btn
            color="primary"
            :label="dirty ? 'Exit without saving' : 'Exit'"
            icon="close"
            :to="'/?t=areas-of-interest'"
          />
          <q-btn
            color="red"
            label="Delete"
            icon="delete"
            :disable="stateReadonly"
            @click="deleteClicked"
          />
        </div>
        <div
          v-if="
            priorityAreaSubmission &&
            $route.name === 'priority-area-submission-confirmation'
          "
        >
          <q-btn
            :disable="published || dirty"
            color="primary"
            label="Publish"
            @click="publishClicked()"
          >
          </q-btn>
          <q-tooltip v-if="dirty"
            >Submission must be saved before publishing</q-tooltip
          >
        </div>

        <q-btn
          v-else
          color="primary"
          label="Save and next"
          icon-right="forward"
          @click="saveClicked(true, true)"
        />
      </div>
    </div>
    <div v-else class="column full-width full-height justify-center">
      <div class="row justify-center items-center q-gutter-sm">
        <div>
          <q-icon
            name="report_problem"
            class="text-red"
            style="font-size: 4rem"
          />
        </div>
        <div class="column items-center">
          <div>Error loading Area of Interest Submission</div>
          <a href="/">Go back</a>
        </div>
      </div>
    </div>

    <confirm-navigation
      id="confirmNavigation"
      ref="confirmNavigation"
    ></confirm-navigation>
  </q-page>
</template>

<script>
import Vue from "vue";
const _ = require("lodash");
import { mapActions, mapGetters, mapMutations } from "vuex";
import { required, minLength, email } from "vuelidate/lib/validators";

import { errorHandler } from "./../mixins/error-handling";
import { permission } from "./../mixins/permission";
import { DirtyRouteGuard } from "./../mixins/dirty-route-guard";

import * as organisationMutTypes from "../../store/modules/organisation/organisation-mutation-types";
import * as pasMutTypes from "../../store/modules/priority-area-submission/priority-area-submission-mutation-types";

// The tab layout, and validation rules for all the priority area/NAI tabs
// is defined here.
// nextRoute is the route that is navigated to when the user clicks 'save and next'
// saveValidations are applied when the user clicks the save button
// submitValidations are applied when the user attempts to publish a priority area
const TABS_INFO = [
  {
    name: 'priority-area-submission-registration',
    label: ['Registration'],
    route: 'priority-area-submission-registration',
    nextRoute: 'priority-area-submission-areas',
    saveValidations: {
      priorityAreaSubmission: {
        submissionName: { },
        submittingOrganisation: { },
        contactPerson: {  },
        contactEmail: {  },
      },
    },
    submitValidations: {
      priorityAreaSubmission: {
        submissionName: { required },
        submittingOrganisation: { required },
        contactPerson: { required },
        contactEmail: { required, email },
      },
    },
  },
  {
    name: 'priority-area-submission-areas',
    label: ['Areas of Interest'],
    route: 'priority-area-submission-areas',
    nextRoute: 'area-of-interest-profiles',
    saveValidations: {
      priorityAreaSubmission: {
        priorityAreas: {
          $each: {
            name: {},
            ecologicalAreaType: {},
            ecologicalAreaName: {},
            seacountryName: {}
          }
        }
      }
    },
    submitValidations: {
      priorityAreaSubmission: {
        priorityAreas: {
          $each: {
            name: { required },
            ecologicalAreaType: {},
            ecologicalAreaName: {},
            seacountryName: {}
          }
        }
      }
    },
  },
  {
    name: 'area-of-interest-profiles',
    label: ['Areas of Interest Profile'],
    route: 'area-of-interest-profiles',
    nextRoute: 'priority-area-submission-confirmation',
    saveValidations: {
      priorityAreaSubmission: {
        priorityAreas: {
          $each: {
            preferredTimeframe: {},
            timeframeReason: {},
            preferredSeason: {},
            collectionCadence: {},
            timeSeriesDescription: {},

            perceivedImpact: {},
            organisationalPriority: {},

            existingDataSources: {},
            reasonForAoiRaise: {},
            existingDataAssessmentComments: {},

            gridSize: {},
            surveyStandard: {},

            purposes: {},
            ecosystems: {},

            dataToCapture: {},
            dataCaptureMethods: {},
          }
        }
      }
    },
    submitValidations: {
      priorityAreaSubmission: {
        priorityAreas: {
          $each: {
            preferredTimeframe: { required },
            timeframeReason: {},
            preferredSeason: {},
            collectionCadence: { required },
            timeSeriesDescription: {},

            perceivedImpact: { required },
            organisationalPriority: { required },

            existingDataSources: { required, minLength: minLength(1) },
            reasonForAoiRaise: { required, minLength: minLength(1) },
            existingDataAssessmentComments: {},

            gridSize: { required },
            surveyStandard: {},

            purposes: {
              required,
              minLength: minLength(1),
            },
            ecosystems: {
              required,
              minLength: minLength(1),
            },

            dataToCapture: {
              required,
              minLength: minLength(1),
            },
            dataCaptureMethods: {
              required,
              minLength: minLength(1),
            },
          }
        }
      }
    },
  },
  {
    name: 'priority-area-submission-confirmation',
    label: ['Submission Confirmation'],
    route: 'priority-area-submission-confirmation',
    nextRoute: 'priority-area-submission-confirmation',
    saveValidations: {

    },
    submitValidations: {

    },
  },
]


export default Vue.extend({
  mixins: [DirtyRouteGuard, errorHandler, permission],

  async mounted() {
    const id = this.$route.params.id;

    // get list of PASs
    await this.getPriorityAreaSubmissions();
    this.id = id;
    if (id == undefined) {
      // usually triggered by a watch, but watch not called if id is undefined
      this.updateActivePriorityAreaSubmission();
    }
  },

  methods: {
    ...mapActions("priorityAreaSubmission", [
      "getPriorityAreaSubmissions",
      "getActivePriorityAreaSubmission",
      "savePriorityAreaSubmission",
      "deletePriorityAreaSubmission",
    ]),
    ...mapActions("organisation", ["getOrganisations"]),

    ...mapMutations("priorityAreaSubmission", {
      setActivePriorityAreaSubmission:
        pasMutTypes.SET_ACTIVE_PRIORITY_AREA_SUBMISSION,
      updatePriorityAreaSubmissionValue:
        pasMutTypes.UPDATE_ACTIVE_PRIORITY_AREA_SUBMISSION_VALUE,
      setDirty: pasMutTypes.SET_DIRTY,
      restoreState: pasMutTypes.RESTORE,
    }),

    ...mapMutations("organisation", {
      setOrganisationFilter: organisationMutTypes.SET_FILTER,
    }),

    restore() {
      // setting only the id means that none of the props are updated in the
      // database. This however will set the uploadTaskId to null in the
      // database, so next time the priority area tab is opened it won't
      // fetch the list of priority areas linked to the task, only those with
      // a direct link to the submission.
      if (this.id == "new") {
        // then don't save, as this will create an empty entry (with an id)
      } else {
        this.savePriorityAreaSubmission({
          id: this.priorityAreaSubmission.id,
        });
      }
      this.restoreState();
    },

    publishClicked() {
      this.validationIntent = 'submit';
      this.$v.$touch();

      if (this.$v.$error) {
        this.notifyError('Please review field errors on highlighted tabs');
        return;
      }

      let pasComp = this.$refs.pasComp;

      if (!pasComp.acknowledged) {
        this.notifyError("Please confirm acknowledgement");
        return;
      }

      this.$refs.recordState
        .transitionRecordState("PUBLISH")
        .then((pas) => {
          this.notifySuccess("Area of Interest Submission published");
        })
        .catch((err) => {
          this.notifyError(
            `Failed to publish Area of Interest Submission`,
            err
          );
        });
    },

    submit() {
      this.saveClicked(false, false);
    },

    beforeDirtyCheck() {
      this.validationIntent = 'save';
    },

    saveClicked(moveNext, changeRoute) {
      this.validationIntent = 'save';
      this.$v.$touch();

      let pasComp = this.$refs.pasComp;
      if (pasComp.isActive) {
        // pasComp could be any one of the tabs, but here we're interested in the
        // areas of interest tab component. The isActive attribute of this component
        // indicates if the user has started drawing something. So if they've started
        // drawing and haven't save it, then we catch it here and tell them to save.
        this.notifyError("Please click 'SAVE AREA OF INTEREST' before continuing");
        return;
      }

      if (this.$v.$error) {
        this.notifyError('Please review fields');
        return;
      }

      const isNew = _.isNil(this.priorityAreaSubmission.id);
      this.savePriorityAreaSubmission(this.priorityAreaSubmission)
        .then((pas) => {
          const successMsg = isNew
            ? "Area of Interest Submission created"
            : "Area of Interest Submission updated";
          this.notifySuccess(successMsg);

          if (!changeRoute) {
            // return here and don't do any change to the route (here at least)
            return;
          }
          // need to check the route, as it may have already been set to something
          // else via "save and continue".
          const currentId = this.$route.params.id;
          let routeName = this.$route.name;
          let nextRouteName = this.getNextRouteName(routeName);
          routeName = _.isNil(routeName) ? 'priority-area-submission-registration' : routeName;
          if (moveNext) {
            routeName = nextRouteName;
          }
          if (isNew || moveNext) {
            // don't push a new route that could be the same as the current
            // route as it produces an error.
            this.$router.push({ name: routeName, params: { id: pas.id } });
          }
        })
        .catch((err) => {
          this.notifyError(`Failed to save Area of Interest Submission`, err);
        });
    },

    getNextRouteName(oldRouteName) {
      let routeName = _.isNil(oldRouteName) ? 'priority-area-submission-registration' : oldRouteName;
      const nextRouteName = this.tabs.find((tabInfo) => {
        return routeName == tabInfo.route;
      }).nextRoute;
      return nextRouteName
    },

    deleteClicked() {
      this.$q
        .dialog({
          title: "Delete Area of Interest Submission",
          message: `This area of interest submission will be deleted.`,
          ok: "Delete",
          cancel: "Cancel",
        })
        .onOk(() => {
          this.deletePriorityAreaSubmission({
            id: this.priorityAreaSubmission.id,
          }).then((pmd) => {
            this.notifySuccess("Deleted Area of Interest Submission");
            this.$router.replace({ path: `/` });
          });
          console.log("delete confirmed");
        });
    },

    updateActivePriorityAreaSubmission() {
      if (_.isNil(this.id) && this.priorityAreaSubmissions.length != 0) {
        // then just use a default PAS, the first one
        this.setActivePriorityAreaSubmission(this.priorityAreaSubmissions[0]);
        this.getActivePriorityAreaSubmission()
          .then((_) => {
            this.errorFetching = false;
          })
          .catch((_) => {
            this.errorFetching = true;
          });

        let routeName = this.$route.name
          ? this.$route.name
          : "priority-area-submission-registration";
        let id = this.priorityAreaSubmission.id;
        this.$router.push({ name: routeName, params: { id: id } });
      } else if (this.id == "new") {
        let pas = {
          id: undefined,
          citation: false,
          contactPerson: undefined,
          contactEmail: undefined,
          identifiedAreaName: undefined,
          geographicalAreaName: undefined,
          submittingOrganisation: undefined,
          citedOrganisation: undefined,
          citedContactName: undefined,
          citedContactEmail: undefined,
        };
        this.setActivePriorityAreaSubmission(pas);
        // update submission details with that from active user
        this.prefill();
        this.setDirty(false);
        this.stateReadonly = false;
      } else {
        // id has been included in url, so get and set this PAS
        this.setActivePriorityAreaSubmission({ id: this.id });
        this.getActivePriorityAreaSubmission()
          .then((_) => {
            this.errorFetching = false;
          })
          .catch((_) => {
            this.errorFetching = true;
          });
      }
    },

    prefill() {
      this.updatePriorityAreaSubmissionValue({
        path: "contactEmail",
        value: this.currentUser.email,
      });
      this.updatePriorityAreaSubmissionValue({
        path: "contactPerson",
        value: this.currentUser.name,
      });
      if (!_.isNil(this.currentUser.custodian)) {
        let cust = this.currentUser.custodian;

        this.setOrganisationFilter(cust.name);
        this.getOrganisations().then((orgsData) => {
          const orgs = orgsData.data;
          if (orgs.length > 0) {
            this.updatePriorityAreaSubmissionValue({
              path: "submittingOrganisation",
              value: orgs[0],
            });
          } else {
            this.updatePriorityAreaSubmissionValue({
              path: "submittingOrganisation",
              value: undefined,
            });
            this.notifyInfo(
              "Could not match current users custodian to organisation"
            );
          }
        });
      }
    },

    stateUpdated({ newState, oldState }) {
      if (_.isNil(newState)) {
        this.stateReadonly = true;
        this.published = true;
      } else {
        this.stateReadonly = newState.readonly;
        this.published = newState.state === "published";
      }
    },

    heightTweak(offset) {
      return {
        minHeight: offset ? `calc(100vh - ${offset}px)` : "100vh",
        height: offset ? `calc(100vh - ${offset}px)` : "100vh",
      };
    },

    recordStateValidationCallback(evt) {
      if (evt != 'PUBLISH') {
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

    validationPathsForTab(validations, paths, currentPath) {
      // recuses the validations object to extract full paths to each
      // one of the validations that has been specified for this tab
      // eg; will build up a list of strings like `priorityAreaSubmission.priorityAreas.$each.ecologicalAreaType`
      const names = Object.keys(validations);
      for (const name of names) {
        let val = _.get(validations, name);
        if (_.isFunction(val)) {
          paths.push(currentPath)
        } else {
          let np = currentPath.length == 0 ? name : [currentPath, name].join('.')
          this.validationPathsForTab(val, paths, np)
        }
      }
      if (names.length == 0) {
        paths.push(currentPath)
      }
    },

    validationPathToValidationObjectMap(valdationObject) {
      let generalToActualPathMap = {}
      let paramsList = valdationObject.$flattenParams()
      for (const param of paramsList) {
        let paramPathComponents = param.path;
        let filteredPathComponents = [];
        let lastCompEach = false;
        for (const pp of paramPathComponents) {
          if (lastCompEach) {
            lastCompEach = false;
          } else {
            if (pp == '$each') {
              lastCompEach = true;
            }
            filteredPathComponents.push(pp)
          }
        }
        let filteredPathComponentStr = filteredPathComponents.join('.')
        let actualList = null;
        if (filteredPathComponentStr in generalToActualPathMap) {
          actualList = generalToActualPathMap[filteredPathComponentStr]
        } else {
          actualList = []
          generalToActualPathMap[filteredPathComponentStr] = actualList
        }
        actualList.push(param.path.join('.'))
      }
      return generalToActualPathMap
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
      if (!tabValidations.priorityAreaSubmission) {
        return true;
      }

      // basic logic for checking if all the data on a tab is valid
      // 1. get an expanded list of all the validations that are applicable
      //    to this tab.
      // 2. get a dict that maps all paths to validators (for all tabs)
      // 3. Loop through the list from 1. get all the validators from the 
      //    map generated in 2
      // 4. if no validators have an error, then the tab is in a valid state
      const paths = []
      this.validationPathsForTab(tabValidations, paths, "")

      const pathMap = this.validationPathToValidationObjectMap(this.$v)
      for (const vp of paths) {
        if (!(vp in pathMap)) {
          continue;
        }
        let validationPaths = pathMap[vp]
        for (const validationPath of validationPaths) {
          const val = _.get(this.$v, validationPath);
          val.$touch();
          if (val.$error) {
            return false;
          }
        }
      }
      return true;
    },
  },

  watch: {
    // call again the method if the route changes
    $route: function (newRoute, oldRoute) {
      const id = newRoute.params.id;
      this.id = id;
    },
    id: function (newId, oldId) {
      this.updateActivePriorityAreaSubmission();
    },
  },

  computed: {
    ...mapGetters("priorityAreaSubmission", {
      priorityAreaSubmissions: "priorityAreaSubmissions",
      priorityAreaSubmission: "activePriorityAreaSubmission",
      dirty: "dirty",
    }),
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
      published: true,
      errorFetching: false,
      validationIntent: 'save',
    };
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
