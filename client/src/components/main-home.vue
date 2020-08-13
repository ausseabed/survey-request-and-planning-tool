<template>
  <div class="column q-py-sm">
    <div class="column q-gutter-y-sm">
      <div class="app-big-heading q-px-md">
        Welcome to the ASB {{title}}
      </div>

      <q-list>
        <q-expansion-item
          :value="expandedAbout"
          :header-class="headerClass"
          icon="error_outline"
          label="About"
        >
          <div class="q-px-md q-pb-sm column q-gutter-y-sm">
            <div>
              The ASB SCT was developed by FrontierSI on behalf of AusSeabed and captures three record types, a survey plan, a survey request and a priority area profile.
            </div>
            <div>
              The survey plans records the survey’s intended area of interest, its specifications and intended deliverable.
            </div>
            <div>
              The survey request record the information required for submission to the Hydroscheme Industry Partnership Program (HIPP) review panel.
            </div>
            <div>
              The priority area profile enables an organisation to highlight the areas of our marine jurisdiction that are of high, medium and low priority for surveying.
            </div>
          </div>
        </q-expansion-item>

        <q-expansion-item
          :value="expandedSurveyPlans"
          :header-class="headerClass"
          icon="app:survey-plan"
          label="Survey Plans"
          caption="Add a new Survey Plan or update existing Survey Plan"
        >
          <div class="q-px-md q-pb-sm q-gutter-y-sm column">
            <div>
              <div>
                The survey plan and associated information has been designed to support a number of different activities such as:
              </div>
              <ol class="q-my-xs">
                <li>
                  Adding an upcoming survey to the AusSeabed “Upcoming Surveys” coverage layer
                </li>
                <li>
                  Assist a non-expert user to plan their survey and get support from within the AusSeabed community. Please refer to our FAQ’s “How to get technical support?” for more information.
                </li>
                <li>
                  Allow a user to plan a survey with specifications and generate documentation to support a tender process.
                </li>
              </ol>
            </div>
            <q-btn
              class="self-center full-width"
              flat label="Add Basic Survey Plan"
              icon="add"
              :to="'/survey-plan/new'">
              <q-tooltip>
                Create new basic survey plan
              </q-tooltip>
            </q-btn>
          </div>
        </q-expansion-item>

        <q-expansion-item
          :value="expandedSurveyRequests"
          :header-class="headerClass"
          icon="app:survey-request"
          label="HIPP Requests"
          caption="Add a new HIPP Request or update existing HIPP Request"
        >
          <div class="q-px-md q-pb-sm q-gutter-y-sm column">
            <div class="q-gutter-y-sm column">
              <div>
                The Request has been specifically designed to support the submission of planned survey programs to the Hydroscheme Industry Partnership Program (HIPP).
              </div>
              <div>
                To submit a survey program for consideration to the HIPP please click on “Requests” at the top of this window and either “+ ADD HIPP REQUEST” or select an already existing record in your list to modify.
              </div>
            </div>
            <q-btn
              class="self-center full-width"
              flat label="Add a HIPP Request"
              icon="add"
              :to="'/survey-request/new/registration'">
              <q-tooltip>
                Create a new HIPP Request
              </q-tooltip>
            </q-btn>
          </div>
        </q-expansion-item>

        <q-expansion-item
          :value="expandedPriorityAreas"
          :header-class="headerClass"
          icon="app:priority-areas-dark"
          label="Priority Areas"
          caption="Add a new Priority Area or update existing Priority Area"
        >
          <div class="q-px-md q-pb-sm q-gutter-y-sm column">
            <div class="q-gutter-y-sm column">
              <div>
                Priority areas are designed to capture areas where data capture is important to those submitting for a variety of reasons. Areas identified in this section of the system may be identified of importance for the following reasons:
              </div>
              <ul class="q-my-xs">
                <li>
                  Safety of navigation
                </li>
                <li>
                  Environmental baseline assessment
                </li>
                <li>
                  Resource competition and baseline data
                </li>
                <li>
                  Areas urgently needed to support policy and government decisions
                </li>
              </ul>
              <div>
                When entering a priority area, the submitting organisation assigns a priority from their perspective and both this, and how this then folds into the national prioritisation.
              </div>
              <div>
                These priority areas are provided to a variety of decision makers, and form part of the incoming information for the Australian Hydrographic Office (AHO) for consideration as supplementary material for the annual preparation of Hydroscheme.
              </div>
            </div>
            <q-btn
              class="self-center full-width"
              flat label="Add a Priority Area"
              icon="add"
              :to="'/priority-area-submission/new'">
              <q-tooltip>
                Add a Priority Area Submission
              </q-tooltip>
            </q-btn>
          </div>
        </q-expansion-item>

      </q-list>
    </div>

  </div>


</template>


<script>

import Vue from 'vue';
const _ = require('lodash');

import { errorHandler } from './mixins/error-handling';
import { permission } from './mixins/permission';



export default Vue.extend({
  name: `MainHome`,

  mixins: [errorHandler, permission],

  mounted() {

  },

  methods: {

  },

  watch: {

  },

  computed: {
    expandedAbout: function () {
      return true;
    },
    expandedSurveyPlans: function () {
      return false;
    },
    expandedSurveyRequests: function () {
      return false;
    },
    expandedPriorityAreas: function () {
      return false;
    },
    title() {
      return process.env.PRODUCT_NAME;
    },
  },

  data() {
    return {
      headerClass: "bg-grey-3"
    }
  },

});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">

</style>
