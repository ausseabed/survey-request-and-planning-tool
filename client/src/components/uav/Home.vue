<template>
  <div class="row justify-center">
    <div style="width: 900px; max-width: 90vw;">
      <q-breadcrumbs separator=">" color="light">
        <q-breadcrumbs-el label="Home" icon="home" to="/" />
        <q-breadcrumbs-el label="UAV" icon="toys" />
      </q-breadcrumbs>
    </div>

    <div class="layout-padding row justify-center">
      <div style="width: 900px; max-width: 90vw;">

        <h5 style="text-align: center"> {{ description }}</h5>
        <h6 style="text-align: center">Collect & use data with confidence</h6>
        <p style="text-align: center">Any other fancy english here</p>


        <div class="row justify-center">
          <div v-intro="'Create a best practice data collection requirement by answering few questions about your project'" v-intro-tooltip-class="'red-bg'">
            <q-btn class="block col-md-4" @click="gotoSurvey">Help me create a tender</q-btn>
          </div>
          <div v-intro="'Create data collection requirement document from scratch'" v-intro-tooltip-class="'red-bg'">
            <q-btn class="block col-md-4" @click="gotoTender">Create tender</q-btn>
          </div>
        </div>
        <div v-intro="'Work with an existing project'" v-intro-tooltip-class="'red-bg'">
          <p class="caption">Projects</p>
          <q-infinite-scroll ref="scroller"
                             :handler="refresher"
                             class="layout-padding justify-center">
            <q-collapsible v-for="(project, k, idx) in reverse_projects"
                           :key="idx"
                           :label="project.project_name"
                           :sublabel="project.tenderer"
                           popup>
              <q-card flat>
                <q-card-actions class="group">
                  <q-btn flat
                         icon="visibility"
                         label="Project"
                         @click="openProject(project.id)" />

                  <q-btn flat
                         icon="notes"
                         label="Requirements"
                         @click="openTender(project.id)" />

                  <q-btn flat
                         icon="av_timer"
                         label="Create Session"
                         @click="createSession(project.id)" />
                </q-card-actions>
                <q-card-main>
                  <q-list no-border>
                    <q-item v-for="(session, k, idx) in reverse(project.sessions)"
                            :key="session.session_id"
                            inset>
                      <q-item-main inset>
                        <q-item-tile label>{{session.notes ? session.notes : 'Session ' + session.session_id}}</q-item-tile>
                        <q-item-tile sublabel>Last updated on {{session.updated}} by {{session.updated_by}}</q-item-tile>
                      </q-item-main>
                      <q-item-side>
                        <q-btn round flat
                               icon="folder_open"
                               @click="openSession(project.id, session.session_id)" />
                      </q-item-side>
                    </q-item>
                  </q-list>
                </q-card-main>
              </q-card>
            </q-collapsible>
          </q-infinite-scroll>
        </div>
      </div>
    </div>

    <!-- Show state of socket -->
    <socket-state />
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { QParallax, QCard, QCardTitle, QCardMain, QIcon, QCardActions, QBtn } from 'quasar'
  import SocketState from './../controls/SocketState.vue'
  import { fail } from 'assert';
  import { timingSafeEqual } from 'crypto';
  import { trajectory } from '../../store/modules/uav/tender/uav_tender_getters';
  import { LocalStorage } from 'quasar'

  export default {
    components: {
      QParallax, QCard, QCardTitle, QCardMain, QIcon, QCardActions, QBtn,
      'socket-state': SocketState
    },
    mounted() {
      var introDone = LocalStorage.get.item('intro.uav')
      if (!introDone) {
        var intro = this.$intro();
        intro.start(); // start the guide
        this.$intro().showHints(); // show hints
        intro.oncomplete(function () {
          LocalStorage.set('intro.uav', true);
        });
        intro.onexit(function () {
          LocalStorage.set('intro.uav', true);
        });
      }
    },
    methods: {
      reverse(arr) { return _.reverse(arr) },
      refresher(index, done) {
        this.getTenders(done);
      },
      getTenders(done) {
        if (!this.forceStart && this.lastKey === null) {
          this.$refs.scroller.stop();
        }

        this.$store.dispatch('uav_common/getTenderList', { done: done, stop: this.$refs.scroller.stop });
      },
      gotoSurvey() {
        this.$router.push('/uav/survey');
      },
      gotoTender() {
        this.$store.commit('uav_tender/reset');   // Reset tender store
        this.$router.push('/uav/tender');
      },
      openTender(id) {
        this.$store.commit('uav_tender/reset');   // Reset tender store
        this.$router.push('/uav/tender?id=' + id);
      },
      createSession(id) {
        this.$store.commit('uav_session/reset');   // Reset tender store
        this.$router.push('/uav/session?id=' + id);
      },
      openSession(id, session_id) {
        this.$store.dispatch('uav_project/getProject', { id: id, session_id: session_id }).then(() => {
          this.$router.push('/uav/project?id=' + id);
        });
      },
      openProject(id) {
        this.$router.push('/uav/project?id=' + id);
      }
    },
    computed: {
      ...mapGetters({
        lastKey: 'uav_common/lastEvaluatedKey',
        forceStart: 'uav_common/forceStartOn',
        projects: 'uav_common/projects',
      }),
      reverse_projects() {
        return this.projects.slice().reverse();
      },
      description() {
        return process.env.DESCRIPTION;
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
  .q-btn {
    margin: 5px;
    min-height: 36px;
  }
</style>
