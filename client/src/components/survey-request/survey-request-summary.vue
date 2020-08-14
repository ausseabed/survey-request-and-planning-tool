<template>
  <div class="column">

    <q-scroll-area class="col column">

      <q-card-section class="column q-gutter-y-sm col-auto">

        <div class="red-text">
          Please review this information carefully. The information detailed
          below forms the complete submission to the Australian Hydrographic
          Office and will only be made available to change at the AHO's
          direction.
        </div>
      </q-card-section>

      <q-card-section class="column q-gutter-y-sm col">
        <!-- <div class="text-h6">Registration Details</div> -->
        <div class="text-subtitle1">Registration Details</div>

        <div class="column">
          <!-- <div class="text-subtitle1">Title</div> -->
          <div class="hint-text">Title</div>
          <div> {{ surveyRequest.name }} </div>
        </div>

        <div class="column">
          <div class="hint-text">Requesting Organisation</div>
          <div v-if="surveyRequest.organisation"> {{ surveyRequest.organisation.name }} </div>
        </div>

        <div class="column">
          <div class="hint-text">Collaborating {{ (surveyRequest.organisations && surveyRequest.organisations.length > 1) ? 'Organisations' : 'Organisation'}}</div>
          <div v-if="surveyRequest.organisation"> {{ surveyRequest.organisations.map((sc) => sc.name).join(', ') }} </div>
        </div>

        <div class="column">
          <div class="hint-text">Contact Person</div>
          <div> {{ surveyRequest.requestorName }} </div>
        </div>

        <div class="column">
          <div class="hint-text">Contact Persons Role (title)</div>
          <div> {{ surveyRequest.requestorPosition }} </div>
        </div>

        <div class="column">
          <div class="hint-text">Contact email</div>
          <div> {{ surveyRequest.pointOfContactEmail }} </div>
        </div>

        <div class="column">
          <div class="hint-text">System Record {{ (surveyRequest.custodians && surveyRequest.custodians.length) > 1 ? 'Custodians' : 'Custodian'}}</div>
          <div v-if="surveyRequest.custodians"> {{ surveyRequest.custodians.map((sc) => sc.name).join(', ') }} </div>
        </div>
      </q-card-section>

      <q-card-section class="column q-gutter-y-sm col">
        <div class="text-subtitle1">Business Case</div>

        <div class="column">
          <div class="hint-text">Survey Justification</div>
          <div class="long-text"> {{ surveyRequest.businessJustification }} </div>
        </div>

        <div class="column">
          <div class="hint-text">Cost Benefit</div>
          <div class="long-text"> {{ surveyRequest.costBenefit }} </div>
        </div>

        <div class="column">
          <div class="hint-text">Additional Funding Available</div>
          <div> {{ surveyRequest.additionalFundingAvailable ? 'yes' : 'no' }} </div>
        </div>

        <div class="row q-gutter-x-lg">
          <div class="column">
            <div class="hint-text"> Attachment </div>
            <div> {{ surveyRequest.businessCaseAttachment ? surveyRequest.businessCaseAttachment.fileName : 'none' }} </div>
          </div>
          <q-btn
            v-if="surveyRequest.businessCaseAttachment"
            type="a"
            size="md" flat dense
            :href="`/api/attachment/survey-request/${surveyRequest.id}/download/${surveyRequest.businessCaseAttachment.fileName}`"
            icon="cloud_download">
            <q-tooltip>
              Download attachment
            </q-tooltip>
          </q-btn>
        </div>

        <div class="row q-gutter-x-lg">
          <div class="column col-auto">
            <div class="hint-text">Moratorium</div>
            <div> {{ surveyRequest.hasMoratorium ? 'yes' : 'no' }} </div>
          </div>

          <div class="column col-auto" v-if="surveyRequest.hasMoratorium">
            <div class="hint-text">Moratorium End Date</div>
            <div> {{ surveyRequest.moratoriumDate   | dateValue | moment("D MMMM YYYY") }} </div>
          </div>

          <div class="column col" v-if="surveyRequest.hasMoratorium">
            <div class="hint-text">Moratorium Justification</div>
            <div class="long-text full-width"> {{ surveyRequest.moratoriumComment }} </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section
        v-if="surveyRequest.aois"
        class="column q-gutter-y-sm col"
      >
        <div class="text-subtitle1"> {{surveyRequest.aois.length > 1 ? 'Areas' : 'Area' }} of Interest</div>

        <div class="column full-width">
          <div class="hint-text">Risk Issues/Caveats or Constraints</div>
          <div class="long-text"> {{ surveyRequest.riskIssues }} </div>
        </div>

        <div class="column full-width">
          <div class="hint-text">Further Information</div>
          <div class="long-text"> {{ surveyRequest.furtherInformation }} </div>
        </div>

        <div v-if="surveyRequest.aois.length == 0">
          <div> No area of interest provided </div>
        </div>
        <div v-else class="q-gutter-y-lg">
          <div
            v-for="aoi of surveyRequest.aois"
            class="row q-gutter-x-lg"
          >
            <q-img
              class="rounded-borders"
              style="width:330px; max-height:330px; "
              :src="`api/survey-request-aoi/${aoi.id}/thumbnail`"
              :ratio="1"
              contain
            />
            <div class="column q-gutter-y-sm col">
              <div class="column">
                <div class="hint-text">Area Name</div>
                <div> {{ aoi.name }} </div>
              </div>

              <div class="column">
                <div class="hint-text">Calculated Area</div>
                <div> {{ aoi.calculatedArea / (1000*1000) | formatNumber }} km²</div>
              </div>

              <div class="column">
                <div class="hint-text">Survey Standard</div>
                <div> {{ aoi.surveyStandard }} </div>
              </div>

              <div class="column">
                <div class="hint-text">Overall Risk</div>
                <div> {{ aoi.overallRisk }} </div>
              </div>

              <div class="column">
                <div class="hint-text">Overall Risk</div>
                <div> {{ aoi.overallRisk }} </div>
              </div>

              <div class="column">
                <div class="hint-text">Preferred Timeframe</div>
                <div> {{ aoi.preferredTimeframe }} </div>
              </div>

              <div class="column">
                <div class="hint-text">Data Types to Capture</div>
                <div> {{ aoi.dataTypesToCapture.join(', ') }} </div>
              </div>

            </div>
          </div>
        </div>
      </q-card-section>

    </q-scroll-area>


    <q-card-section class="column q-gutter-y-sm col-auto">
      <div class="checkbox-div rounded-borders">
        <div class="q-pa-md">
          <q-checkbox
            v-if="recordState && !(recordState.state === 'submitted') "
            :value="surveyRequest.acknowledged"
            @input="setAcknowledged($event)"
            label="I acknowledge that I have the authority and delegation to submit this request to the Hydroscheme Industry Partnership Program on behalf of my organisation and representatives named in this submission."
          />
          <div
            v-if="recordState && recordState.state === 'submitted'"
          >
            HIPP Request has been submitted
          </div>
        </div>
      </div>
    </q-card-section>
  </div>

</template>

<script>
import Vue from 'vue';
const _ = require('lodash');
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { required, minLength, email } from 'vuelidate/lib/validators';

import { errorHandler } from './../mixins/error-handling';
import { permission } from './../mixins/permission';

import * as organisationMutTypes from '../../store/modules/organisation/organisation-mutation-types';
import * as srMutTypes from '../../store/modules/survey-request/survey-request-mutation-types';

export default Vue.extend({
  mixins: [errorHandler, permission],

  props: [
    'readonly',
  ],

  mounted() {
    this.fetchData();
  },

  methods: {
    ...mapMutations('surveyRequest', {
      'setAcknowledged': srMutTypes.SET_ACKNOWLEDGED,
    }),

    fetchData() {

    },

  },

  watch: {

  },

  computed: {
    ...mapGetters('surveyRequest',{
      surveyRequest: 'surveyRequest',
      dirty: 'dirty',
    }),
    ...mapGetters('recordState', [
      'recordState',
    ]),
  },

  data() {
    return {}
  },

});
</script>


<style scoped lang="stylus">

.checkbox-div {
  border: 1px solid red;
}


.long-text {
  white-space: pre-wrap;
}

</style>
