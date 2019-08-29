<template>
  <q-dialog
    v-model="active"
  >

    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-header class="bg-primary">
        <q-toolbar>
          <div class="column q-pa-sm" >
            <q-toolbar-title style="margin-bottom:-8px">Plans</q-toolbar-title>
            <div>Select plans to link to current request</div>
          </div>
          <q-space />
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-header>

      <q-footer>
        <q-toolbar inset>
          <q-space />
          <q-btn label="Link selected" @click="clickDone()" />
          <q-btn label="Cancel" @click="clickCancel()" />
        </q-toolbar>
      </q-footer>

      <q-page-container>
        <q-page padding>
          <p v-for="n in 150" :key="n">
            {{ lorem }}
          </p>
        </q-page>
      </q-page-container>
    </q-layout>


  </q-dialog>
</template>

<script>

import { mapActions, mapGetters, mapMutations } from 'vuex'
const _ = require('lodash');
import * as pmMutTypes
  from '../../store/modules/survey-plan/survey-plan-mutation-types'


export default {
  name: 'PlanSelection',
  data () {
    return {
      active: false,
      name: '',
      resolve: null,

      lorem: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus, ratione eum minus fuga, quasi dicta facilis corporis magnam, suscipit at quo nostrum!',
    }
  },

  computed: {
    ...mapGetters('surveyPlan',[
      'surveyPlanList',
      'surveyPlanListFilter',
    ]),
    ...mapGetters('surveyRequest',[
      'surveyRequest',
    ]),
  },

  methods: {
    ...mapActions('surveyPlan', [
      'getSurveyPlanList',
    ]),
    ...mapMutations('surveyPlan', [
      pmMutTypes.SET_PROJECT_METADATA_LIST_FILTER,
      pmMutTypes.RESET_PROJECT_METADATA,
    ]),
    ...mapMutations('surveyPlan', {
      'surveyPlanUpdate': pmMutTypes.UPDATE,
      'projectSetDirty': pmMutTypes.SET_DIRTY,
    }),

    pop(){
        this.active = true;
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
        });
    },
    clickDone(){
        this.active = false;
        this.resolve("save");
    },
    clickCancel(){
        this.active = false;
        this.resolve("cancel");
    }
  }
}
</script>
