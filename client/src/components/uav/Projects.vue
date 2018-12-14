<template>
  <q-layout view="hhh lpr fff">
    <q-layout-drawer side="left"
                     v-model="left">
      <q-scroll-area class="fit bg-grey-1">
        <q-item link @click.native="showReport()">
          <q-item-side icon="assessment" />
          <q-item-main label="Report" sublabel="Project report" />
        </q-item>
        <q-item link @click.native="showUsers()">
          <q-item-side icon="far fa-user" />
          <q-item-main label="Users" sublabel="Invite / Assign roles" />
        </q-item>
        <q-item multiline>
          <q-item-side icon="av_timer" />
          <q-item-main label="Sessions">
            <q-item-tile>
              <q-list no-border>
                <q-item v-for="(session, k, idx) in project_state.sessions"
                        link
                        :class="session_state && session.session_id === session_state.session_id ? 'bg-grey-3' : ''">
                  <q-item-main @click.native="showSession(session.session_id)"
                               :label="session.notes ? session.notes : 'Session ' + session.session_id"
                               :sublabel="'updated by ' + session.updated_by + ', ' + elapsedTime(session.updated)" />
                  <q-item-side>
                    <q-btn flat round dense icon="more_vert">
                      <q-popover>
                        <q-list link>
                          <q-item v-close-overlay>
                            <q-item-main label="Ignore Results" />
                          </q-item>
                          <q-item v-close-overlay @click.native="deleteSession(session.session_id)">
                            <q-item-main label="Delete" />
                          </q-item>
                        </q-list>
                      </q-popover>
                    </q-btn>
                  </q-item-side>
                </q-item>
              </q-list>
            </q-item-tile>
          </q-item-main>
        </q-item>
      </q-scroll-area>
    </q-layout-drawer>
    
    <q-page-container>
        <div style="width: 900px; max-width: 90vw;">
          <q-breadcrumbs separator=">" color="light">
            <q-breadcrumbs-el label="Home" icon="home" to="/" />
            <q-breadcrumbs-el label="UAV" icon="toys" to="/uav" />
            <q-breadcrumbs-el label="Project" icon="fas fa-cubes" />
          </q-breadcrumbs>
        </div>
        <q-page style="padding: 20px;">
          <q-btn class="absolute-top-right"
                 icon="delete"
                 color="negative"
                 @click="deleteProject()"
                 dense
                 label="Delete"></q-btn>
          <h3>
            {{project_state.project_name}}
            <q-chip icon="done" small square color="success">passing</q-chip>
          </h3>
          <p>Created by {{project_state.created_by}} {{elapsedTime(project_state.created)}}</p>
          <p v-if="session_state">{{session_state.notes ? session_state.notes : 'Session ' + session_state.session_id}}</p>

          <!-- Show Report -->
          <div v-if="isShowReport">
            Reports here
          </div>
          <!-- Show Users -->
          <div v-if="isShowUsers">
            Users here
          </div>
          <!-- Show Sessions -->
          <div v-if="isShowSessions && session_state">
            <q-tabs>
              <q-tab default name="checks" slot="title" icon="far fa-check-square" label="Checks" />
              <q-tab default name="results" slot="title" icon="assessment" label="Results" />
              <q-tab name="datasets" slot="title" icon="fas fa-folder-open" label="Datasets & Notes" />

              <q-tab-pane name="checks">
                <dir-scanner v-if="project_state && project_state.current_session"
                             :disable="!(!project_state.current_session.datadir)"
                             :show_files="false"
                             :value="project_state.current_session.datadir"
                             @change="directoryChanged"
                             @dir-changed="directoryChanged"
                             @scan-done="directoryScanCompleted"></dir-scanner>
                <checks v-if="project_state.current_session.datadir && project_state.current_session.files" />

                <div class="row">
                  <q-btn v-if="can_run_checks"
                         icon="far fa-check-square"
                         color="primary"
                         @click="runChecks()"
                         label="Run Selected Checks"></q-btn>
                </div>
              </q-tab-pane>

              <q-tab-pane name="summary">
                <p>
                  <q-chip icon="done" small square color="success">passing</q-chip>
                </p>
                <p class="caption">Session Notes</p>
                <q-input type="textarea">
                </q-input>
              </q-tab-pane>

              <q-tab-pane name="datasets">
                <file-browser v-if="session_state && session_state.files"
                              v-model="session_state.files"></file-browser>
              </q-tab-pane>

              <q-tab-pane name="results">
                <results :result="session_state.results"></results>
              </q-tab-pane>
            </q-tabs>
          </div>

          <!-- Show state of socket -->
          <socket-state />

        </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
  import './docs-input.styl'
  import Vue from 'vue'
  import { mapGetters } from 'vuex'
  import { errorHandler } from './../mixins/error-handling'
  import DirectoryScanner from './../controls/DirectoryScanner.vue'
  import FilesBrowser from './../controls/FilesBrowser.vue'
  import Results from './../controls/Results.vue'
  import SocketState from './../controls/SocketState.vue'
  import Checks from './../controls/Checks.vue'
  //import { socketConnection } from './../mixins/socket-connections'
  const _ = require('lodash');
  const timespan = require('readable-timespan');
  timespan.set({
    lessThanFirst: 'now',
    millisecond: false
  });


  export default Vue.extend({
    components: {
      'file-browser': FilesBrowser,
      'dir-scanner': DirectoryScanner,
      'socket-state': SocketState,
      'checks': Checks,
      'results': Results
    },
    //mixins: [errorHandler, socketConnection],
    mixins: [errorHandler],
    methods: {
      runChecks() {
        this.$sock.onmessage = (e) => {
          if (e.data['msg'] && e.data['msg_type'] && e.data['command']) {
            if (e.data['command'] === 'run') {
              if (e.data['msg_type'] === 'status') {
                console.log(e.data['msg'].progress)
                this.$store.commit('uav_common/set_check_progress', { check_id: e.data['msg'].check_id, progress: { progress: parseInt(e.data['msg'].progress), is_running: true }});
              }
              else if (e.data['msg_type'] === 'done') {
                this.$store.commit('uav_common/set_check_progress', { check_id: e.data['msg'].check_id, progress: { progress: 0, is_running: false } });

                // Get session response, no_save will prevent current_session state replacement, we'll commit results & files to the state in then
                this.$store.dispatch('uav_project/getSession', { id: this.session_state.id, session_id: this.session_state.session_id, no_save: true })
                  .then((session) => {
                    this.$store.commit('uav_project/update', { path: 'current_session.files', value: session.files });
                    this.$store.commit('uav_project/update', { path: 'current_session.results', value: session.results });
                  });
              }
              else if (e.data['msg_type'] === 'start') {
                this.$store.commit('uav_common/set_check_progress', { check_id: e.data['msg'].check_id, progress: { progress: 0, is_running: true } });
              }
              else if (e.data['msg_type'] === 'error') {
                var check = this.getCheckById(e.data['msg'].check_id);
                this.$q.notify({ type: 'negative', message: "Check " + check.name + " failed with error, " + e.data['msg'].error });
              }
            }
          }
        }

        this.$sock.send(JSON.stringify({
          command: "run",
          data: {
            checks: this.selected_checks,
            project_id: this.project_state.id,
            session_id: this.project_state.current_session.session_id,
            datadir: this.project_state.current_session.datadir,
            auth_token: this.$auth.getToken()
          }
        }));
      },
      directoryChanged(e) {
        this.$store.commit('uav_project/update', { path: 'current_session.datadir', value: e });
      },
      directoryScanCompleted(scan_result) {
        this.$sock.onmessage = (e) => {
          if (e.data['msg'] && e.data['msg_type'] && e.data['command']) {
            if (e.data['command'] === 'open_session') {
              if (e.data['msg_type'] === 'info' && e.data['msg'] === 'done') {
                // Session Opened - All good update state
                this.$store.commit('uav_project/update', { path: 'current_session.datadir', value: scan_result.dir });
                this.$store.commit('uav_project/update', { path: 'current_session.files', value: scan_result.files });
              }
              else if (e.data['msg_type'] === 'error') {
                if (e.data['msg'] === 'file_difference') {
                  this.$q.notify({ type: 'negative', message: "File signature from server & the directory selected are different. Please select correct directory or create a new session." });
                  this.showDirScanner = true;
                }
                else if (e.data['msg'] === 'tender_difference') {
                  this.$q.notify({ type: 'negative', message: "Project requirement has changed, this session is obsolete now. Please create a new session or use the latest session." });
                }
                this.datadir = null;
                this.files = null;
              }
            }
          }
        }

        // Get Latest tender for the project
        this.axios.get('/api/uav/tender/' + this.session_state.id)
          .then((tender) => {
            // Get the session details from server
            return this.axios.get('/api/uav/' + this.session_state.id + '/session/' + this.current_session_id)
              .then((session) => {
                return { tender: tender.data, session: session.data }
              })
          })
          .then((response) => {
            // Open session in local box. This is where session files & tender are verified
            this.$sock.send(JSON.stringify({
              command: "open_session",
              data: response,
              files: scan_result.files
            }));
          });
      },
      getCheckById(checkId) {
        var check = null;
        _.each(this.checks, (chk_grp) => {
          var can_break = null;
          _.each(chk_grp.checks, (chk) => {
            if (chk.id.toUpperCase() === checkId.toUpperCase()) {
              check = chk;
              can_break = false;
              return false;
            }
          })

          if (can_break === false) return false;
        });

        return check;
      },
      elapsedTime(time) {
        var elapsed = timespan.parse(Date.now() - Date.parse(time));
        elapsed = elapsed === "now" ? "just " + elapsed : elapsed + " ago";
        return elapsed;
      },
      showReport() {
        this.isShowReport = true;
        this.isShowUsers = this.isShowSessions = false;
      },
      showUsers() {
        this.isShowUsers = true;
        this.isShowReport = this.isShowSessions = false;
      },
      showSession(sessionId) {
        this.$store.dispatch('uav_project/getSession', { id: this.$route.query.id, session_id: sessionId });

        this.isShowSessions = true;
        this.isShowReport = this.isShowUsers = false;

        this.current_session_id = sessionId
      },
      deleteProject() {
        this.$q.dialog({
          title: 'Are you sure?',
          message: 'Deleting a project will delete it\'s requirements, session & reports. It is not possible to recover the data once deleted. Are you sure you want to delete this project?',
          ok: { label: 'Yes, Delete the project', color: 'negative' },
          cancel: 'Cancel'
        }).then(() => {
          this.$store.dispatch('uav_project/deleteProject', { id: this.$route.query.id })
            .catch((e) => {
              this.$q.notify({ type: 'negative', message: "Error deleting project" });
            })
        }).catch(() => { })
      },
      deleteSession(session_id) {
        this.$q.dialog({
          title: 'Are you sure?',
          message: 'Deleting a session will delete check results created in the session. It is not possible to recover the data once deleted. Are you sure you want to delete this session?',
          ok: { label: 'Yes, Delete the session', color: 'negative' },
          cancel: 'Cancel'
        }).then(() => {
          this.$store.dispatch('uav_project/deleteSession', { id: this.project_state.id, session_id: session_id })
            .then(() => {
              if (session_id === this.session_state.session_id) {
                this.$sock.send(JSON.stringify({
                  command: "delete_session",
                  data: {
                    id: this.project_state.id,
                    session_id: this.project_state.current_session.session_id
                  }
                }))

                // We are deleting the session we are viewing now.
                if (this.project_state && this.project_state.sessions.length > 0) {
                  this.showSession(this.project_state.sessions[0].session_id);
                }
                else {
                  this.$store.commit('uav_project/update', { path: 'current_session', value: null })
                  this.$router.push('/uav');
                }
              }
            })
            .catch((e) => {
              this.$q.notify({ type: 'negative', message: "Error deleting session" });
            })
        }).catch(() => { })
      }
    },
    mounted() {
      if (this.session_state) {
        this.isShowSessions = true;
        this.isShowReport = this.isShowUsers = false;

        this.current_session_id = this.session_state.session_id;
      }
    },
    computed: {
      ...mapGetters({
        project_state: 'uav_project/project_state',
        checks: 'uav_common/check_groups',
        any_check_selected: 'uav_common/is_check_selected',
        selected_checks: 'uav_common/selected_checks'
      }),
      can_run_checks() {
        return this.any_check_selected &&
          this.project_state.current_session.datadir &&
          this.project_state.current_session.files;
      },
      session_table() {
        return _.reduce(this.project_state.sessions, (result, s) => {
          var elapsed = timespan.parse(Date.now() - Date.parse(s.updated));
          elapsed = elapsed === "now" ? "just " + elapsed : elapsed + " ago";
          result.push(_.merge(s, { elapsed: elapsed }));
          return result;
        }, [])
      },
      session_state() {
        return this.project_state.current_session;
      },
      dir_files() {
        if (!this.current_dir) { return this.session_state.files }
        else {
          return _.get(this.session_state.files, this.current_dir);
        }
      },
      current_dirs() {
        return this.current_dir ? this.current_dir.split('.') : []
      }
    },
    data() {
      return {
        showDirScanner: true,
        current_session_id: null,
        left: true,
        isShowReport: true,
        isShowUsers: false,
        isShowSessions: false,
        session_columns: [
          { name: 'notes', label: 'Notes / Session ID', field: 'notes' },
          { name: 'updated', label: 'Last Updated On', field: 'updated' },
          { name: 'updated_by', label: 'Updated By', field: 'updated_by' },
          { name: 'session_id', label: 'View', field: 'session_id' }
        ]
      }
    }
  })
</script>
<style lang="stylus">
</style>
