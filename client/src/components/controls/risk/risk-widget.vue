<template>
  <div class="column full-width q-col-gutter-sm">
    <div class="row q-col-gutter-sm full-width">
      <div class="col-5 risk-column-heading"></div>
      <div class="col-3 risk-column-heading">Level</div>
      <div class="col-3 risk-column-heading">Timeframe</div>
      <div class="col-1 risk-column-heading">Priority</div>
    </div>
    <div v-if="riskData.length == 0" class="row justify-center">
      <div>No risks entered</div>
    </div>
    <template v-else>
      <risk-widget-row
        class="full-width"
        v-for="(riskRow, index) of riskData" :key="index"
        :risk-data-row="riskRow"
        :risk-matrix="riskMatrix">
      </risk-widget-row>
    </template>
    <div class="row full-width">
      <div class="col-4 row justify-end">
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

import RiskWidgetRow from './risk-widget-row'

export default Vue.extend({
  props: [
    'riskMatrix',
    'riskData',
  ],
  components: {
    'risk-widget-row': RiskWidgetRow
  },
  data() {
    return {

    }
  },
  methods: {
    getNewName() {
      return `Risk (${this.riskData.length + 1})`
    },
    addRisk() {
      this.riskData.push({
        name:this.getNewName(),
        level: undefined,
        timeframe: undefined,
      })
    }
  },
  computed: {

  }
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">

.risk-column-heading {
  font-weight: 500;
  color: #656565;
}

</style>
