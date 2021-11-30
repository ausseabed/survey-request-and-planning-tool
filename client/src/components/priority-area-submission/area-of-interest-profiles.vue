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
        v-for="aoi of priorityAreaSubmission.priorityAreas"
        :key="aoi.id"
        :area-of-interest="aoi"
        @aoi-value-changed="aoiValueChanged"
        :readonly="readonly"
        ref="aoiProfile"
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
    "area-of-interest-profile": AreaOfInterestProfile
  },

  props: ["readonly"],

  mounted() {
    console.log("mounted");
  },

  methods: {
    ...mapMutations("priorityAreaSubmission", {
      updatePriorityAreaSubmissionValue:
        pasMutTypes.UPDATE_ACTIVE_PRIORITY_AREA_SUBMISSION_VALUE,
      setDirty: pasMutTypes.SET_DIRTY
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

    isValid() {
      // we perform map, then reduce, so that the `isValid` method
      // is called on all priority area components. Doing the only the reduce
      // will stop calling isValid after the first non-valid component.
      if (_.isNil(this.$refs.aoiProfile)) {
        // if there are no priority areas, then its valid
        return true;
      }
      let allValid = this.$refs.aoiProfile
        .map(comp => comp.isValid())
        .reduce((sum, next) => sum && next, true);

      return allValid;
    }
  },

  watch: {},

  computed: {
    ...mapGetters("priorityAreaSubmission", {
      priorityAreaSubmission: "activePriorityAreaSubmission"
    })
  },

  data() {
    return {
      expanded: false
    };
  }
});
</script>


<style scoped lang="stylus"></style>
