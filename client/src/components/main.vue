<template>
  <q-page :style-fn="heightTweak">
    <div class="row q-pt-sm q-pl-sm q-col-gutter-sm fit">
      <div class="column full-height">
        <q-card class="column col" style="max-width: 420px; min-width: 420px;">
          <q-tabs v-model="tab" class="bg-secondary text-white">
            <q-tab name="home" label="Home" icon="home" />
            <q-tab
              name="priority-areas"
              :icon="'img:' + require('assets/priority-areas.svg')"
              class="q-tab__label"
            >
              <div style="margin-bottom: -4px;">
                Areas of
              </div>
              <div style="margin-top: -4px;">
                Interest
              </div>
            </q-tab>
            <q-tab
              v-if="
                hasPermission([
                  'canViewAllSurveyRequests',
                  'canViewCustodianSurveyRequests',
                ])
              "
              name="survey-requests"
              icon="device_hub"
              class="q-tab__label"
            >
              <div style="margin-bottom: -4px;">
                HIPP
              </div>
              <div style="margin-top: -4px;">
                Requests
              </div>
            </q-tab>
            <q-tab
              v-if="
                hasPermission([
                  'canViewAllSurveyPlans',
                  'canViewCustodianSurveyPlans',
                ])
              "
              name="survey-plans"
              icon="layers"
              class="q-tab__label"
            >
              <div style="margin-bottom: -4px;">
                Survey
              </div>
              <div style="margin-top: -4px;">
                Plans
              </div>
            </q-tab>
          </q-tabs>
          <div class="fat-spacer bg-secondary"></div>

          <q-tab-panels v-model="tab" animated class="col">
            <q-tab-panel name="home" class="no-padding">
              <main-home
                @add-aoi-clicked="addAoI"
                @add-request-clicked="addRequest"
              >
              </main-home>
            </q-tab-panel>

            <q-tab-panel
              v-if="
                hasPermission([
                  'canViewAllSurveyPlans',
                  'canViewCustodianSurveyPlans',
                ])
              "
              name="survey-plans"
              class="column col-auto no-padding"
            >
              <!-- <q-card-section class="column col" style="padding:0px"> -->
              <q-scroll-area class="col">
                <q-list
                  v-if="surveyPlans && surveyPlans.length > 0"
                  no-border
                  padding
                  @mouseleave.native="mouseleaveListItem"
                >
                  <q-item
                    clickable
                    v-for="surveyPlan in surveyPlans"
                    :id="'list-item-' + surveyPlan.id"
                    :key="surveyPlan.id"
                    @mouseover="mouseoverListItem(surveyPlan, true)"
                    class="column"
                    :to="`/survey-plan/${surveyPlan.id}/summary`"
                    :manual-focus="true"
                    :focused="activeId == surveyPlan.id"
                  >
                    <div class="row">
                      <q-item-section top avatar>
                        <q-avatar
                          text-color="white"
                          size="34px"
                          font-size="20px"
                          rounded
                          :icon="
                            surveyPlanStatusIconDetails(surveyPlan.status).icon
                          "
                          :color="
                            surveyPlanStatusIconDetails(surveyPlan.status).color
                          "
                        />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{ surveyPlan.surveyName }}</q-item-label>
                        <q-item-label caption>{{
                          surveyPlan.status
                        }}</q-item-label>
                      </q-item-section>

                      <q-item-section side top>
                        <q-item-label caption>{{
                          surveyPlan.startDate | dateString
                        }}</q-item-label>
                        <q-icon
                          :name="
                            recordStateDetails(surveyPlan.recordState).icon
                          "
                        >
                          <q-tooltip>
                            {{
                              recordStateDetails(surveyPlan.recordState).label
                            }}
                          </q-tooltip>
                        </q-icon>
                      </q-item-section>
                    </div>

                    <q-item-section>
                      <transition-expand>
                        <div v-if="activeId == surveyPlan.id">
                          <q-btn
                            outline
                            size="sm"
                            color="primary"
                            label="Summary"
                            class="q-mt-xs q-ml-xs"
                            :to="`/survey-plan/${surveyPlan.id}/summary`"
                          >
                          </q-btn>
                          <!-- <q-btn outline size="sm" color="primary" label="Specs" class="q-mt-xs q-ml-xs"
                              :to="`/survey-plan/${surveyPlan.id}/specifications`">
                            </q-btn>
                            <q-btn outline size="sm" color="primary" label="Deliverables" class="q-mt-xs q-ml-xs"
                              :to="`/survey-plan/${surveyPlan.id}/deliverables`">
                            </q-btn>
                            <q-btn outline size="sm" color="primary" icon="attach_file" class="q-mt-xs q-ml-xs"
                              :to="`/survey-plan/${surveyPlan.id}/attachments`">
                            </q-btn> -->
                        </div>
                      </transition-expand>
                    </q-item-section>
                  </q-item>
                </q-list>
                <div v-else class="hint-text q-pa-lg">
                  There are currently no entries for your custodian, please add
                  a survey plan using the button below.
                </div>
              </q-scroll-area>

              <div
                v-if="hasPermission('canAddSurveyPlan')"
                class="full-width column"
              >
                <q-separator style="height: 1px" />
                <div class="row justify-end q-py-sm q-mx-md">
                  <sct-btn label="add plan" icon="add" :to="'/survey-plan/new'">
                    <q-tooltip> Create new survey plan </q-tooltip>
                  </sct-btn>
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel
              v-if="
                hasPermission([
                  'canViewAllSurveyRequests',
                  'canViewCustodianSurveyRequests',
                ])
              "
              name="survey-requests"
              class="column col-auto no-padding"
            >
              <q-scroll-area class="col">
                <q-list
                  v-if="surveyRequests && surveyRequests.length > 0"
                  no-border
                  padding
                  @mouseleave.native="mouseleaveListItem"
                >
                  <q-item
                    clickable
                    v-for="surveyRequest in surveyRequests"
                    :id="'list-item-' + surveyRequest.id"
                    :key="surveyRequest.id"
                    @mouseover="mouseoverListItem(surveyRequest, true)"
                    class="column"
                    :to="{
                      name: 'survey-request-registration',
                      params: { id: surveyRequest.id },
                    }"
                    :manual-focus="true"
                    :focused="activeId == surveyRequest.id"
                  >
                    <div class="row">
                      <q-item-section top>
                        <q-item-label>{{ surveyRequest.name }}</q-item-label>
                      </q-item-section>

                      <q-item-section side top>
                        <q-item-label caption>{{
                          (surveyRequest.recordState
                            ? surveyRequest.recordState.created
                            : undefined) | dateString
                        }}</q-item-label>
                        <q-icon
                          :name="
                            recordStateDetails(surveyRequest.recordState).icon
                          "
                        >
                          <q-tooltip>
                            {{
                              recordStateDetails(surveyRequest.recordState)
                                .label
                            }}
                          </q-tooltip>
                        </q-icon>
                      </q-item-section>
                    </div>
                    <q-item-section>
                      <transition-expand>
                        <div v-if="activeId == surveyRequest.id">
                          <q-btn
                            outline
                            size="sm"
                            color="primary"
                            label="Registration"
                            class="q-mt-xs q-ml-xs"
                            :to="{
                              name: 'survey-request-registration',
                              params: { id: surveyRequest.id },
                            }"
                          >
                          </q-btn>
                        </div>
                      </transition-expand>
                    </q-item-section>
                  </q-item>
                </q-list>
                <div v-else class="hint-text q-pa-lg">
                  There are currently no entries for your custodian, please add
                  a survey request using the button below.
                </div>
              </q-scroll-area>

              <div
                v-if="hasPermission('canAddSurveyRequest')"
                class="full-width column"
              >
                <q-separator style="height: 1px" />
                <div class="row justify-between q-gutter-x-sm q-pa-sm">
                  <sct-btn
                    class="col-grow "
                    label="HydroScheme"
                    target="_blank"
                    href="https://www.hydro.gov.au/NHP/"
                  >
                    <q-tooltip> Australian Hydrographic Office - National Hydrography </q-tooltip>
                  </sct-btn>
                  <sct-btn
                    class="col-grow"
                    label="Add Request"
                    icon="add"
                    @click="addRequest"
                  >
                    <q-tooltip> Create a new HIPP Request </q-tooltip>
                  </sct-btn>
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel
              v-if="
                hasPermission([
                  'canViewAllPriorityAreaSubmissions',
                  'canViewCustodianPriorityAreaSubmissions',
                ])
              "
              name="priority-areas"
              class="column col-auto no-padding"
            >
              <div class="col-auto q-py-sm q-mx-md app-big-heading">
                Submissions
              </div>
              <q-separator style="height: 1px" />

              <q-scroll-area class="col">
                <q-list
                  v-if="
                    priorityAreaSubmissions &&
                    priorityAreaSubmissions.length > 0
                  "
                  no-border
                  padding
                  @mouseleave.native="mouseleaveListItem"
                >
                  <q-item
                    clickable
                    v-for="priorityAreaSubmission in priorityAreaSubmissions"
                    :id="'list-item-' + priorityAreaSubmission.id"
                    :key="priorityAreaSubmission.id"
                    @mouseover="mouseoverListItem(priorityAreaSubmission, true)"
                    class="column"
                    :to="{
                      name: 'priority-area-submission-registration',
                      params: { id: priorityAreaSubmission.id },
                    }"
                    :manual-focus="true"
                    :focused="activeId == priorityAreaSubmission.id"
                  >
                    <div class="row">
                      <q-item-section top>
                        <q-item-label>
                          {{
                            getPriorityAreaLabel(priorityAreaSubmission)
                              | truncate(45)
                          }}
                        </q-item-label>
                        <q-item-label caption>
                          {{
                            _.get(
                              priorityAreaSubmission,
                              "submittingOrganisation.name",
                              "No submitting organisation specified"
                            )
                          }}
                        </q-item-label>
                      </q-item-section>

                      <q-item-section side top>
                        <q-item-label caption>{{
                          priorityAreaSubmission.lastModified | dateString
                        }}</q-item-label>
                      </q-item-section>
                    </div>
                    <q-item-section>
                      <transition-expand>
                        <div v-if="activeId == priorityAreaSubmission.id">
                          <q-btn
                            outline
                            size="sm"
                            color="primary"
                            label="Registration"
                            class="q-mt-xs q-ml-xs"
                            :to="{
                              name: 'priority-area-submission-registration',
                              params: { id: priorityAreaSubmission.id },
                            }"
                          >
                          </q-btn>
                          <q-btn
                            outline
                            size="sm"
                            color="primary"
                            label="Areas"
                            class="q-mt-xs q-ml-xs"
                            :to="{
                              name: 'priority-area-submission-areas',
                              params: { id: priorityAreaSubmission.id },
                            }"
                          >
                          </q-btn>
                          <q-btn
                            outline
                            size="sm"
                            color="primary"
                            label="Confirmation"
                            class="q-mt-xs q-ml-xs"
                            :to="{
                              name: 'priority-area-submission-confirmation',
                              params: { id: priorityAreaSubmission.id },
                            }"
                          >
                          </q-btn>
                        </div>
                      </transition-expand>
                    </q-item-section>
                  </q-item>
                </q-list>
                <div v-else class="hint-text q-pa-lg">
                  There are currently no entries for your custodian, please add
                  an Area of Interest submission using the button below.
                </div>
              </q-scroll-area>

              <div
                v-if="hasPermission('canAddPriorityAreaSubmission')"
                class="full-width column"
              >
                <q-separator style="height: 1px" />
                <div class="row q-pl-sm q-py-sm q-gutter-x-sm">
                  <sct-btn
                    label="Go to data portal"
                    align="right"
                    icon="public"
                    type="a"
                    href="https://portal.ga.gov.au/restore/8163b137-c621-4e9f-8781-883e6af7a662"
                    target="_blank"
                  >
                    <q-tooltip max-height="160px" >
                      View AoI submissions on AusSeabed <br/>Marine Data Portal
                    </q-tooltip>
                  </sct-btn>
                  <sct-btn
                    label="add submission"
                    align="right"
                    icon="add"
                    @click="addAoI"
                  >
                    <q-tooltip>
                      Create new Area of Interest Submission
                    </q-tooltip>
                  </sct-btn>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
      <div class="gt-xs col full-height">
        <q-card class="fit">
          <l-map
            class="col rounded-borders"
            ref="map"
            :zoom="zoom"
            :center="center"
            :bounds="bounds"
          >
            <l-control-scale
              position="topright"
              :imperial="false"
              :metric="true"
            >
            </l-control-scale>
            <l-control :position="'bottomleft'">
              <div
                class="rounded-borders q-px-sm"
                style="background-color: #ffffff4f"
              >
                <q-checkbox
                  v-model="showPriorityAreas"
                  label="Published Areas of Interest"
                />
              </div>
            </l-control>

            <l-control :position="'bottomright'" v-if="showPriorityAreas">
              <div
                class="rounded-borders q-px-xs q-pt-xs"
                style="background-color: #ffffff4f"
              >
                <img :src="mapLegendUrl" spinner-color="white" contain />
              </div>
            </l-control>

            <l-control position="topleft">
              <q-btn
                class="map-btn"
                padding="none"
                icon="zoom_out_map"
                @click="zoomToDefault()"
              >
              </q-btn>
            </l-control>

            <l-tile-layer
              :url="mapBaseUrl"
              :opacity="0.6"
              :attribution="baseLayerAttribution"
              :zIndex="3"
            >
            </l-tile-layer>

            <l-wms-tile-layer
              :visible="showPriorityAreas"
              :base-url="priorityAreaLayerDetails.url"
              :layers="priorityAreaLayerDetails.layer"
              name="Areas of Interest"
              layer-type="base"
              :transparent="true"
              format="image/png"
              :zIndex="5"
              :opacity="0.5"
            >
            </l-wms-tile-layer>

            <template v-if="tab === 'survey-plans'">
              <l-geo-json
                v-for="sp in surveyPlanFeatures"
                :key="sp.id"
                :geojson="sp.geojson"
                :options="options"
                :options-style="styleFunction(sp)"
              >
              </l-geo-json>
            </template>

            <template v-if="tab === 'survey-requests'">
              <l-geo-json
                v-for="sr in surveyRequestFeatures"
                :key="sr.id"
                :geojson="sr.geojson"
                :options="options"
                :options-style="styleFunction(sr)"
              >
              </l-geo-json>
            </template>

            <template v-if="tab === 'priority-areas'">
              <l-geo-json
                v-for="pas in priorityAreaSubmissionFeatures"
                :key="pas.id"
                :geojson="pas.geojson"
                :options="options"
                :options-style="styleFunction(pas)"
              >
              </l-geo-json>
            </template>

            <!-- <l-rectangle :bounds="boundsRectangle" ></l-rectangle> -->
          </l-map>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { date } from "quasar";
