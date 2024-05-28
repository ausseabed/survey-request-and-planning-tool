<template>
  <q-page :style-fn="heightTweak">
    <div class="row q-pt-sm q-pl-sm q-col-gutter-sm fit">
      <div class="column full-height">
        <q-card class="column col" style="max-width: 420px; min-width: 420px;">
          <q-tabs v-model="tab" class="bg-secondary text-white">
            <q-tab name="home" label="Home" icon="home" />
            <q-tab
              name="areas-of-interest"
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
              name="hipp-requests"
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

            <q-expansion-item
                expand-separator
                label="Survey Plans"
                header-class="app-big-heading"
                expand-icon="filter_list"
              >
                <q-card>
                  <q-separator style="height: 1px" />
                  <div class="column q-px-md q-pb-sm">
                    <div class="row q-gutter-x-sm items-center">
                      <div class="text-grey">
                        Sort by
                      </div>
                      <q-select borderless dense options-dense v-model="planSortBy" :options="PLAN_SORT_OPTIONS"/>
                      <div class="text-grey">
                        order
                      </div>
                      <q-checkbox
                        v-model="planSortAscending"
                        checked-icon="arrow_upward"
                        unchecked-icon="arrow_downward"
                        dense size="lg"
                      />
                    </div>

                    <div class="row q-gutter-x-sm items-center" style="margin-top: -8px">
                      <div class="text-grey">
                        Filter by
                      </div>
                      <q-select borderless dense options-dense v-model="planFilterBy" :options="PLAN_FILTER_OPTIONS"/>
                      <template v-if="planFilterSelectionOptions.length != 0">
                        <div class="text-grey">
                          options
                        </div>
                        <q-select
                          borderless dense options-dense multiple
                          v-model="planFilterSelections"
                          :options="planFilterSelectionOptions"
                        >
                          <template v-slot:option="{ itemProps, itemEvents, opt, selected, toggleOption }">
                            <q-item
                              v-bind="itemProps"
                              v-on="itemEvents"
                            >
                              <q-item-section >
                                <q-checkbox :label="opt" :value="selected" @input="toggleOption(opt)" />
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                      </template>
                    </div>

                  </div>
                </q-card>
              </q-expansion-item>

              <q-separator style="height: 1px" />

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
                    v-for="surveyPlan in plansFilteredSorted"
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
                        <q-item-label caption>
                          {{
                            surveyPlan.organisations
                              .map((o) => o.name)
                              .join(", ") | truncate(50)
                          }}
                        </q-item-label>
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
                <div class="row justify-between q-gutter-x-sm q-pa-sm">
                  <sct-btn
                    label="Go to data portal"
                    align="right"
                    icon="public"
                    type="a"
                    href="https://portal.ga.gov.au/restore/264ef8e2-b752-4278-a095-47fc6f073d8c"
                    target="_blank"
                    class="col-grow"
                  >
                    <q-tooltip max-height="160px" >
                      View AoI submissions on AusSeabed <br/>Marine Data Portal
                    </q-tooltip>
                  </sct-btn>
                  <sct-btn
                    label="add plan"
                    icon="add"
                    :to="'/survey-plan/new'"
                    class="col-grow"
                  >
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
              name="hipp-requests"
              class="column col-auto no-padding"
            >

              <q-expansion-item
                expand-separator
                label="HIPP Requests"
                header-class="app-big-heading"
                expand-icon="filter_list"
              >
                <q-card>
                  <q-separator style="height: 1px" />
                  <div class="column q-px-md q-pb-sm">
                    <div class="row q-gutter-x-sm items-center">
                      <div class="text-grey">
                        Sort by
                      </div>
                      <q-select borderless dense options-dense v-model="requestSortBy" :options="REQUEST_SORT_OPTIONS"/>
                      <div class="text-grey">
                        order
                      </div>
                      <q-checkbox
                        v-model="requestSortAscending"
                        checked-icon="arrow_upward"
                        unchecked-icon="arrow_downward"
                        dense size="lg"
                      />
                    </div>

                    <div class="row q-gutter-x-sm items-center" style="margin-top: -8px">
                      <div class="text-grey">
                        Filter by
                      </div>
                      <q-select borderless dense options-dense v-model="requestFilterBy" :options="REQUEST_FILTER_OPTIONS"/>
                      <template v-if="requestFilterSelectionOptions.length != 0">
                        <div class="text-grey">
                          options
                        </div>
                        <q-select
                          borderless dense options-dense multiple
                          v-model="requestFilterSelections"
                          :options="requestFilterSelectionOptions"
                        >
                          <template v-slot:option="{ itemProps, itemEvents, opt, selected, toggleOption }">
                            <q-item
                              v-bind="itemProps"
                              v-on="itemEvents"
                            >
                              <q-item-section >
                                <q-checkbox :label="opt" :value="selected" @input="toggleOption(opt)" />
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                      </template>
                    </div>

                  </div>
                </q-card>
              </q-expansion-item>

              <q-separator style="height: 1px" />

              <q-scroll-area class="col">
                <q-list
                  v-if="surveyRequests && surveyRequests.length > 0"
                  no-border
                  padding
                  @mouseleave.native="mouseleaveListItem"
                >
                  <q-item
                    clickable
                    v-for="surveyRequest in requestsFilteredSorted"
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
                        <q-item-label caption>
                          {{
                            _.get(
                              surveyRequest,
                              "organisation.name",
                              "No requesting organisation specified"
                            )
                          }}
                        </q-item-label>
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
                  a HIPP Request using the button below.
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
              name="areas-of-interest"
              class="column col-auto no-padding"
            >

              <q-expansion-item
                expand-separator
                label="Submissions"
                header-class="app-big-heading"
                expand-icon="filter_list"
              >
                <q-card>
                  <q-separator style="height: 1px" />
                  <div class="column q-px-md q-pb-sm">
                    <div class="row q-gutter-x-sm items-center">
                      <div class="text-grey">
                        Sort by
                      </div>
                      <q-select borderless dense options-dense v-model="aoiSortBy" :options="AOI_SORT_OPTIONS"/>
                      <div class="text-grey">
                        order
                      </div>
                      <q-checkbox
                        v-model="aoiSortAscending"
                        checked-icon="arrow_upward"
                        unchecked-icon="arrow_downward"
                        dense size="lg"
                      />
                    </div>

                    <div class="row q-gutter-x-sm items-center" style="margin-top: -8px">
                      <div class="text-grey">
                        Filter by
                      </div>
                      <q-select borderless dense options-dense v-model="aoiFilterBy" :options="AOI_FILTER_OPTIONS"/>
                      <template v-if="aoiFilterSelectionOptions.length != 0">
                        <div class="text-grey">
                          options
                        </div>
                        <q-select
                          borderless dense options-dense multiple
                          v-model="aoiFilterSelections"
                          :options="aoiFilterSelectionOptions"
                        >
                          <template v-slot:option="{ itemProps, itemEvents, opt, selected, toggleOption }">
                            <q-item
                              v-bind="itemProps"
                              v-on="itemEvents"
                            >
                              <q-item-section >
                                <q-checkbox :label="opt" :value="selected" @input="toggleOption(opt)" />
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                      </template>
                    </div>

                  </div>
                </q-card>
              </q-expansion-item>

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
                    v-for="priorityAreaSubmission in priorityAreaSubmissionsFilteredSorted"
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
                        <q-icon
                          :name="
                            recordStateDetails(priorityAreaSubmission.recordState).icon
                          "
                        >
                          <q-tooltip>
                            {{
                              recordStateDetails(priorityAreaSubmission.recordState)
                                .label
                            }}
                          </q-tooltip>
                        </q-icon>
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
              :opacity="0.8"
            >
            </l-wms-tile-layer>

            <template v-if="tab === 'survey-plans'">
              <l-geo-json
                v-for="sp in planFeaturesFiltered"
                :key="sp.id"
                :geojson="sp.geojson"
                :options="options"
                :options-style="styleFunction(sp)"
              >
              </l-geo-json>
            </template>

            <template v-if="tab === 'hipp-requests'">
              <l-geo-json
                v-for="sr in requestFeaturesFiltered"
                :key="sr.id"
                :geojson="sr.geojson"
                :options="options"
                :options-style="styleFunction(sr)"
              >
              </l-geo-json>
            </template>

            <template v-if="tab === 'areas-of-interest'">
              <l-geo-json
                v-for="pas in priorityAreaSubmissionFeaturesFiltered"
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

