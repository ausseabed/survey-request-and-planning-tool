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
              v-if="hasPermission(['canViewAllSurveyPlans', 'canViewCustodianSurveyPlans'])"
              name="survey-plans" label="Plans" icon="layers"/>
            <q-tab
              v-if="hasPermission(['canViewAllSurveyRequests', 'canViewCustodianSurveyRequests'])"
              name="survey-requests" label="Requests" icon="device_hub"/>
          </q-tabs>
          <div class="fat-spacer bg-secondary"></div>

          <q-tab-panels v-model="tab" animated class="col">
            <q-tab-panel
              v-if="hasPermission(['canViewAllSurveyPlans', 'canViewCustodianSurveyPlans'])"
              name="survey-plans" class="column col-auto no-padding">

              <!-- <q-card-section class="column col" style="padding:0px"> -->
                <q-scroll-area class="col">
                  <q-list no-border padding
                    @mouseleave.native="mouseleaveMatchingProjMeta">

                    <q-item clickable
                      v-for="matchingProjMeta in matchingProjMetas"
                      :key="matchingProjMeta.id"
                      @mouseover="mouseoverMatchingProjMeta(matchingProjMeta, true)"
                      class="column"
                      >

                      <div class="row">
                        <q-item-section top avatar>
                          <q-avatar
                            text-color="white"
                            size="34px"
                            font-size="20px"
                            rounded
                            :icon="surveyPlanStatusIconDetails(matchingProjMeta.status).icon"
                            :color="surveyPlanStatusIconDetails(matchingProjMeta.status).color"
                          />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label>{{matchingProjMeta.surveyName}}</q-item-label>
                          <q-item-label caption>{{matchingProjMeta.status}}</q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                          <q-item-label caption>{{matchingProjMeta.startDate | dateString}}</q-item-label>
                          <q-icon
                            :name="recordStateDetails(matchingProjMeta.recordState).icon"
                          >
                            <q-tooltip>
                              {{ recordStateDetails(matchingProjMeta.recordState).label }}
                            </q-tooltip>
                          </q-icon>
                        </q-item-section>
                      </div>

                      <q-item-section>
                        <transition-expand>
                          <div v-if="activeProjMetaId == matchingProjMeta.id">
                            <q-btn outline size="sm" color="primary" label="Summary"  class="q-mt-xs q-ml-xs"
                              :to="`/survey-plan/${matchingProjMeta.id}/summary`">
                            </q-btn>
                            <q-btn outline size="sm" color="primary" label="Specs" class="q-mt-xs q-ml-xs"
                              :to="`/survey-plan/${matchingProjMeta.id}/specifications`">
                            </q-btn>
                            <q-btn outline size="sm" color="primary" label="Deliverables" class="q-mt-xs q-ml-xs"
                              :to="`/survey-plan/${matchingProjMeta.id}/deliverables`">
                            </q-btn>
                            <q-btn outline size="sm" color="primary" icon="attach_file" class="q-mt-xs q-ml-xs"
                              :to="`/survey-plan/${matchingProjMeta.id}/attachments`">
                            </q-btn>
                          </div>
                        </transition-expand>

                      </q-item-section>
                    </q-item>

                  </q-list>

                </q-scroll-area>

                <div
                  v-if="hasPermission('canAddSurveyPlan')"
                  class="full-width column"
                  >
                  <q-separator style="height:1px;"/>
                  <div class="row justify-end q-py-sm q-mx-md">
                    <q-btn flat label="add plan"
                      icon="add"
                      :to="'/survey-plan/new'">
                      <q-tooltip>
                        Create new survey plan
                      </q-tooltip>
                    </q-btn>
                  </div>

                </div>
            </q-tab-panel>

            <q-tab-panel
              v-if="hasPermission(['canViewAllSurveyRequests', 'canViewCustodianSurveyRequests'])"
              name="survey-requests" class="column col-auto no-padding">

              <q-scroll-area class="col">
                <q-list no-border padding
                  @mouseleave.native="mouseleaveMatchingProjMeta"
                  >

                  <q-item clickable
                    v-for="surveyRequest in surveyRequests"
                    :key="surveyRequest.id"
                    @mouseover="mouseoverMatchingProjMeta(surveyRequest, false)"
                    class="column"
                    >
                    <div class="row">
                      <q-item-section>
                        <q-item-label>{{surveyRequest.name}}</q-item-label>
                      </q-item-section>

                      <q-item-section side top>
                        <q-item-label caption>{{surveyRequest.requestDateStart | dateString }}</q-item-label>
                      </q-item-section>
                    </div>
                    <q-item-section>
                      <transition-expand>
                        <div v-if="activeProjMetaId == surveyRequest.id">
                          <q-btn outline size="sm" color="primary" label="Summary"  class="q-mt-xs q-ml-xs"
                            :to="`/survey-request/${surveyRequest.id}/summary`">
                          </q-btn>
                          <q-btn outline size="sm" color="primary" icon="attach_file" class="q-mt-xs q-ml-xs"
                            :to="`/survey-request/${surveyRequest.id}/attachments`">
                          </q-btn>
                          <q-btn outline size="sm" color="primary" label="Plans" class="q-mt-xs q-ml-xs"
                            :to="`/survey-request/${surveyRequest.id}/survey-plans`">
                          </q-btn>
                        </div>
                      </transition-expand>

                    </q-item-section>
                  </q-item>

                </q-list>

              </q-scroll-area>

              <div
                v-if="hasPermission('canAddSurveyRequest')"
                class="full-width column"
                >
                <q-separator style="height:1px;"/>
                <div class="row justify-end q-py-sm q-mx-md">
                  <q-btn flat label="add request"
                    align="right" icon="add"
                    :to="'/survey-request/new'">
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
import { surveyPlanStatusIconDetails, recordStateDetails } from './utils'
import OlMap from './olmap/olmap';

