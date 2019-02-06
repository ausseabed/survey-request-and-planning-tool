<template>
  <q-page :style-fn="heightTweak" >
    <div class="overflow-hidden fit">
      <div class="column col-4 full-height">
        <q-tabs color="secondary">
          <q-route-tab
            default
            icon="notes"
            label="Summary"
            :to="`/survey/${id}/summary`"
            exact
            slot="title"
          />
          <q-route-tab
            default
            icon="assignment"
            label="Specifications"
            :to="`/survey/${id}/specifications`"
            exact
            slot="title"
          />
          <q-route-tab
            default
            icon="ballot"
            label="Deliverables"
            :to="`/survey/${id}/deliverables`"
            exact
            slot="title"
          />
          <q-route-tab
            default
            icon="attach_file"
            label="Attachments"
            :to="`/survey/${id}/attachments`"
            exact
            slot="title"
          />
        </q-tabs>

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

import { errorHandler } from './mixins/error-handling'

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

.q-tabs {
  border-radius: 0px;
}


</style>