// mapping from a nice displayable name, to the priority area submission
// value that should be filtered or sorted on
const AOI_SORT_OPTIONS = [
  {label: "Submission name", value: "submissionName"},
  {label: "Date created", value: "created"},
  {label: "Date last modified", value: "lastModified"},
  {label: "Record state", value: "recordState.state"},
  {label: "Submitting organisation", value: "submittingOrganisation.name"}
]

const AOI_FILTER_OPTIONS = [
  {label: "No filter", value: null},
  {label: "Record state", value: "recordState.state"},
  {label: "Submitting organisation", value: "submittingOrganisation.name"},
  {label: "Record custodian", value: "custodian.name"}
]

const REQUEST_SORT_OPTIONS = [
  {label: "Request name", value: "name"},
  {label: "Record state date", value: "recordState.created"},
  {label: "Record state", value: "recordState.state"},
  {label: "Requesting organisation", value: "organisation.name"}
]

const REQUEST_FILTER_OPTIONS = [
  {label: "No filter", value: null},
  {label: "Record state", value: "recordState.state"},
  {label: "Requesting organisation", value: "organisation.name"},
  {
    label: "Record custodian",
    value: "custodians[].name",
    valueFunction: (sr) => {
      return sr.custodians.map((c) => c.name);
    }
  }
]

