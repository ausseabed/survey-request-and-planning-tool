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
              {{ getDateString(props.row.created) }}
            </q-td>
            <q-td key="actions" :props="props" style="width: 80px; padding-right: 5px; padding-left: 5px;">
              <div class="row justify-center">
                <q-btn size="md" flat dense
                  icon="cloud_download"
                  @click="downloadFile($event, props.row)"
                  :disable="props.row.downloading"/>
                <q-btn size="md" flat dense
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
          label="Upload"
          class="full-width"
          ref="uploader"
          multiple
          :auto-expand="true"
          url=""
          :factory="uploadFiles"
          @start="uploadStarted"
          @finish="uploadFinished"
          @failed="uploadFailed"/>



      </div>
    </q-page>


  </div>
</template>
<script>
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'
const _ = require('lodash');
import { errorHandler } from './mixins/error-handling'
import { date } from 'quasar'
import * as types
  from '../store/modules/survey-file/survey-file-mutation-types'
const uuidv4 = require('uuid/v4');

const FileDownload = require('js-file-download');

import axios from 'axios';
const path = require('path');


export default Vue.extend({
  mixins: [errorHandler],
  beforeMount() {
    //this.getFormData();
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    ...mapMutations('surveyFile', [
      types.UPDATE,
    ]),

    fetchData () {
      const id = this.$route.params.id;
      this.$store.dispatch(
        'projectMetadata/getProjectMetadata', { id: id });

    },

    downloadFile(e, props) {
      // The vuex store uses axios to download the file. Axios includes the
      // auth bearer token in this request, requried by the web handler, hence
      // a simple html anchor tag with a href wont work.
      this.$store.dispatch(
        'surveyFile/downloadFile',
        {id: props.id, name: props.fileName}
      );
    },

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

    getDateString(dateUtcMilliseconds) {
      const ts = new Date();
      ts.setTime(dateUtcMilliseconds);
      let formattedString = date.formatDate(ts, 'MMMM D, YYYY');
      return formattedString;
    },

    uploadFiles (files) {
      // we need to return a Promise
      // (resolves when upload is done, rejects when there's an error)
      let data = new FormData();
      for (const file of files) {
        data.append('file', file, file.name);
      }

      //
      // var config = {
      //   onUploadProgress: function(progressEvent) {
      //     updateProgress(progressEvent.loaded / progressEvent.total);
      //   }
      // };
      const uploadUrl = `/api/survey-file/${this.projectMetadata.id}/upload/`;
      return axios.put(uploadUrl, data);
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

    hasScrolled (scroll) {
      this.showFloatingButtons = scroll.position > 30;
    },
  },

  computed: {
    ...mapGetters('projectMetadata',[
      'projectMetadata',
    ]),
    ...mapGetters('surveyFile',[
      'files',
      'id',
    ]),
  },

  watch: {
    // call again the method if the route changes
    '$route': function (newRoute, oldRoute) {
      if (this.id == newRoute.params.id) {
        // then we've only set the url, no need to fetch new data
      } else {
        this.fetchData();
      }
    },
    'projectMetadata': function (newPmd, oldPmd) {
      if (newPmd) {
        this.UPDATE({path:'id', value:newPmd.id});
      }
    },
    'id': function (newId, oldId) {
      if (newId) {
        this.$store.dispatch('surveyFile/getFiles');
      } else {
        this.UPDATE({path:'files', value:[]});
      }
    },
  },

  data() {
    return {
      loading: false,
      showFloatingButtons: false,
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
