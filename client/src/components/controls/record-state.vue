<template>
  <div class="column">
    <div class="text-caption record-state-title">Record state</div>
    <div class="row">
      <q-chip square outline class="record-state-chip">
        <q-avatar color="primary" text-color="white" :icon="stateDisplayIcon"></q-avatar>
        {{stateDisplayName}} {{recordState && recordState.version ? ', v' + recordState.version : ''}}
        <q-tooltip
          content-style="font-size: 12px" :offset="[0, 5]"
          anchor="bottom left" self="top left"
          >
          {{tooltipMessage}} - {{tooltipDate | moment("from", "now") }}
        </q-tooltip>
      </q-chip>

      <q-chip
        v-for="evt of eventsList"
        :key="evt"
        square clickable @click="onClickEvent(evt)"
        class="record-state-chip"
        :disable="disable"
        >
        {{evt}}
        <q-tooltip v-if="disable">{{disableMessage}}</q-tooltip>
      </q-chip>
    </div>
  </div>

</template>
<script>

const _ = require('lodash')
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Vue from 'vue'
const moment = require('moment')
import * as recordStateMutTypes
  from '../../store/modules/record-state/record-state-mutation-types'

import { recordStateDetails } from '../utils';

const UPDATED_STATE = 'updated-state';

export default Vue.extend({
  props: {
    entityType: { type: String },
    entityId: { type: String },
    disable: { type: Boolean, default: false },
    disableMessage: { type: String, default: "Record must be saved." },
    validationCallback: { type: Function},
  },
  data() {
    return {

    }
  },
  methods: {
    ...mapActions('recordState', [
      'getRecordState',
      'transitionRecordState',
    ]),
    ...mapMutations('recordState', {
      'update': recordStateMutTypes.UPDATE,
    }),
    doUpdate() {
      this.getRecordState();
    },
    onClickEvent(evt) {
      if (_.isFunction(this.validationCallback)) {
        // then it has a validation callback, so call it and make sure that
        // true is returned.
        if (this.validationCallback(evt)) {
          this.transitionRecordState(evt);
        }
      } else {
        this.transitionRecordState(evt);
      }

    },
  },
  computed: {
    ...mapGetters('recordState', [
      'recordState',
      'hasNextEvent',
    ]),
    stateDisplayName: function () {
      if (_.isNil(this.recordState)) {
        return "loading..."
      }
      return recordStateDetails(this.recordState.state).label;
    },
    stateDisplayIcon: function () {
      if (_.isNil(this.recordState)) {
        return 'hourglass_full'
      }
      return recordStateDetails(this.recordState.state).icon;
    },
    eventsList: function () {
      if (_.isNil(this.recordState)) {
        return []
      }
      return this.recordState.nextEvents.filter((evt) => {
        return evt != 'SAVE'
      });
    },
    tooltipMessage: function () {
      if (!_.isNil(this.recordState) && !_.isNil(this.recordState.user)) {
        const name = this.recordState.user.name ?
            this.recordState.user.name :
            this.recordState.user.email;
        return `By: ${name}`
      } else {
        return ""
      }
    },
    tooltipDate: function () {
      if (this.recordState) {
        const ts = new Date();
        ts.setTime(this.recordState.created);
        return moment(ts);
      } else {
        return undefined;
      }
    }
  },
  watch: {
    'entityId': {
      immediate: true,
      handler (newId, oldId) {
        this.update({path:'entityId', value:newId})
        if (!_.isNil(newId) && !_.isNil(this.entityType)) {
          this.doUpdate();
        }
      },
    },
    'entityType': {
      immediate: true,
      handler (newType, oldType) {
        this.update({path:'entityType', value:newType})
        if (!_.isNil(newType) && !_.isNil(this.entityId)) {
          this.doUpdate();
        }
      },
    },
    'recordState': {
      handler (newState, oldState) {
        this.$emit(UPDATED_STATE, newState);
      }
    },
  }
});

</script>

<style>
.record-state-chip {
  margin: 2px;
}

.record-state-title {
  margin-bottom: -4px;
  padding-left: 4px;
}
</style>