import Vue from "vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
const _ = require("lodash");
import { scroll } from "quasar";
const { getScrollTarget, setScrollPosition } = scroll;

import TransitionExpand from "./transition-expand.vue";
import { errorHandler } from "./mixins/error-handling";
import { permission } from "./mixins/permission";
import { surveyPlanStatusIconDetails, recordStateDetails } from "./utils";

import * as MapConstants from "./olmap/map-constants";
import { latLng, latLngBounds } from "leaflet";
import {
  LMap,
  LWMSTileLayer,
  LControlLayers,
  LLayerGroup,
  LControlScale,
  LRectangle,
} from "vue2-leaflet";

import * as pmMutTypes from "../store/modules/survey-plan/survey-plan-mutation-types";

import MainHome from "./main-home";

const defaultCenter = latLng(
  (MapConstants.WMTS_DEFAULT_EXTENT[1] + MapConstants.WMTS_DEFAULT_EXTENT[3]) /
    2,
  (MapConstants.WMTS_DEFAULT_EXTENT[0] + MapConstants.WMTS_DEFAULT_EXTENT[2]) /
    2
);

const defaultBounds = latLngBounds(
  latLng(
    MapConstants.WMTS_DEFAULT_EXTENT[1],
    MapConstants.WMTS_DEFAULT_EXTENT[0]
  ),
  latLng(
    MapConstants.WMTS_DEFAULT_EXTENT[3],
    MapConstants.WMTS_DEFAULT_EXTENT[2]
  )
);

