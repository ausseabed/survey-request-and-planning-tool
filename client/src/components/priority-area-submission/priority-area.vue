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
          <div class="column q-pt-xs q-gutter-xs">
            <sct-btn
              v-if="!readonly"
              label="Apply to Next"
              @click="applyToNextClicked"
            />
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

          <form-field-validated-input
            name="priorityArea.seacountryName"
            label="Seacountry name"
            attribute="Seacountry name"
            :value="priorityArea.seacountryName"
            @input="valueChanged('seacountryName', $event)"
            type="text"
            @blur="$v.priorityArea.seacountryName.$touch"
            :readonly="readonly"
            outlined
          >
          </form-field-validated-input>

          <form-field-validated-select
            class="bg-grey-2 q-pa-sm rounded-borders"
            inline
            name="priorityArea.ecologicalAreaType"
            label="Significant ecological area name"
            :value="priorityArea.ecologicalAreaType"
            @input="valueChanged('ecologicalAreaType', $event)"
            :options="[...ecologicalAreaNameOptions, 'Other']"
            @blur="$v.priorityArea.ecologicalAreaType.$touch"
            :readonly="readonly"
          />

          <form-field-validated-input
            name="priorityArea.ecologicalAreaName"
            label="Ecological area name"
            attribute="Ecological area name"
            :value="priorityArea.ecologicalAreaName"
            @input="valueChanged('ecologicalAreaName', $event)"
            type="text"
            @blur="$v.priorityArea.ecologicalAreaName.$touch"
            :readonly="readonly"
            outlined
          >
          </form-field-validated-input>

          <div class="bg-grey-2 q-pa-sm rounded-borders">
            <div class="field-label">Intersecting Marine Park boundaries</div>
            <div
              v-if="intersections.length == 0"
              class="column justify-center bg-white"
              style="min-height: 50px"
            >
              <div class="row justify-center">No intersections found</div>
            </div>
            <q-list v-else bordered separator class="col bg-white">
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
  },

  props: {
    priorityArea: {},
    readonly: true,
  },

  methods: {
    valueChanged(propertyName, value) {
      this.$emit("priority-area-value-changed", {
        priorityArea: this.priorityArea,
        propertyName: propertyName,
        value: value,
      });
    },
    deleteClicked() {
      this.$emit("priority-area-deleted", {
        priorityArea: this.priorityArea,
      });
    },

    applyToAllClicked() {
      this.$emit("priority-area-apply-to-all", {
        propertyName: "seacountryName",
        value: this.priorityArea.seacountryName,
      });
      this.$emit("priority-area-apply-to-all", {
        propertyName: "ecologicalAreaName",
        value: this.priorityArea.ecologicalAreaName,
      });
    },

    applyToNextClicked() {
      this.$emit("priority-area-apply-to-all", {
        propertyName: "seacountryName",
        value: this.priorityArea.seacountryName,
        id: this.priorityArea.id,
        limit: 1,
      });
      this.$emit("priority-area-apply-to-all", {
        propertyName: "ecologicalAreaName",
        value: this.priorityArea.ecologicalAreaName,
        id: this.priorityArea.id,
        limit: 1,
      });
    },

    isValid() {
      this.$v.$touch();
      return !this.$v.$error;
    },

    getIntersections() {
      Vue.axios
        .get(`api/priority-area/${this.priorityArea.id}/intersections`)
        .then((res) => {
          this.intersections = res.data;
        })
        .catch((err) => {
          if (err.response.status == 404) {
            // then no task has been provided, this is ok.
          } else {
            console.error(err);
          }
        });
    },
  },

  watch: {},

  validations() {
    return {
      priorityArea: {
        name: { required },
        ecologicalAreaType: { required },
        ecologicalAreaName: { required },
        seacountryName: { required },
      },
    };
  },

  computed: {
    // these are all loaded by the parent component
    ...mapState("priorityAreaSubmission", ["ecologicalAreaNameOptions"]),
  },

  data() {
    return {
      intersections: [],
    };
  },
});
</script>


<style scoped lang="stylus"></style>
