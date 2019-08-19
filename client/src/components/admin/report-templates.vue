<template>

  <div class="fit">
    <div class="fit">
      <div class="row q-col-gutter-sm full-width">

        <div class="column full-width">
          <q-card v-if="hasPermission('canEditTemplate')">
            <q-card-section class="row">
              <div class="text-h6">
                Upload new template
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <form-wrapper
                :validator="$v"
                :messages="validationMessagesOverride"
                class="row q-col-gutter-md"
              >

                  <div class="col-sm-12 col-md-6 column ">
                    <form-field-validated-input
                      name="reportTemplateName"
                      label="Name"
                      attribute="Template name"
                      v-model="reportTemplateName"
                      @blur="$v.reportTemplateName.$touch"
                      type="text"
                     >
                    </form-field-validated-input>

                    <form-field-validated-select
                      name="reportTemplateType"
                      label="Template type"
                      attribute="Template type"
                      v-model="reportTemplateType"
                      :options="reportTemplateTypes"
                      @blur="$v.reportTemplateType.$touch"
                      >
                    </form-field-validated-select>
                  </div>
                  <form-field-validated dense
                    class="col-sm-12 col-md-6"
                    bottom-slots
                    attribute="Template file"
                    name="reportTemplateFile"
                    >
                    <q-uploader
                      class="fit" flat bordered
                      hide-upload-btn
                      label="Template file"
                      ref="uploader"
                      :multiple="false"
                      accept=".docx"
                      :auto-expand="true"
                      url="/api/report-template/upload/"
                      method="PUT"
                      :form-fields="[{name: 'name', value: reportTemplateName}, {name: 'templateType', value: reportTemplateType}]"
                      @start="uploadStarted"
                      @finish="uploadFinished"
                      @failed="uploadFailed"
                      @added="addedFile"
                      @removed="removedFile"/>
                  </form-field-validated>

              </form-wrapper>
            </q-card-section>

            <div class="col-auto">
              <q-separator />
              <q-card-actions align="right">
                <q-btn flat icon="save"
                  label="Save and upload"
                  @click="submit()"
                >
                </q-btn>
              </q-card-actions>
            </div>

          </q-card>

          <div class="text-h6 q-pt-md">
            Active Templates
          </div>

          <report-template-card
            class="q-mt-sm"
            v-for="template in activeTemplates"
            :template="template"
            :key="template.id">
          </report-template-card>

          <div class="text-light text-h6 q-pt-md">
            Old Templates
          </div>

          <report-template-card
            class="q-mt-sm"
            v-for="template in inactiveTemplates"
            :template="template"
            :key="template.id">
          </report-template-card>

        </div>
      </div>
    </div>
    <confirm-navigation id="confirmNavigation" ref="confirmNavigation"></confirm-navigation>
  </div>
</template>

<script>
import Vue from 'vue'
const _ = require('lodash');
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { required } from 'vuelidate/lib/validators';

import { DirtyRouteGuard } from './../mixins/dirty-route-guard'
import { permission } from './../mixins/permission'
import { errorHandler } from './../mixins/error-handling'
import * as mTypes
  from '../../store/modules/custodian/custodian-mutation-types'
import ReportTemplateCard from './report-template-card'

export default Vue.extend({
  mixins: [DirtyRouteGuard, errorHandler, permission],
  components: {
    'report-template-card': ReportTemplateCard
  },
  beforeMount() {
    this.getFormData();
  },
  mounted() {
  },
  computed: {
    ...mapGetters('reportTemplate',[
      'reportTemplates',
      'reportTemplateTypes',
    ]),
    activeTemplates: function () {
      return this.reportTemplates.filter((t) => {return t.active});
    },
    inactiveTemplates: function () {
      return this.reportTemplates.filter((t) => {return !t.active});
    },
  },

  methods: {
    ...mapActions('reportTemplate', [
      'getReportTemplates',
      'getReportTemplateTypes',
    ]),

    getFormData() {
      this.getReportTemplateTypes();
      this.getReportTemplates();
    },

    submit() {
      this.$v.$touch()
      if (this.$v.$error) {
        this.notifyError('Please review fields')
        return
      }
      this.$refs.uploader.upload();
    },

    uploadStarted () {
      this.fileUploadFailed = false;
    },

    uploadFinished () {
      if (this.fileUploadFailed) {
        this.notifyError(`Failed to upload`);
      } else {
        this.notifySuccess("Successfully uploaded report template");
      }
      this.getReportTemplates();
    },

    uploadFailed (file, xhr) {
      this.fileUploadFailed = true;
      console.log(file);
      console.log(xhr);
    },


    addedFile (files) {
      // we only allow a single file here, so this works (same goes for
      // removedFile). Generally addedFile will only get passed the newly added
      // files; not the whole list.
      this.reportTemplateFile = files;
    },
    removedFile (files) {
      this.reportTemplateFile = undefined;
    },
  },

  validations: {
    reportTemplateFile: { required },
    reportTemplateName: { required },
    reportTemplateType: { required },
  },

  watch: {
    'reportTemplateTypes': function (newRts, oldRts) {
      if (!_.isNil(newRts) || newRts.length > 0) {
        // automatically set to whatever is first in the list
        this.reportTemplateType = newRts[0]
      }
    }
  },

  data() {
    return {
      fileUploadFailed: false,
      reportTemplateFile: undefined,
      reportTemplateName: undefined,
      reportTemplateType: undefined,
      validationMessagesOverride: {}
    }
  }
})
</script>

<style>

</style>
