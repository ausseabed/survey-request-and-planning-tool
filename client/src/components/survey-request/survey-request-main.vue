<template>
  <q-page :style-fn="heightTweak" >
    <div class="overflow-hidden fit">
      <div class="column col-4 full-height">
        <q-toolbar class="col-auto q-py-none bg-secondary text-white">
          <q-toolbar-title class="column">
            <div>
              {{surveyRequest.name}}
            </div>
            <div class="tabs-toolbar-sub-title">
              HIPP Request
            </div>
          </q-toolbar-title>

          <q-tabs class="gt-xs" align="right">
            <q-route-tab
              default
              icon="notes"
              label="Request"
              :to="`/hipp-request/${id}/summary`"
              exact
            />
            <q-route-tab
              icon="attach_file"
              label="Attachments"
              :to="`/hipp-request/${id}/attachments`"
              exact
              v-if="canViewAttachments"
            />
            <q-route-tab
              icon="layers"
              label="Plans"
              :to="`/hipp-request/${id}/projects`"
              exact
            />
          </q-tabs>

          <q-tabs dense class="lt-sm" align="right">
            <q-route-tab
              default
              class="mobile-tabs"
              icon="notes"
              :to="`/hipp-request/${id}/summary`"
              exact
            />
            <q-route-tab
              class="mobile-tabs"
              icon="attach_file"
              :to="`/hipp-request/${id}/attachments`"
              exact
              v-if="canViewAttachments"
            />
            <q-route-tab
              class="mobile-tabs"
              icon="layers"
              :to="`/hipp-request/${id}/projects`"
              exact
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
    ...mapActions('surveyRequest', [
      'getSurveyRequest',
    ]),

    heightTweak (offset) {
      return {
        minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh',
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      }
    },
    fetchData () {
      this.id = this.$route.params.id;
      this.getSurveyRequest({ id: this.id })
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
    ...mapGetters('surveyRequest',[
      'surveyRequest',
    ]),
    canViewAttachments: function() {
      if (this.hasPermission('canViewAllAttachments')) {
        return true
      } else if (
        this.hasPermission('canViewCustodianAttachments') &&
        this.hasCustodianLink('surveyRequest.custodians')
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
