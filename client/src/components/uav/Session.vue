<template>
  <div class="row justify-center">
    <div style="width: 900px; max-width: 90vw;">
      <q-breadcrumbs separator=">" color="light">
        <q-breadcrumbs-el label="Home" icon="home" to="/" />
        <q-breadcrumbs-el label="UAV" icon="toys" to="/uav" />
        <q-breadcrumbs-el label="Session" icon="av_timer" />
      </q-breadcrumbs>
    </div>
    <q-page padding class="docs-input row justify-center">
      <div style="width: 900px; max-width: 90vw;">
        <q-field v-if="session_state.id && session_state.session_id"
                 icon="folder"
                 label="Session Notes"
                 :labelWidth="3">
          <q-input type="textarea"
                   :value="session_state.notes"
                   @change="update('notes', $event)"
                   float-label="Session Notes" />
        </q-field>

        <dir-scanner v-if="session_state.id && session_state.session_id"
                     @scan-done="directoryScanCompleted"
                     @dir-changed="directoryChanged"></dir-scanner>

        <div class="layout-padding">
          <q-btn v-if="session_state.id && session_state.session_id && !session_state.created && session_state.files"
                 @click="createSession">
            Create Session
          </q-btn>
        </div>

        <!-- Show state of socket -->
        <socket-state />
      </div>
    </q-page>
  </div>
</template>
<script>
  import './docs-input.styl'
  import Vue from 'vue'
  import { mapGetters } from 'vuex'
  import { errorHandler } from './../mixins/error-handling'
  //import { socketConnection } from './../mixins/socket-connections'
  const _ = require('lodash');
  const uuidv4 = require('uuid/v4');
  import DirectoryScanner from './../controls/DirectoryScanner.vue'
  import SocketState from './../controls/SocketState.vue'

  export default Vue.extend({
    components: {
      'dir-scanner': DirectoryScanner,
      'socket-state': SocketState
    },
    //mixins: [errorHandler, socketConnection],
    mixins: [errorHandler],
    created() {
      if (this.$route.query.id) {
        this.$store.commit('uav_session/update', { path: 'id', value: this.$route.query.id });
      }

      if (!this.session_state.id) {
        this.$router.push('/uav');
      }
    },
    mounted() {
      if (this.session_state.id) {
        if (!this.session_state.session_id) {
          this.$store.commit('uav_session/update', { path: 'session_id', value: 1 });
        }
      }
    },
    beforeDestroy() {
      //if (this.session_state.id) {
      //  this.$sock.close(4999, "beforeDestroy");   // 4999 is max code
      //}
    },
    methods: {
      directoryChanged(e) {
        this.datadir = null;
        this.$store.commit('uav_session/update', { path: 'files', value: null });
      },
      directoryScanCompleted(e) {
        this.datadir = e.dir;
        this.$store.commit('uav_session/update', {
          path: 'files',
          value: e.files
        }); 
      },
      createSession() {
        console.log('Create Session')
        this.$store.dispatch('uav_session/createSession')
          .then(() => {
            this.$sock.onmessage = (e) => {
              if (e.data['msg'] && e.data['msg_type'] && e.data['command']) {
                if (e.data['command'] === 'create_session') {
                  if (e.data['msg_type'] === 'error') {
                    this.$q.notify({ type: 'negative', message: e.data['msg'] });
                  }
                  else if (e.data['msg_type'] === 'info') {
                    //this.$router.push('project?id=' + this.session_state.id + '&session_id=' + this.session_state.session_id)
                    this.$store.dispatch('uav_project/getProject', { id: this.session_state.id, session_id: this.session_state.session_id }).then(() => {
                      this.$router.push('/uav/project?id=' + this.session_state.id);
                    });
                  }
                }
              }
            }

            this.$sock.send(JSON.stringify({
              command: "create_session",
              data: {
                session: this.session_state,
                tender: this.session_state.tender
              }
            }));
          })
      },
      update(key, event) {
        this.$store.commit('uav_session/update', {
          path: key,
          value: event
        })
      },
    },
    computed: {
      ...mapGetters({
        session_state: 'uav_session/session_state',
      })
    },
    data() {
      return {
        path: '/',
        datadir: null,
      }
    }
  })

</script>
<style lang="stylus">

</style>
