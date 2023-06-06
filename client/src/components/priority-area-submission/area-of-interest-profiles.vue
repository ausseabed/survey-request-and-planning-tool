<template>
  <div class="scroll">
    <div class="row q-pa-sm justify-between items-center">
      <div>
        Provide additional metadata for each Area of Interest to support
        prioritisation.
      </div>
      <div class="row q-gutter-xs">
        <q-btn
          size="sm"
          :disable="!expanded"
          color="secondary"
          @click="toggleExpanded"
        >
          Collapse All
        </q-btn>
        <q-btn
          size="sm"
          :disable="expanded"
          color="secondary"
          @click="toggleExpanded"
        >
          Expand All
        </q-btn>
      </div>
    </div>

    <div class="column q-pa-sm q-gutter-y-sm">
      <area-of-interest-profile
        v-for="(aoi, index) of priorityAreaSubmission.priorityAreas"
        :key="aoi.id"
        :index="index"
        :priority-area="aoi"
        @aoi-value-changed="aoiValueChanged"
        :readonly="readonly"
        ref="aoiProfile"
        @aoi-apply-to-all="aoiApplyToAll"
        :validator="validator"
      >
      </area-of-interest-profile>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
const _ = require("lodash");
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

import { errorHandler } from "../mixins/error-handling";
import { permission } from "../mixins/permission";

import * as pasMutTypes from "../../store/modules/priority-area-submission/priority-area-submission-mutation-types";
import AreaOfInterestProfile from "./area-of-interest-profile.vue";

export default Vue.extend({
  mixins: [errorHandler, permission],

  components: {
    "area-of-interest-profile": AreaOfInterestProfile,
  },

  props: [
    'readonly',
    'validationIntent',
    'validator'
  ],

  mounted() {},

  methods: {
    ...mapMutations("priorityAreaSubmission", {
      updatePriorityAreaSubmissionValue:
        pasMutTypes.UPDATE_ACTIVE_PRIORITY_AREA_SUBMISSION_VALUE,
      setDirty: pasMutTypes.SET_DIRTY,
    }),

    aoiValueChanged({ aoi, propertyName, value }) {
      const paIndex = this.priorityAreaSubmission.priorityAreas.indexOf(aoi);
      const path = `priorityAreas[${paIndex}].${propertyName}`;
      this.updatePriorityAreaSubmissionValue({ path: path, value: value });
    },

    toggleExpanded() {
      this.expanded = !this.expanded;
      for (const aoiProfile of this.$refs.aoiProfile) {
        aoiProfile.setExpanded(this.expanded);
      }
    },

    aoiApplyToAll({ propertyName, value, id, limit }) {
      let limitCount = 0;
      let startUpdating = false;

      for (const [
        paIndex,
        pa,
      ] of this.priorityAreaSubmission.priorityAreas.entries()) {
        if (id == undefined || limit == undefined) {
          // no id, and no limit provided so update all the entries
          const path = `priorityAreas[${paIndex}].${propertyName}`;
          this.updatePriorityAreaSubmissionValue({ path: path, value: value });
        } else {
          if (pa.id == id) {
            startUpdating = true;
          }
          if (startUpdating) {
            const path = `priorityAreas[${paIndex}].${propertyName}`;
            this.updatePriorityAreaSubmissionValue({
              path: path,
              value: value,
            });
            limitCount++;
          }
          if (limitCount > limit) {
            return;
          }
        }
      }
    },

    isValid() {
      this.$v.$touch();
      return !this.$v.$error;
    },

  },

  watch: {},

  computed: {
    ...mapGetters("priorityAreaSubmission", {
      priorityAreaSubmission: "activePriorityAreaSubmission",
    }),
    $v () {
      return this.validator;
    },
  },

  data() {
    return {
      expanded: false,
    };
  },
});
</script>


<style scoped lang="stylus"></style>
