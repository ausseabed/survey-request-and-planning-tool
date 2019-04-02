<template>

  <div class="q-my-md fit">
    <div class="fit">
      <div class="row gutter-sm fit content-stretch">
        <div class="col-sm-12 ol-lg-12 col-xl-6 self-stretch ">
          <q-card class="fit column">
            <q-card-title>
              Organisations
            </q-card-title>
            <q-card-separator />
            <q-card-main class="full-height col" style="padding:0px">
              <div v-if="organisations.length == 0">
                No organisations.
              </div>
              <q-scroll-area v-else class="fit">
                <q-list highlight no-border>
                  <q-item
                    v-for="org in organisations"
                    :key="org.id"
                    :to="`/admin/organisation/${org.id}`"
                    >
                      <q-item-main>
                        <q-item-tile label>{{org.name}}</q-item-tile>
                      </q-item-main>
                  </q-item>
                </q-list>
              </q-scroll-area>
            </q-card-main>
            <div class="col-auto">
              <q-card-separator />
              <q-card-actions align="end">
                <q-btn flat icon="add"
                  label="Add new organisation"
                  @click="addNewOrganisation()"
                >
                </q-btn>
              </q-card-actions>
            </div>
          </q-card>
        </div>
        <div class="col-sm-12 col-lg-12 col-xl-6 self-start">
          <q-card class="fit">
            <q-card-title>
              My Org
            </q-card-title>
            <q-card-separator />
            <q-card-main>
              Foo bar
            </q-card-main>
          </q-card>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
const _ = require('lodash');
import { mapActions, mapGetters, mapMutations } from 'vuex'

import { DirtyRouteGuard } from './../mixins/dirty-route-guard'
import { errorHandler } from './../mixins/error-handling'
import * as mTypes from '../../store/modules/tech-spec/tech-spec-mutation-types'

export default Vue.extend({
  mixins: [DirtyRouteGuard, errorHandler],
  beforeMount() {
    this.getFormData();
  },

  components: {
  },
  computed: {
    ...mapGetters('organisation', [
      'activeOrganisation',
      'dirty',
      'organisations',
    ]),
  },

  methods: {
    ...mapActions('organisation', [
      'getOrganisations',
    ]),
    ...mapMutations('organisation', {
      'setActiveOrganisation': mTypes.SET_ACTIVE_ORGANISATION,
      'setDirty': mTypes.SET_DIRTY,
    }),

    getFormData() {
      this.getOrganisations();
    },

    addNewOrganisation() {
      console.log("Add new org");
    },

    submit() {
      // save the organisation
    }
  },

  data() {
    return {

    }
  }
})
</script>

<style>

</style>
