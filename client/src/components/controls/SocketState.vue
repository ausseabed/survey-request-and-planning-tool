<template>
  <q-page-sticky corner="bottom-right" :offset="[18, 18]">
    <div v-intro="'Displays connection status to QaLab Desktop service'" v-intro-tooltip-class="'red-bg'">
      <q-chip v-if="socket_state == -1" tag color="faded" icon-right="error">Unkown</q-chip>
      <q-chip v-if="socket_state == 1" tag color="positive" icon-right="done">Connected</q-chip>
      <q-chip v-if="socket_state != 1 && socket_state != -1"
              tag color="negative"
              icon-right="warning"
              style="cursor: pointer"
              @click="try_open_connection">Not Connected</q-chip>
    </div>
  </q-page-sticky>
</template>
<script>
  import Vue from 'vue'
  import { socketConnection } from './../mixins/socket-connections'

  export default Vue.extend({
    mounted() {
      this.open_connection();
    },
    mixins: [socketConnection]
  })
</script>
<style lang="stylus">
</style>
