<template>
  <form-wrapper :validator="$v" class="scroll">
    <div class="column q-pa-md q-gutter-y-sm">
      <form-field-validated-select
        name="priorityAreaSubmission.submittingOrganisation"
        label="Submitting organisation"
        hint="Organisation that is submitting the list or priorities"
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
        label="Contact Person"
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
        label="Contact Email"
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

      <form-field-validated-select
        use-input
        hide-selected
        fill-input
        clearable
        name="priorityAreaSubmission.identifiedAreaName"
        label="Identified Area name"
        attribute="Identified Area name"
        hint="The agreed name of the area that is provided by the submitting organisation."
        :value="priorityAreaSubmission.identifiedAreaName"
        @input-value="
          updatePriorityAreaSubmissionValue({
            path: 'identifiedAreaName',
            value: $event,
          })
        "
        @clear="
          updatePriorityAreaSubmissionValue({
            path: 'identifiedAreaName',
            value: undefined,
          })
        "
        :options="identifiedAreaOptionsFiltered"
        @blur="$v.priorityAreaSubmission.identifiedAreaName.$touch"
      >
      </form-field-validated-select>

      <form-field-validated-select
        use-input
        hide-selected
        fill-input
        clearable
        name="priorityAreaSubmission.geographicalAreaName"
        label="Geographical Area name"
        attribute="Geographical Area name"
        :value="priorityAreaSubmission.geographicalAreaName"
        @input-value="
          updatePriorityAreaSubmissionValue({
            path: 'geographicalAreaName',
            value: $event,
          })
        "
        @clear="
          updatePriorityAreaSubmissionValue({
            path: 'geographicalAreaName',
            value: undefined,
          })
        "
        :options="geographicalAreaOptionsFiltered"
        @blur="$v.priorityAreaSubmission.geographicalAreaName.$touch"
      >
      </form-field-validated-select>
    </div>
  </form-wrapper>
</template>

<script>
import Vue from "vue";
const _ = require("lodash");
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { required, minLength, email } from "vuelidate/lib/validators";

import { errorHandler } from "./../mixins/error-handling";
import { permission } from "./../mixins/permission";

import * as organisationMutTypes from "../../store/modules/organisation/organisation-mutation-types";
import * as pasMutTypes from "../../store/modules/priority-area-submission/priority-area-submission-mutation-types";

export default Vue.extend({
  mixins: [errorHandler, permission],

  props: ["readonly"],

  mounted() {
    this.fetchData();
  },

  methods: {
    ...mapActions("organisation", ["getOrganisations"]),
    ...mapActions("priorityAreaSubmission", [
      "getIdentifiedAreaOptions",
      "getGeographicalAreaOptions"
    ]),

    ...mapMutations("priorityAreaSubmission", {
      updatePriorityAreaSubmissionValue:
        pasMutTypes.UPDATE_ACTIVE_PRIORITY_AREA_SUBMISSION_VALUE,
      setDirty: pasMutTypes.SET_DIRTY
    }),
    ...mapMutations("organisation", {
      setOrganisationFilter: organisationMutTypes.SET_FILTER
    }),

    fetchData() {
      this.getOrganisations();
      this.getIdentifiedAreaOptions();
      this.getGeographicalAreaOptions();
    },

    filterOrganisationFunction(val, update, abort) {
      this.setOrganisationFilter(val);
      this.getOrganisations().then(orgs => {
        update();
      });
    },

    getFilteredOptions(current, allOpts) {
      if (_.isNil(current) || current.length == 0) {
        return allOpts;
      }
      let opts = allOpts.filter(areaNameOpt => {
        return areaNameOpt.toLowerCase().includes(current.toLowerCase());
      });
      return opts;
    },

    isValid() {
      this.$v.$touch();
      return !this.$v.$error;
    }
  },

  watch: {},

  validations() {
    return {
      priorityAreaSubmission: {
        submittingOrganisation: { required },
        contactPerson: { required },
        contactEmail: { required, email },
        identifiedAreaName: { required },
        geographicalAreaName: {}
      }
    };
  },

  computed: {
    ...mapGetters("priorityAreaSubmission", {
      priorityAreaSubmission: "activePriorityAreaSubmission"
    }),
    ...mapGetters("organisation", {
      organisationsList: "organisations"
    }),
    ...mapState("priorityAreaSubmission", {
      identifiedAreaOptions: "identifiedAreaOptions",
      geographicalAreaOptions: "geographicalAreaOptions"
    }),

    identifiedAreaOptionsFiltered() {
      return this.getFilteredOptions(
        this.priorityAreaSubmission.identifiedAreaName,
        this.identifiedAreaOptions
      );
    },

    geographicalAreaOptionsFiltered() {
      return this.getFilteredOptions(
        this.priorityAreaSubmission.geographicalAreaName,
        this.geographicalAreaOptions
      );
    }
  },

  data() {
    return {};
  }
});
</script>


<style scoped lang="stylus"></style>
