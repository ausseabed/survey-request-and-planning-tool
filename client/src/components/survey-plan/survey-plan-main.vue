<template>
  <q-page :style-fn="heightTweak" >
    <div class="overflow-hidden fit">
      <div class="column col-4 full-height">
        <q-toolbar class="q-py-none bg-secondary text-white">
          <q-toolbar-title class="column">
            <div>
              {{surveyPlan.surveyName}}
            </div>
            <div class="tabs-toolbar-sub-title">
              Survey Plan
            </div>
          </q-toolbar-title>

          <q-tabs class="gt-xs" align="right">
            <q-route-tab
              default
              icon="notes"
              label="Summary"
              :to="`/survey/${id}/summary`"
              exact
            />
            <q-route-tab
              icon="assignment"
              label="Specifications"
              :to="`/survey/${id}/specifications`"
              exact
            />
            <q-route-tab
              icon="ballot"
              label="Deliverables"
              :to="`/survey/${id}/deliverables`"
              exact
            />
            <q-route-tab
              icon="attach_file"
              label="Attachments"
              :to="`/survey/${id}/attachments`"
              exact
              v-if="canViewAttachments"
            />
          </q-tabs>

          <q-tabs class="lt-sm" align="right">
            <q-route-tab
              default
              class="mobile-tabs"
              icon="notes"
              :to="`/survey/${id}/summary`"
              exact
            />
            <q-route-tab
              class="mobile-tabs"
              icon="assignment"
              :to="`/survey/${id}/specifications`"
              exact
            />
            <q-route-tab
              class="mobile-tabs"
              icon="ballot"
              :to="`/survey/${id}/deliverables`"
              exact
            />
            <q-route-tab
              class="mobile-tabs"
              icon="attach_file"
              :to="`/survey/${id}/attachments`"
              exact
              v-if="canViewAttachments"
            />
          </q-tabs>

        </q-toolbar>

        <div class="column col">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </q-page>


</template>


<script>
import Vue from 'vue'
const _ = require('lodash');
import { mapActions, mapGetters } from 'vuex'

import { errorHandler } from './../mixins/error-handling'
import { permission } from './../mixins/permission'

export default Vue.extend({
  mixins: [errorHandler, permission],

  mounted() {
    this.fetchData();
  },

  methods: {
    ...mapActions('surveyPlan', [
      'getSurveyPlan',
    ]),

    heightTweak (offset) {
      return {
        minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh',
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      }
    },
    fetchData () {
      this.id = this.$route.params.id;
      this.getSurveyPlan({ id: this.id })
    },

  },

  watch: {
    // call again the method if the route changes
    '$route': function (newRoute, oldRoute) {
      if (this.id == newRoute.params.id) {
        // then we've only set the url, no need to fetch new data
      } else {
        this.fetchData();
      }
    }
  },

  computed: {
    ...mapGetters('surveyPlan',[
      'surveyPlan',
    ]),
    canViewAttachments: function() {
      if (this.hasPermission('canViewAllAttachments')) {
        return true
      } else if (
        this.hasPermission('canViewCustodianAttachments') &&
        this.hasCustodianLink('surveyPlan.custodians')
      ) {
        return true
      } else {
        return false
      }
    },
  },

  data() {
    return {
      id: undefined,
    }
  },

});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">


</style>
