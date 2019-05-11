<template>
  <div class="row q-col-gutter-sm">
    <div class="col-xs-10 col-sm-5">
      <q-input
        outlined dense
        v-model="riskDataRow.name"
        autogrow
        type="textarea"
      >
      </q-input>
    </div>
    <div class="xs col-xs-2 column justify-center q-pl-xs">
      <q-btn
        flat color="primary" icon="close" class="remove-button no-padding"
        @click="$emit('remove-risk', riskDataRow)"
        >
        <q-tooltip>
          Remove
        </q-tooltip>
      </q-btn>
    </div>
    <div class="col-xs-5 col-sm-3">
      <q-select
        outlined dense
        v-model="riskDataRow.level"
        :options="levelOptions"
      >
      </q-select>
    </div>
    <div class="col-xs-5 col-sm-3">
      <q-select
        outlined dense
        v-model="riskDataRow.timeframe"
        :options="timeframeOptions"
      >
      </q-select>
    </div>
    <div class="col-xs-2 col-sm-1 row">
      <div
        class="col row rounded-borders risk-priority justify-center"
        :style="{'background-color':priorityColor}">
        <div class="column self-center risk-priority">
          {{priority}}
        </div>

      </div>
      <div class="sm column justify-center q-pl-xs">
        <q-btn
          flat color="primary" icon="close" class="remove-button no-padding"
          @click="$emit('remove-risk', riskDataRow)"
          >
          <q-tooltip>
            Remove
          </q-tooltip>
        </q-btn>
      </div>

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
    removeRisk() {

    }
  },
  computed: {
    priority: function () {
      if (_.isNil(this.riskDataRow.level) || _.isNil(this.riskDataRow.timeframe)) {
        return "-"
      } else if (Object.keys(this.riskMatrix).length == 0) {
        // isNil type check for an observed value
        return "-"
      } else {
        return this.riskMatrix[this.riskDataRow.level][this.riskDataRow.timeframe].toString()
      }
    },
    priorityColor: function () {
      let priority = this.priority
      if (priority == "-") {
        return "#b5b5b5" //grey
      } else if (priority == "1") {
        return "#ff4747" // red
      } else if (priority == "2") {
        return "#6a6aff" // blue
      } else if (priority == "3") {
        return "#339c33" // green
      } else {
        return "pink" // shouldn't happen
      }
    },
    levelOptions: function () {
      // isNil type check for an observed value
      if (Object.keys(this.riskMatrix).length == 0) {
        return []
      }
      let opts = Object.keys(this.riskMatrix).map(key => {
        return key
      })
      return opts
    },
    timeframeOptions: function () {
      if (Object.keys(this.riskMatrix).length == 0) {
        return []
      }
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
  text-align: center;
}

.remove-button {
  min-height:36px;
  height:36px;
  margin-top:-8px;
  margin-bottom:-8px;
  padding-top:0px;
  padding-bottom:0px;
}
</style>
