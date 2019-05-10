<template>
  <div class="row q-col-gutter-sm">
    <div class="col-5">
      <q-input
        outlined dense
        v-model="riskDataRow.name"
        autogrow
        type="textarea"
      >
      </q-input>
    </div>
    <div class="col-3">
      <q-select
        outlined dense
        v-model="riskDataRow.level"
        :options="levelOptions"
      >
      </q-select>
      <!-- <div class="bg-grey"> -Level- </div> -->
    </div>
    <div class="col-3">
      <q-select
        outlined dense
        v-model="riskDataRow.timeframe"
        :options="timeframeOptions"
      >
      </q-select>
      <!-- <div class="bg-grey"> -Timeframe- </div> -->
    </div>
    <div class="col-1">
      <div
        class="fit row rounded-borders risk-priority justify-center"
        :style="{'background-color':priorityColor}">
        <div class="column self-center risk-priority">
          {{priority}}
        </div>

      </div>
      <!-- <div class="bg-grey"> -Priority- </div> -->
    </div>
  </div>
</template>
<script>

import _ from 'lodash'
import Vue from 'vue'

export default Vue.extend({
  props: [
    'riskMatrix',
    'riskDataRow',
  ],
  data() {
    return {

    }
  },
  methods: {

  },
  computed: {
    priority: function () {
      if (_.isNil(this.riskDataRow.level) || _.isNil(this.riskDataRow.timeframe)) {
        return "-"
      } else {
        return this.riskMatrix[this.riskDataRow.level][this.riskDataRow.timeframe].toString()
      }
    },
    priorityColor: function () {
      let priority = this.priority
      if (priority == "-") {
        return "grey"
      } else if (priority == "1") {
        return "red"
      } else if (priority == "2") {
        return "blue"
      } else if (priority == "3") {
        return "green"
      } else {
        return "pink"
      }
    },
    levelOptions: function () {
      let opts = Object.keys(this.riskMatrix).map(key => {
        return key
      })
      return opts
    },
    timeframeOptions: function () {
      // get the first attrib
      let firstLevel = Object.keys(this.riskMatrix)[0]
      let timeframes = this.riskMatrix[firstLevel]

      let opts = Object.keys(timeframes).map(key => {
        return key
      })
      return opts
    },
  }
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">

.risk-priority {
  font-weight: 600;
  font-size: 16pt;
  color: white;
  text-align: center
}

</style>
