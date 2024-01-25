<template>
  <q-card flat bordered class="full-width">
    <q-card-section>
      <div class="main-page-sub-title">{{ priorityArea.name }}</div>
    </q-card-section>
    <q-card-section class="row q-gutter-md">
      <div class="column justify-between" style="max-width: 250px">
        <div>
          <q-img
            class="rounded-borders"
            style="width: 250px; max-height: 250px"
            :src="`api/priority-area/${priorityArea.id}/thumbnail`"
            :ratio="1"
            contain
          />
          <div class="column q-pt-xs q-gutter-xs">
            <q-badge color="secondary" text-color="white">
              Registration details
            </q-badge>
            <div class="column q-pl-sm reg-details-text">
              <div><b>Identified area name:</b> {{ priorityArea.name }}</div>
              <div>
                <b>Seacountry name:</b> {{ priorityArea.seacountryName }}
              </div>
              <div>
                <b>Ecological area:</b> {{ priorityArea.ecologicalAreaName }}
              </div>
            </div>
          </div>
        </div>
        <div class="column q-pt-xs q-gutter-xs q-pt-md">
          <sct-btn
            v-if="!readonly && count > 1"
            label="Apply to Next"
            @click="applyToNextClicked"
          />
          <sct-btn
            v-if="!readonly && count > 1"
            label="Apply to All"
            icon="format_line_spacing"
            @click="applyToAllClicked"
          />
        </div>
      </div>

      <q-list
        bordered
        separator
        class="col rounded-borders"
        ref="expansionItemList"
      >
        <q-expansion-item
          expand-separator
          label="Purpose *"
          icon="flag"
          :header-style="{
            color: getSectionValidation(['purposes']) ? '#000000' : '#ff0000',
          }"
        >
          <q-card>
            <q-card-section v-if="!getSectionValidation(['purposes'])">
              <div style="color: #ff0000">
                Please select at least one purpose.
              </div>
            </q-card-section>
            <q-card-section class="column q-gutter-y-xs">
              <div>
                Please select all that apply to your Area of Interest.
              </div>
              <q-tree
                ref="purposeTree"
                :nodes="PURPOSE_DATA"
                node-key="key"
                tick-strategy="strict"
                :ticked.sync="purposesTicked"
                :expanded.sync="purposesExpanded"
                :no-transition="true"
              >
                <template v-slot:default-header="prop">
                  <div class="row justify-between full-width">
                    <div>{{ prop.node.label }}</div>
                    <div class="q-gutter-sm" v-if="prop.node.flags">
                      <q-radio
                        v-for="flag in prop.node.flags"
                        :value="getPurposeFlag(prop.node.key)"
                        @input="setPurposeFlag(prop.node.key, $event)"
                        :val="flag"
                        :label="flag"
                        :key="'flag-' + flag"
                        dense
                        size="sm"
                        :disable="readonly"
                      />
                    </div>
                  </div>
                </template>
                <template v-slot:default-body="prop">
                  <div
                    class="text-weight-light text-black"
                    v-if="prop.node.children"
                    style="padding-left: 52px"
                  >
                    Additional details are optional
                  </div>
                </template>
              </q-tree>

              <div class="col">
                <div>Values</div>
                <div
                  v-if="purposesTicked.length == 0"
                  class="row justify-center"
                >
                  <div class="text-light">
                    Select one or more purposes to view associated values.
                  </div>
                </div>
                <q-list v-else dense>
                  <template v-for="purposeGroup of purposeValues">
                    <q-item-label
                      v-if="purposeGroup.values.length != 0"
                      header
                      :key="purposeGroup.label + '-header'"
                      style="padding-bottom: 0px"
                    >
                      {{ purposeGroup.label }}
                    </q-item-label>
                    <q-item
                      v-for="value in purposeGroup.values"
                      :key="purposeGroup.label + '-' + value"
                      tag="label"
                      v-ripple
                    >
                      <q-item-section avatar>
                        <q-checkbox
                          size="sm"
                          :value="priorityArea.purposeValues"
                          :val="value"
                          @input="valueChanged('purposeValues', $event)"
                          :disable="readonly"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ value }} </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-list>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          label="Ecosystem Description *"
          icon="grass"
          :header-style="{
            color: getSectionValidation(['ecosystems'])
              ? '#000000'
              : '#ff0000',
          }"
        >
          <q-card>
            <q-card-section v-if="!getSectionValidation(['ecosystems'])">
              <div style="color: #ff0000">
                Please select at least one ecosystem.
              </div>
            </q-card-section>
            <q-card-section class="column q-gutter-y-xs">
              <div>
                Which part(s) of the ecosystem should be targeted for mapping
                in the submitted AOI?
              </div>
              <q-tree
                :nodes="ECOSYSTEM_DATA"
                node-key="key"
                :ticked.sync="ecosystemsTicked"
                :expanded.sync="ecosystemsExpanded"
                :no-transition="true"
              >
                <template v-slot:default-body="prop">
                  <div
                    v-if="prop.node.description"
                    class="text-weight-light text-black"
                  >
                    {{ prop.node.description }}
                  </div>
                </template>
              </q-tree>

              <div class="q-pt-md">Ecosystem components</div>
              <q-list dense>
                <q-item
                  v-for="ecosystemComp of ECOSYSTEM_COMPONENT_DATA"
                  :key="'key-' + ecosystemComp"
                  tag="label"
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-checkbox
                      size="sm"
                      :value="priorityArea.ecosystemComponents"
                      :val="ecosystemComp"
                      @input="valueChanged('ecosystemComponents', $event)"
                      :disable="readonly"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ ecosystemComp }} </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          label="Data and Methods *"
          icon="scatter_plot"
          :header-style="{
            color: getSectionValidation([
              'dataToCapture',
              'dataCaptureMethods',
            ])
              ? '#000000'
              : '#ff0000',
          }"
        >
          <q-card>
            <q-card-section
              v-if="
                !getSectionValidation(['dataToCapture', 'dataCaptureMethods'])
              "
            >
              <div style="color: #ff0000">
                Please select at least one data type to capture and preferred
                method.
              </div>
            </q-card-section>
            <q-card-section class="row q-gutter-x-xs">
              <div class="col">
                <div>Data to Capture</div>
                <q-list dense>
                  <q-item
                    v-for="opt in DATA_OPTIONS"
                    :key="opt"
                    tag="label"
                    v-ripple
                  >
                    <q-item-section avatar>
                      <q-checkbox
                        size="sm"
                        :value="priorityArea.dataToCapture"
                        :val="opt"
                        @input="valueChanged('dataToCapture', $event)"
                        :disable="readonly"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ opt }} </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div class="col">
                <div>Preferred Method(s)</div>
                <q-list dense>
                  <template v-for="methodGroup of DATA_AND_METHOD_OPTIONS">
                    <q-item-label
                      header
                      :key="methodGroup.groupName + '-header'"
                      style="padding-bottom: 0px"
                    >
                      {{ methodGroup.groupName }}
                    </q-item-label>
                    <q-item
                      v-for="method in methodGroup.methods"
                      :key="method.name"
                      tag="label"
                      v-ripple
                    >
                      <q-item-section avatar>
                        <q-checkbox
                          size="sm"
                          :value="priorityArea.dataCaptureMethods"
                          :val="method.name"
                          @input="valueChanged('dataCaptureMethods', $event)"
                          :disable="
                            readonly || dataCaptureMethodDisabled(method.name)
                          "
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ method.name }} </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-list>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          label="Existing Data Assessment *"
          icon="fact_check"
          :header-style="{
            color: getSectionValidation([
              'existingDataSources',
              'reasonForAoiRaise',
            ])
              ? '#000000'
              : '#ff0000',
          }"
        >
          <q-card>
            <q-card-section
              v-if="
                !getSectionValidation(['existingDataSources', 'reasonForAoiRaise'])
              "
            >
              <div style="color: #ff0000">
                Please check which existing data sources have been considered, and select
                a reason for why this Area of Intereset submission is being raised.
              </div>
            </q-card-section>
            <q-card-section class="q-gutter-y-xs">
              <div>
                Please select all existing data sources you have considered,
                and brief note on why this area of interest is not being
                serviced to meet your needs. *
              </div>
              <q-list dense>
                <q-item
                  v-for="opt in EXISTING_DATA_SOURCE_OPTIONS"
                  :key="opt.name"
                  tag="label"
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-checkbox
                      :value="priorityArea.existingDataSources"
                      :val="opt.name"
                      @input="valueChanged('existingDataSources', $event)"
                      :disable="readonly"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ opt.name }} </q-item-label>
                    <q-item-label caption>{{ opt.datatypes }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{ opt.url }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <div>Reason for Area of Interest to be raised. *</div>
              <q-option-group
                dense
                class="q-pl-md"
                :options="REASON_FOR_AOI_RAISE_OPTIONS"
                type="radio"
                :value="priorityArea.reasonForAoiRaise"
                @input="valueChanged('reasonForAoiRaise', $event)"
                :disable="readonly"
              />

              <form-field-validated-input
                :name="`priorityAreaSubmission.priorityAreas.$each.${index}.existingDataAssessmentComments`"
                attribute="Further Comments"
                label="Further Comments"
                :value="priorityArea.existingDataAssessmentComments"
                @input="
                  valueChanged('existingDataAssessmentComments', $event)
                "
                @blur="
                  `$v.priorityArea.priorityAreas.$each.${index}.existingDataAssessmentComments.$touch`
                "
                type="textarea"
                autogrow
                :readonly="readonly"
                outlined
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          label="Resolution and Standard *"
          icon="grid_on"
          :header-style="{
            color: getSectionValidation(['gridSize']) ? '#000000' : '#ff0000',
          }"
        >
          <q-card>
            <q-card-section class="row q-gutter-x-xs">
              <form-field-validated-option-group
                class="col"
                :value="priorityArea.gridSize"
                @input="valueChanged('gridSize', $event)"
                :options="GRID_SIZE_OPTIONS"
                :name="`priorityAreaSubmission.priorityAreas.$each.${index}.gridSize`"
                label="Grid Size"
                @blur="`$v.priorityArea.priorityAreas.$each.${index}.gridSize.$touch`"
                :readonly="readonly"
              >
              </form-field-validated-option-group>

              <div class="column col">
                <form-field-validated-option-group
                  v-if="priorityArea.dataToCapture.includes('Bathymetry')"
                  :value="priorityArea.surveyStandard"
                  @input="valueChanged('surveyStandard', $event)"
                  :options="SURVEY_STANDARD_OPTIONS"
                  :name="`priorityAreaSubmission.priorityAreas.$each.${index}.surveyStandard`"
                  label="Bathymetry Survey Standard"
                  @blur="`$v.priorityArea.priorityAreas.$each.${index}.surveyStandard.$touch`"
                  :readonly="readonly"
                >
                </form-field-validated-option-group>
                <div
                  v-if="priorityArea.dataToCapture.includes('Bathymetry')"
                  class="column q-pa-sm"
                >
                  <div>{{ priorityArea.surveyStandard }}</div>
                  <div
                    class="text-weight-light"
                    v-if="surveyStandardDescription"
                  >
                    {{ surveyStandardDescription }}
                  </div>
                  <div v-else class="text-weight-light">No description</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          label="Data Collection Timeline and Cadence *"
          icon="schedule"
          :header-style="{
            color: getSectionValidation([
              'preferredTimeframe',
              'collectionCadence',
            ])
              ? '#000000'
              : '#ff0000',
          }"
        >
          <q-card>
            <q-card-section class="q-gutter-y-xs">
              <form-field-validated-button-toggle
                inline
                :name="`priorityAreaSubmission.priorityAreas.$each.${index}.preferredTimeframe`"
                label="Preferred Timeframe *"
                :value="priorityArea.preferredTimeframe"
                @input="valueChanged('preferredTimeframe', $event)"
                :options="PREFERRED_TIMEFRAME_OPTIONS"
                @blur="`$v.priorityArea.priorityAreas.$each.${index}.preferredTimeframe.$touch`"
                :readonly="readonly"
              />
              <form-field-validated-input
                :name="`priorityAreaSubmission.priorityAreas.$each.${index}.timeframeReason`"
                attribute="Reason for timeframe"
                label="Reason for timeframe"
                :value="priorityArea.timeframeReason"
                @input="valueChanged('timeframeReason', $event)"
                @blur="`$v.priorityArea.priorityAreas.$each.${index}.timeframeReason.$touch`"
                type="textarea"
                autogrow
                :readonly="readonly"
                outlined
              >
              </form-field-validated-input>
              <form-field-validated-button-toggle
                inline
                :name="`priorityAreaSubmission.priorityAreas.$each.${index}.preferredSeason`"
                label="Preferred Season"
                :value="priorityArea.preferredSeason"
                @input="valueChanged('preferredSeason', $event)"
                :options="PREFERRED_SEASON_OPTIONS"
                @blur="`$v.priorityArea.priorityAreas.$each.${index}.preferredSeason.$touch`"
                :readonly="readonly"
              />
              <form-field-validated-button-toggle
                inline
                :name="`priorityAreaSubmission.priorityAreas.$each.${index}.collectionCadence`"
                label="Intended Cadence for Collection *"
                :value="priorityArea.collectionCadence"
                @input="valueChanged('collectionCadence', $event)"
                :options="COLLECTION_CADENCE_OPTIONS"
                @blur="`$v.priorityArea.priorityAreas.$each.${index}.collectionCadence.$touch`"
                :readonly="readonly"
              />
              <form-field-validated-input
                v-if="
                  priorityArea.collectionCadence == 'Time Series Desired' ||
                  priorityArea.collectionCadence ==
                    'Time Series Established'
                "
                :name="`priorityAreaSubmission.priorityAreas.$each.${index}.timeSeriesDescription`"
                attribute="Time Series Description"
                label="Time Series Description"
                :value="priorityArea.timeSeriesDescription"
                @input="valueChanged('timeSeriesDescription', $event)"
                @blur="`$v.priorityArea.priorityAreas.$each.${index}.timeSeriesDescription.$touch`"
                type="textarea"
                autogrow
                :readonly="readonly"
                outlined
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          label="Perceived Impact and Organisational Priority *"
          icon="hardware"
          :header-style="{
            color: getSectionValidation([
              'perceivedImpact',
              'organisationalPriority',
            ])
              ? '#000000'
              : '#ff0000',
          }"
        >
          <q-card>
            <q-card-section class="q-gutter-y-xs">
              <form-field-validated-button-toggle
                inline
                :name="`priorityAreaSubmission.priorityAreas.$each.${index}.perceivedImpact`"
                label="Perceived Impact"
                :value="priorityArea.perceivedImpact"
                @input="valueChanged('perceivedImpact', $event)"
                :options="PERCEIVED_IMPACT_OPTIONS"
                @blur="`$v.priorityArea.priorityAreas.$each.${index}.perceivedImpact.$touch`"
                :readonly="readonly"
              />
              <form-field-validated-button-toggle
                inline
                :name="`priorityAreaSubmission.priorityAreas.$each.${index}.organisationalPriority`"
                label="Organisational Priority *"
                :value="priorityArea.organisationalPriority"
                @input="valueChanged('organisationalPriority', $event)"
                :options="ORGANISATIONAL_PRIORITY_OPTIONS"
                @blur="`$v.priorityArea.priorityAreas.$each.${index}.organisationalPriority.$touch`"
                :readonly="readonly"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item expand-separator label="Pressures" icon="water">
          <q-card>
            <q-card-section class="column q-gutter-y-xs">
              <div>
                Please select the appropriate profile within the MERI
                framework to identify the focus areas of proposed data
                acquisition.
              </div>
              <q-tree
                :nodes="ACTIVITIES"
                node-key="key"
                :ticked.sync="pressuresTicked"
                :expanded.sync="pressuresExpanded"
                :no-transition="true"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </q-card-section>
  </q-card>

