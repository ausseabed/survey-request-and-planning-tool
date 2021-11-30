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

        <q-list bordered class="col rounded-borders" ref="expansionItemList">
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

export default Vue.extend({
  mixins: [errorHandler, permission],

  async mounted() {},

  created() {
    this.PREFERRED_TIMEFRAME_OPTIONS = PREFERRED_TIMEFRAME_OPTIONS;
    this.PREFERRED_SEASON_OPTIONS = PREFERRED_SEASON_OPTIONS;
    this.COLLECTION_CADENCE_OPTIONS = COLLECTION_CADENCE_OPTIONS;
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
        timeSeriesDescription: {}
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
