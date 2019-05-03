<template>
  <q-page :style-fn="heightTweak" >
    <div class="overflow-hidden fit">
      <div class="row q-pt-md q-pl-md q-col-gutter-md fit ">
        <div class="column col-4 full-height">

          <q-card class="column no-margin col justify-between">
            <div class="col-auto">
              <q-card-section>
                Projects
              </q-card-section>
              <q-separator />
            </div>
            <q-card-section class="column col" style="padding:0px">
            </q-card-section>
            <div class="col-auto">
              <q-separator />
              <q-card-actions align="right">
                <q-btn flat icon="add" label="Add project">
                </q-btn>
              </q-card-actions>
            </div>
          </q-card>

        </div>
        <div class="col-8">
          <q-card class="no-margin full-height row justify-center">
            <div class="fit">
              foo
            </div>
          </q-card>

        </div>
      </div>
    </div>

  </q-page>

</template>

<script>
import Vue from 'vue'
import { QParallax, QCard, QIcon, QCardActions,
  QBtn, date } from 'quasar'
const _ = require('lodash');

import { errorHandler } from './mixins/error-handling'

export default Vue.extend({
  mixins: [errorHandler],
  components: {
    QParallax, QCard, QIcon, QCardActions, QBtn
  },

  async mounted() {

  },

  methods: {
    heightTweak (offset) {
      return {
        minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh',
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      }
    },

  },

  data() {
    return {
    }
  }

});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">

</style>
