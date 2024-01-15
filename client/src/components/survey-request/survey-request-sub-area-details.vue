<template>
  <q-scroll-area class="col column">

    <q-card-section class="column q-gutter-y-sm">

      <q-card-section>
        <div class="column q-gutter-y-xs">

          <div class="row justify-between items-center">
            <div class="main-page-sub-title">Requested Areas</div>
            <q-btn
              v-if="_.get(surveyRequest, 'aois.length') > 0"
              type="a"
              :href="`/api/survey-request/${surveyRequest.id}/shp`"
              round flat icon="cloud_download">
              <q-tooltip>
                Download all requested areas
              </q-tooltip>
            </q-btn>
          </div>

          <area-of-interest-detail
            ref="aoiComponents"
            v-for="(aoi, index) of surveyRequest.aois"
            :key="aoi.id"
            :aoi="aoi"
            :index="index"
            :count="surveyRequest.aois.length"
            :readonly="readonly"
            :validator="validator"
            @aoi-value-changed="aoiValueChanged"
            @aoi-apply-to-all="aoiApplytoAll"
          >
        </area-of-interest-detail>
        </div>
      </q-card-section>

    </q-card-section>
  </q-scroll-area>
</template>

<script>
import Vue from 'vue';
const _ = require('lodash');
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { required, minLength, email } from 'vuelidate/lib/validators';

import { errorHandler } from './../mixins/error-handling';
import { permission } from './../mixins/permission';

import * as organisationMutTypes from '../../store/modules/organisation/organisation-mutation-types';
import * as srMutTypes from '../../store/modules/survey-request/survey-request-mutation-types';

import AreaOfInterestDetail from './area-of-interest-detail';

export default Vue.extend({
  mixins: [errorHandler, permission],

  props: [
    'readonly',
    'validationIntent',
    'validator'
  ],

  components: {
    'area-of-interest-detail': AreaOfInterestDetail,
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    ...mapActions('surveyRequest', [
      'getSurveyStandard',
      'getPreferredTimeframe',
      'getOverallRisk',
      'getDataTypes',
    ]),
    ...mapMutations('surveyRequest', {
      'setDirty': srMutTypes.SET_DIRTY,
      'update': srMutTypes.UPDATE,
      'resetSurveyRequest': srMutTypes.RESET_HIPP_REQUEST,
      'updateSurveyRequest': srMutTypes.UPDATE_HIPP_REQUEST,
    }),

    fetchData() {
      this.getSurveyStandard();
      this.getPreferredTimeframe();
      this.getOverallRisk();
      this.getDataTypes();
    },

    isValid() {
      this.$v.$touch();
      return !this.$v.$error;
    },

    aoiValueChanged({aoi, propertyName, value}) {
      const aoiIndex = this.surveyRequest.aois.indexOf(aoi);
      const path = `aois[${aoiIndex}].${propertyName}`;
      this.updateSurveyRequest({path:path, value:value});
    },

    aoiApplytoAll({propertyName, value}) {
      for (const [aoiIndex, aoi] of this.surveyRequest.aois.entries()) {
        const path = `aois[${aoiIndex}].${propertyName}`;
        this.updateSurveyRequest({path:path, value:value});
      }
    },

  },

  watch: {

  },

  computed: {
    ...mapGetters('surveyRequest',{
      surveyRequest: 'surveyRequest',
      dirty: 'dirty',
    }),
    $v () {
      return this.validator;
    }
  },

  data() {
    return {

    }
  },

});
</script>


<style scoped lang="stylus">

</style>
