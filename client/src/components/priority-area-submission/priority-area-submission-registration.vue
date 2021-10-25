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

      <form-field-validated-input
        name="priorityAreaSubmission.identifiedAreaName"
        label="Identified Area name"
        attribute="Identified Area name"
        hint="The agreed name of the area that is provided by the submitting organisation."
        :value="priorityAreaSubmission.identifiedAreaName"
        @input="
          updatePriorityAreaSubmissionValue({
            path: 'identifiedAreaName',
            value: $event,
          })
        "
        type="text"
        @blur="$v.priorityAreaSubmission.identifiedAreaName.$touch"
        :readonly="readonly"
      >
      </form-field-validated-input>

      <div class="q-pt-sm">
        <q-separator class="q-my-md" style="min-height: 1px" />
      </div>

      <q-field stack-label label="Citation" bottom-slots :readonly="readonly">
        <q-checkbox
          :value="priorityAreaSubmission.citation"
          label="Use above details for public citation"
          @input="
            updatePriorityAreaSubmissionValue({
              path: 'citation',
              value: $event,
            })
          "
          :disable="readonly"
        />
      </q-field>

      <form-field-validated-select
        name="priorityAreaSubmission.citedOrganisation"
        label="Cited Organisation"
        hint="Organisation cited in the public records"
        use-input
        clearable
        input-debounce="200"
        @filter="filterOrganisationFunction"
        :value="
          priorityAreaSubmission.citation
            ? priorityAreaSubmission.submittingOrganisation
            : priorityAreaSubmission.citedOrganisation
        "
        @input="
          updatePriorityAreaSubmissionValue({
            path: 'citedOrganisation',
            value: $event,
          })
        "
        :options="organisationsList"
        option-label="name"
        option-value="id"
        @blur="$v.priorityAreaSubmission.citedOrganisation.$touch"
        :readonly="readonly"
        :disable="priorityAreaSubmission.citation"
      >
      </form-field-validated-select>

      <form-field-validated-input
        name="priorityAreaSubmission.citedContactName"
        label="Cited Contact Name"
        attribute="Cited Contact Name"
        hint="Contact person from the commissioning organisation"
        :value="
          priorityAreaSubmission.citation
            ? priorityAreaSubmission.contactPerson
            : priorityAreaSubmission.citedContactName
        "
        @input="
          updatePriorityAreaSubmissionValue({
            path: 'citedContactName',
            value: $event,
          })
        "
        type="text"
        @blur="$v.priorityAreaSubmission.citedContactName.$touch"
        :readonly="readonly"
        :disable="priorityAreaSubmission.citation"
      >
      </form-field-validated-input>

      <form-field-validated-input
        name="priorityAreaSubmission.citedContactEmail"
        label="Cited Contact Email"
        attribute="Contact Email"
        hint="email that will appear in the public records"
        :value="
          priorityAreaSubmission.citation
            ? priorityAreaSubmission.contactEmail
            : priorityAreaSubmission.citedContactEmail
        "
        @input="
          updatePriorityAreaSubmissionValue({
            path: 'citedContactEmail',
            value: $event,
          })
        "
        type="email"
        @blur="$v.priorityAreaSubmission.citedContactEmail.$touch"
        :readonly="readonly"
        :disable="priorityAreaSubmission.citation"
      >
      </form-field-validated-input>
    </div>
  </form-wrapper>
</template>

<script>
import Vue from "vue";
const _ = require("lodash");
import { mapActions, mapGetters, mapMutations } from "vuex";
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
    ...mapActions("priorityAreaSubmission", ["getIdentifiedAreaOptions"]),

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
    },

    filterOrganisationFunction(val, update, abort) {
      this.setOrganisationFilter(val);
      this.getOrganisations().then(orgs => {
        update();
      });
    },

    isValid() {
      this.$v.$touch();
      return !this.$v.$error;
    }
  },

  watch: {},

  validations() {
    if (this.priorityAreaSubmission.citation) {
      return {
        priorityAreaSubmission: {
          submittingOrganisation: { required },
          contactPerson: { required },
          contactEmail: { required, email },
          identifiedAreaName: { required },
          citation: {},
          citedOrganisation: {},
          citedContactName: {},
          citedContactEmail: {}
        }
      };
    } else {
      return {
        priorityAreaSubmission: {
          submittingOrganisation: { required },
          contactPerson: { required },
          contactEmail: { required, email },
          identifiedAreaName: { required },
          citation: {},
          citedOrganisation: { required },
          citedContactName: { required },
          citedContactEmail: { required, email }
        }
      };
    }
  },

  computed: {
    ...mapGetters("priorityAreaSubmission", {
      priorityAreaSubmission: "activePriorityAreaSubmission"
    }),
    ...mapGetters("organisation", {
      organisationsList: "organisations"
    })
  },

  data() {
    return {};
  }
});
</script>


<style scoped lang="stylus"></style>
