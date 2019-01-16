<template>
  <q-page :style-fn="heightTweak" >
    <div class="overflow-hidden fit">
      <q-card inline class="q-ma-sm fixed-center">
        <q-card-title>
          Login
          <span slot="subtitle">You are not logged in.</span>
          <q-icon slot="right" name="error_outline" size="70px" color="red" />
        </q-card-title>
        <q-card-main>
          Please log in using the top right toolbar button.
        </q-card-main>
      </q-card>
    </div>

  </q-page>

</template>

<script>
import Vue from 'vue'
import { QParallax, QCard, QCardTitle, QCardMain, QIcon, QCardActions, QBtn } from 'quasar'
const _ = require('lodash');

export default Vue.extend({
  components: {
    QParallax, QCard, QCardTitle, QCardMain, QIcon, QCardActions, QBtn
  },

  methods: {
    heightTweak (offset) {
      return {
        minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh',
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      }
    },
  },


});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">

</style>
