<template>
  <q-page :style-fn="heightTweak" >
    <div class="overflow-hidden fit">
      <q-card inline class="q-ma-sm fixed-center">
        <q-item>
          <q-item-section avatar>
            <q-avatar icon="error_outline" text-color="white" color="red" size="70px" font-size="60px"></q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Login</q-item-label>
            <q-item-label caption>You are not logged in.</q-item-label>
          </q-item-section>
        </q-item>
        <q-card-section>
          Please log in using the top right toolbar button.
        </q-card-section>
      </q-card>
    </div>

  </q-page>

</template>

<script>
import Vue from 'vue'
import { QParallax, QCard, QIcon, QCardActions, QBtn } from 'quasar'
const _ = require('lodash');

export default Vue.extend({
  components: {
    QParallax, QCard, QIcon, QCardActions, QBtn
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
