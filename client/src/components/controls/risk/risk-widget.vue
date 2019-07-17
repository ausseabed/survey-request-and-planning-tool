<template>
  <div class="column full-width q-col-gutter-sm">
    <div class="gt-xs row q-col-gutter-sm full-width">
      <div class="col-5 risk-column-heading"></div>
      <div class="col-3 risk-column-heading">Level</div>
      <div class="col-3 risk-column-heading">Timeframe</div>
      <div v-if="canViewPriority" class="col-1 risk-column-heading">Priority</div>
    </div>
    <div v-if="(riskData && riskData.length == 0) || !(riskData instanceof Array)" class="row justify-center">
      <div>No risks entered</div>
    </div>
    <template v-else>
      <risk-widget-row
        class="full-width"
        v-for="(riskRow, index) of riskData" :key="index"
        :risk-data-row="riskRow"
        :risk-matrix="riskMatrix"
        :readonly="readonly"
        :can-view-priority="canViewPriority"
        @remove-risk="removeRisk($event)"
        @updated-risk="updatedRisk($event)">
      </risk-widget-row>
    </template>
    <div
      v-if="!readonly && !(singleRisk && riskData.length > 0 )"
      class="row full-width">
      <div class="col-4 row">
        <q-btn
          flat color="primary"
          label="Add Risk"
          icon="add"
          align="right"
          @click="addRisk()"/>
      </div>

    </div>

  </div>
</template>
<script>

import Vue from 'vue'
import _ from 'lodash'

import RiskWidgetRow from './risk-widget-row'

const UPDATED_RISKS = 'updated-risks';

export default Vue.extend({
  props: {
    riskMatrix: {},
    riskData: {},
    readonly: { default: false, type: Boolean},
    canViewPriority: { default: true, type: Boolean}, // hide the priority indicator
    singleRisk: { default: false, type: Boolean},  // restrict widget to including only a single risk
  },
  components: {
    'risk-widget-row': RiskWidgetRow
  },
  data() {
    return {

    }
  },
  methods: {
    getNewName() {
      if (this.riskData instanceof Array) {
        return `Risk (${this.riskData.length + 1})`
      } else {
        return 'Risk (1)'
      }
    },
    addRisk() {
      let defLevel = Object.keys(this.riskMatrix)[0]
      let defTimeframe = Object.keys(this.riskMatrix[defLevel])[0]

      let clonedRiskData = undefined
      if (this.riskData instanceof Array) {
        clonedRiskData = _.cloneDeep(this.riskData)
      } else {
        clonedRiskData = []
      }
      clonedRiskData.push({
        name:this.getNewName(),
        level: defLevel,
        timeframe: defTimeframe,
      })
      this.$emit(UPDATED_RISKS, { path:'', value : clonedRiskData });
    },
    removeRisk(riskDataRow) {
      var index = this.riskData.indexOf(riskDataRow)
      let clonedRiskData = _.cloneDeep(this.riskData)
      if (index > -1) {
        clonedRiskData.splice(index, 1)
      }
      this.$emit(UPDATED_RISKS, { path:'', value : clonedRiskData });
    },
    updatedRisk(event) {
      let index = this.riskData.indexOf(event.riskDataRow)
      let path = `[${index}].${event.property}`
      this.$emit(UPDATED_RISKS, { path:path, value : event.value });
    },
    fixMismatchedData() {
      // because sometimes the structure of the risk matrix will differ to
      // what is in the database. eg; when we change the risk matrix options
      let bad = false;
      for (const risk of this.riskData) {
        if (_.has(this.riskMatrix,risk.level)) {
          const tf = this.riskMatrix[risk.level]
          if (_.has(tf.risk.timeframe)) {
            // then move on to checking next thing
          } else {
            bad = true;
            break;
          }
        } else {
          bad = true;
          break;
        }
      }

      // if one bad risk is found, then remove all risks
      if (bad) {
        this.$emit(UPDATED_RISKS, { path:'', value : [] });
      }
    },
  },
  computed: {
    hasData: function() {
      return !_.isNil(this.riskMatrix) && !_.isNil(this.riskData) && this.riskData.length > 0
    }
  },
  watch: {
    'hasData': {
      immediate: true,
      handler (newHasData, oldHasData) {
        if (newHasData) {
          this.fixMismatchedData()
        }
      },
    },
  },
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">

.risk-column-heading {
  font-weight: 500;
  color: #656565;
}

</style>