const PLAN_SORT_OPTIONS = [
  {label: "Survey name", value: "surveyName"},
  {label: "Survey status", value: "status"},
  {label: "Survey start date", value: "startDate"},
  {label: "Record state", value: "recordState.state"},
  {label: "Record state date", value: "recordState.created"}
]

const PLAN_FILTER_OPTIONS = [
  {label: "No filter", value: null},
  {label: "Survey status", value: "status"},
  {label: "Record state", value: "recordState.state"},
  {
    label: "Commissioning organisation",
    value: "organisations[].name",
    valueFunction: (sr) => {
      return sr.organisations.map((c) => c.name);
    }
  },
  {
    label: "Record custodian",
    value: "custodians[].name",
    valueFunction: (sr) => {
      return sr.custodians.map((c) => c.name);
    }
  }
]

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
    if (!this.tab) {
      this.tab = "home"
    }

    Promise.all([
      this.fetchSurveyPlans(),
      this.getSurveyRequests(),
      this.getPriorityAreaSubmissions()
    ]).then(() => {
      // the map features fetched are based on the ids returns by the
      // above requests, we must therefore wait for them to return
      // before fetching the map features
      if (this.tab == "home") {
        // do nothing, as there's no geometry shown when on the home tab
      } else {
        this.fetchMapFeatures(this.tab);
      }
    })
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
      return this.getSurveyPlans();
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
      } else if (tabName === "hipp-requests") {
        featureUrlName = "survey-request";
        featureList = this.surveyRequestFeatures;
        entityList = this.surveyRequests;
        nameProp = "name";
      } else if (tabName === "areas-of-interest") {
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
        this.batchGeometryRequests([...entityList], featureUrlName, featureList, nameProp);
      }
    },

    batchGeometryRequests(entityList, featureUrlName, featureList, nameProp) {
      // this function makes requests for geojson features in batches (of 10)
      // the reason for doing so is that the UI becomes unresponsive until
      // all pending responses are returned. By batching the UI has a chance
      // to update in between each request batch. 
      if (entityList.length == 0) {
        return;
      }

      let shiftCount = 0;
      let sr = undefined;
      let promises = []
      while (!_.isNil(sr = entityList.shift()) && shiftCount < 10) {
        shiftCount++;
        let srv = sr;
        let promise = Vue.axios
          .get(`api/${featureUrlName}/${srv.id}/geometry?simplify=true`)
          .then((res) => {
            const geojson = res.data;
            if (!_.isNil(geojson) && geojson.length != 0) {
              geojson.properties = {
                id: srv.id,
                name: _.get(srv, nameProp),
              };
              const existingIndex = featureList.findIndex((esr) => {
                return esr.sr.id === srv.id;
              });
              const nf = {
                geojson: geojson,
                sr: srv,
              };
              if (existingIndex == -1) {
                featureList.push(nf);
              } else {
                this.$set(featureList, existingIndex, nf);
              }
            }
          }).catch(function(error) {
              console.log(error.message);
          });
        promises.push(promise);
      }

      Promise.all(promises).then(() => {
        setTimeout(
          this.batchGeometryRequests(entityList, featureUrlName, featureList, nameProp),
          0
        );
      })
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

    filterSelectionOptions(filterBy, listToFilter) {
      if (_.isNil(filterBy.value) ) {
        return []
      }
      let opts = new Set()
      listToFilter.forEach((itemToFilter) => {
        if (!_.isNil(filterBy.valueFunction)) {
          let values = filterBy.valueFunction(itemToFilter)
          values.forEach(val => opts.add(val))
        } else if (!_.isNil(filterBy.value)) {
          opts.add(_.get(itemToFilter, filterBy.value))
        }
      });
      let sortedOpts = Array.from(opts).sort()
      return sortedOpts
    },

    filteredSortedList(list, filterBy, filterSelections, sortBy, sortAscending) {
      // clone the list so we don't mess with the one in the vuex state store
      let l = [...list];

      // only filter if a filter by property has been selected, and that there's valid options selected
      if (!_.isNil(filterBy.value) && !_.isNil(filterSelections) && filterSelections.length > 0 ) {
        l = l.filter((pas) => {
          if (!_.isNil(filterBy.valueFunction)) {
            let values = filterBy.valueFunction(pas);
            for (const fs of filterSelections) {
              if (values.includes(fs)) {
                return true;
              }
            }
            return false;
          } else if (!_.isNil(filterBy.value)) {
            let val = _.get(pas, filterBy.value);
            return filterSelections.includes(val);
          }
        })
      }

      // sort the list based on sort by selection
      l.sort((a,b) => {
        if (_.isNil(a)) {
          return -1;
        }
        let val_a = undefined;
        let val_b = undefined;
        if (sortBy.value === "submissionName") {
          // special case as many of the records don't have a submission name and
          // instead use the `getPriorityAreaLabel` function to define what is
          // shown as the submission name in the list
          val_a = this.getPriorityAreaLabel(a);
          val_b = this.getPriorityAreaLabel(b);
        } else {
          val_a = _.get(
            a,
            sortBy.value
          );
          val_b = _.get(
            b,
            sortBy.value
          );
        }

        if (typeof val_a === 'string' || typeof val_b === 'string') {
          return val_a.localeCompare(val_b);
        } else if (typeof val_a === 'number' || typeof val_a === 'number') {
          return val_a - val_b;
        } else {
          return val_a - val_b;
        }
      });
      // reverse the sort order based on if the user has selected ascending order or not
      if (!sortAscending) {
        l.reverse();
      }
      return l;
    },

    featuresFiltered(filteredSortedList, featuresList) {
      let filteredIds = new Set();
      filteredSortedList.forEach((pas) => {
        filteredIds.add(pas.id);
      });
      let filteredFeatures = featuresList.filter((pasFeature) => {
        return filteredIds.has(pasFeature.sr.id);
      });
      return filteredFeatures;
    },

  },



  computed: {
    ...mapGetters("surveyPlan", ["surveyPlans"]),
    ...mapGetters("surveyRequest", ["surveyRequests"]),
    ...mapGetters("priorityAreaSubmission", ["priorityAreaSubmissions"]),

    priorityAreaSubmissionsFilteredSorted() {
      return this.filteredSortedList(
        this.priorityAreaSubmissions,
        this.aoiFilterBy,
        this.aoiFilterSelections,
        this.aoiSortBy,
        this.aoiSortAscending
      );
    },

    requestsFilteredSorted() {
      return this.filteredSortedList(
        this.surveyRequests,
        this.requestFilterBy,
        this.requestFilterSelections,
        this.requestSortBy,
        this.requestSortAscending
      )
    },

    plansFilteredSorted() {
      return this.filteredSortedList(
        this.surveyPlans,
        this.planFilterBy,
        this.planFilterSelections,
        this.planSortBy,
        this.planSortAscending
      )
    },

    priorityAreaSubmissionFeaturesFiltered() {
      return this.featuresFiltered(
        this.priorityAreaSubmissionsFilteredSorted,
        this.priorityAreaSubmissionFeatures
      );
    },

    requestFeaturesFiltered() {
      return this.featuresFiltered(
        this.requestsFilteredSorted,
        this.surveyRequestFeatures
      );
    },

    planFeaturesFiltered() {
      return this.featuresFiltered(
        this.plansFilteredSorted,
        this.surveyPlanFeatures
      );
    },

    aoiFilterSelectionOptions() {
      return this.filterSelectionOptions(this.aoiFilterBy, this.priorityAreaSubmissions);
    },

    requestFilterSelectionOptions() {
      return this.filterSelectionOptions(this.requestFilterBy, this.surveyRequests);
    },

    planFilterSelectionOptions() {
      return this.filterSelectionOptions(this.planFilterBy, this.surveyPlans);
    },

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

    // tab state is persisted by the t parameter in the query string
    tab: {
      get() {
        return this.$route.query.t;
      },
      set(newValue) {
        this.$router.push({ ...this.$router.currentRoute, query: { t: newValue } })
      }
    }
  },

  data() {
    return {
      activeId: undefined,
      lastSelectedFeatureIds: [],
      zoom: 4,
      mapLegendUrl: `map/wms?SERVICE=WMS&REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&HEIGHT=25&LAYER=areas_of_interest&LAYERS=areas_of_interest&LEGEND_OPTIONS=forceLabels:on;minSymbolSize&SLD_VERSION=1.1.0&TRANSPARENT=true`,
      center: defaultCenter,
      bounds: defaultBounds,
      showPriorityAreas: true,
      surveyPlanFeatures: [],
      surveyRequestFeatures: [],
      priorityAreaSubmissionFeatures: [],

      aoiSortBy: AOI_SORT_OPTIONS.find((o) => o.value == "lastModified"),
      aoiSortAscending: false,
      AOI_SORT_OPTIONS,
      aoiFilterBy: AOI_FILTER_OPTIONS[0],
      aoiFilterSelections: null,
      AOI_FILTER_OPTIONS,

      requestSortBy: REQUEST_SORT_OPTIONS.find((o) => o.value == "recordState.created"),
      requestSortAscending: false,
      REQUEST_SORT_OPTIONS,
      requestFilterBy: REQUEST_FILTER_OPTIONS[0],
      requestFilterSelections: null,
      REQUEST_FILTER_OPTIONS,

      planSortBy: PLAN_SORT_OPTIONS.find((o) => o.value == "recordState.created"),
      planSortAscending: false,
      PLAN_SORT_OPTIONS,
      planFilterBy: PLAN_FILTER_OPTIONS[0],
      planFilterSelections: null,
      PLAN_FILTER_OPTIONS,
    };
  },

  watch: {
    tab: {
      handler(newTab, oldTab) {
        this.fetchMapFeatures(newTab);
      },
    },

    aoiFilterBy: {
      handler(n, o) {
        // we need to clear out the list of selected filter options
        // as these options change when the filter by prop is
        // changed by the user
        this.aoiFilterSelections = null;
      }
    },
    requestFilterBy: {
      handler(n, o) {
        this.requestFilterSelections = null;
      }
    },
    planFilterBy: {
      handler(n, o) {
        this.planFilterSelections = null;
      }
    }

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
