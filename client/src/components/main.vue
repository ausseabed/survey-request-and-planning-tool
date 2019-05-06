<template>
  <q-page :style-fn="heightTweak" >
    <div class="row q-pt-md q-pl-md q-col-gutter-md fit ">
      <div class="column col-4 full-height">

        <q-card class="column no-margin col justify-between">
          <div class="col-auto">
            <q-card-section>
              <div class="text-h5">Projects</div>
            </q-card-section>
            <q-separator />
          </div>
          <q-card-section class="column col" style="padding:0px">
            <q-scroll-area class="fit">
              <q-list no-border padding
                @mouseleave.native="mouseleaveMatchingProjMeta">

                <q-item clickable
                  v-for="matchingProjMeta in matchingProjMetas"
                  :key="matchingProjMeta.id"
                  @mouseover.native="mouseoverMatchingProjMeta(matchingProjMeta)"
                  class="column"
                  >
                  <div class="row">
                    <q-item-section>
                      <q-item-label>{{matchingProjMeta.surveyName}}</q-item-label>
                      <q-item-label caption>{{matchingProjMeta.projectStatus}}</q-item-label>
                    </q-item-section>

                    <q-item-section side top>
                      <q-item-label caption>{{getProjectStartDateString(matchingProjMeta)}}</q-item-label>
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

          </q-card-section>
          <div class="col-auto">
            <q-separator />
            <q-card-actions align="right">
              <q-btn flat icon="add" label="Add project"
                :to="'/survey/new'">
              </q-btn>
            </q-card-actions>
          </div>
        </q-card>

      </div>
      <div class="col-8 full-height">
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
const _ = require('lodash');

import TransitionExpand from './transition-expand.vue';
import { errorHandler } from './mixins/error-handling'
import OlMap from './olmap/olmap';

export default Vue.extend({
  mixins: [errorHandler],
  components: {
    TransitionExpand
  },

  async mounted() {
    var olmap = OlMap(this.$refs.mapDiv, {
      basemap: "osm"
    })
    await olmap.initMap();
    this.map = olmap;
    this.map.onExtentsChange = (extents) => {
      this.debounceExtents(extents);
    };
    this.fetchProjects(this.map.getExtents());
  },

  methods: {
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
      this.$store.commit('projectMetadata/setAoi', geojson);
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

    mouseoverMatchingProjMeta(matchingProjMeta) {
      this.activeProjMetaId = matchingProjMeta.id;
      this.map.highlightFeatureId(matchingProjMeta.id);
    },
    mouseleaveMatchingProjMeta() {
      //clears selection in map
      this.activeProjMetaId = undefined;
      this.map.highlightFeatureId(undefined);
    },

    getProjectStartDateString(projectMetadata) {
      const ts = new Date();
      ts.setTime(projectMetadata.startDate);
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

  data() {
    return {
      map: null,
      matchingProjMetas:undefined,
      activeProjMetaId:undefined,
    }
  }

});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">

</style>
