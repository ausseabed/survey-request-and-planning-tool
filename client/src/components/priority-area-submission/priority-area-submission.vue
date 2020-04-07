<template>
  <q-page :style-fn="heightTweak" class="column q-pa-lg">
    <div class="col-auto">
      PAS
    </div>
    <q-card class="col column">
      <q-tabs
        align="left"
        class="col-auto bg-secondary text-white"
      >
        <q-route-tab
          name="registration"
          label="Priority Area Registration"
          :to="{name: 'priority-area-submission-registration'}"
          exact
        />
        <q-route-tab
          name="areas"
          label="Priority Areas"
          :to="{name: 'priority-area-submission-areas'}"
          exact
        />
        <q-route-tab
          name="confirmation"
          label="Submission Confirmation"
          :to="{name: 'priority-area-submission-confirmation'}"
          exact
        />
      </q-tabs>
      <div class="col-auto fat-spacer bg-secondary"></div>
      <router-view class="col" ref="pasComp"></router-view>
    </q-card>
    <div class="row justify-between q-pt-sm col-auto">
      <div class="row justify-start q-gutter-sm">
        <q-btn
          color="primary"
          label="Save"
          icon="save"
          @click="saveClicked(false)"
        />
        <q-btn color="primary" label="Exit/Exit without saving" icon="close"/>
      </div>
      <q-btn
        color="primary"
        label="Save and next"
        icon-right="forward"
        @click="saveClicked(true)"
      />
    </div>

  </q-page>
</template>

<script>
import Vue from 'vue';
const _ = require('lodash');
import { mapActions, mapGetters, mapMutations } from 'vuex';

import { errorHandler } from './../mixins/error-handling';
import { permission } from './../mixins/permission';

import * as pasMutTypes from '../../store/modules/priority-area-submission/priority-area-submission-mutation-types';

// what the route gets changed to after save and continue is clicked
const NEXT_ROUTES = {
  'priority-area-submission-registration': 'priority-area-submission-areas',
  'priority-area-submission-areas': 'priority-area-submission-confirmation',
  'priority-area-submission-confirmation': 'priority-area-submission-confirmation',
};

export default Vue.extend({
  mixins: [errorHandler, permission],

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
      'savePriorityAreaSubmission',
    ]),
    ...mapMutations('priorityAreaSubmission', {
      'setActivePriorityAreaSubmission': pasMutTypes.SET_ACTIVE_PRIORITY_AREA_SUBMISSION,
      'setDirty': pasMutTypes.SET_DIRTY,
    }),

    saveClicked(moveNext) {
      let pasComp = this.$refs.pasComp;
      if (!pasComp.isValid()) {
        this.notifyError('Please review fields');
        return;
      }

      const isNew = _.isNil(this.activePriorityAreaSubmission.id);
      this.savePriorityAreaSubmission(this.activePriorityAreaSubmission).then(pas => {
        // this.getFormData();
        const successMsg = isNew ?
          'Priority Area Submission created' :
          'Priority Area Submission updated';
        this.notifySuccess(successMsg);

        // need to check the route, as it may have already been set to something
        // else via "save and continue".
        const currentId = this.$route.params.id;
        if (isNew && currentId == 'new') {
          let routeName = this.$route.name;
          if (moveNext) {
            routeName = NEXT_ROUTES[this.$route.name];
          }
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
        };
        this.setActivePriorityAreaSubmission(pas);
        this.setDirty(true);
      } else {
        // id has been included in url, so get and set this PAS
        this.setActivePriorityAreaSubmission({id: this.id});
        this.getActivePriorityAreaSubmission();
      }
    },

    heightTweak (offset) {
      return {
        minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh',
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      }
    },

  },

  watch: {
    // call again the method if the route changes
    '$route': function (newRoute, oldRoute) {
      const id =  newRoute.params.id;
      this.id = id;
    },
    'id': function (newId, oldId) {
      console.log(`PAS id = ${newId}`);
      this.updateActivePriorityAreaSubmission();
    }
  },

  computed: {
    ...mapGetters('priorityAreaSubmission',[
      'priorityAreaSubmissions',
      'activePriorityAreaSubmission',
    ]),
  },

  data() {
    return {
      id: undefined,
    }
  },

});
</script>


<style scoped lang="stylus">

</style>
