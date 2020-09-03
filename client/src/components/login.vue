<template>
  <q-page >
    <div class="overflow-hidden fit">
      <q-card inline class="q-ma-sm fixed-center" style="max-width:400px">
        <q-item>
          <q-item-section avatar>
            <q-avatar icon="error_outline" text-color="white" color="grey-4" size="70px" font-size="60px"></q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Sign in</q-item-label>
            <q-item-label caption>Only registered users can access the {{appName}} </q-item-label>
          </q-item-section>
        </q-item>
        <q-card-section>
          You are not signed in to the {{appName}}. Please use the button below
          to sign in or <i>create an account</i>.
        </q-card-section>
        <q-card-section class="row justify-center">
          <sct-btn @click="signup" no-caps label="Sign in or Sign up to SCT">
            <q-tooltip>
              Signup to AusSeabed SCT
            </q-tooltip>
          </sct-btn>
        </q-card-section>
      </q-card>
    </div>

  </q-page>

</template>

<script>
import Vue from 'vue'

import { mapActions } from 'vuex'

const _ = require('lodash');

export default Vue.extend({

  methods: {
    ...mapActions('auth', [
      'authenticate',
      'logout',
    ]),

    async signup() {
      const authed = await this.authenticate()
      if (authed) {
        if (this.$route.query.redirect) {
          this.$router.push(this.$route.query.redirect);
        } else {
          this.$router.push('/');
        }
      }
    }
  },

  computed: {
    appName() {
      return process.env.PRODUCT_NAME;
    },
  },

});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">

</style>
