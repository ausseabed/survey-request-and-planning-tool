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
                    :to="`/admin/organisations/${org.id}`"
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
                  to="/admin/organisations/new"
                >
                </q-btn>
              </q-card-actions>
            </div>
          </q-card>
        </div>
        <div class="col-sm-12 col-lg-12 col-xl-6 self-start">
          <q-card v-if="activeOrganisation" class="fit">
            <q-card-title>
              {{activeOrganisation.name}}
            </q-card-title>
            <q-card-separator />
            <q-card-main>
              <div>
                {{activeOrganisation.id}}
              </div>
              <div>
                {{activeOrganisation.name}}
              </div>
            </q-card-main>
          </q-card>
          <div v-else class="no-active-organisation column justify-center items-center">
            <div>
              No organisation selected.
            </div>
          </div>
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
import * as mTypes
  from '../../store/modules/organisation/organisation-mutation-types'

export default Vue.extend({
  mixins: [DirtyRouteGuard, errorHandler],
  beforeMount() {
    this.getFormData();
  },
  mounted() {
    const id = this.$route.params.id;
    this.id = id;
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

    getNewOrganisationName(base) {
      let count = 0;
      let validNumber = 0;
      // should never be more than 100 orgs that start with "New organisation"
      while (count < 100) {
        let checkFor = count == 0 ? base : `${base} (${count})`;
        let existingIndex = this.organisations.findIndex(existingOrg => {
          return existingOrg.name == checkFor;
        });
        if (existingIndex == -1) {
          return checkFor;
        }
        count++;
      }

      return `${base} (something is wrong)`;
    },

    submit() {
      // save the organisation
    }
  },

  watch: {
    // call again the method if the route changes
    '$route': function (newRoute, oldRoute) {
      const id =  newRoute.params.id;
      this.id = id;
    },
    'id': function (newId, oldId) {
      console.log(`org id = ${newId}`)
      let org = undefined;
      if (this.id == 'new') {
        org = {
          id: undefined,
          name: this.getNewOrganisationName("New organisation"),
        };
      } else {
        org = this.organisations.find(existingOrg => {
          return existingOrg.id == this.id;
        });
      }

      this.setActiveOrganisation(org);
    }
  },

  data() {
    return {
      id: undefined,
    }
  }
})
</script>

<style>
.no-active-organisation {
  width: 100%;
  height: 200px;
}
</style>
