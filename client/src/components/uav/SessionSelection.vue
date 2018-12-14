<template>
  <div class="layout-padding docs-input row justify-center">
    <div style="width: 900px; max-width: 90vw;">
      <q-field icon="book"
               label="Project"
               :labelWidth="3">
        <q-select v-model="project"
                  float-label="Select Your project"
                  :options="projects" />
      </q-field>

      <q-field v-if="project"
               icon="date_range"
               label="Session"
               :labelWidth="3">
        <q-select v-model="session"
                  float-label="Select or create a session"
                  :options="sessions" />
      </q-field>

      <q-field v-if="project && session"
               icon="folder"
               label="Data Directory"
               :labelWidth="3">
        <q-input v-model="datadir"
                 float-label="Directory containing project data" />
      </q-field>

      <div class="layout-padding">
        <q-btn v-if="project && session && datadir"
               loader
               :percentage="scan_progress"
               color="primary"
               @click="scan_data_dir">
          Scan Data
          <span slot="loading">
            <q-spinner-grid class="on-left" />
            Scanning directory...
          </span>
        </q-btn>
      </div>

      <q-page-sticky corner="bottom-right" :offset="[18, 18]">
        <q-chip v-if="socket_state == -1" tag color="faded" icon-right="error">Unkown</q-chip>
        <q-chip v-if="socket_state == 1" tag color="positive" icon-right="done">Connected</q-chip>
        <q-chip v-if="socket_state != 1 && socket_state != -1"
                tag color="negative"
                icon-right="warning"
                @click="try_open_connection">Not Connected</q-chip>
      </q-page-sticky>
    </div>
  </div>
</template>
<script>
  import './docs-input.styl'
  import Vue from 'vue'
  import { mapGetters } from 'vuex'
  const _ = require('lodash');
  import SockJS from 'sockjs-client'
  const SOCKET_ENDPOINT = 'https://localhost:8888/socket'

  import {
    QBtn,
    QField,
    QIcon,
    QChip,
    QInput,
    QSelect,
    QSpinnerGrid,
    Notify,
  } from 'quasar'

  export default Vue.extend({
    components: {
      QBtn,
      QField,
      QIcon,
      QChip,
      QInput,
      QSpinnerGrid,
      QSelect,
    },
    mounted() {
      // Try to
      this.open_connection(SOCKET_ENDPOINT);
    },
    beforeDestroy() {
      this.$sock.close(4999, "beforeDestroy");   // 4999 is max code
    },
    methods: {
      try_open_connection() {
        this.open_connection(SOCKET_ENDPOINT);
      },
      scan_data_dir(e, done) {
        this.scan_done_handler = done;

        if (!this.$sock || this.$sock.readyState !== 1) {
          this.$q.notify({ type: 'negative', message: "QA4Lab client agent not running." });
        }
        else {
          this.startScan();
        }
      },
      startScan() {
        // Send Scanning request to agent
        this.scan_progress = 0;
        this.$sock.send(JSON.stringify({
          command: "scan",
          data: {
            project: this.project,
            session: this.session,
            datadir: this.datadir
          }
        }));
      },
      open_connection(endpoint) {
        if (this.socket_state === 1) {
          console.log("A connection exists alreay, not attempting")
          return;
        }

        this.$sock = new SockJS(endpoint ? endpoint : SOCKET_ENDPOINT);

        this.$sock.onopen = () => {
          console.log("Connected....");
          if (this.open_handler) {
            this.open_handler();
            this.open_handler = null;
          }
        }

        this.$sock.onerror = () => {
          console.log("Attempt to connect on error....")
          // setTimeout(this.open_connection, 2000);   // Attempt to connect after 2 seconds
          this.$q.notify({ type: 'negative', message: "Error connecting to qa4lab agent." });
        }

        this.$sock.onmessage = (e) => {
          // Messages coming through socket
          if (e.data['msg'] && e.data['msg_type'] && e.data['command']) {
            if (e.data['command'] === 'scan') {
              if (e.data['msg_type'] === 'status') {
                this.scan_progress = parseInt(e.data['msg'])
                console.log(e.data['msg'])
              }
              else if (e.data['msg_type'] === 'error') {
                this.scan_done_handler();
                this.$q.notify({ type: 'negative', message: e.data['msg'] });
              }
              else if (e.data['msg_type'] === 'warning') { this.$q.notify({ type: 'warning', message: e.data['msg'] }); }
              else if (e.data['msg_type'] === 'info') {
                if (e.data['msg'] === 'done') {
                  this.scan_done_handler();
                  console.log('All good go to next')
                }
              }
            }
          }
        };

        this.$sock.onclose = (e) => {
          if (e.code !== 4999) {      // This is app induced, don't bother reconnecting
            console.log("Attempt to connect on close....")
            // setTimeout(this.open_connection, 2000);     // Connection closed attempt to connect again
            this.$q.notify({ type: 'negative', message: 'Connection to qa4lab agent closed.', actions: [{ icon: 'clear' }] });
          }
          console.log('close');
        };
      },
      onStop() {
        this.$sock.send(JSON.stringify({
          command: "stop"
        }));
      },
      onAbort() {
        window.location.href = 'qa4l:stop';
        this.$sock = null;
      }
    },
    computed: {
      socket_state() {
        return this.$sock ? this.$sock.readyState : -1;
      },
      projects() {
        return [
          { label: 'Project 1', value: '1' },
          { label: 'Project 2', value: '2' },
          { label: 'Project 3', value: '3' },
          { label: 'Project 4', value: '4' }
        ];
      },
      sessions() {
        return [
          { label: 'Create a new session', value: 'new' },
          { label: 'Session 1', value: '1' },
          { label: 'Session 2', value: '2' },
          { label: 'Session 3', value: '3' },
          { label: 'Session 4', value: '4' },
        ];
      }
    },
    data() {
      return {
        datadir: null,
        project: null,
        session: null,
        scan_progress: 0,
        scan_done_handler: null,

        open_handler: null,
        sock: null,
        socket_open: false,
      }
    }
  });
</script>
<style lang="stylus">
</style>
