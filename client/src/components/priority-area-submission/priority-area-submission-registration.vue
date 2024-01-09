<template>
  <div class="column q-pa-md q-gutter-y-sm scroll">
    <form-field-validated-input
      name="priorityAreaSubmission.submissionName"
      label="Submission Name *"
      attribute="Submission Name"
      hint="Name or description of this submission"
      :value="priorityAreaSubmission.submissionName"
      @input="
        updatePriorityAreaSubmissionValue({
          path: 'submissionName',
          value: $event,
        })
      "
      type="text"
      @blur="$v.priorityAreaSubmission.submissionName.$touch"
      :readonly="readonly"
    >
    </form-field-validated-input>

    <form-field-validated-select
      ref="submittingOrganisation"
      name="priorityAreaSubmission.submittingOrganisation"
      label="Submitting Organisation *"
      attribute="Submitting Organisation"
      hint="Organisation that is submitting the list or areas of interest"
      use-input
      clearable
      input-debounce="200"
      @filter="filterOrganisationFunction"
      :value="priorityAreaSubmission.submittingOrganisation"
      @input="
        updatePriorityAreaSubmissionValue({
          path: 'submittingOrganisation',
          value: $event,
        })
      "
      :options="organisationsList"
      option-label="name"
      option-value="id"
      @blur="$v.priorityAreaSubmission.submittingOrganisation.$touch"
      :readonly="readonly"
    >
    </form-field-validated-select>

    <form-field-validated-input
      name="priorityAreaSubmission.contactPerson"
      label="Contact Person *"
      attribute="Contact Person"
      hint="Contact person from the commissioning organisation"
      :value="priorityAreaSubmission.contactPerson"
      @input="
        updatePriorityAreaSubmissionValue({
          path: 'contactPerson',
          value: $event,
        })
      "
      type="text"
      @blur="$v.priorityAreaSubmission.contactPerson.$touch"
      :readonly="readonly"
    >
    </form-field-validated-input>

    <form-field-validated-input
      name="priorityAreaSubmission.contactEmail"
      label="Contact Email *"
      attribute="Contact Email"
      hint="Ideally, provide a group email to ensure continuity of the dataset"
      :value="priorityAreaSubmission.contactEmail"
      @input="
        updatePriorityAreaSubmissionValue({
          path: 'contactEmail',
          value: $event,
        })
      "
      type="email"
      @blur="$v.priorityAreaSubmission.contactEmail.$touch"
      :readonly="readonly"
    >
    </form-field-validated-input>
  </div>

</template>

<script>
import Vue from "vue";
const _ = require("lodash");
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

import { errorHandler } from "./../mixins/error-handling";
import { permission } from "./../mixins/permission";

import * as organisationMutTypes from "../../store/modules/organisation/organisation-mutation-types";
import * as pasMutTypes from "../../store/modules/priority-area-submission/priority-area-submission-mutation-types";

export default Vue.extend({
  mixins: [errorHandler, permission],

  props: [
    'readonly',
    'validationIntent',
    'validator'
  ],

  mounted() {
    this.fetchData();
  },

  methods: {
    ...mapActions("organisation", ["getOrganisations"]),

    ...mapMutations("priorityAreaSubmission", {
      updatePriorityAreaSubmissionValue:
        pasMutTypes.UPDATE_ACTIVE_PRIORITY_AREA_SUBMISSION_VALUE,
      setDirty: pasMutTypes.SET_DIRTY,
    }),
    ...mapMutations("organisation", {
      setOrganisationFilter: organisationMutTypes.SET_FILTER,
    }),

    fetchData() {
      this.getOrganisations();
    },

    filterOrganisationFunction(val, update, abort) {
      this.setOrganisationFilter(val);
      this.getOrganisations().then((orgs) => {
        update();
      });
    },

    getFilteredOptions(current, allOpts) {
      if (_.isNil(current) || current.length == 0) {
        return allOpts;
      }
      let opts = allOpts.filter((areaNameOpt) => {
        return areaNameOpt.toLowerCase().includes(current.toLowerCase());
      });
      return opts;
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
    ...mapGetters("organisation", {
      organisationsList: "organisations",
    }),
    ...mapGetters("user", {
      currentUser: "currentUser",
    }),
    $v () {
      return this.validator;
    }
  },

  data() {
    return {};
  },
});
</script>


<style scoped lang="stylus"></style>
