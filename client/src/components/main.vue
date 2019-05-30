<template>
  <q-page :style-fn="heightTweak" >
    <div class="row q-pt-md q-pl-md q-col-gutter-md fit ">
      <div class="column col-xs-12 col-sm-4 full-height">

        <q-card class="column col">

          <q-tabs
            v-model="tab"
            class="bg-secondary text-white"
          >
            <q-tab
              v-if="hasPermission(['canViewAllProjects', 'canViewOrgProjects'])"
              name="projects" label="Projects" icon="layers"/>
            <q-tab
              v-if="hasPermission(['canViewAllHippRequests', 'canViewOrgHippRequests'])"
              name="requests" label="Requests" icon="device_hub"/>
          </q-tabs>
          <div class="fat-spacer bg-secondary"></div>

          <q-tab-panels v-model="tab" animated class="col">
            <q-tab-panel
              v-if="hasPermission(['canViewAllProjects', 'canViewOrgProjects'])"
              name="projects" class="column col-auto no-padding">

              <!-- <q-card-section class="column col" style="padding:0px"> -->
                <q-scroll-area class="col">
                  <q-list no-border padding
                    @mouseleave.native="mouseleaveMatchingProjMeta">

                    <q-item clickable
                      v-for="matchingProjMeta in matchingProjMetas"
                      :key="matchingProjMeta.id"
                      @mouseover.native="mouseoverMatchingProjMeta(matchingProjMeta, false)"
                      class="column"
                      >
                      <div class="row">
                        <q-item-section>
                          <q-item-label>{{matchingProjMeta.surveyName}}</q-item-label>
                          <q-item-label caption>{{matchingProjMeta.projectStatus}}</q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                          <q-item-label caption>{{getDateString(matchingProjMeta.startDate)}}</q-item-label>
                          <div>
                            <q-icon :name="getIconDetails(matchingProjMeta).icon" :color="getIconDetails(matchingProjMeta).color" size="16pt" class="self-center"/>
                          </div>
                        </q-item-section>
                      </div>
                      <q-item-section>
                        <transition-expand>
                          <div v-if="activeProjMetaId == matchingProjMeta.id">
                            <q-btn outline size="sm" color="primary" label="Summary"  class="q-mt-xs q-ml-xs"
                              :to="`/survey/${matchingProjMeta.id}/summary`">
                            </q-btn>
                            <q-btn outline size="sm" color="primary" label="Specs" class="q-mt-xs q-ml-xs"
                              :to="`/survey/${matchingProjMeta.id}/specifications`">
                            </q-btn>
                            <q-btn outline size="sm" color="primary" label="Deliverables" class="q-mt-xs q-ml-xs"
                              :to="`/survey/${matchingProjMeta.id}/deliverables`">
                            </q-btn>
                            <q-btn outline size="sm" color="primary" icon="attach_file" class="q-mt-xs q-ml-xs"
                              :to="`/survey/${matchingProjMeta.id}/attachments`">
                            </q-btn>
                          </div>
                        </transition-expand>

                      </q-item-section>
                    </q-item>

                  </q-list>

                </q-scroll-area>
                <!-- <div class="fat-spacer bg-secondary"></div> -->

                <div
                  v-if="hasPermission('canAddProject')"
                  class="full-width column"
                  >
                  <q-separator style="height:1px;"/>
                  <div class="row justify-end q-py-sm q-mx-md">
                    <q-btn flat label="add project"
                      icon="add"
                      :to="'/survey/new'">
                      <q-tooltip>
                        Create new survey project
                      </q-tooltip>
                    </q-btn>
                  </div>

                </div>
            </q-tab-panel>

            <q-tab-panel
              v-if="hasPermission(['canViewAllHippRequests', 'canViewOrgHippRequests'])"
              name="requests" class="column col-auto no-padding">

              <q-scroll-area class="col">
                <q-list no-border padding
                  @mouseleave.native="mouseleaveMatchingProjMeta"
                  >

                  <q-item clickable
                    v-for="hippRequest in hippRequests"
                    :key="hippRequest.id"
                    @mouseover.native="mouseoverMatchingProjMeta(hippRequest, false)"
                    class="column"
                    >
                    <div class="row">
                      <q-item-section>
                        <q-item-label>{{hippRequest.name}}</q-item-label>
                        <q-item-label caption>{{hippRequest.areaName}}</q-item-label>
                      </q-item-section>

                      <q-item-section side top>
                        <q-item-label caption>{{getDateString(hippRequest.requestDateStart)}}</q-item-label>
                        <!-- <div>
                          <q-icon :name="getIconDetails(matchingProjMeta).icon" :color="getIconDetails(matchingProjMeta).color" size="16pt" class="self-center"/>
                        </div> -->
                      </q-item-section>
                    </div>
                    <q-item-section>
                      <transition-expand>
                        <div v-if="activeProjMetaId == hippRequest.id">
                          <q-btn outline size="sm" color="primary" label="Summary"  class="q-mt-xs q-ml-xs"
                            :to="`/hipp-request/${hippRequest.id}/summary`">
                          </q-btn>
                          <q-btn outline size="sm" color="primary" icon="attach_file" class="q-mt-xs q-ml-xs"
                            :to="`/hipp-request/${hippRequest.id}/attachments`">
                          </q-btn>
                          <q-btn outline size="sm" color="primary" label="Projects" class="q-mt-xs q-ml-xs"
                            :to="`/hipp-request/${hippRequest.id}/projects`">
                          </q-btn>
                        </div>
                      </transition-expand>

                    </q-item-section>
                  </q-item>

                </q-list>

              </q-scroll-area>

              <div
                v-if="hasPermission('canAddHippRequest')"
                class="full-width column"
                >
                <q-separator style="height:1px;"/>
                <div class="row justify-end q-py-sm q-mx-md">
                  <q-btn flat label="add request"
                    align="right" icon="add"
                    :to="'/hipp-request/new'">
                    <q-tooltip>
                      Create new HIPP request
                    </q-tooltip>
                  </q-btn>
                </div>
              </div>

            </q-tab-panel>
          </q-tab-panels>

        </q-card>

      </div>
      <div class="gt-xs col-sm-8 full-height">
        <q-card class="fit">
          <div ref="mapDiv" id="mapDiv" class="full-height"></div>
        </q-card>

      </div>
    </div>

  </q-page>

