<template>

  <div class="row justify-center">
    <q-scroll-observable @scroll="hasScrolled"></q-scroll-observable>
    <div inline style="width: 900px; max-width: 90vw;">
      <div class="row justify-between">
        <q-breadcrumbs separator=">" color="light">
          <q-breadcrumbs-el label="Home" icon="home" to="/" />
          <q-breadcrumbs-el label="Deliverables" icon="attach_file" />
        </q-breadcrumbs>
        <div class="row">
          <q-btn icon="arrow_back" label="Technical specifications"
            :to="'/survey-technical-specification/' + projectMetadata.id">
          </q-btn>
        </div>
      </div>
    </div>

    <div v-if="loading">Loading...</div>


    <q-page padding class="docs-input row justify-center">
      <transition
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
      >
        <q-page-sticky
          v-if="showFloatingButtons"
          position="bottom-right"
          :offset="[18, 18]"
          style="z-index:100">

          <q-btn
            round
            color="primary"
            :to="'/survey-technical-specification/' + projectMetadata.id"
            icon="arrow_back"
          >
            <q-tooltip :offset="[10, 10]">
              Return to technical specification
            </q-tooltip>
          </q-btn>
        </q-page-sticky>

      </transition>

      <div style="width: 900px; max-width: 90vw;">

        <q-card inline style="width:100%">
          <q-card-title> List </q-card-title>
          <q-card-main>


          </q-card-main>

        </q-card>

        <deliverable-list :definitionList="definitionList">
        </deliverable-list>

      </div>
    </q-page>


  </div>
</template>
<script>
import './docs-input.styl'
import Vue from 'vue'
import { filter } from 'quasar'
import { mapGetters, mapMutations } from 'vuex'
const _ = require('lodash');
import { errorHandler } from './../mixins/error-handling'
import { date } from 'quasar'
import * as types
  from '../../store/modules/deliverable/deliverable-mutation-types'
import DeliverableList from '../deliverable/deliverable-list'
const uuidv4 = require('uuid/v4');

import axios from 'axios';
const path = require('path');


export default Vue.extend({
  mixins: [errorHandler],
  components: {
    'deliverable-list': DeliverableList
  },
  beforeMount() {
    //this.getFormData();
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    ...mapMutations('deliverable', [
      types.UPDATE,
    ]),

    fetchData () {
      const id = this.$route.params.id;
      this.$store.dispatch(
        'deliverable/getDefinitionList');
    },

    hasScrolled (scroll) {
      this.showFloatingButtons = scroll.position > 30;
    },
  },

  computed: {
    ...mapGetters('projectMetadata',[
      'projectMetadata',
    ]),
    ...mapGetters('deliverable',[
      'definitionList',
    ]),
  },

  watch: {
    // call again the method if the route changes
    '$route': function (newRoute, oldRoute) {
      if (this.id == newRoute.params.id) {
        // then we've only set the url, no need to fetch new data
      } else {
        this.fetchData();
      }
    },
  },

  data() {
    return {
      loading: false,
      showFloatingButtons: false,
    }
  }
});

</script>
