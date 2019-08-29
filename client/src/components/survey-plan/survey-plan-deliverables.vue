<template>

  <q-page class="full-height" style="min-height:300px">
    <q-page-sticky
      v-if="!readOnly"
      position="top-right"
      :offset="[18, 18+66]"
      style="z-index:100">

      <q-btn
        round
        color="primary"
        @click="applyDefaults"
        icon="input"
        class="q-ml-sm"
      >
        <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 4]"> Apply defaults </q-tooltip>
      </q-btn>

      <q-btn
        round
        color="primary"
        @click="submit"
        icon="save"
        class="q-ml-sm"
      >
        <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 4]"> Save deliverables </q-tooltip>
      </q-btn>
    </q-page-sticky>


    <div class="overflow-hidden fit">
      <div class="row q-pl-md q-gutter-md fit ">
        <div class="column col-4 q-gutter-md">

          <q-card
            v-if="!readOnly"
            class="full-width column"
            >
            <div class="col-auto">
              <q-card-section class="full-width">
                <div class="text-h6"> Add deliverables </div>
                <div class="text-caption"> Select deliverable types from the drop down list below to assign to this survey. </div>
              </q-card-section>
              <q-separator />
            </div>
            <q-card-section style="padding:8px" class="full-width">
              <q-select multiple
                class="q-pl-md q-pr-md"
                float-label="Select deliverable types to add"

                v-model="tempDeliverableDefinitions"
                option-label="name"
                option-value="id"
                :options="definitionList"/>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right" class="full-width">
              <q-btn flat icon="add" label="Add"
                :disable="tempDeliverableDefinitions.length == 0"
                @click="addTempDeliverables">
              </q-btn>
            </q-card-actions>
          </q-card>

          <q-card class="full-width column col">
            <div class="col-auto">
              <q-card-section class="full-width">
                <div class="text-h6"> Survey deliverables </div>
                <div class="text-caption"> The following deliverables have been assigned to this survey. </div>
              </q-card-section>
              <q-separator />
            </div>
            <q-card-section class="column col" style="padding:0px">
              <q-scroll-area class="fit" v-if="deliverableList.length != 0">
                <q-list no-border
                  @mouseleave.native="mouseleaveDeliverableList">
                  <q-item clickable
                    v-for="deliverable in deliverableList"
                    @mouseover.native="mouseoverDeliverableList(deliverable)"
                    @click.native="clickDeliverable(deliverable)"
                    :key="deliverable.id">

                    <q-item-section>
                      {{nameForDefinition(deliverable.definitionId)}}
                    </q-item-section>
                    <template v-if="!readOnly">
                      <q-item-section side v-if="activeDeliverableId == deliverable.id">
                        <q-btn flat style="min-height:36px;height:36px;margin-top:-8px;margin-bottom:-8px;padding-top:0px;padding-bottom:0px;" color="primary" icon="close"
                          @click="deleteDeliverable(deliverable)">
                        </q-btn>
                      </q-item-section>
                    </template>
                  </q-item>
                </q-list>
              </q-scroll-area>
              <div class="fit column justify-center items-center" v-else>
                <div class="q-pa-md q-caption" style="color: rgba(0,0,0,0.4);">
                  No deliverables have been assigned to this survey.
                </div>
              </div>
            </q-card-section>

            <div
              v-if="!readOnly"
              class="col-auto"
              >
              <q-separator />
              <q-card-actions align="right">
                <q-btn flat icon="delete" label="Remove all"
                  :disable="deliverableList.length == 0"
                  @click="deleteAllDeliverables">
                </q-btn>
              </q-card-actions>
            </div>
          </q-card>

        </div>
        <div class="col q-pt-md">
          <div class="text-h6">Details</div>
          <q-separator />
          <q-scroll-area class="fit" v-if="deliverableList.length != 0">
            <deliverable-list
              :definitionList="definitionList"
              :deliverableList="deliverables"
              :selectedId="selectedId"
              :readOnly="readOnly">
            </deliverable-list>
          </q-scroll-area>
          <div class="fit column justify-center items-center" v-else>
            <div class="q-pa-md q-caption" style="color: rgba(0,0,0,0.4);">
              No deliverables have been assigned to this survey.
            </div>
          </div>
        </div>
      </div>
    </div>

  </q-page>
</template>
<script>
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'
const _ = require('lodash');
import { errorHandler } from './../mixins/error-handling'
import { permission } from './../mixins/permission'
import { date } from 'quasar'
import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll

import * as types
  from '../../store/modules/deliverable/deliverable-mutation-types'
import { RequestStatus }
  from '../../store/modules/request-status'
import DeliverableList from './../deliverable/deliverable-list'

const path = require('path');


