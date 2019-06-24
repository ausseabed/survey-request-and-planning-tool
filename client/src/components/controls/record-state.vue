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
        >
        {{evt}}
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


export default Vue.extend({
  props: ['entityType', 'entityId'],
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
      console.log(evt)
      this.transitionRecordState(evt)
    },
    doClick() {
      console.log(this.hasNextEvent('FINALISE'))
    }
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
      if (this.recordState.state == 'draft') {
        return "Draft"
      } else if (this.recordState.state == 'finalised') {
        return "Finalised"
      } else if (this.recordState.state == 'underReview') {
        return "Under Review"
      } else if (this.recordState.state == 'accepted') {
        return "Accepted"
      } else {
        return this.recordState.state
      }
    },
    stateDisplayIcon: function () {
      if (_.isNil(this.recordState)) {
        return 'hourglass_full'
      }
      if (this.recordState.state == 'draft') {
        return 'edit'
      } else if (this.recordState.state == 'finalised') {
        return 'done'
      } else if (this.recordState.state == 'underReview') {
        return 'restore_page'
      } else if (this.recordState.state == 'accepted') {
        return 'done_all'
      } else {
        return 'help'
      }
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
        this.update({path:'entityId', value:this.entityId})
        if (!_.isNil(newId) && !_.isNil(this.entityType)) {
          this.doUpdate();
        }
      },
    },
    'entityType': {
      immediate: true,
      handler (newType, oldType) {
        this.update({path:'entityType', value:this.entityType})
        if (!_.isNil(newType) && !_.isNil(this.entityId)) {
          this.doUpdate();
        }
      },
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
