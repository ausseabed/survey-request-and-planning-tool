<template>

    <div class="q-my-md fit">
      <div class="fit">
        <div class="row q-gutter-sm fit content-stretch">
          <div class="col-sm-12 ol-lg-12 col-xl-6 self-stretch ">
            <q-card class="fit">
              <q-card-section>
                Users
              </q-card-section>
              <q-separator />
              <q-card-section>
                Not implemented.
              </q-card-section>
            </q-card>
          </div>
          <div class="col-sm-12 col-lg-12 col-xl-6 self-start">
            <q-card class="fit">
              <q-card-section>
                User
              </q-card-section>
              <q-separator />
              <q-card-section>
                Not implemented.
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

    </div>

</template>

<script>
import Vue from 'vue'
const _ = require('lodash');

import { DirtyRouteGuard } from './../mixins/dirty-route-guard'
import { errorHandler } from './../mixins/error-handling'

export default Vue.extend({
  mixins: [DirtyRouteGuard, errorHandler],
  components: {
  },
  computed: {
  },

  methods: {
    submit () {
      //needed by dirty route guard
    }
  },

  data() {
    return {
      dirty: false,
    }
  }
})
</script>

<style>

</style>