import * as pmMutTypes
  from '../store/modules/survey-plan/survey-plan-mutation-types'

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
    this.fetchSurveyPlans(this.map.getExtents());
    this.getSurveyRequests();
  },

  methods: {
    ...mapMutations('surveyPlan', [
      pmMutTypes.SET_AOI,
      pmMutTypes.SET_PROJECT_METADATA_LIST_FILTER,
    ]),
    ...mapActions('surveyRequest', [
      'getSurveyRequests',
    ]),
    heightTweak (offset) {
      return {
        minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh',
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      }
    },
    fetchSurveyPlans (extents) {
      this.SET_PROJECT_METADATA_LIST_FILTER(undefined);
      this.$store.dispatch(
        'surveyPlan/getSurveyPlanList',
        {params:{includeGeometry:true}})
      .then(matchingProjMetas => {
        this.matchingProjMetas = matchingProjMetas;

        const mapableSurveyPlans = matchingProjMetas.filter(proj => {
          return !_.isNil(proj.areaOfInterest);
        })
        const areaOfInterests = mapableSurveyPlans.map(mpm => {
          let f = mpm.areaOfInterest;
          f.id = mpm.id;
          return f;
        });
        this.map.setGeojsonFeatureIntersecting(areaOfInterests);
      })
    },

    debounceExtents: _.debounce(function(extents) {
      this.fetchSurveyPlans(extents);
    }, 500),

    mouseoverMatchingProjMeta(matchingProjMeta, updateMap) {
      this.activeProjMetaId = matchingProjMeta.id;
      if (_.isNil(matchingProjMeta.areaOfInterest)) {
        this.map.highlightFeatureId(undefined);
      } else if (updateMap) {
        this.map.highlightFeatureId(matchingProjMeta.id);
      }
    },
    mouseleaveMatchingProjMeta() {
      //clears selection in map
      this.activeProjMetaId = undefined;
      this.map.highlightFeatureId(undefined);
    },
    surveyPlanStatusIconDetails: surveyPlanStatusIconDetails,
    recordStateDetails: recordStateDetails,
  },

  computed: {
    ...mapGetters('surveyRequest', [
      'surveyRequests',
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
    'userRole': {
      immediate: true,
      handler(newRole, oldRole) {
        if (this.hasPermission(['canViewAllSurveyPlans', 'canViewCustodianSurveyPlans'])) {
          this.tab = 'survey-plans';
        } else if (this.hasPermission(['canViewAllSurveyRequests', 'canViewCustodianSurveyRequests'])) {
          this.tab = 'survey-requests';
        }
      },
    },
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