</template>

<script>
import Vue from "vue";
const _ = require("lodash");
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { required, minLength } from "vuelidate/lib/validators";

import { errorHandler } from "./../mixins/error-handling";
import { permission } from "./../mixins/permission";

import * as pasMutTypes from "../../store/modules/priority-area-submission/priority-area-submission-mutation-types";

import * as constants from "./area-of-interest-constants";

// list of attributes that have the value copied to other areas of interest
// when the 'apply to all' button is clicked
const APPLY_TO_ATTRS = [
  "purposes",
  "purposeValues",
  "purposeFlags",
  "ecosystems",
  "ecosystemComponents",
  "dataToCapture",
  "dataCaptureMethods",
  "existingDataSources",
  "reasonForAoiRaise",
  "existingDataAssessmentComments",
  "gridSize",
  "surveyStandard",
  "preferredTimeframe",
  "timeframeReason",
  "preferredSeason",
  "collectionCadence",
  "timeSeriesDescription",
  "perceivedImpact",
  "organisationalPriority",
  "pressures",
];

export default Vue.extend({
  mixins: [errorHandler, permission],

  mounted() {
    this.setDefaults();
  },

  created() {
    this.PREFERRED_TIMEFRAME_OPTIONS = constants.PREFERRED_TIMEFRAME_OPTIONS;
    this.PREFERRED_SEASON_OPTIONS = constants.PREFERRED_SEASON_OPTIONS;
    this.COLLECTION_CADENCE_OPTIONS = constants.COLLECTION_CADENCE_OPTIONS;

    this.PERCEIVED_IMPACT_OPTIONS = constants.PERCEIVED_IMPACT_OPTIONS;
    this.ORGANISATIONAL_PRIORITY_OPTIONS =
      constants.ORGANISATIONAL_PRIORITY_OPTIONS;

    this.EXISTING_DATA_SOURCE_OPTIONS = constants.EXISTING_DATA_SOURCE_OPTIONS;
    this.REASON_FOR_AOI_RAISE_OPTIONS = constants.REASON_FOR_AOI_RAISE_OPTIONS;

    this.GRID_SIZE_OPTIONS = constants.GRID_SIZE_OPTIONS.map((o) => {
      return o.label;
    });
    this.SURVEY_STANDARD_OPTIONS = constants.SURVEY_STANDARD_OPTIONS.map(
      (o) => {
        return o.label;
      }
    );

    this.DATA_AND_METHOD_OPTIONS = constants.DATA_AND_METHOD_OPTIONS;

    // get a simple sorted list of the data types to make showing this
    // in a checklist much easier
    let optionsSet = new Set();
    for (const methodGroup of this.DATA_AND_METHOD_OPTIONS) {
      for (const method of methodGroup.methods) {
        if (method.data.length != 0) {
          method.data.forEach((d) => {
            optionsSet.add(d);
          });
        }
      }
    }
    this.DATA_OPTIONS = Array.from(optionsSet).sort();

    this.ECOSYSTEM_COMPONENT_DATA = constants.ECOSYSTEM_COMPONENT_DATA;
  },

  props: [
    'priorityArea',
    'index',
    'count',
    'readonly',
    'validator'
  ],

  methods: {
    ...mapMutations("priorityAreaSubmission", {
      setDirty: pasMutTypes.SET_DIRTY,
    }),

    valueChanged(propertyName, value) {
      this.$emit("aoi-value-changed", {
        aoi: this.priorityArea,
        propertyName: propertyName,
        value: value,
      });
    },

    applyTo(limit) {
      for (const attrName of APPLY_TO_ATTRS) {
        if (limit) {
          this.$emit("aoi-apply-to-all", {
            propertyName: attrName,
            value: this.priorityArea[attrName],
            id: this.priorityArea.id,
            limit: limit,
          });
        } else {
          this.$emit("aoi-apply-to-all", {
            propertyName: attrName,
            value: this.priorityArea[attrName],
          });
        }
      }
    },

    applyToAllClicked() {
      this.applyTo(undefined);
    },

    applyToNextClicked() {
      this.applyTo(1);
    },

    getPurposeFlag(purposeFlagKey) {
      let flagKey = purposeFlagKey + ":";
      let flag = this.priorityArea.purposeFlags.find((f) =>
        f.startsWith(flagKey)
      );
      if (flag) {
        let f = flag.substring(flagKey.length, flag.length);
        return f;
      } else {
        return undefined;
      }
    },

    setPurposeFlag(purposeFlagKey, flag) {
      let flagKey = purposeFlagKey + ":";
      let updatedPurposeFlags = this.priorityArea.purposeFlags.filter((f) => {
        return !f.startsWith(flagKey);
      });
      updatedPurposeFlags.push(flagKey + flag);
      this.valueChanged("purposeFlags", updatedPurposeFlags);

      // if the user selects a radio button option of a node that hasn't
      // been ticked, then tick it automaticaly
      if (!this.priorityArea.purposes.includes(purposeFlagKey)) {
        this.valueChanged("purposes", [
          ...this.priorityArea.purposes,
          purposeFlagKey,
        ]);
      }
    },

    setDefaults() {
      if (this.priorityArea.perceivedImpact == undefined) {
        this.valueChanged("perceivedImpact", this.PERCEIVED_IMPACT_OPTIONS[0]);
      }

      this.ACTIVITIES = constants.ACTIVITIES;
      this.addKeys(undefined, this.ACTIVITIES);
      this.addTickStrategy(this.ACTIVITIES);
      this.setActivitiesDisabled(this.readonly, this.ACTIVITIES);
      this.pressuresExpanded = this.getDefaultExpansion(this.pressuresTicked);

      this.PURPOSE_DATA = constants.PURPOSE_DATA;
      this.addKeys(undefined, this.PURPOSE_DATA);
      this.setActivitiesDisabled(this.readonly, this.PURPOSE_DATA);
      this.purposesExpanded = this.getDefaultExpansion(this.purposesTicked);

      this.purposesTicked = this.purposesTicked.filter((pKey) => {
        let p = this.findPurpose(pKey, this.PURPOSE_DATA);
        return !_.isNil(p);
      });

      this.ECOSYSTEM_DATA = constants.ECOSYSTEM_DATA;
      this.addKeys(undefined, this.ECOSYSTEM_DATA);
      this.addTickStrategy(this.ECOSYSTEM_DATA);
      this.setActivitiesDisabled(this.readonly, this.ECOSYSTEM_DATA);
      this.ecosystemsExpanded = this.getDefaultExpansion(this.ecosystemsTicked);

      this.setDirty(false);
    },

    setExpanded(expanded) {
      // expands or contracts all expansion controls
      for (const expansionItem of this.$refs.expansionItemList.$children) {
        if (expanded) {
          expansionItem.show();
        } else {
          expansionItem.hide();
        }
      }
    },

    addKeys(parentKey, items) {
      // Each node in the tree needs a unique key, this is the value
      // that ultimately gets saved to the database to maintain selections
      // some leaf nodes use the same label, so we generate keys that
      // include the complete path to the leaf (instead of just the leaf
      // node label)
      for (const item of items) {
        item.key = parentKey ? parentKey + "-" + item.label : item.label;
        if (item.children) {
          this.addKeys(item.key, item.children);
        }
      }
    },

    addExpandedKeys(key, expandedKeys) {
      expandedKeys.add(key);
      const lastSeparator = key.lastIndexOf("-");
      if (lastSeparator != -1) {
        const parentKey = key.substring(0, lastSeparator);
        this.addExpandedKeys(parentKey, expandedKeys);
      }
    },

    getDefaultExpansion(tickedKeys) {
      // By default tree nodes that have selected nodes under them should
      // be expanded. This makes it much easier for a user to see what was
      // previously selected.
      let expandedKeys = new Set();
      for (const tickedKey of tickedKeys) {
        this.addExpandedKeys(tickedKey, expandedKeys);
      }
      return Array.from(expandedKeys);
    },

    addTickStrategy(items) {
      // Users should only be able to tick leaf nodes of tree components.
      // This sets the tick strategy to ensure only leaf nodes can be
      // selected.
      for (const item of items) {
        if (item.children) {
          item.tickStrategy = "none";
          this.addTickStrategy(item.children);
        } else {
          item.tickStrategy = "strict";
        }
      }
    },

    dataCaptureMethodDisabled(dataCaptureMethod) {
      // data capture methods are disabled if there is no data collection
      // type selected that requires this collection type.
      for (const methodGroup of this.DATA_AND_METHOD_OPTIONS) {
        for (const method of methodGroup.methods) {
          if (method.name == dataCaptureMethod) {
            let commonData = _.intersectionWith(
              this.priorityArea.dataToCapture,
              method.data,
              (a, b) => a == b
            );
            return commonData.length == 0;
          }
        }
      }
    },

    purposeGroupSelected(purposeGroup) {
      for (const tickedPurpose of this.purposesTicked) {
        if (tickedPurpose.startsWith(purposeGroup)) {
          return true;
        }
      }
      return false;
    },

    setActivitiesDisabled(disabled, items) {
      for (const item of items) {
        item.tickable = !disabled;
        if (item.children) {
          this.setActivitiesDisabled(disabled, item.children);
        }
      }
    },

    getSectionValidation(attributes) {
      let paVal = this.$v.priorityAreaSubmission.priorityAreas.$each[this.index];
      for (const attribute of attributes) {
        if (_.isNil(paVal[attribute])) {
          // then skip
        } else if (paVal[attribute].$error) {
          return false;
        }
      }
      return true;
    },

    findPurpose(purposeKey, purposeChildren) {
      // recursive method to find and return a purpose
      let found = undefined;
      for (const purpose of purposeChildren) {
        if (purpose.key == purposeKey) {
          return purpose;
        } else {
          if (purpose.children) {
            found = this.findPurpose(purposeKey, purpose.children);
          }
        }
        if (found) {
          return found;
        }
      }
      return found;
    },

    removeChildPurposes(purposeSet, childrenToRemove) {
      // recursive method to remove all child keys from the purposeSet
      for (const child of childrenToRemove) {
        purposeSet.delete(child.key);
        if (child.children) {
          this.removeChildPurposes(purposeSet, child.children);
        }
      }
    },

    splitPurposeKey(tokens, purposeKey, purposes) {
      // The keys used in the purpose tree view are made up of the purpose labels
      // of the full path to that tree node concatenated with '-' characters. This
      // is how the selection is stored in the database. The simple solution to get
      // the tokens from the key is to split by the '-' character, however some of
      // the purpose labels include this '-' character. This function gets around
      // this problem by only splitting on available labels (so '-' characters) in
      // labels are ok.
      for (const purpose of purposes) {
        if (purposeKey.startsWith(purpose.label + '-')) {
          tokens.push(purpose.label);
          let remainingKey = purposeKey.substring((purpose.label + '-').length)
          this.splitPurposeKey(tokens, remainingKey, purpose.children);
        } else if (purposeKey.startsWith(purpose.label)) {
          tokens.push(purpose.label);
        }
      }
    },

    updatePurposes(newPurposes, addedSet, removedSet) {
      // The quasar tree view component doesn't support the check mode that we
      // need, so the following code updates the list of selected purposes to match
      // the way we need the selection to work.
      // - If a leaf node is selected all parent nodes should be selected
      // - If a parent node is deselected all child nodes should be deselected
      let adjustedPurposes = new Set(newPurposes);

      // we need to select all parent nodes of new selections
      for (const addedPurpose of addedSet) {
        let addedTokens = [];
        this.splitPurposeKey(addedTokens, addedPurpose, this.PURPOSE_DATA);
        let tokenBasedKey = addedTokens[0];
        for (const token of addedTokens.slice(1)) {
          adjustedPurposes.add(tokenBasedKey);
          tokenBasedKey = tokenBasedKey + '-' + token
        }
      }

      // we need to remove all child nodes of deselected nodes
      for (const removedPurpose of removedSet) {
        let p = this.findPurpose(removedPurpose, this.PURPOSE_DATA);
        if (p.children) {
          this.removeChildPurposes(adjustedPurposes, p.children);
        }
      }

      return Array.from(adjustedPurposes);
    },
  },

  watch: {
    "priorityArea.dataToCapture": function (newVal, oldVal) {
      // deselect any data capture methods that should not be selected based
      // on what dataToCapture types has been selected.
      var toRemove = [];
      for (const methodGroup of this.DATA_AND_METHOD_OPTIONS) {
        for (const method of methodGroup.methods) {
          if (
            this.priorityArea.dataCaptureMethods.includes(method.name) &&
            this.dataCaptureMethodDisabled(method.name)
          ) {
            toRemove.push(method.name);
          }
        }
      }

      let cleanedList = this.priorityArea.dataCaptureMethods.filter((i) => {
        return !toRemove.includes(i);
      });

      // calling `this.valueChanged()` will set the dirty state to true
      // so we need to check to make sure we aren't setting the dataCaptureMethods
      // to what it is already set to (this happens immediately after a save).
      // Issue was that the dirty state would alway be set to true without this.
      let sharedWithExistingSelection = _.intersectionWith(
        cleanedList,
        this.priorityArea.dataCaptureMethods,
        (a, b) => a == b
      );

      if (
        sharedWithExistingSelection.length !=
        this.priorityArea.dataCaptureMethods.length
      ) {
        this.valueChanged("dataCaptureMethods", cleanedList);
      }
    },

    "priorityArea.surveyStandard": {
      immediate: true,
      handler(newVal, oldVal) {
        let surveyStandardDetails = constants.SURVEY_STANDARD_OPTIONS.find(
          (ss) => {
            return ss.label == newVal;
          }
        );
        if (surveyStandardDetails) {
          this.surveyStandardDescription = surveyStandardDetails.description;
        }
      },
    },

    readonly: {
      immediate: true,
      handler(newVal, oldVal) {
        this.setActivitiesDisabled(newVal, this.ACTIVITIES);
        this.setActivitiesDisabled(newVal, this.PURPOSE_DATA);
        this.setActivitiesDisabled(newVal, this.ECOSYSTEM_DATA);
      },
    },
  },

  computed: {
    pressuresTicked: {
      get: function () {
        return this.priorityArea.pressures;
      },
      set: function (value) {
        this.valueChanged("pressures", value);
      },
    },
    ecosystemsTicked: {
      get: function () {
        return this.priorityArea.ecosystems;
      },
      set: function (value) {
        this.valueChanged("ecosystems", value);
      },
    },
    purposesTicked: {
      get: function () {
        return this.priorityArea.purposes;
      },
      set: function (value) {
        let oldPurposes = this.$refs.purposeTree.getTickedNodes()
        .filter((node) => !_.isNil(node))
        .map((node) => {
          return node.key;
        });
        let oldSet = new Set(oldPurposes);
        let newSet = new Set(value);
        // use set theory to figure out what has been selected vs unselected
        let addedSet = newSet.difference(oldSet);
        let removedSet = oldSet.difference(newSet);

        value = this.updatePurposes(value, addedSet, removedSet);
        this.valueChanged("purposes", value);

        // update what nodes are expanded based on the tick selection
        addedSet.forEach((tickedKey) => {
          this.purposesExpanded.push(tickedKey);
        });

        // collapse nodes that have been unselected
        removedSet.forEach((untickedKey) => {
          this.purposesExpanded = this.purposesExpanded.filter((nodeKey) => {
            return nodeKey != untickedKey;
          })
        });

        // if a purpose has been unticked, then automatically deselect any
        // associate flag that has been selected.
        let updatedPurposeFlags = this.priorityArea.purposeFlags.filter(
          (f) => {
            let found = false;
            for (const aPurpose of value) {
              if (f.startsWith(aPurpose)) {
                found = true;
              }
            }
            return found;
          }
        );
        this.valueChanged("purposeFlags", updatedPurposeFlags);

        let updatedPurposeValues = this.priorityArea.purposeValues.filter(
          (pv) => {
            let pvGroup = this.PURPOSE_DATA.find((p) => {
              return p.values.includes(pv);
            });
            if (pvGroup) {
              return this.purposeGroupSelected(pvGroup.label);
            }
          }
        );
        this.valueChanged("purposeValues", updatedPurposeValues);
      },
    },
    purposeValues: {
      get: function () {
        return this.PURPOSE_DATA.filter((p) =>
          this.purposeGroupSelected(p.label)
        );
      },
    },

    $v () {
      return this.validator;
    },
  },

  data() {
    return {
      ticked: [],
      ACTIVITIES: [],
      PURPOSE_DATA: [],
      ECOSYSTEM_DATA: [],
      surveyStandardDescription: "",
      purposesExpanded: [],
      pressuresExpanded: [],
      ecosystemsExpanded: [],
    };
  },
});
</script>


<style scoped lang="stylus">
.reg-details-text {
  div, b {
    font-size: 0.9em;
  }
}

.section-validation-fail {
  backgroundColor: '#ff0000';
}

.q-tree {
  &::v-deep {
    .q-tree__node-body {
      padding: 0px;
    }
  }
}

</style>
