<template>
  <q-layout view="hHh Lpr lFf" id="q-app">
	  <q-layout-header>
		  <toolbar></toolbar>
	  </q-layout-header>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
  import Toolbar from 'components/Toolbar'
  import { EventBus } from './event-bus.js';

  export default {
    name: 'App',
    components: {
      'toolbar': Toolbar
    },
    created() {
      EventBus.$on('redirect', this.redirectURL)
    },
    methods: {
      resetScroll(el, done) {
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        done()
      },
      redirectURL(path) {
        this.$router.push(path);
      }
    }
  }
</script>

<style>
</style>
