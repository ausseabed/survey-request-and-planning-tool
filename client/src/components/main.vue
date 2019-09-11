<template>
  <q-page :style-fn="heightTweak" >
    <div class="row q-pt-sm q-pl-sm q-col-gutter-sm fit ">
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
                      v-for="surveyPlan in surveyPlans"
                      :id="'list-item-' + surveyPlan.id"
                      :key="surveyPlan.id"
                      @mouseover="mouseoverMatchingProjMeta(surveyPlan, true)"
                      class="column"
                      :to="`/survey-plan/${surveyPlan.id}/summary`"
                      :manual-focus="true"
                      :focused="activeProjMetaId == surveyPlan.id"
                      >

                      <div class="row">
                        <q-item-section top avatar>
                          <q-avatar
                            text-color="white"
                            size="34px"
                            font-size="20px"
                            rounded
                            :icon="surveyPlanStatusIconDetails(surveyPlan.status).icon"
                            :color="surveyPlanStatusIconDetails(surveyPlan.status).color"
                          />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label>{{surveyPlan.surveyName}}</q-item-label>
                          <q-item-label caption>{{surveyPlan.status}}</q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                          <q-item-label caption>{{surveyPlan.startDate | dateString}}</q-item-label>
                          <q-icon
                            :name="recordStateDetails(surveyPlan.recordState).icon"
                          >
                            <q-tooltip>
                              {{ recordStateDetails(surveyPlan.recordState).label }}
                            </q-tooltip>
                          </q-icon>
                        </q-item-section>
                      </div>

                      <q-item-section>
                        <transition-expand>
                          <div v-if="activeProjMetaId == surveyPlan.id">
                            <q-btn outline size="sm" color="primary" label="Summary"  class="q-mt-xs q-ml-xs"
                              :to="`/survey-plan/${surveyPlan.id}/summary`">
                            </q-btn>
                            <q-btn outline size="sm" color="primary" label="Specs" class="q-mt-xs q-ml-xs"
                              :to="`/survey-plan/${surveyPlan.id}/specifications`">
                            </q-btn>
                            <q-btn outline size="sm" color="primary" label="Deliverables" class="q-mt-xs q-ml-xs"
                              :to="`/survey-plan/${surveyPlan.id}/deliverables`">
                            </q-btn>
                            <q-btn outline size="sm" color="primary" icon="attach_file" class="q-mt-xs q-ml-xs"
                              :to="`/survey-plan/${surveyPlan.id}/attachments`">
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
                    :id="'list-item-' + surveyRequest.id"
                    :key="surveyRequest.id"
                    @mouseover="mouseoverMatchingProjMeta(surveyRequest, true)"
                    class="column"
                    :to="`/survey-request/${surveyRequest.id}/summary`"
                    :manual-focus="true"
                    :focused="activeProjMetaId == surveyRequest.id"
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
          <div ref="mapDiv" id="mapDiv" class="full-height">
            <q-resize-observer @resize="onResize" />
          </div>
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
import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll

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

  beforeMount() {
    this.fetchSurveyPlans();
    this.getSurveyRequests({params:{includeGeometry:true}});
  },

  mounted() {
    var olmap = OlMap(this.$refs.mapDiv, {
      basemap: "osm"
    })
    olmap.initMap(false);
    this.map = olmap;
    this.map.onFeaturesSelected = this.mapFeaturesSelected;
  },

  methods: {
    ...mapMutations('surveyPlan', [
      pmMutTypes.SET_AOI,
      pmMutTypes.SET_SURVEY_PLAN_LIST_FILTER,
    ]),
    ...mapActions('surveyPlan', [
      'getSurveyPlans',
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

    fetchSurveyPlans () {
      this.SET_SURVEY_PLAN_LIST_FILTER(undefined);
      this.getSurveyPlans({params:{includeGeometry:true}})
    },

    debounceExtents: _.debounce(function(extents) {
      this.fetchSurveyPlans(extents);
    }, 500),

    mapFeaturesSelected(featureIds) {
      if (featureIds.length > 0) {
        let spid = featureIds[0];

        // in some cases the survey plans may overlay each other. The following
        // block allows the user to cycle through each of the surveys found
        // at the clicked location by repeatedly clicking.
        if (_.includes(featureIds, this.activeProjMetaId)) {
          let prevId = undefined;
          for (const fId of featureIds) {
            if (prevId == this.activeProjMetaId) {
              spid = fId
              break
            }
            prevId = fId
          }
        }

        // sets the active plan set in the plan list
        this.activeProjMetaId = spid;
        this.map.highlightFeatureId(spid);

        // set the list scroll position to the survey clicked on in the map
        const surveyPlanId = `list-item-${this.activeProjMetaId}`;
        const ele = document.getElementById(surveyPlanId);
        const target = getScrollTarget(ele);
        const offset = ele.offsetTop;
        const duration = 200;
        setScrollPosition(target, offset, duration);
      }
      this.lastSelectedFeatureIds = featureIds;
    },

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

    onResize (size) {
      if (this.map) {
        this.map.setSize(size);
      }
    },

    updateMapFeatures() {
      if (_.isNil(this.tab)) {
        return;
      }
      if (this.tab == 'survey-plans') {
        const mapableSurveyPlans = this.surveyPlans.filter(sp => {
          return !_.isNil(sp.areaOfInterest);
        })
        const areaOfInterests = mapableSurveyPlans.map(mpm => {
          let f = mpm.areaOfInterest;
          f.id = mpm.id;
          return f;
        });
        if (!_.isNil(this.map)) {
          this.map.setGeojsonFeatureIntersecting(areaOfInterests);
        }
      } else if (this.tab == 'survey-requests') {
        const mapableSurveyRequests = this.surveyRequests.filter(sp => {
          return !_.isNil(sp.areaOfInterest);
        });
        let areaOfInterests = mapableSurveyRequests.map(mpm => {
          let f = mpm.areaOfInterest;
          f.id = mpm.id;
          return f;
        });
        if (!_.isNil(this.map)) {
          this.map.setGeojsonFeatureIntersecting(areaOfInterests);
        }
      } else {
        console.error("Bad tab specified");
      }
    }
  },

  computed: {
    ...mapGetters('surveyPlan', [
      'surveyPlans',
    ]),
    ...mapGetters('surveyRequest', [
      'surveyRequests',
    ]),
  },

  data() {
    return {
      map: null,
      tab: undefined,
      activeProjMetaId: undefined,
      lastSelectedFeatureIds: [],
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
    'surveyPlans': {
      immediate: true,
      handler(newList, oldList) {
        this.updateMapFeatures();
      },
    },
    'tab': {
      handler(newTab, oldTab) {
        this.updateMapFeatures();
      }
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
