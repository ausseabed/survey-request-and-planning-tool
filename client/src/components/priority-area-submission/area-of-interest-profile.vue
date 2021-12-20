<template>
  <form-wrapper :validator="$v">
    <q-card flat bordered class="full-width">
      <q-card-section>
        <div class="main-page-sub-title">{{ areaOfInterest.name }}</div>
      </q-card-section>
      <q-card-section class="row q-gutter-md">
        <div class="column" style="max-width: 250px">
          <q-img
            class="rounded-borders"
            :src="`api/priority-area/${areaOfInterest.id}/thumbnail`"
            :ratio="1"
            contain
          />
          <div class="column q-pt-xs q-gutter-xs">
            <q-badge color="secondary" text-color="white">
              Registration details
            </q-badge>
            <div class="column q-pl-sm reg-details-text">
              <div><b>Identified area name:</b> {{ areaOfInterest.name }}</div>
              <div>
                <b>Seacountry name:</b> {{ areaOfInterest.seacountryName }}
              </div>
              <div>
                <b>Ecological area:</b> {{ areaOfInterest.ecologicalAreaName }}
              </div>
            </div>
          </div>
        </div>

        <q-list
          bordered
          separator
          class="col rounded-borders"
          ref="expansionItemList"
        >
          <q-expansion-item expand-separator label="Purpose" icon="flag">
            <q-card>
              <q-card-section class="column q-gutter-y-xs">
                <div>
                  Please select all that apply to your Area of Interest.
                </div>
                <q-tree
                  :nodes="PURPOSE_DATA"
                  node-key="key"
                  :ticked.sync="purposesTicked"
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
                            :value="areaOfInterest.purposeValues"
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
            label="Ecosystem description"
            icon="grass"
          >
            <q-card>
              <q-card-section class="column q-gutter-y-xs">
                <div>
                  Which part(s) of the ecosystem should be targeted for mapping
                  in the submitted AOI?
                </div>
                <q-tree
                  :nodes="ECOSYSTEM_DATA"
                  node-key="key"
                  :ticked.sync="ecosystemsTicked"
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
                        :value="areaOfInterest.ecosystemComponents"
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
            label="Data and Methods"
            icon="scatter_plot"
          >
            <q-card>
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
                          :value="areaOfInterest.dataToCapture"
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
                            :value="areaOfInterest.dataCaptureMethods"
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
            label="Existing Data Assessment"
            icon="fact_check"
          >
            <q-card>
              <q-card-section class="q-gutter-y-xs">
                <div>
                  Please select all existing data sources you have considered,
                  and brief note on why this area of interest is not being
                  serviced to meet your needs.
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
                        :value="areaOfInterest.existingDataSources"
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
                <div>Reason for Area of Interest to be raised.</div>
                <q-option-group
                  dense
                  class="q-pl-md"
                  :options="REASON_FOR_AOI_RAISE_OPTIONS"
                  type="radio"
                  :value="areaOfInterest.reasonForAoiRaise"
                  @input="valueChanged('reasonForAoiRaise', $event)"
                  :disable="readonly"
                />

                <form-field-validated-input
                  name="areaOfInterest.existingDataAssessmentComments"
                  attribute="Further Comments"
                  label="Further Comments"
                  :value="areaOfInterest.existingDataAssessmentComments"
                  @input="
                    valueChanged('existingDataAssessmentComments', $event)
                  "
                  @blur="
                    $v.areaOfInterest.existingDataAssessmentComments.$touch
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
            label="Resolution and Standard"
            icon="grid_on"
          >
            <q-card>
              <q-card-section class="row q-gutter-x-xs">
                <form-field-validated-option-group
                  class="col"
                  :value="areaOfInterest.gridSize"
                  @input="valueChanged('gridSize', $event)"
                  :options="GRID_SIZE_OPTIONS"
                  name="areaOfInterest.gridSize"
                  label="Grid Size"
                  @blur="$v.areaOfInterest.gridSize.$touch"
                  :readonly="readonly"
                >
                </form-field-validated-option-group>

                <form-field-validated-option-group
                  v-if="areaOfInterest.dataToCapture.includes('Bathymetry')"
                  class="col"
                  :value="areaOfInterest.surveyStandard"
                  @input="valueChanged('surveyStandard', $event)"
                  :options="SURVEY_STANDARD_OPTIONS"
                  name="areaOfInterest.surveyStandard"
                  label="Bathymetry Survey Standard"
                  @blur="$v.areaOfInterest.surveyStandard.$touch"
                  :readonly="readonly"
                >
                </form-field-validated-option-group>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            expand-separator
            label="Data collection timeline and cadence"
            icon="schedule"
          >
            <q-card>
              <q-card-section class="q-gutter-y-xs">
                <form-field-validated-button-toggle
                  inline
                  name="areaOfInterest.preferredTimeframe"
                  label="Preferred Timeframe"
                  :value="areaOfInterest.preferredTimeframe"
                  @input="valueChanged('preferredTimeframe', $event)"
                  :options="PREFERRED_TIMEFRAME_OPTIONS"
                  @blur="$v.areaOfInterest.preferredTimeframe.$touch"
                  :readonly="readonly"
                />
                <form-field-validated-input
                  name="areaOfInterest.timeframeReason"
                  attribute="Reason for timeframe"
                  label="Reason for timeframe"
                  :value="areaOfInterest.timeframeReason"
                  @input="valueChanged('timeframeReason', $event)"
                  @blur="$v.areaOfInterest.timeframeReason.$touch"
                  type="textarea"
                  autogrow
                  :readonly="readonly"
                  outlined
                >
                </form-field-validated-input>
                <form-field-validated-button-toggle
                  inline
                  name="areaOfInterest.preferredSeason"
                  label="Preferred Season"
                  :value="areaOfInterest.preferredSeason"
                  @input="valueChanged('preferredSeason', $event)"
                  :options="PREFERRED_SEASON_OPTIONS"
                  @blur="$v.areaOfInterest.preferredSeason.$touch"
                  :readonly="readonly"
                />
                <form-field-validated-button-toggle
                  inline
                  name="areaOfInterest.collectionCadence"
                  label="Intended Cadence for Collection"
                  :value="areaOfInterest.collectionCadence"
                  @input="valueChanged('collectionCadence', $event)"
                  :options="COLLECTION_CADENCE_OPTIONS"
                  @blur="$v.areaOfInterest.collectionCadence.$touch"
                  :readonly="readonly"
                />
                <form-field-validated-input
                  v-if="
                    areaOfInterest.collectionCadence == 'Time Series Desired' ||
                    areaOfInterest.collectionCadence ==
                      'Time Series Established'
                  "
                  name="areaOfInterest.timeSeriesDescription"
                  attribute="Time Series Description"
                  label="Time Series Description"
                  :value="areaOfInterest.timeSeriesDescription"
                  @input="valueChanged('timeSeriesDescription', $event)"
                  @blur="$v.areaOfInterest.timeSeriesDescription.$touch"
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
            label="Perceived Impact and Organisational Priority"
            icon="hardware"
          >
            <q-card>
              <q-card-section class="q-gutter-y-xs">
                <form-field-validated-button-toggle
                  inline
                  name="areaOfInterest.perceivedImpact"
                  label="Perceived Impact"
                  :value="areaOfInterest.perceivedImpact"
                  @input="valueChanged('perceivedImpact', $event)"
                  :options="PERCEIVED_IMPACT_OPTIONS"
                  @blur="$v.areaOfInterest.perceivedImpact.$touch"
                  :readonly="readonly"
                />
                <form-field-validated-button-toggle
                  inline
                  name="areaOfInterest.organisationalPriority"
                  label="Organisational Priority"
                  :value="areaOfInterest.organisationalPriority"
                  @input="valueChanged('organisationalPriority', $event)"
                  :options="ORGANISATIONAL_PRIORITY_OPTIONS"
                  @blur="$v.areaOfInterest.organisationalPriority.$touch"
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
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>
    </q-card>
  </form-wrapper>
