<template>

  <div class="row justify-center">
    <q-scroll-observable @scroll="hasScrolled"></q-scroll-observable>
    <div inline style="width: 900px; max-width: 90vw;">
      <div class="row justify-between">
        <q-breadcrumbs separator=">" color="light">
          <q-breadcrumbs-el label="Home" icon="home" to="/" />
          <q-breadcrumbs-el label="Survey files" icon="fas fa-clipboard-list" />
        </q-breadcrumbs>
        <div class="row">
          <q-btn icon="arrow_back" label="Technical specifications"
            :to="'/survey-technical-specification/' + projectMetadata.id">
          </q-btn>
          <!-- <q-btn icon="fas fa-save" label="Save"
            @click="submit">
          </q-btn> -->
        </div>
      </div>
    </div>

    <div v-if="loading">Loading...</div>

    <q-page padding class="docs-input row justify-center">
      <transition
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
      >
        <q-page-sticky
          v-if="showFloatingButtons"
          position="bottom-right"
          :offset="[18, 18]"
          style="z-index:100">

          <q-btn
            round
            color="primary"
            :to="'/survey-technical-specification/' + projectMetadata.id"
            icon="arrow_back"
          >
            <q-tooltip :offset="[10, 10]">
              Return to project metadata
            </q-tooltip>
          </q-btn>
          <q-btn
            round
            color="primary"
            @click="submit"
            icon="fas fa-save"
          />
        </q-page-sticky>

      </transition>

      <div style="width: 900px; max-width: 90vw;">

        <q-table
          title="Attachments"
          :data="files"
          :columns="columns"
          row-key="name"
          :rows-per-page-options="[0]"
          :pagination.sync="pagination"
          hide-bottom>
          <q-tr slot="body" slot-scope="props" :props="props">
            <q-td key="fileName" :props="props">
              <span class="text-italic">{{ props.row.fileName }}</span>
            </q-td>
            <!-- <q-td key="calories" :props="props">
              <div class="row items-center justify-between no-wrap">
                <q-btn size="sm" round dense color="secondary" icon="remove" @click="props.row.calories--" class="q-mr-xs" />
                <q-btn size="sm" round dense color="tertiary" icon="add" @click="props.row.calories++" class="q-mr-sm" />
                <div>{{ props.row.calories }}</div>
              </div>
            </q-td> -->
            <q-td key="created" :props="props">
              {{ getDateString(props.row.created) }}
            </q-td>
            <q-td key="actions" :props="props" style="width: 80px; padding-right: 5px; padding-left: 5px;">
              <div class="row justify-center">
                <q-btn size="md" flat dense icon="cloud_download" @click="downloadFile($event, props.row)"/>
                <q-btn size="md" flat dense icon="delete" @click="deleteFile($event, props.row)"/>
              </div>
            </q-td>
          </q-tr>
          <q-tr slot="bottom-row" slot-scope="props">
            <q-td colspan="100%"></q-td>
          </q-tr>
        </q-table>

        <q-card inline style="width:100%">
          <q-card-title> Upload </q-card-title>
          <q-card-main>

            <q-uploader
              ref="uploader"
              :multiple="true"
              :auto-expand="true"
              url=""
              :upload-factory="uploadFiles"
              @finish="uploadFinished"/>

          </q-card-main>

        </q-card>

      </div>
    </q-page>


  </div>
</template>
<script>
import './docs-input.styl'
import Vue from 'vue'
import { filter } from 'quasar'
import { mapGetters, mapMutations } from 'vuex'
const _ = require('lodash');
import { errorHandler } from './../mixins/error-handling'
import { date } from 'quasar'
import * as types
  from '../../store/modules/survey-file/survey-file-mutation-types'
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

    submit() {

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
      }).then(() => {
        this.$store.dispatch('surveyFile/deleteFile', {id: props.id});
      }).catch(() => {
        // Picked "Cancel" or dismissed, nothing to do (just catch error)
      });
    },

    getDateString(dateUtcMilliseconds) {
      const ts = new Date();
      ts.setTime(dateUtcMilliseconds);
      let formattedString = date.formatDate(ts, 'MMMM D, YYYY');
      return formattedString;
    },

    uploadFiles (file, updateProgress) {
      // "file" is an Object containing file's props, including content

      // for updating progress (as 0-1 floating number), we need to call:
      // updateProgress (bytesTransferred / totalBytes)

      // we need to return a Promise
      // (resolves when upload is done, rejects when there's an error)
      let data = new FormData();
      data.append('file', file, file.name);

      var config = {
        onUploadProgress: function(progressEvent) {
          updateProgress(progressEvent.loaded / progressEvent.total);
        }
      };

      const uploadUrl = `/api/survey-file/${this.projectMetadata.id}/upload/`;
      return axios.put(uploadUrl, data, config);
    },

    uploadFinished () {
      this.$refs.uploader.reset();
      this.notifySuccess("Uploaded files");
      // get the file list from the server, each uploaded fiel gets a server
      // asigned id, so theres no shortcut we can do here
      this.$store.dispatch('surveyFile/getFiles');
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
    'projectMetadata.id': function (newId, oldId) {
      if (newId) {
        this.UPDATE({path:'id', value:newId});
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
