<template>
  <q-page>
    <div> PAS </div>
    <q-tabs>
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
    <router-view></router-view>
  </q-page>
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

  async mounted() {
    const id = this.$route.params.id;

    // get list of PASs
    await this.getPriorityAreaSubmissions();
  },

  methods: {
    ...mapActions('priorityAreaSubmission', [
      'getPriorityAreaSubmissions',
      'getActivePriorityAreaSubmission',
    ]),
    ...mapMutations('priorityAreaSubmission', {
      'setActivePriorityAreaSubmission': pasMutTypes.SET_ACTIVE_PRIORITY_AREA_SUBMISSION,
      'setDirty': pasMutTypes.SET_DIRTY,
    }),

    updateActivePriorityAreaSubmission () {
      if (_.isNil(this.id) && this.priorityAreaSubmissions.length != 0) {
        // then just use a default PAS, the first one
        this.setActivePriorityAreaSubmission(this.priorityAreaSubmissions[0]);
        this.getActivePriorityAreaSubmission();
      } else if (this.id == 'new') {
        let pas = {
          id: undefined,
        };
        this.setActivePriorityAreaSubmission(pas);
        this.setDirty(true);
      } else {
        // id has been included in url, so get and set this PAS
        this.setActivePriorityAreaSubmission({id: this.id});
        this.getActivePriorityAreaSubmission();
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
