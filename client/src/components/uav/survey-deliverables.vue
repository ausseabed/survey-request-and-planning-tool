<template>

  <q-page :style-fn="heightTweak" >
    <q-page-sticky
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
      <q-btn
        round
        color="primary"
        @click="submit"
        icon="fas fa-save"
      />
    </q-page-sticky>


    <div class="overflow-hidden fit">
      <div class="row q-pt-md q-pl-md gutter-sm fit ">
        <div class="column col-4 full-height">

          <q-card >
            <q-card-title>
              Add deliverables
              <span slot="subtitle">Select deliverable types from the drop down list below to assign to this survey.</span>
            </q-card-title>
            <q-card-separator />
            <q-card-main style="padding:8px">
              <q-select multiple
                class="q-pl-md q-pr-md"
                float-label="Select deliverable types to add"
                v-model="tempDeliverableDefinitions"
                :options="deliverableDefinitionOptions"/>
            </q-card-main>
            <q-card-separator />
            <q-card-actions align="end">
              <q-btn flat icon="add" label="Add deliverables"
                @click="addTempDeliverables">
              </q-btn>
            </q-card-actions>
          </q-card>

          <q-card class="column col justify-between q-mt-md">
            <div class="col-auto">
              <q-card-title>
                Survey deliverables
                <span slot="subtitle">The following deliverables have been assigned to this survey.</span>
              </q-card-title>
              <q-card-separator />
            </div>
            <q-card-main class="column col" style="padding:0px">
              <q-scroll-area class="fit">
                <q-list no-border>
                  <q-item
                    v-for="definition in deliverableList"
                    :key="definition.id">

                    <q-item-main>
                      <q-item-tile label>{{nameForDefinition(definition.definitionId)}}</q-item-tile>
                    </q-item-main>
                  </q-item>
                </q-list>
              </q-scroll-area>



            </q-card-main>
            <div class="col-auto">
              <q-card-separator />
              <q-card-actions align="end">
                <q-btn flat icon="delete" label="Remove all">
                </q-btn>
              </q-card-actions>
            </div>
          </q-card>

        </div>
        <div class="col-8">
          <div class="q-headline">Details</div>
          <q-card-separator />
          <q-scroll-area class="fit">
            <deliverable-list
              :definitionList="deliverableDefinitionList"
              :deliverableList="deliverables">
            </deliverable-list>
          </q-scroll-area>
        </div>
      </div>
    </div>

  </q-page>




<!--
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
          <q-btn
            round
            color="primary"
            @click="submit"
            icon="fas fa-save"
          />
        </q-page-sticky>

      </transition>

      <div style="width: 900px; max-width: 90vw;">

        <q-card inline style="width:100%">
          <q-card-title> List </q-card-title>
          <q-card-main>


          </q-card-main>

        </q-card>

        <deliverable-list
          :definitionList="deliverableDefinitionList"
          :deliverableList="deliverables">
        </deliverable-list>

      </div>
    </q-page>


  </div> -->

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
import { RequestStatus }
  from '../../store/modules/request-status'
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
    this.getFormData();
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    ...mapMutations('deliverable', [
      types.UPDATE,
      types.SET_DELIVERABLE_LIST,
    ]),

    getFormData() {
      this.$store.dispatch('deliverable/getDefinitionList');
    },

    fetchData () {
      const id = this.$route.params.id;
      this.$store.dispatch(
        'projectMetadata/getProjectMetadata', { id: id });
    },

    hasScrolled (scroll) {
      this.showFloatingButtons = scroll.position > 30;
    },

    nameForDefinition(definitionId) {
      const defn = this.definitionList.find((def) => {
        return def.id == definitionId;
      });
      if (defn) {
        return defn.name;
      } else {
        return `Missing definitionId (${definitionId})`
      }
    },

    submit() {
      // console.log(this.deliverables);
      this.SET_DELIVERABLE_LIST(this.deliverables);

      this.$store.dispatch(
        'deliverable/saveDeliverableList',
        { id: this.projectMetadata.id }
      ).then(pmd => {
        if (this.requestStatus == RequestStatus.SUCCESS) {
          this.notifySuccess('Saved deliverables');
        } else if (this.requestStatus == RequestStatus.ERROR) {
          const status = this.requestError.response.status;
          this.notifyError(
            `Failed to save deliverables (${status})`);
        }
      });

    },

    addTempDeliverables() {
      const surveyDeliverables = this.tempDeliverableDefinitions.map((dd) => {
        const sd = {
          definitionId: dd.id,
          projectMetadataId: this.projectMetadata.id,
        };
        return sd;
      });

      const payload = {
        id: this.projectMetadata.id,
        deliverableList: surveyDeliverables,
      }
      this.$store.dispatch('deliverable/addDeliverablesToSurvey', payload);

      this.tempDeliverableDefinitions = [];
    },


    heightTweak (offset) {
      return {
        minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh',
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      }
    },
  },

  computed: {
    ...mapGetters('projectMetadata',[
      'projectMetadata',
    ]),
    ...mapGetters('deliverable',[
      'definitionList',
      'deliverableList',
      'requestStatus',
      'requestError',
    ]),
    deliverableDefinitionOptions: function () {
      const opts = this.deliverableDefinitionList.map(dd => {
        return {label: dd.name, value: dd};
      });
      return opts;
    }
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
    'projectMetadata.id': function (newId, oldId) {
      if (newId) {
        this.$store.dispatch(
          'deliverable/getDeliverableList', { id: newId })
        this.deliverableDefinitionList = this.definitionList;
      }
    },
    'deliverableList': function (deliverables, old) {
      if (!deliverables) {
        return;
      }

      const newDeliverables = deliverables.map((d) => {
        const defn = this.definitionList.find((def) => {
          return def.id == d.definitionId;
        });

        const rd = {data: {}};
        defn.fields.forEach((f) => {
          rd.data[f.name] = undefined;
        });
        _.merge(rd, d)
        return rd;
      });

      this.deliverables = newDeliverables;
    },
  },

  data() {
    return {
      loading: false,
      showFloatingButtons: false,
      deliverableDefinitionList: [],
      deliverables: [],
      tempDeliverableDefinitions: [],
    }
  }
});

</script>
