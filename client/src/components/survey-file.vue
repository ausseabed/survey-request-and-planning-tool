<template>

  <div class="row justify-center">

    <div v-if="loading">Loading...</div>

    <q-page padding class="docs-input row justify-center">
      <div style="width: 900px; max-width: 90vw;" class="q-gutter-y-md">

        <q-table
          title="Attachments"
          class="full-width"
          :data="files"
          :columns="columns"
          row-key="name"
          :rows-per-page-options="[0]"
          :pagination.sync="pagination"
          hide-bottom>
          <q-tr slot="body" slot-scope="props" :props="props">
            <q-td key="fileName" :props="props">
              <span class="text-italic">{{ props.row.fileName }}</span>
              <q-linear-progress class="q-mt-sm" color="secondary"
                v-if="props.row.progress != 0"
                :value="props.row.progress / 100.0" />
            </q-td>
            <q-td key="created" :props="props" style="width: 110px;">
              {{ props.row.created | dateString }}
            </q-td>
            <q-td key="actions" :props="props" style="width: 80px; padding-right: 5px; padding-left: 5px;">
              <div class="row justify-center">
                <q-btn
                  size="md" flat dense
                  icon="cloud_download"
                  @click="downloadFile({id: props.row.id, name: props.row.fileName})"
                  :disable="props.row.downloading"/>
                <q-btn
                  v-if="canDelete"
                  size="md" flat dense
                  icon="delete"
                  @click="deleteFile($event, props.row)"
                  :disable="props.row.downloading"/>
              </div>
            </q-td>
          </q-tr>
          <q-tr slot="bottom-row" slot-scope="props">
            <q-td colspan="100%"></q-td>
          </q-tr>
        </q-table>

        <q-uploader
          v-if="canUpload"
          label="Upload"
          class="full-width"
          ref="uploader"
          multiple
          :auto-expand="true"
          :url="`/api/attachment/${attachesTo}/${attachesToId}/upload/`"
          method="PUT"
          @start="uploadStarted"
          @finish="uploadFinished"
          @failed="uploadFailed"/>
      </div>
    </q-page>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
const _ = require('lodash');
import { permission } from './mixins/permission'
import { errorHandler } from './mixins/error-handling'
import { date } from 'quasar'
import * as types
  from '../store/modules/survey-file/survey-file-mutation-types'

const FileDownload = require('js-file-download');

import axios from 'axios';
const path = require('path');


export default Vue.extend({
  props: ['attachesTo'],
  mixins: [errorHandler, permission],

  mounted() {
    this.SET_ATTACHES_TO(this.attachesTo)
    this.SET_ATTACHES_TO_ID(this.$route.params.id)
  },

  methods: {
    ...mapActions('surveyFile', [
      'getFiles',
      'downloadFile',
    ]),
    ...mapMutations('surveyFile', [
      types.UPDATE,
      types.SET_ATTACHES_TO,
      types.SET_ATTACHES_TO_ID,
    ]),

    deleteFile(e, props) {
      this.$q.dialog({
        title: 'Delete attachment',
        message:
          `File attachment ${props.fileName} will be permanently deleted`,
        ok: 'Delete',
        cancel: 'Cancel'
      }).onOk(() => {
        this.$store.dispatch('surveyFile/deleteFile', {id: props.id});
      });
    },

    uploadStarted () {
      this.fileUploadFailed = false;
    },

    uploadFinished () {
      if (this.fileUploadFailed) {
        this.notifyError(`Failed to upload`);
      } else {
        this.$refs.uploader.reset();
        this.notifySuccess("Uploaded files");
      }

      // get the file list from the server, each uploaded fiel gets a server
      // asigned id, so theres no shortcut we can do here
      this.$store.dispatch('surveyFile/getFiles');
    },

    uploadFailed (file, xhr) {
      this.fileUploadFailed = true;
      console.log(file);
      console.log(xhr);
    },

  },

  computed: {
    ...mapGetters('surveyPlan',[
      'surveyPlan',
    ]),
    ...mapGetters('surveyRequest',[
      'surveyRequest',
    ]),
    ...mapGetters('surveyFile',[
      'files',
      'attachesToId',
    ]),
    custodianLink: function() {
      let custodianLink = undefined
      if (this.attachesTo === 'survey-plan') {
        custodianLink = 'surveyPlan.custodians'
      } else if (this.attachesTo === 'survey-request') {
        custodianLink = 'surveyRequest.custodians'
      }
      return custodianLink
    },
    canDelete: function() {
      if (this.hasPermission('canDeleteAllAttachments')) {
        return true
      } else if (
        this.hasPermission('canDeleteCustodianAttachments') &&
        this.hasCustodianLink(this.custodianLink)
      ) {
        return true
      } else {
        return false
      }
    },
    canUpload: function() {
      if (this.hasPermission('canUploadAllAttachments')) {
        return true
      } else if (
        this.hasPermission('canUploadCustodianAttachments') &&
        this.hasCustodianLink(this.custodianLink)
      ) {
        return true
      } else {
        return false
      }
    },
  },

  watch: {
    'attachesToId': function (newId, oldId) {
      if (newId) {
        this.getFiles()
      } else {
        this.UPDATE({path:'files', value:[]});
      }
    },
  },

  data() {
    return {
      loading: false,
      fileUploadFailed: false,
      columns: [
        {
          name: 'fileName',
          required: true,
          label: 'File name',
          align: 'left',
          field: 'fileName',
          sortable: true
        },
        {
          name: 'created',
          label: 'Created date',
          field: 'created',
          sortable: true,
          format: val => {
            const ts = new Date();
            ts.setTime(val);
            let formattedString = date.formatDate(ts, 'MMMM D, YYYY');
            return formattedString;
          }
        },
        {
          name: 'actions',
          label: 'Actions',
        },
      ],
      pagination: {
        // sortBy: null, // String, column "name" property value
        // descending: false,
        page: 0,
        rowsPerPage: 50 // current rows per page being displayed
      }
    }
  }
});

</script>