</template>

<script>
import Vue from "vue";
const _ = require("lodash");
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { required } from "vuelidate/lib/validators";

import { errorHandler } from "./../mixins/error-handling";
import { permission } from "./../mixins/permission";

import * as pasMutTypes from "../../store/modules/priority-area-submission/priority-area-submission-mutation-types";

import * as constants from "./area-of-interest-constants";

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

  props: {
    areaOfInterest: {},
    readonly: true,
  },

  methods: {
    ...mapMutations("priorityAreaSubmission", {
      setDirty: pasMutTypes.SET_DIRTY,
    }),

    valueChanged(propertyName, value) {
      this.$emit("aoi-value-changed", {
        aoi: this.areaOfInterest,
        propertyName: propertyName,
        value: value,
      });
    },

    getPurposeFlag(purposeFlagKey) {
      let flagKey = purposeFlagKey + ":";
      let flag = this.areaOfInterest.purposeFlags.find((f) =>
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
      let updatedPurposeFlags = this.areaOfInterest.purposeFlags.filter((f) => {
        return !f.startsWith(flagKey);
      });
      updatedPurposeFlags.push(flagKey + flag);
      this.valueChanged("purposeFlags", updatedPurposeFlags);

      // if the user selects a radio button option of a node that hasn't
      // been ticked, then tick it automaticaly
      if (!this.areaOfInterest.purposes.includes(purposeFlagKey)) {
        this.valueChanged("purposes", [
          ...this.areaOfInterest.purposes,
          purposeFlagKey,
        ]);
      }
    },

    setDefaults() {
      if (this.areaOfInterest.organisationalPriority == undefined) {
        this.valueChanged(
          "organisationalPriority",
          this.ORGANISATIONAL_PRIORITY_OPTIONS[0]
        );
        this.setDirty(false);
      }
      if (this.areaOfInterest.perceivedImpact == undefined) {
        this.valueChanged("perceivedImpact", this.PERCEIVED_IMPACT_OPTIONS[0]);
        this.setDirty(false);
      }

      this.ACTIVITIES = constants.ACTIVITIES;
      this.addKeys(undefined, this.ACTIVITIES);
      this.addTickStrategy(this.ACTIVITIES);
      this.setActivitiesDisabled(this.readonly, this.ACTIVITIES);

      this.PURPOSE_DATA = constants.PURPOSE_DATA;
      this.addKeys(undefined, this.PURPOSE_DATA);
      this.addTickStrategy(this.PURPOSE_DATA);
      this.setActivitiesDisabled(this.readonly, this.PURPOSE_DATA);

      this.ECOSYSTEM_DATA = constants.ECOSYSTEM_DATA;
      this.addKeys(undefined, this.ECOSYSTEM_DATA);
      this.addTickStrategy(this.ECOSYSTEM_DATA);
      this.setActivitiesDisabled(this.readonly, this.ECOSYSTEM_DATA);
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
              this.areaOfInterest.dataToCapture,
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

    isValid() {
      this.$v.$touch();
      return !this.$v.$error;
    },
  },

  watch: {
    "areaOfInterest.dataToCapture": function (newVal, oldVal) {
      // deselect any data capture methods that should not be selected based
      // on what dataToCapture types has been selected.
      var toRemove = [];
      for (const methodGroup of this.DATA_AND_METHOD_OPTIONS) {
        for (const method of methodGroup.methods) {
          if (
            this.areaOfInterest.dataCaptureMethods.includes(method.name) &&
            this.dataCaptureMethodDisabled(method.name)
          ) {
            toRemove.push(method.name);
          }
        }
      }

      let cleanedList = this.areaOfInterest.dataCaptureMethods.filter((i) => {
        return !toRemove.includes(i);
      });

      // calling `this.valueChanged()` will set the dirty state to true
      // so we need to check to make sure we aren't setting the dataCaptureMethods
      // to what it is already set to (this happens immediately after a save).
      // Issue was that the dirty state would alway be set to true without this.
      let sharedWithExistingSelection = _.intersectionWith(
        cleanedList,
        this.areaOfInterest.dataCaptureMethods,
        (a, b) => a == b
      );

      if (
        sharedWithExistingSelection.length !=
        this.areaOfInterest.dataCaptureMethods.length
      ) {
        this.valueChanged("dataCaptureMethods", cleanedList);
      }
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

  validations() {
    return {
      areaOfInterest: {
        preferredTimeframe: { required },
        timeframeReason: {},
        preferredSeason: {},
        collectionCadence: {},
        timeSeriesDescription: {},

        perceivedImpact: { required },
        organisationalPriority: { required },

        existingDataSources: {},
        reasonForAoiRaise: {},
        existingDataAssessmentComments: {},

        gridSize: { required },
        surveyStandard: {},

        dataToCapture: {},
        dataCaptureMethods: {},
      },
    };
  },

  computed: {
    pressuresTicked: {
      get: function () {
        return this.areaOfInterest.pressures;
      },
      set: function (value) {
        this.valueChanged("pressures", value);
      },
    },
    ecosystemsTicked: {
      get: function () {
        return this.areaOfInterest.ecosystems;
      },
      set: function (value) {
        this.valueChanged("ecosystems", value);
      },
    },
    purposesTicked: {
      get: function () {
        return this.areaOfInterest.purposes;
      },
      set: function (value) {
        this.valueChanged("purposes", value);

        // if a purpose has been unticked, then automatically deselect any
        // associate flag that has been selected.
        let updatedPurposeFlags = this.areaOfInterest.purposeFlags.filter(
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

        let updatedPurposeValues = this.areaOfInterest.purposeValues.filter(
          (pv) => {
            let pvGroup = this.PURPOSE_DATA.find((p) => {
              return p.values.includes(pv);
            });
            return this.purposeGroupSelected(pvGroup.label);
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
  },

  data() {
    return {
      ticked: [],
      ACTIVITIES: [],
      PURPOSE_DATA: [],
      ECOSYSTEM_DATA: [],
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
</style>
