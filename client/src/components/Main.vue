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
                      <q-item-tile sublabel>{{matchingProjMeta.projectStatus}}</q-item-tile>
                    </q-item-main>

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
import { QParallax, QCard, QCardTitle, QCardMain, QIcon, QCardActions, QBtn } from 'quasar'
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
      this.$store.commit('uav_projectmetadata/setAoi', geojson);
      this.$store.dispatch(
        'uav_projectmetadata/checkAoi', { id: this.id })
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