</template>

<script>
import { date } from 'quasar'
import Vue from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
const _ = require('lodash');

import TransitionExpand from './transition-expand.vue';
import { errorHandler } from './mixins/error-handling';
import { permission } from './mixins/permission';
import OlMap from './olmap/olmap';

import * as pmMutTypes
  from '../store/modules/project-metadata/project-metadata-mutation-types'

export default Vue.extend({
  mixins: [errorHandler, permission],
  components: {
    TransitionExpand
  },

  async mounted() {
    var olmap = OlMap(this.$refs.mapDiv, {
      basemap: "osm"
    })
    await olmap.initMap(false);
    this.map = olmap;
    this.map.onExtentsChange = (extents) => {
      this.debounceExtents(extents);
    };
    this.fetchProjects(this.map.getExtents());
    this.getHippRequests();
  },

  methods: {
    ...mapMutations('projectMetadata', [
      pmMutTypes.SET_AOI,
    ]),
    ...mapActions('hippRequest', [
      'getHippRequests',
    ]),
    heightTweak (offset) {
      return {
        minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh',
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      }
    },
    fetchProjects (extents) {
      const geojson = {
        type:"MultiPolygon",
        coordinates:[[[
          [extents[0],extents[1]],
          [extents[0],extents[3]],
          [extents[2],extents[3]],
          [extents[2],extents[1]],
          [extents[0],extents[1]],
        ]]]
      }
      this.SET_AOI(geojson)
      this.$store.dispatch(
        'projectMetadata/checkAoi', { id: this.id })
      .then(matchingProjMetas => {
        this.matchingProjMetas = matchingProjMetas;
        const areaOfInterests = matchingProjMetas.map(mpm => {
          let f = mpm.areaOfInterest;
          f.id = mpm.id;
          return f;
        });
        this.map.setGeojsonFeatureIntersecting(areaOfInterests);
      })
      .catch((e) => {
        this.notify('negative', 'Error fetching projects')
      });
    },

    debounceExtents: _.debounce(function(extents) {
      this.fetchProjects(extents);
    }, 500),

    mouseoverMatchingProjMeta(matchingProjMeta, updateMap) {
      this.activeProjMetaId = matchingProjMeta.id;
      if (updateMap) {
        this.map.highlightFeatureId(matchingProjMeta.id);
      }
    },
    mouseleaveMatchingProjMeta() {
      //clears selection in map
      this.activeProjMetaId = undefined;
      this.map.highlightFeatureId(undefined);
    },

    getDateString(aDate) {
      const ts = new Date();
      ts.setTime(aDate);
      let formattedString = date.formatDate(ts, 'MMMM D, YYYY');
      return formattedString;
    },

    getIconDetails(projectMetadata) {
      const ps = projectMetadata.projectStatus.toLowerCase();
      if (ps == "planning") {
        return {icon: "assignment", color:"tertiary"};
      } else if (ps == "scheduled") {
        return {icon: "event", color:"primary"};
      } else if (ps == "complete") {
        return {icon: "check_circle_outline", color:"positive"};
      } else if (ps == "abandoned") {
        return {icon: "not_interested", color:"faded"};
      } else {
        // shouldn't happen, but if it does a new status option has been
        // added
        return {icon: "bug_report", color:"negative"}
      }
    }

  },

  computed: {
    ...mapGetters('hippRequest', [
      'hippRequests',
    ]),
  },

  data() {
    return {
      map: null,
      tab: undefined,
      matchingProjMetas:undefined,
      activeProjMetaId:undefined,
    }
  },

  watch: {
    'userRole': function(newRole, oldRole) {
      if (this.hasPermission(['canViewAllProjects', 'canViewOrgProjects'])) {
        this.tab = 'projects';
      } else if (this.hasPermission(['canViewAllHippRequests', 'canViewOrgHippRequests'])) {
        this.tab = 'requests';
      }
    }
  }

});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">

.fat-spacer {
  width:100%;
  height: 2px;
}

</style>