export default Vue.extend({
  mixins: [errorHandler, permission],
  components: {
    'deliverable-list': DeliverableList
  },
  beforeMount() {
    this.getFormData();
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    ...mapMutations('deliverable', [
      types.UPDATE,
      types.SET_DELIVERABLE_LIST,
    ]),

    getFormData() {
      this.$store.dispatch('deliverable/getDefinitionList');
    },

    fetchData () {
      const id = this.$route.params.id;
      this.$store.dispatch(
        'surveyPlan/getProjectMetadata', { id: id });
      this.$store.dispatch(
        'deliverable/getDeliverableList', { id: id })
    },

    nameForDefinition(definitionId) {
      const defn = this.definitionList.find((def) => {
        return def.id == definitionId;
      });
      if (defn) {
        return defn.name;
      } else {
        return `Missing definitionId (${definitionId})`
      }
    },

    applyDefaults() {
      const defaults = this.projectMetadata.surveyApplication.defaults;
      if (_.isNil(defaults)) {
        this.notifyError("No defaults available for survey application.");
      } else if (_.isNil(defaults.deliverables)) {
        this.notifyError(
          "No deliverable defaults available for survey application.");
      } else {
        const surveyDeliverables = []
        for (const dd of defaults.deliverables) {
          const defn = this.definitionList.find((def) => {
            return def.name == dd.name;
          });
          if (_.isNil(defn)) {
            // the defaults include a number of deliverables that are not
            // present in the deliverable definitions SKIP THESE
            continue;
          }

          const sd = {
            definitionId: defn.id,
            projectMetadataId: this.projectMetadata.id,
          }
          if (!_.isNil(dd.data)) {
            sd['data'] = dd.data;
          }

          surveyDeliverables.push(sd);
        }

        if (surveyDeliverables.length == 0) {
          this.notifyInfo("No default deliverables");
        } else {
          const payload = {
            id: this.projectMetadata.id,
            deliverableList: surveyDeliverables,
          }
          this.$store.dispatch('deliverable/addDeliverablesToSurvey', payload);
          this.notifySuccess("Defaults applied");
        }

      }
    },

    submit() {
      // console.log(this.deliverables);
      this.SET_DELIVERABLE_LIST(this.deliverables);

      this.$store.dispatch(
        'deliverable/saveDeliverableList',
        { id: this.projectMetadata.id }
      ).then(pmd => {
        if (this.requestStatus == RequestStatus.SUCCESS) {
          this.notifySuccess('Saved deliverables');
        } else if (this.requestStatus == RequestStatus.ERROR) {
          const status = this.requestError.response.status;
          this.notifyError(
            `Failed to save deliverables (${status})`);
        }
      });

    },

    addTempDeliverables() {
      const surveyDeliverables = this.tempDeliverableDefinitions.map((dd) => {
        const sd = {
          definitionId: dd.id,
          projectMetadataId: this.projectMetadata.id,
        };
        return sd;
      });

      const payload = {
        id: this.projectMetadata.id,
        deliverableList: surveyDeliverables,
      }
      this.$store.dispatch('deliverable/addDeliverablesToSurvey', payload);

      this.tempDeliverableDefinitions = [];
    },

    mouseoverDeliverableList(deliverable) {
      if (_.isNil(deliverable)) {
        return;
      }
      this.activeDeliverableId = deliverable.id;
    },
    mouseleaveDeliverableList() {
      this.activeDeliverableId = undefined;
    },
    deleteDeliverable(deliverable) {
      this.$store.dispatch(
        'deliverable/deleteDeliverable',
        {
          pid: this.projectMetadata.id,
          did: deliverable.id
        });
    },
    deleteAllDeliverables() {
      this.deliverableList.forEach((d) => {
        this.deleteDeliverable(d);
      });
    },

    clickDeliverable(deliverable) {
      this.selectedId = deliverable.id;

      const deliverableElementId = `deliverable-${deliverable.id}`;

      const ele = document.getElementById(deliverableElementId);
      const target = getScrollTarget(ele);
      const offset = ele.offsetTop;
      const duration = 200;
      setScrollPosition(target, offset, duration);
    },

    updateDeliverables() {
      if (!this.deliverableList || !this.definitionList) {
        return;
      }

      const newDeliverables = this.deliverableList.map((d) => {
        const defn = this.definitionList.find((def) => {
          return def.id == d.definitionId;
        });

        const rd = {data: {}};
        defn.fields.forEach((f) => {
          rd.data[f.name] = undefined;
        });
        _.merge(rd, d)
        return rd;
      });

      this.deliverables = newDeliverables;
    },

    heightTweak (offset) {
      return {
        minHeight: offset ? `calc(100vh - ${offset*2}px)` : '100vh',
        height: offset ? `calc(100vh - ${offset*2}px)` : '100vh'
      }
    },
  },

  computed: {
    ...mapGetters('surveyPlan',[
      'projectMetadata',
    ]),
    ...mapGetters('deliverable',[
      'definitionList',
      'deliverableList',
      'requestStatus',
      'requestError',
    ]),
    readOnly: function() {
      if (this.hasPermission('canEditAllProjects')) {
        // can edit all projects
        return false
      } else if (
        this.hasPermission('canEditCustodianProjects') &&
        this.hasCustodianLink('projectMetadata.custodians')
      ) {
        // can only edit projects that are linked to user
        return false
      } else {
        return true
      }
    },
    deliverableDefinitionOptions: function () {
      const opts = this.definitionList.map(dd => {
        return {label: dd.name, value: dd};
      });
      return opts;
    }
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
    'deliverableList': function (deliverables, old) {
      this.updateDeliverables()
    },
    'definitionList': function (definitions, old) {
      this.updateDeliverables()
    },
  },

  data() {
    return {
      loading: false,
      deliverables: [],
      tempDeliverableDefinitions: [],
      activeDeliverableId: undefined,
      selectedId: undefined,
    }
  }
});

</script>
