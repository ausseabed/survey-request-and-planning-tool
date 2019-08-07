<template>
  <q-layout view="hHh Lpr lFf" id="q-app">
    <q-header>
      <toolbar></toolbar>
    </q-header>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
  import Toolbar from 'components/toolbar'
  import { EventBus } from './event-bus.js';
  import { mapActions } from 'vuex'

  export default {
    name: 'App',
    components: {
      'toolbar': Toolbar
    },
    mounted() {
      if (this.$route.path == '/login' || this.$route.path == '/auth/callback') {
        // part of the login process, don't request role & custodian as these will
        // fail and that causes issues in Safari
      } else {
        try {
          this.getUserRole();
          this.getUserCustodian();
        } catch (error) {
          console.log(error)
        }
      }
    },
    created() {
      EventBus.$on('redirect', this.redirectURL)
    },
    methods: {
      ...mapActions('role', [
        'getUserRole',
      ]),
      ...mapActions('custodian', [
        'getUserCustodian',
      ]),
      resetScroll(el, done) {
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        done()
      },
      redirectURL(path) {
        this.$router.push(path);
      }
    },
  }
</script>

<style>
</style>
