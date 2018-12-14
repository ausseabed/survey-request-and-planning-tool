<template>
  <div>
    <q-field icon="folder"
             label="Data Directory"
             :labelWidth="3">
      <q-input :value="data_dir"
               :disable="disable"
               float-label="Directory containing project data"
               :after="[{icon: 'arrow_forward', content: true, handler () {scan_data_dir ()}}]"
               @change="directoryChanged"
               @input="directoryChanged"/>
      <q-progress v-if="is_scanning" :percentage="scan_progress" color="primary" />
    </q-field>

    <file-browser v-if="show_files && files"
                  v-model="files"></file-browser>
  </div>
</template>
<script>
  import Vue from 'vue'
  //import { socketConnection } from './../mixins/socket-connections'
  import FilesBrowser from './FilesBrowser.vue'

  export default Vue.extend({
    components: { 'file-browser': FilesBrowser },
    model: {
      prop: 'datadir',
      event: 'change'
    },
    props: {
      show_files: { default: true, type: Boolean },
      disable: { default: false, type: Boolean },
      datadir: { default: null, type: String }
    },
    //mixins: [socketConnection],
    methods: {
      directoryChanged(newVal) {
        this.data_dir = newVal;
        this.$emit('dir-changed', newVal);
        this.files = null;
      },
      scan_done_handler() {
        this.is_scanning = false;
        this.$emit('scan-done', { files: this.files, dir: this.data_dir });
      },
      scan_data_dir(e, done) {
        if (this.disable) return;
        if (!this.$sock || this.$sock.readyState !== 1) {
          this.$q.notify({ type: 'negative', message: "QA4Lab client agent not running." });
        }
        else {
          this.startScan();
        }
      },
      startScan() {
        // Send Scanning request to agent
        this.is_scanning = true;
        this.scan_progress = 0;
        this.files = null;

        this.$sock.onmessage = (e) => {
          if (e.data['msg'] && e.data['msg_type'] && e.data['command']) {
            if (e.data['command'] === 'scan') {
              if (e.data['msg_type'] === 'status') {
                this.scan_progress = parseInt(e.data['msg'])
              }
              else if (e.data['msg_type'] === 'files') {
                this.current_dir = null;
                this.files = _.values(e.data['msg'])[0];
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
        }

        this.$sock.send(JSON.stringify({
          command: "scan",
          data: {
            datadir: this.data_dir
          }
        }));
      }
    },
    data() {
      return {
        data_dir: this.datadir,
        is_scanning: false,
        scan_progress: null,
        files: null
      }
    }
  })
</script>
<style lang="stylus">
</style>
