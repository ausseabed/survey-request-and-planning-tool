<template>

  <div class="fit">
    <div class="fit">
      <div class="row q-col-gutter-sm full-width">

        <div class="column full-width">
          <q-card v-if="hasPermission('isAdmin')">
            <q-card-section class="row">
              <div class="text-h6">
                Upload new document
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
                      name="documentName"
                      label="Name"
                      attribute="Document name"
                      v-model="documentName"
                      @blur="$v.documentName.$touch"
                      type="text"
                     >
                    </form-field-validated-input>

                    <form-field-validated-select
                      name="documentType"
                      label="Document type"
                      attribute="Document type"
                      v-model="documentType"
                      :options="documentTypes"
                      @blur="$v.documentType.$touch"
                      >
                    </form-field-validated-select>
                  </div>
                  <form-field-validated dense
                    class="col-sm-12 col-md-6"
                    bottom-slots
                    attribute="Document file"
                    name="documentFile"
                    >
                    <q-uploader
                      class="fit" flat bordered
                      hide-upload-btn
                      label="Document file"
                      ref="uploader"
                      :multiple="false"
                      accept=".pdf"
                      :auto-expand="true"
                      url="/api/document/upload/"
                      method="PUT"
                      :form-fields="[{name: 'name', value: documentName}, {name: 'documentType', value: documentType}]"
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
            Active Documents
          </div>

          <document-card
            class="q-mt-sm"
            v-for="doc in activeDocuments"
            :document="doc"
            :key="doc.id">
          </document-card>

          <div class="text-light text-h6 q-pt-md">
            Old Documents
          </div>

          <document-card
            class="q-mt-sm"
            v-for="doc in inactiveDocuments"
            :document="doc"
            :key="doc.id">
          </document-card>

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

import { DirtyRouteGuard } from './../../mixins/dirty-route-guard'
import { permission } from './../../mixins/permission'
import { errorHandler } from './../../mixins/error-handling'
import * as mTypes
  from '../../../store/modules/custodian/custodian-mutation-types'
import DocumentCard from './document-card'

export default Vue.extend({
  mixins: [DirtyRouteGuard, errorHandler, permission],
  components: {
    'document-card': DocumentCard
  },
  beforeMount() {
    this.getFormData();
  },
  mounted() {
  },
  computed: {
    ...mapGetters('document',[
      'documents',
      'documentTypes',
    ]),
    activeDocuments: function () {
      return this.documents.filter((t) => {return t.active});
    },
    inactiveDocuments: function () {
      return this.documents.filter((t) => {return !t.active});
    },
  },

  methods: {
    ...mapActions('document', [
      'getDocuments',
      'getDocumentTypes',
    ]),

    getFormData() {
      this.getDocumentTypes();
      this.getDocuments();
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
        this.notifySuccess("Successfully uploaded document");
      }
      this.getDocuments();
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
      this.documentFile = files;
    },
    removedFile (files) {
      this.documentFile = undefined;
    },
  },

  validations: {
    documentFile: { required },
    documentName: { required },
    documentType: { required },
  },

  watch: {
    'documentTypes': function (newRts, oldRts) {
      if (!_.isNil(newRts) || newRts.length > 0) {
        // automatically set to whatever is first in the list
        this.documentType = newRts[0]
      }
    }
  },

  data() {
    return {
      fileUploadFailed: false,
      documentFile: undefined,
      documentName: undefined,
      documentType: undefined,
      validationMessagesOverride: {}
    }
  }
})
</script>

<style>

</style>
