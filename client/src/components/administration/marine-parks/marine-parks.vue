<template>
  <div class="fit">
    <div class="fit">
      <div class="row q-col-gutter-sm full-width">
        <div class="column full-width">
          <q-card v-if="hasPermission('isAdmin')">
            <q-card-section class="row">
              <div class="text-h6">Upload Marine Parks shapfile (zipped)</div>
            </q-card-section>
            <q-card-section>
              <q-uploader
                class="fit"
                flat
                bordered
                label="Zipped Shapefile"
                ref="uploader"
                :multiple="false"
                accept=".zip"
                :auto-expand="true"
                url="/api/marine-park/upload/"
                method="PUT"
                @start="uploadStarted"
                @finish="uploadFinished"
                @failed="uploadFailed"
                @added="addedFile"
                @removed="removedFile"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
const _ = require("lodash");

import { DirtyRouteGuard } from "../../mixins/dirty-route-guard";
import { permission } from "../../mixins/permission";
import { errorHandler } from "../../mixins/error-handling";

export default Vue.extend({
  mixins: [DirtyRouteGuard, errorHandler, permission],

  beforeMount() {},
  mounted() {},
  computed: {},

  methods: {
    uploadStarted() {
      this.fileUploadFailed = false;
    },

    uploadFinished() {
      if (this.fileUploadFailed) {
        this.notifyError(`Failed to upload`);
      } else {
        this.notifySuccess("Successfully uploaded marine parks");
      }
    },

    uploadFailed(file, xhr) {
      this.fileUploadFailed = true;
      console.log(file);
      console.log(xhr);
    },

    addedFile(files) {
      // we only allow a single file here, so this works (same goes for
      // removedFile). Generally addedFile will only get passed the newly added
      // files; not the whole list.
      this.documentFile = files;
    },
    removedFile(files) {
      this.documentFile = undefined;
    }
  },

  watch: {},

  data() {
    return {
      fileUploadFailed: false
    };
  }
});
</script>

<style>
</style>
