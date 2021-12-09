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
          <q-expansion-item expand-separator label="Purpose">
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
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
            label="Organisational Priority and Perceived Impact"
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
                  tick-strategy="leaf"
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

    this.ACTIVITIES = constants.ACTIVITIES;
    this.addKeys(undefined, this.ACTIVITIES);
    this.setActivitiesDisabled(false, this.ACTIVITIES);
  },

  props: {
    areaOfInterest: {},
    readonly: true,
  },

  methods: {
    valueChanged(propertyName, value) {
      this.$emit("aoi-value-changed", {
        aoi: this.areaOfInterest,
        propertyName: propertyName,
        value: value,
      });
    },

    setDefaults() {
      if (this.areaOfInterest.organisationalPriority == undefined) {
        this.valueChanged(
          "organisationalPriority",
          ORGANISATIONAL_PRIORITY_OPTIONS[0]
        );
      }
      if (this.areaOfInterest.perceivedImpact == undefined) {
        this.valueChanged("perceivedImpact", PERCEIVED_IMPACT_OPTIONS[0]);
      }
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

      this.valueChanged("dataCaptureMethods", cleanedList);
    },

    readonly: {
      immediate: false,
      handler(newVal, oldVal) {
        this.setActivitiesDisabled(newVal, this.ACTIVITIES);
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
  },

  data() {
    return {
      ticked: [],
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
