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
                  class="q-pl-md"
                  :options="REASON_FOR_AOI_RAISE_OPTIONS"
                  type="radio"
                  :value="areaOfInterest.reasonForAoiRaise"
                  @input="valueChanged('reasonForAoiRaise', $event)"
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

const PREFERRED_TIMEFRAME_OPTIONS = [
  "1-2 years",
  "2-5 years",
  "5-10 years",
  "No Timeframe"
];

const PREFERRED_SEASON_OPTIONS = ["NA", "Spring", "Summer", "Autumn", "Winter"];

const COLLECTION_CADENCE_OPTIONS = [
  "Snapshot",
  "Time Series Desired",
  "Time Series Established"
];

const PERCEIVED_IMPACT_OPTIONS = [
  "Unknown",
  "Local (<10km)",
  "Regional (10-100km)",
  "National (>1000km)"
];

const ORGANISATIONAL_PRIORITY_OPTIONS = ["NA", "1", "2", "3"];

const EXISTING_DATA_SOURCE_OPTIONS = [
  {
    name: "AusSeabed",
    url: "https://www.ausseabed.gov.au/data",
    datatypes: "acoustic data, bathymetry, etc"
  },
  {
    name: "MARS",
    url: "http://dbforms.ga.gov.au/pls/www/npm.mars.search",
    datatypes: "sediments"
  },
  {
    name: "Squidle+",
    url: "https://squidle.org/",
    datatypes: "epibenthos organisms / imagery"
  },
  {
    name: "SOI Squidle",
    url: "https://soi.squidle.org/",
    datatypes: "epibenthos organisms / imagery"
  },
  {
    name: "AODN  (all rationales)",
    url: "https://portal.aodn.org.au/",
    datatypes: "all data types"
  },
  {
    name: "OBIS",
    url: "https://obis.org/",
    datatypes: "ecological data; species distributions"
  },
  {
    name: "ALA",
    url: "https://www.ala.org.au/",
    datatypes: "ecological data; species distributions"
  },
  {
    name: "SeaMap Australia",
    url: "https://seamapaustralia.org/",
    datatypes: "biotope"
  },
  {
    name: "GlobalArchive",
    url: "https://globalarchive.org/",
    datatypes: "fish, BRUVS data"
  },
  {
    name: "IMSA",
    url: "biotope, sediment, chemical",
    datatypes: "https://biocollect.ala.org.au/imsa"
  }
];

const REASON_FOR_AOI_RAISE_OPTIONS = [
  { label: "Data not found for AOI", value: "Data not found for AOI" },
  {
    label: "Data not found to meet requirements",
    value: "Data not found to meet requirements"
  },
  { label: "Data found, not relevant", value: "Data found, not relevant" },
  { label: "Timeseries required", value: "Timeseries required" }
];

export default Vue.extend({
  mixins: [errorHandler, permission],

  mounted() {
    this.setDefaults();
  },

  created() {
    this.PREFERRED_TIMEFRAME_OPTIONS = PREFERRED_TIMEFRAME_OPTIONS;
    this.PREFERRED_SEASON_OPTIONS = PREFERRED_SEASON_OPTIONS;
    this.COLLECTION_CADENCE_OPTIONS = COLLECTION_CADENCE_OPTIONS;

    this.PERCEIVED_IMPACT_OPTIONS = PERCEIVED_IMPACT_OPTIONS;
    this.ORGANISATIONAL_PRIORITY_OPTIONS = ORGANISATIONAL_PRIORITY_OPTIONS;

    this.EXISTING_DATA_SOURCE_OPTIONS = EXISTING_DATA_SOURCE_OPTIONS;
    this.REASON_FOR_AOI_RAISE_OPTIONS = REASON_FOR_AOI_RAISE_OPTIONS;
  },

  props: {
    areaOfInterest: {},
    readonly: true
  },

  methods: {
    valueChanged(propertyName, value) {
      this.$emit("aoi-value-changed", {
        aoi: this.areaOfInterest,
        propertyName: propertyName,
        value: value
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

    isValid() {
      this.$v.$touch();
      return !this.$v.$error;
    }
  },

  watch: {},

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
        existingDataAssessmentComments: {}
      }
    };
  },

  computed: {},

  data() {
    return {};
  }
});
</script>


<style scoped lang="stylus">
.reg-details-text {
  div, b {
    font-size: 0.9em;
  }
}
</style>