export default Vue.extend({
  mixins: [errorHandler, permission],
  components: {
    TransitionExpand,
    MainHome,
    LMap,
    LControlLayers,
    LLayerGroup,
    LControlScale,
    LRectangle,
    "l-wms-tile-layer": LWMSTileLayer,
  },

  beforeMount() {
    this.fetchSurveyPlans();
    this.getSurveyRequests();
    this.getPriorityAreaSubmissions();
  },

  mounted() {
    // hides the "Leaflet" attribution in the map widget
    this.$refs.map.mapObject.attributionControl.setPrefix("");
  },

  methods: {
    ...mapMutations("surveyPlan", [
      pmMutTypes.SET_AOI,
      pmMutTypes.SET_SURVEY_PLAN_LIST_FILTER,
    ]),
    ...mapActions("surveyPlan", ["getSurveyPlans"]),
    ...mapActions("surveyRequest", ["getSurveyRequests"]),
    ...mapActions("priorityAreaSubmission", ["getPriorityAreaSubmissions"]),
    heightTweak(offset) {
      return {
        minHeight: offset ? `calc(100vh - ${offset}px)` : "100vh",
        height: offset ? `calc(100vh - ${offset}px)` : "100vh",
      };
    },

    fetchSurveyPlans() {
      this.SET_SURVEY_PLAN_LIST_FILTER(undefined);
      this.getSurveyPlans();
    },

    addAoI() {
      this.confirmNavigation(
        "Add Areas of Interest",
        `You will be directed to submit an Area of Interest. Please note this is
        not a pathway to submitting a HIPP Request. You may submit your polygon
        separately through both channels, or just one, depending on your intention.`,
        "/priority-area-submission/new/registration"
      )
    },

    addRequest() {
      this.confirmNavigation(
        "Add a HIPP Request",
        `You will be directed to submit an HIPP Request.  Please note this is
        not a pathway to submitting an Area of Interest polygon. You may submit
        your polygon separately through both channels , or just one, depending
        on your intention.`,
        "/survey-request/new/registration"
      )
    },

    confirmNavigation(title, message, toAddress) {
      const doNotShowConfirmCookie = `sct-${title}-no-show-confirm`
      if (this.$q.cookies.get(doNotShowConfirmCookie) != null) {
        // if user has checked the option not to show in future, then skip
        // the dialog
        this.$router.push(toAddress);
        return;
      }

      this.$q.dialog({
        title: title,
        message: message,
        ok: 'Continue',
        cancel: 'Cancel',
        options: {
          type: 'checkbox',
          model: [],
          // inline: true
          items: [
            { label: 'Do not show again', value: 'doNotShow'}
          ]
        },
      }).onOk((optionData) => {
        if (optionData.includes('doNotShow')) {
          // we just check if it's set, the value (True) doesn't matter here
          this.$q.cookies.set(doNotShowConfirmCookie, true);
        }
        this.$router.push(toAddress);
      }).onCancel(() => {
        //do nothing
      }).onDismiss(() => {
        //do nothing
      });
    },

    getPriorityAreaLabel(priorityAreaSubmission) {
      // if a submission name has been given, then use it as the label
      if (!_.isNil(priorityAreaSubmission.submissionName) && priorityAreaSubmission.submissionName.length != 0) {
        return priorityAreaSubmission.submissionName
      }

      // otherwise generate a string containing all the names of the priority
      // areas belonging to a submission. String is comma separated.
      if (priorityAreaSubmission.priorityAreas.length == 0) {
        return "No areas provided";
      }
      const names = priorityAreaSubmission.priorityAreas.map((pa) => {
        return pa.name;
      });
      return names.join(", ");
    },

    debounceExtents: _.debounce(function (extents) {
      this.fetchSurveyPlans(extents);
    }, 500),

    mapFeaturesSelected(featureIds) {
      if (featureIds.length > 0) {
        let spid = featureIds[0];

        // in some cases the survey plans may overlay each other. The following
        // block allows the user to cycle through each of the surveys found
        // at the clicked location by repeatedly clicking.
        if (_.includes(featureIds, this.activeId)) {
          let prevId = undefined;
          for (const fId of featureIds) {
            if (prevId == this.activeId) {
              spid = fId;
              break;
            }
            prevId = fId;
          }
        }

        // sets the active plan set in the plan list
        this.activeId = spid;

        // set the list scroll position to the survey clicked on in the map
        const surveyPlanId = `list-item-${this.activeId}`;
        const ele = document.getElementById(surveyPlanId);
        const target = getScrollTarget(ele);
        const offset = ele.offsetTop;
        const duration = 200;
        setScrollPosition(target, offset, duration);
      }
      this.lastSelectedFeatureIds = featureIds;
    },

    mouseoverListItem(matchingProjMeta, updateMap) {
      this.activeId = matchingProjMeta.id;
    },
    mouseleaveListItem() {
      this.activeId = undefined;
    },
    surveyPlanStatusIconDetails: surveyPlanStatusIconDetails,
    recordStateDetails: recordStateDetails,

    fetchMapFeatures(tabName) {
      let featureUrlName = undefined;
      let featureList = undefined;
      let entityList = undefined;
      // different entities use different name attributes, this controls what
      // wil be shown in the feature mouseover tooltip
      let nameProp = undefined;

      if (tabName === "survey-plans") {
        featureUrlName = "survey-plan";
        featureList = this.surveyPlanFeatures;
        entityList = this.surveyPlans;
        nameProp = "surveyName";
      } else if (tabName === "survey-requests") {
        featureUrlName = "survey-request";
        featureList = this.surveyRequestFeatures;
        entityList = this.surveyRequests;
        nameProp = "name";
      } else if (tabName === "priority-areas") {
        featureUrlName = "priority-area-submission";
        featureList = this.priorityAreaSubmissionFeatures;
        entityList = this.priorityAreaSubmissions;
        nameProp = "submittingOrganisation.name";
      }

      // we keep the 3 different entity types in 3 different lists
      // but the process of getting the geometry is pretty much the same
      // for each one; differences being the url and what property holds
      // the name value
      if (!_.isNil(featureUrlName) && !_.isNil(featureList)) {
        entityList.forEach((sr) => {
          Vue.axios
            .get(`api/${featureUrlName}/${sr.id}/geometry`)
            .then((res) => {
              const geojson = res.data;
              if (!_.isNil(geojson) && geojson.length != 0) {
                geojson.properties = {
                  id: sr.id,
                  name: _.get(sr, nameProp),
                };
                const existingIndex = featureList.findIndex((esr) => {
                  return esr.sr.id === sr.id;
                });
                const nf = {
                  geojson: geojson,
                  sr: sr,
                };
                if (existingIndex == -1) {
                  featureList.push(nf);
                } else {
                  this.$set(featureList, existingIndex, nf);
                }
              }
            });
        });
      }
    },

    styleFunction(sr) {
      return (f) => {
        const srid = (_.isNil(f.geometry.properties) ? f.id : f.geometry.properties.id )
        return {
          weight: 2,
          color:
            srid === this.activeId
              ? "rgba(255, 0, 0, 0.6)"
              : "rgba(0, 0, 0, 0.3)",
          opacity: 1,
          fillColor:
            srid === this.activeId
              ? "rgba(255, 0, 0, 0.3)"
              : "rgba(0, 0, 0, 0.1)",
          fillOpacity: 1,
        };
      };
    },

    zoomToDefault() {
      const map = this.$refs.map;
      map.mapObject.flyToBounds(defaultBounds, { duration: 0.2 });
    },
  },

  computed: {
    ...mapGetters("surveyPlan", ["surveyPlans"]),
    ...mapGetters("surveyRequest", ["surveyRequests"]),
    ...mapGetters("priorityAreaSubmission", ["priorityAreaSubmissions"]),

    mapBaseUrl() {
      return MapConstants.LEAFLET_BASE_LAYER;
    },
    baseLayerAttribution() {
      return MapConstants.MAP_ATTRIBUTION_HTML;
    },
    priorityAreaLayerDetails() {
      return {
        url: MapConstants.WMS_PRIORITY_AREAS,
        layer: MapConstants.WMS_PRIORITY_AREAS_LAYER,
      };
    },
    options() {
      return {
        onEachFeature: this.onEachFeatureFunction,
      };
    },
    onEachFeatureFunction() {
      return (feature, layer) => {
        layer.bindTooltip(
          `<div class="rounded-borders">` + feature.properties.name + `</div>`,
          { permanent: false, sticky: false }
        );
        layer.on("mouseover", (e) => {
          this.activeId = feature.properties.id;
        });
        layer.on("click", (e) => {
          this.activeId = feature.properties.id;
          const layerBounds = layer.getBounds().pad(0.2);
          const map = this.$refs.map;
          map.mapObject.flyToBounds(layerBounds, { duration: 0.2 });
        });
      };
    },

    boundsRectangle() {
      return [
        [
          MapConstants.WMTS_DEFAULT_EXTENT[1],
          MapConstants.WMTS_DEFAULT_EXTENT[0],
        ],
        [
          MapConstants.WMTS_DEFAULT_EXTENT[3],
          MapConstants.WMTS_DEFAULT_EXTENT[2],
        ],
      ];
    },
  },

  data() {
    return {
      tab: undefined,
      activeId: undefined,
      lastSelectedFeatureIds: [],
      zoom: 4,
      mapLegendUrl: `map/wms?SERVICE=WMS&REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&HEIGHT=25&LAYER=areas_of_interest&LAYERS=areas_of_interest&LEGEND_OPTIONS=forceLabels:on;minSymbolSize&SLD_VERSION=1.1.0&TRANSPARENT=true`,
      center: defaultCenter,
      bounds: defaultBounds,
      showPriorityAreas: false,
      surveyPlanFeatures: [],
      surveyRequestFeatures: [],
      priorityAreaSubmissionFeatures: [],
    };
  },

  watch: {
    userRole: {
      immediate: true,
      handler(newRole, oldRole) {
        this.tab = "home";
      },
    },
    tab: {
      handler(newTab, oldTab) {
        this.fetchMapFeatures(newTab);
      },
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
.map-btn .q-btn__wrapper {
  background-color: white;
  padding: 1px !important;
  min-height: 1em !important;
}
</style>
