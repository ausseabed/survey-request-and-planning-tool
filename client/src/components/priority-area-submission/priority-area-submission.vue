<template>
  <q-page
    :style-fn="heightTweak"
    class="column items-center"
  >
    <div
      class="column q-px-sm q-pt-sm q-gutter-y-sm fit"
      style="max-width: 900px;"
    >
      <record-state
        ref="recordState"
        v-if="activePriorityAreaSubmission.id"
        entity-type="priority-area-submission"
        :entity-id="activePriorityAreaSubmission.id"
        :disable="dirty"
        @updated-state="stateUpdated($event)"
        class="col-auto"
        :validationCallback="recordStateValidationCallback"
        >
      </record-state>

      <q-card class="col column">
        <q-tabs
          v-model="tab"
          align="left"
          class="col-auto bg-secondary text-white"
        >
          <q-route-tab
            name="priority-area-submission-registration"
            label="Priority Area Registration"
            :to="{name: 'priority-area-submission-registration', params: {id: activePriorityAreaSubmission.id}}"
            exact
          />
          <q-route-tab
            name="priority-area-submission-areas"
            label="Priority Areas"
            :to="{name: 'priority-area-submission-areas', params: {id: activePriorityAreaSubmission.id}}"
            exact
          />
          <q-route-tab
            name="priority-area-submission-confirmation"
            label="Submission Confirmation"
            :to="{name: 'priority-area-submission-confirmation', params: {id: activePriorityAreaSubmission.id}}"
            exact
          />
        </q-tabs>
        <div class="col-auto fat-spacer bg-secondary"></div>
        <router-view
          class="col"
          ref="pasComp"
          :readonly="stateReadonly"
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
          v-if="activePriorityAreaSubmission && $route.name === 'priority-area-submission-confirmation'"
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

import * as pasMutTypes from '../../store/modules/priority-area-submission/priority-area-submission-mutation-types';

// what the route gets changed to after save and continue is clicked
const NEXT_ROUTES = {
  'priority-area-submission-registration': 'priority-area-submission-areas',
  'priority-area-submission-areas': 'priority-area-submission-confirmation',
  'priority-area-submission-confirmation': 'priority-area-submission-confirmation',
};

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
    ...mapActions('priorityAreaSubmission', [
      'getPriorityAreaSubmissions',
      'getActivePriorityAreaSubmission',
      'savePriorityAreaSubmission'
    ]),
    ...mapMutations('priorityAreaSubmission', {
      'setActivePriorityAreaSubmission': pasMutTypes.SET_ACTIVE_PRIORITY_AREA_SUBMISSION,
      'setDirty': pasMutTypes.SET_DIRTY,
      'restoreState': pasMutTypes.RESTORE,
    }),

    restore() {
      // setting only the id means that none of the props are updated in the
      // database. This however will set the uploadTaskId to null in the
      // database, so next time the priority area tab is opened it won't
      // fetch the list of priority areas linked to the task, only those with
      // a direct link to the submission.
      this.savePriorityAreaSubmission({
        id: this.activePriorityAreaSubmission.id
      });
      this.restoreState();
    },

    publishClicked() {
      let pasComp = this.$refs.pasComp;
      if (!pasComp.isValid()) {
        this.notifyError('Please confirm acknowledgement');
        return;
      }

      this.$refs.recordState.transitionRecordState('PUBLISH').then(pas => {
        this.notifySuccess('Priority Area Submission published');
      }).catch((err) => {
        this.notifyError(`Failed to publish Priority Area Submission`);
      });
    },

    submit() {
      this.saveClicked(false, false);
    },

    saveClicked(moveNext, changeRoute) {
      let pasComp = this.$refs.pasComp;
      if (!pasComp.isValid()) {
        this.notifyError('Please review fields');
        return;
      }

      const isNew = _.isNil(this.activePriorityAreaSubmission.id);
      this.savePriorityAreaSubmission(this.activePriorityAreaSubmission).then(pas => {

        const successMsg = isNew ?
          'Priority Area Submission created' :
          'Priority Area Submission updated';
        this.notifySuccess(successMsg);

        if (!changeRoute) {
          // return here and don't do any change to the route (here at least)
          return
        }
        // need to check the route, as it may have already been set to something
        // else via "save and continue".
        const currentId = this.$route.params.id;
        let routeName = this.$route.name;
        routeName = _.isNil(routeName) ? 'priority-area-submission-registration' : routeName;
        if (moveNext) {
          routeName = NEXT_ROUTES[routeName];
        }
        if (isNew || moveNext) {
          // don't push a new route that could be the same as the current
          // route as it produces an error.
          this.$router.push({ name: routeName, params: { id: pas.id } });
        }
      }).catch((err) => {
        this.notifyError(`Failed to save Priority Area Submission`);
      });
    },

    updateActivePriorityAreaSubmission () {
      if (_.isNil(this.id) && this.priorityAreaSubmissions.length != 0) {
        // then just use a default PAS, the first one
        this.setActivePriorityAreaSubmission(this.priorityAreaSubmissions[0]);
        this.getActivePriorityAreaSubmission();

        let routeName = this.$route.name ?
          this.$route.name :
          'priority-area-submission-registration';
        let id = this.activePriorityAreaSubmission.id;
        this.$router.push({ name: routeName, params: { id: id } });

      } else if (this.id == 'new') {
        let pas = {
          id: undefined,
          citation: false,
          contactPerson: undefined,
          contactEmail: undefined,
          submittingOrganisation: undefined,
          citedOrganisation: undefined,
          citedContactName: undefined,
          citedContactEmail: undefined,
        };
        this.setActivePriorityAreaSubmission(pas);
        this.setDirty(false);
        this.stateReadonly = false;
      } else {
        // id has been included in url, so get and set this PAS
        this.setActivePriorityAreaSubmission({id: this.id});
        this.getActivePriorityAreaSubmission();
      }
    },

    stateUpdated(state) {
      if (_.isNil(state)) {
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
      let pasComp = this.$refs.pasComp;
      if (this.$route.name !== 'priority-area-submission-confirmation' || !pasComp.isValid()) {
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
      this.updateActivePriorityAreaSubmission();
    }
  },

  computed: {
    ...mapGetters('priorityAreaSubmission',[
      'priorityAreaSubmissions',
      'activePriorityAreaSubmission',
      'dirty',
    ]),
    $v() {
      // the dirty route guard wants to call the validation method (touch) to
      // determin if the form is in a valid state. However in this case the
      // form lives in the current child component. This exists solely for the
      // DRG to hook onto.
      let pasComp = this.$refs.pasComp;
      return pasComp.$v;
    }
  },

  data() {
    return {
      tab: undefined,
      id: undefined,
      stateReadonly: true,
      published: true,
    }
  },

});
</script>


<style scoped lang="stylus">

</style>
