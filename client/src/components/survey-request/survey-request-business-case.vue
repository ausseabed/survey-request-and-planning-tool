<template>

  <div class="column">

    <q-card-section class="column q-gutter-y-sm">
      <div>
        The HIPP Request process requires entry of a business justification
        and cost benefit analysis directly. If you would also like to
        provide a more detailed response to these questions, please upload an
        attached file for our consideration.
      </div>

      <form-field-validated-input
        name="surveyRequest.businessJustification"
        attribute="Survey Justification"
        label="Survey Justification"
        :value="surveyRequest.businessJustification"
        @input="update({path:'surveyRequest.businessJustification', value:$event})"
        @blur="$v.surveyRequest.businessJustification.$touch"
        type="textarea"
        autogrow
        :readonly="readonly"
        outlined
        >
      </form-field-validated-input>

      <form-field-validated-input
        name="surveyRequest.costBenefit"
        attribute="Cost Benefit"
        label="Cost Benefit"
        :value="surveyRequest.costBenefit"
        @input="update({path:'surveyRequest.costBenefit', value:$event})"
        @blur="$v.surveyRequest.costBenefit.$touch"
        type="textarea"
        autogrow
        :readonly="readonly"
        outlined
        >
      </form-field-validated-input>

      <q-field
        borderless
        :readonly="readonly"
        class="row items-center content-center"
        >
        <q-checkbox
          :disable="readonly"
          class="col-auto"
          label="Additional Funding Available?"
          left-label
          :value="surveyRequest.additionalFundingAvailable"
          @input="update({path:'surveyRequest.additionalFundingAvailable', value:$event})"
          />
        <div class="col row items-center q-pl-md">
          <div class="hint-text">
            Please select if partial funding has been identified and the
            request represents an opportunity to partner with the HIPP.
          </div>
        </div>
      </q-field>

      <div class="row q-col-gutter-sm">
        <div class="column col-auto">
          <q-uploader
            v-if="!readonly"
            label="Additional Business Case File for Upload"
            ref="uploader"
            auto-upload
            flat
            bordered
            :multiple="false"
            :auto-expand="true"
            :url="`/api/attachment/survey-request/${surveyRequest.id}/upload/`"
            method="PUT"
            @failed="uploadFailed"
            @uploaded="uploaded"/>
        </div>
        <div class="column col" v-if="surveyRequest.businessCaseAttachment">
          <div class="hint-text"> Attached file </div>
          <div class="row justify-between">
            <div class="column">
              <div>{{surveyRequest.businessCaseAttachment.fileName}}</div>
              <div class="q-pl-lg hint-text">
                Uploaded {{surveyRequest.businessCaseAttachment.created | dateValue | moment("from", "now")}}
              </div>
            </div>
            <div class="row">
              <q-btn
                type="a"
                size="md" flat dense
                :href="`/api/attachment/survey-request/${surveyRequest.id}/download/${surveyRequest.businessCaseAttachment.fileName}`"
                icon="cloud_download">
                <q-tooltip>
                  Download attachment
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="!readonly"
                size="md" flat dense
                icon="delete"
                @click="deleteFile()"
              >
                <q-tooltip>
                  Delete attachment
                </q-tooltip>
              </q-btn>
            </div>

          </div>

        </div>
        <div v-else>
          <div class="hint-text"> No file attached </div>
        </div>
      </div>


    </q-card-section>

    <q-card-section class="column q-gutter-y-sm">
      <div class="red-text">
        The Australian hydrographic Office will release data publicly
        unless there is an appropriate reason as to why a moratorium on data
        release should be applied.
      </div>

      <q-field
        borderless
        :readonly="readonly"
        >
        <q-checkbox
          :disable="readonly"
          class="col-auto"
          label="Please select if data subject to a moratorium period?"
          left-label
          :value="surveyRequest.hasMoratorium"
          @input="update({path:'surveyRequest.hasMoratorium', value:$event})"
          />
      </q-field>

      <form-field-validated-date
        v-if="surveyRequest.hasMoratorium"
        name="surveyRequest.moratoriumDate"
        attribute="Date moratorium ends"
        label="Moratorium End Date"
        :date="surveyRequest.moratoriumDate"
        @updated-date="update({path:'surveyRequest.moratoriumDate', value:$event})"
        @blur="$v.surveyRequest.moratoriumDate.$touch"
        :readonly="readonly"
        hint="(YYYY/MM/DD)"
        >
      </form-field-validated-date>

      <form-field-validated-input
        v-if="surveyRequest.hasMoratorium"
        name="surveyRequest.moratoriumComment"
        attribute="Moratorium Justification"
        label="Moratorium Justification"
        :value="surveyRequest.moratoriumComment"
        @input="update({path:'surveyRequest.moratoriumComment', value:$event})"
        @blur="$v.surveyRequest.moratoriumComment.$touch"
        type="textarea"
        autogrow
        :readonly="readonly"
        outlined
        >
      </form-field-validated-input>

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
import * as sfMutTypes from '../../store/modules/survey-file/survey-file-mutation-types';

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
    ...mapActions('surveyFile', {
      'deleteSurveyFile': 'deleteFile',
    }),
    ...mapMutations('surveyRequest', {
      'setDirty': srMutTypes.SET_DIRTY,
      'update': srMutTypes.UPDATE,
      'resetSurveyRequest': srMutTypes.RESET_HIPP_REQUEST,
      'updateSurveyRequest': srMutTypes.UPDATE_HIPP_REQUEST,
    }),
    ...mapMutations('organisation', {
      'setOrganisationFilter': organisationMutTypes.SET_FILTER,
    }),
    ...mapMutations('surveyFile', {
      'setFileAttachesTo': sfMutTypes.SET_ATTACHES_TO,
      'setFileAttachesToId': sfMutTypes.SET_ATTACHES_TO_ID,
    }),

    fetchData() {

    },

    filterOrganisationFunction(val, update, abort) {
      this.setOrganisationFilter(val);
      this.getOrganisations().then((orgs) => {
        update();
      });
    },

    isValid() {
      this.$v.$touch();
      return !this.$v.$error;
    },

    uploadFailed (file, xhr) {
      this.notifyError(`Failed to upload`);
      console.log(file);
      console.log(xhr);
    },

    uploaded(info) {
      const attachmentDetails = JSON.parse(info.xhr.response);

      this.update({
        path:'surveyRequest.businessCaseAttachment',
        value:attachmentDetails.attachment}
      );
      this.notifySuccess("Uploaded file successfully");
    },


    deleteFile() {
      this.$q.dialog({
        title: 'Delete attachment',
        message:
          `File attachment ${this.surveyRequest.businessCaseAttachment.fileName} will be permanently deleted`,
        ok: 'Delete',
        cancel: 'Cancel'
      }).onOk(() => {
        this.setFileAttachesTo('survey-request');
        this.setFileAttachesToId(this.surveyRequest.id);
        this.deleteSurveyFile({id: this.surveyRequest.businessCaseAttachment.id});
        this.update({
          path:'surveyRequest.businessCaseAttachment',
          value:undefined
        });
      });
    },
  },

  watch: {

  },

  computed: {
    ...mapGetters('surveyRequest',{
      'surveyRequest': 'surveyRequest',
      'dirty': 'dirty'
    }),
    $v () {
      return this.validator;
    }
  },

  data() {
    return {

    }
  },

});
</script>


<style scoped lang="stylus">

.red-text {
  color: rgba(255, 0, 0, 1.0);
  font-weight: bold;
}

</style>
