<template>
  <q-card>
    <q-card-section class="row">
      <div class="col row items-center">
        <div class="text-subtitle1 q-pl-md">
          {{document.name}}
        </div>
      </div>
      <div class="col-auto">
        <q-btn
          type="a"
          :href="`/api/document/${document.id}/download`"
          round flat icon="cloud_download">
          <q-tooltip>
            Download document
          </q-tooltip>
        </q-btn>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section class="row q-col-gutter-sm">
      <div class="column col-6">
        <div>
          <div class="caption-text text-weight-light">Type:</div>
          <div class="q-pl-md">{{document.documentType}}</div>
        </div>
        <div>
          <div class="caption-text text-weight-light">Filename:</div>
          <div class="q-pl-md">{{document.fileName}}</div>
        </div>
        <div>
          <div class="caption-text text-weight-light">Created:</div>
          <div class="q-pl-md">{{document.created | dateString }}</div>
        </div>
      </div>

    </q-card-section>
  </q-card>
</template>
<script>
import { date } from 'quasar'
import Vue from 'vue'

export default Vue.extend({
  props: [
    'document',
  ],
  data() {
    return {}
  },
  methods: {

  },
  computed: {

  }
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
