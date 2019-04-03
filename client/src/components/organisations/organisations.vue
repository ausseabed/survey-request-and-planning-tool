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
              <form-wrapper
                :validator="$v"
                :messages="validationMessagesOverride"
                class="overflow-hidden"
              >
                <div class="column gutter-sm">
                  <form-field-validated :label-width="1"
                           name="activeOrganisation.name"
                           attribute="Name"
                           label="Name">
                    <q-input :value="activeOrganisation.name"
                             @input="updateActiveOrganisationValue({path:'name', value:$event})"
                             @blur="$v.activeOrganisation.name.$touch"
                             type="text" />
                  </form-field-validated>

                  <form-field-validated :label-width="1"
                           name="activeOrganisation.abn"
                           attribute="ABN"
                           label="ABN"
                           helper="Optional">
                    <q-input :value="activeOrganisation.abn"
                             @input="updateActiveOrganisationValue({path:'abn', value:$event})"
                             @blur="$v.activeOrganisation.abn.$touch"
                             type="text" />
                  </form-field-validated>
                </div>

              </form-wrapper>
            </q-card-main>
            <!-- @input="updateActiveOrganisation({path:'name', value:$event})" -->
            <div class="col-auto">
              <q-card-separator />
              <q-card-actions align="end">
                <q-btn flat icon="save"
                  label="Save organisation"
                  @click="submit()"
                >
                </q-btn>
                <q-btn flat icon="delete"
                  label="Delete organisation"
                  @click="deleteOrgClick()"
                >
                </q-btn>
              </q-card-actions>
            </div>

          </q-card>
          <div v-else class="no-active-organisation column justify-center items-center">
            <div>
              No organisation selected.
            </div>
          </div>

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

import { DirtyRouteGuard } from './../mixins/dirty-route-guard'
import { errorHandler } from './../mixins/error-handling'
import * as mTypes
  from '../../store/modules/organisation/organisation-mutation-types'

// custom validators
const duplicateOrganisationName = function (value, vm) {
  if ( _.isNil(this.organisations)) {
    return true;
  }
  let index = this.organisations.findIndex(org => {
    return org.name == value && vm.id != org.id;
  })
  return index == -1;
};

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
      'saveOrganisation',
      'deleteOrganisation',
    ]),
    ...mapMutations('organisation', {
      'setActiveOrganisation': mTypes.SET_ACTIVE_ORGANISATION,
      'setDirty': mTypes.SET_DIRTY,
      'updateActiveOrganisationValue': mTypes.UPDATE_ACTIVE_ORGANISATION_VALUE,
    }),

    getFormData() {
      this.getOrganisations().then(() => {
        this.updateActiveOrganisation();
      });
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

    updateActiveOrganisation() {
      if (_.isNil(this.id)) {
        this.setActiveOrganisation(undefined);
      } else if (this.id == 'new') {
        let org = {
          id: undefined,
          name: this.getNewOrganisationName("New organisation"),
        };
        this.setActiveOrganisation(org);
        this.setDirty(true);
      } else {
        let org = this.organisations.find(existingOrg => {
          return existingOrg.id == this.id;
        });
        this.setActiveOrganisation(org);
      }

    },

    deleteOrgClick() {
      if (!_.isNil(this.activeOrganisation.id)) {
        // an existing id indicated this org has been saved
        this.$q.dialog({
          title: 'Delete organisation',
          message:
            `Organisation ${this.activeOrganisation.name} will be deleted`,
          ok: 'Delete',
          cancel: 'Cancel'
        }).then(() => {

          this.deleteOrganisation({ id: this.id })
          .then(pmd => {
            //delete org handler sets active org to undefined, so no need here
            this.notifySuccess('Organisation deleted');
            this.$router.replace({ path: `/admin/organisations/` });
          });
        }).catch(() => {
          // Picked "Cancel" or dismissed, nothing to do (just catch error)
        });
      } else {
        // no id, so hasn't been saved. Simply replace active org with nothing
        this.setActiveOrganisation(undefined);
        this.$router.replace({ path: `/admin/organisations/` });
      }
    },

    submit() {
      // save the organisation
      this.$v.$touch()

      if (this.$v.$error) {
        this.notifyError('Please review fields')
        return
      }

      const isNew = _.isNil(this.activeOrganisation.id)

      this.saveOrganisation(this.activeOrganisation).then(org => {
        // this.getFormData();
        const successMsg = isNew ? 'Organisation created' : 'Organisation updated';
        this.notifySuccess(successMsg);

        // need to check the route, as it may have already been set to something
        // else via "save and continue".
        const currentId = this.$route.params.id;
        if (isNew && currentId == 'new') {
          // then updated the route for the org
          this.$router.replace({ path: `/admin/organisations/${org.id}` });
        }
      });
    }
  },

  validations: {
    activeOrganisation: {
      name: { required, duplicateOrganisationName },
      abn: { },
    }
  },

  watch: {
    // call again the method if the route changes
    '$route': function (newRoute, oldRoute) {
      const id =  newRoute.params.id;
      this.id = id;
    },
    'id': function (newId, oldId) {
      console.log(`org id = ${newId}`);
      this.updateActiveOrganisation();
    }
  },

  data() {
    return {
      id: undefined,
      validationMessagesOverride: {
        'duplicateOrganisationName': "Organisation name already exists"
      }
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
