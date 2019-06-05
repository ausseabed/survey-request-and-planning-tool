<template>

  <div class="row justify-center fit">

    <div v-if="loading">Loading...</div>

    <div style="width: 900px; max-width: 900px;" class="column no-wrap fit">
      <div class="q-pa-md fit">
        <q-card class="fit column">
          <q-card-section>
            <div class="text-h6"> Linked Plans </div>
          </q-card-section>
          <q-separator style="height:1px;"/>
          <q-card-section class="column col no-padding">
            <div
              v-if="!projectMetadataList || projectMetadataList.length == 0"
              class="row justify-center fit"
              >
              <div class="column justify-center text-light">
                No survey plans have been created for this HIPP Request.
              </div>
            </div>
            <q-scroll-area
              v-else
              class="fit">
              <q-list no-border padding>

                <q-item clickable
                  v-for="pm in projectMetadataList"
                  :key="pm.id"
                  class="column"
                  :to="`/survey/${pm.id}/summary/`"
                  >
                  <div class="row" style="min-height:100px;">
                    <q-item-section class="column col-sm-6 col-xs-12">
                      <div class="fit column justify-start q-pb-sm">
                        <q-item-label>{{pm.surveyName}}</q-item-label>
                        <q-item-label caption>{{pm.projectStatus}}</q-item-label>
                        <q-item-label caption>{{getDateString(pm.startDate)}}</q-item-label>
                      </div>
                    </q-item-section>

                    <!-- <q-item-section side top>

                      <div>
                        <q-icon :name="getIconDetails(matchingProjMeta).icon" :color="getIconDetails(matchingProjMeta).color" size="16pt" class="self-center"/>
                      </div>
                    </q-item-section> -->
                    <q-item-section class="col-sm-6 col-xs-12 thumbnail-background tn-img-parent rounded-borders justify-center">
                      <img
                        class="tn-img-parent q-pa-sm self-center"
                        :src="`api/project-metadata/${pm.id}/thumbnail`">
                      </img>
                      <div class="top-left q-pa-sm rounded-borders" style="background-color:rgba(255, 255, 255, 0.5);">
                        <div class="text-light">Project AOI</div>
                      </div>

                    </q-item-section>
                  </div>
                </q-item>

              </q-list>

            </q-scroll-area>

          </q-card-section>
          <q-separator style="height:1px;"/>
          <q-card-section
            v-if="this.hasPermission('canAddProject')"
            class="row justify-end">
            <q-btn
              flat icon="add" label="Add plan"
              @click="addProject()"
              >
            </q-btn>
          </q-card-section>
        </q-card>
      </div>

    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
const _ = require('lodash');
import { errorHandler } from '../mixins/error-handling'
import { permission } from './../mixins/permission'
import { date } from 'quasar'
import * as pmMutTypes
  from '../../store/modules/project-metadata/project-metadata-mutation-types'


import axios from 'axios';
const path = require('path');


export default Vue.extend({
  mixins: [errorHandler, permission],

  mounted() {

  },

  methods: {
    ...mapActions('projectMetadata', [
      'getProjectMetadataList',
    ]),
    ...mapMutations('projectMetadata', [
      pmMutTypes.SET_PROJECT_METADATA_LIST_FILTER,
      pmMutTypes.RESET_PROJECT_METADATA,
    ]),
    ...mapMutations('projectMetadata', {
      'projectMetadataUpdate': pmMutTypes.UPDATE,
      'projectSetDirty': pmMutTypes.SET_DIRTY,
    }),

    addProject() {
      this.RESET_PROJECT_METADATA();
      let clonedHippReq = _.cloneDeep(this.hippRequest);
      this.projectMetadataUpdate(
        {path:'projectMetadata.hippRequest', value:clonedHippReq}
      );
      this.projectSetDirty(false);
      this.$router.push({ path: `/survey/new`, query: {reset:false} })
    },

    getDateString(dateUtcMilliseconds) {
      const ts = new Date();
      ts.setTime(dateUtcMilliseconds);
      let formattedString = date.formatDate(ts, 'MMMM D, YYYY');
      return formattedString;
    },



  },

  computed: {
    ...mapGetters('projectMetadata',[
      'projectMetadataList',
      'projectMetadataListFilter',
    ]),
    ...mapGetters('hippRequest',[
      'hippRequest',
    ]),
  },

  watch: {
    'hippRequest.id': {
      handler: function (newId, oldId) {
        let hrfilter = _.isNil(newId) ? undefined : {'hipp-request': newId}
        this.SET_PROJECT_METADATA_LIST_FILTER(hrfilter)
      },
      immediate: true,
    },
    'projectMetadataListFilter': {
      handler: function (newFilter, oldFilter) {
        if (!_.isNil(this.hippRequest.id)) {
          this.getProjectMetadataList()
        }
      },
      immediate: true,
    },
  },

  data() {
    return {
      loading: false,
    }
  }
});

</script>

<style>
.thumbnail-background {
  background: #efefef;
  margin-left: 0px !important;
  position: relative;
}
.thumbnail {
  display: block;
    max-width:230px;
    max-height:95px;
    width: auto;
    height: auto;
}
.top-left {
  position: absolute;
  top: 8px;
  left: 16px;
}

.tn-img-parent {
  width: 100px;
}

.tn-img {
  display: block;
  width: 100%;
  height: auto;
}

</style>
