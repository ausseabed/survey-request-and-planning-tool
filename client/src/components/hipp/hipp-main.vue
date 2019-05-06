<template>
  <q-page :style-fn="heightTweak" >
    <div class="overflow-hidden fit">
      <div class="column col-4 full-height">
        <q-toolbar class="q-py-none bg-secondary text-white">
          <q-toolbar-title class="column">
            <div>
              {{hippRequest.name}}
            </div>
            <div class="tabs-toolbar-sub-title">
              HIPP Request
            </div>
          </q-toolbar-title>

          <q-tabs align="right">
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
            />
          </q-tabs>

        </q-toolbar>

        <div class="column col" style="overflow-y: auto;">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </q-page>


</template>


<script>
import Vue from 'vue'
const _ = require('lodash');
import { mapGetters } from 'vuex'

import { errorHandler } from './../mixins/error-handling'

export default Vue.extend({
  mixins: [errorHandler],

  mounted() {
    this.fetchData();
  },

  methods: {
    heightTweak (offset) {
      return {
        minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh',
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      }
    },
    fetchData () {
      this.id = this.$route.params.id;
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
    ...mapGetters('hippRequest',[
      'hippRequest',
    ]),
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
