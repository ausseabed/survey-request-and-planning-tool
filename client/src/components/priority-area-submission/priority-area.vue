<template>
  <form-wrapper :validator="$v">
    <q-card flat bordered class="full-width">
      <q-card-section class="row q-col-gutter-md">
        <div class="column col-auto justify-between">
          <div class="column q-gutter-sm">
            <q-badge
              v-if="priorityArea.isNew"
              color="yellow-6"
              text-color="black"
            >
              New Area of Interest
            </q-badge>
            <q-img
              class="rounded-borders"
              style="width: 250px; max-height: 250px"
              :src="`api/priority-area/${priorityArea.id}/thumbnail`"
              :ratio="1"
              contain
            />
          </div>
          <div class="column q-gutter-xs">
            <sct-btn
              v-if="!readonly"
              label="Apply to All"
              icon="format_line_spacing"
              @click="applyToAllClicked"
            />
            <sct-btn
              v-if="!readonly"
              label="Remove"
              icon="delete"
              @click="deleteClicked"
            />
          </div>
        </div>

        <div class="col column q-gutter-xs">
          <form-field-validated-input
            name="priorityArea.name"
            label="Identified Area Name"
            attribute="Identified Area Name"
            :value="priorityArea.name"
            @input="valueChanged('name', $event)"
            type="text"
            @blur="$v.priorityArea.name.$touch"
            :readonly="readonly"
            outlined
          >
          </form-field-validated-input>

          <form-field-validated-select
            class="bg-grey-2 q-pa-sm rounded-borders"
            inline
            name="priorityArea.seacountryName"
            label="Seacountry name"
            :value="selectedSeacountryOption"
            @input="seacountrySelected($event)"
            :options="[...seacountryNameOptions, 'Other']"
            @blur="$v.priorityArea.seacountryName.$touch"
            :readonly="readonly"
          />

          <div class="row">
            <div style="min-width: 90px"></div>
            <form-field-validated-input
              v-if="selectedSeacountryOption == 'Other'"
              name="priorityArea.seacountryName"
              label="Other"
              attribute="Seacountry name"
              :value="priorityArea.seacountryName"
              @input="valueChanged('seacountryName', $event)"
              type="text"
              @blur="$v.priorityArea.seacountryName.$touch"
              :readonly="readonly"
              outlined
              class="col"
            >
            </form-field-validated-input>
          </div>

          <form-field-validated-select
            class="bg-grey-2 q-pa-sm rounded-borders"
            inline
            name="priorityArea.ecologicalAreaName"
            label="Significant ecological area name"
            :value="selectedEcologicalAreaOption"
            @input="ecologicalAreaSelected($event)"
            :options="[...ecologicalAreaNameOptions, 'Other']"
            @blur="$v.priorityArea.ecologicalAreaName.$touch"
            :readonly="readonly"
          />

          <div class="row">
            <div style="min-width: 90px"></div>
            <form-field-validated-input
              v-if="selectedEcologicalAreaOption == 'Other'"
              name="priorityArea.ecologicalAreaName"
              label="Other"
              attribute="Ecological area name"
              :value="priorityArea.ecologicalAreaName"
              @input="valueChanged('ecologicalAreaName', $event)"
              type="text"
              @blur="$v.priorityArea.ecologicalAreaName.$touch"
              :readonly="readonly"
              outlined
              class="col"
            >
            </form-field-validated-input>
          </div>

          <div class="bg-grey-2 q-pa-sm rounded-borders">
            <div class="field-label">Intersecting Management Boundaries</div>

            <q-list bordered separator class="col bg-white">
              <q-scroll-area style="height: 200px">
                <q-item v-for="(ii, index) in intersections" :key="index">
                  <q-item-section>
                    <q-item-label
                      >{{ ii[0].value }} {{ ii[1].value }}</q-item-label
                    >
                    <q-item-label caption>{{ ii[2].value }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-scroll-area>
            </q-list>
          </div>
        </div>
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

export default Vue.extend({
  mixins: [errorHandler, permission],

  async mounted() {
    this.getIntersections();

    if (this.seacountryNameOptions.includes(this.priorityArea.seacountryName)) {
      this.selectedSeacountryOption = this.priorityArea.seacountryName;
    } else {
      this.selectedSeacountryOption = "Other";
    }

    if (
      this.ecologicalAreaNameOptions.includes(
        this.priorityArea.ecologicalAreaName
      )
    ) {
      this.selectedEcologicalAreaOption = this.priorityArea.ecologicalAreaName;
    } else {
      this.selectedEcologicalAreaOption = "Other";
    }
  },

  props: {
    priorityArea: {},
    readonly: true
  },

  methods: {
    valueChanged(propertyName, value) {
      this.$emit("priority-area-value-changed", {
        priorityArea: this.priorityArea,
        propertyName: propertyName,
        value: value
      });
    },
    deleteClicked() {
      this.$emit("priority-area-deleted", {
        priorityArea: this.priorityArea
      });
    },

    applyToAllClicked() {
      this.$emit("priority-area-apply-to-all", {
        propertyName: "preferredTimeframe",
        value: this.priorityArea.preferredTimeframe
      });
      this.$emit("priority-area-apply-to-all", {
        propertyName: "riskRating",
        value: this.priorityArea.riskRating
      });
      this.$emit("priority-area-apply-to-all", {
        propertyName: "requiredDataQuality",
        value: this.priorityArea.requiredDataQuality
      });
      this.$emit("priority-area-apply-to-all", {
        propertyName: "priority",
        value: this.priorityArea.priority
      });
    },

    seacountrySelected(selected) {
      this.selectedSeacountryOption = selected;
      if (this.seacountryNameOptions.includes(selected)) {
        // seacountryNameOptions doesn't include the 'Other' option
        // so we use this to set the vuex model value if the 'Other'
        // option hasn't been selected
        this.valueChanged("seacountryName", selected);
      } else {
        this.valueChanged("seacountryName", undefined);
      }
    },

    ecologicalAreaSelected(selected) {
      this.selectedEcologicalAreaOption = selected;
      if (this.ecologicalAreaNameOptions.includes(selected)) {
        this.valueChanged("ecologicalAreaName", selected);
      } else {
        this.valueChanged("ecologicalAreaName", undefined);
      }
    },

    isValid() {
      this.$v.$touch();
      return !this.$v.$error;
    },

    getIntersections() {
      Vue.axios
        .get(`api/priority-area/${this.priorityArea.id}/intersections`)
        .then(res => {
          this.intersections = res.data;
        })
        .catch(err => {
          if (err.response.status == 404) {
            // then no task has been provided, this is ok.
          } else {
            console.error(err);
          }
        });
    }
  },

  watch: {},

  validations() {
    return {
      priorityArea: {
        name: { required },
        ecologicalAreaName: { required },
        seacountryName: { required }
      }
    };
  },

  computed: {
    // these are all loaded by the parent component
    ...mapState("priorityAreaSubmission", [
      "seacountryNameOptions",
      "ecologicalAreaNameOptions"
    ])
  },

  data() {
    return {
      intersections: [],
      selectedSeacountryOption: undefined,
      selectedEcologicalAreaOption: undefined
    };
  }
});
</script>


<style scoped lang="stylus"></style>
