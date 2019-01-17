<template>
  <q-page :style-fn="heightTweak" >
    <div class="overflow-hidden fit">
      <div class="row q-pt-md q-pr-md gutter-sm fit ">
        <div class="col-4">
          <q-card class="column no-margin full-height justify-between">
            <div class="col-auto">
              <q-card-title>
                Projects
              </q-card-title>
              <q-card-separator />
            </div>
            <q-card-main class="col">
              <q-scroll-area class="fit">
                <q-list no-border highlight
                  @mouseleave.native="mouseleaveMatchingProjMeta">
                  <q-item
                    v-for="matchingProjMeta in matchingProjMetas"
                    :key="matchingProjMeta.id"
                    @mouseover.native="mouseoverMatchingProjMeta(matchingProjMeta)"
                    :to="'/project-metadata/' + matchingProjMeta.id"
                    >

                    <q-item-main>
                      <q-item-tile label>{{matchingProjMeta.surveyName}}</q-item-tile>
                      <q-item-tile sublabel>{{getProjectStartDateString(matchingProjMeta)}}</q-item-tile>
                    </q-item-main>

                    <q-item-side :icon="getIconDetails(matchingProjMeta).icon" :color="getIconDetails(matchingProjMeta).color">
                      <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">
                        {{matchingProjMeta.projectStatus}}
                      </q-tooltip>
                    </q-item-side>

                  </q-item>
                </q-list>

              </q-scroll-area>
              <!-- <div class="q-card-subtitle"><span>Subtitle</span></div> -->
            </q-card-main>
            <div class="col-auto">
              <q-card-separator />
              <q-card-actions align="end">
                <q-btn flat icon="add" label="Add project"
                  @click="clickNewProject">
                </q-btn>
              </q-card-actions>
            </div>
          </q-card>

        </div>
        <div class="col-8">
          <q-card class="no-margin full-height">
            <!-- <div>Hi2</div> -->
            <div ref="mapDiv" id="mapDiv" class="fit"></div>
          </q-card>

        </div>
      </div>
    </div>

  </q-page>

</template>

<script>
import Vue from 'vue'
import { QParallax, QCard, QCardTitle, QCardMain, QIcon, QCardActions,
  QBtn, date } from 'quasar'
const _ = require('lodash');

import { errorHandler } from './mixins/error-handling'
import OlMap from './olmap/olmap';

export default Vue.extend({
  mixins: [errorHandler],
  components: {
    QParallax, QCard, QCardTitle, QCardMain, QIcon, QCardActions, QBtn
  },

  mounted() {
    var olmap = OlMap(this.$refs.mapDiv, {
      basemap: "osm"
    })
    olmap.initMap();
    this.map = olmap;
    this.map.onExtentsChange = (extents) => {
      this.debounceExtents(extents);
    };
    this.fetchProjects(this.map.getExtents());
  },

  methods: {
    clickNewProject() {
      this.$router.push('/project-metadata');
    },
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
      // this.map.addGeojsonFeature(geojson);
      console.log(geojson);
      this.$store.commit('projectMetadata/setAoi', geojson);
      this.$store.dispatch(
        'projectMetadata/checkAoi', { id: this.id })
      .then(matchingProjMetas => {
        console.log(matchingProjMetas);
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
      this.map.highlightFeatureId(matchingProjMeta.id);
    },
    mouseleaveMatchingProjMeta() {
      //clears selection in map
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
    }
  }

});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">

</style>
