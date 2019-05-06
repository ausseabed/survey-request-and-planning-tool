<template>

  <div class="q-my-md fit">
    <div class="fit">
      <div class="row q-gutter-sm fit content-stretch">
        <div class="col-sm-12 ol-lg-12 col-xl-6 self-stretch ">
          <q-card class="fit column">
            <q-card-section>
              <div class="text-h6">Organisations</div>
            </q-card-section>
            <q-separator />
            <q-card-section class="full-height col" style="padding:0px">
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
                      <q-item-label v-bind:class="{ organisationnamedeleted: org.deleted }">
                        {{org.name}}
                      </q-item-label>
                  </q-item>
                </q-list>
              </q-scroll-area>
            </q-card-section>
            <div class="col-auto">
              <q-separator />
              <q-card-actions align="between">
                <q-checkbox
                  class="q-pl-sm"
                  :value="deletedOrganisations"
                  @change="setDeletedOrganisationsChange($event)"
                  toggle-indeterminate
                >
                  <div class="q-pl-sm"><small>Show deleted</small></div>
                </q-checkbox>
                <q-btn flat icon="add"
                  label="Add new"
                  to="/admin/organisations/new"
                >
                </q-btn>

              </q-card-actions>
            </div>
          </q-card>
        </div>

        <div class="col-sm-12 col-lg-12 col-xl-6 self-start">
          <q-card v-if="activeOrganisation" class="fit">
            <q-card-section class="row">
              <div class="text-h6">
                <strong v-if="activeOrganisation.deleted">Deleted - </strong>
                <span v-bind:class="{ organisationnamedeleted: activeOrganisation.deleted }"> {{activeOrganisation.name}} </span>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <form-wrapper
                :validator="$v"
                :messages="validationMessagesOverride"
                class="overflow-hidden"
              >
                <div class="column q-gutter-sm">
                  <form-field-validated-input :label-width="2"
                           name="activeOrganisation.name"
                           attribute="Name"
                           label="Name"
                           :value="activeOrganisation.name"
                            @input="updateActiveOrganisationValue({path:'name', value:$event})"
                            @blur="$v.activeOrganisation.name.$touch"
                            type="text"
                           >
                  </form-field-validated-input>

                  <form-field-validated-input :label-width="2"
                           name="activeOrganisation.abn"
                           attribute="ABN"
                           label="ABN"
                           helper="Optional"
                           :value="activeOrganisation.abn"
                                    @input="updateActiveOrganisationValue({path:'abn', value:$event})"
                                    @blur="$v.activeOrganisation.abn.$touch"
                                    type="text" >
                  </form-field-validated-input>
                </div>

              </form-wrapper>
            </q-card-section>
            <!-- @input="updateActiveOrganisation({path:'name', value:$event})" -->
            <div class="col-auto">
              <q-separator />
              <q-card-actions align="right">
                <q-btn flat icon="save"
                  label="Save"
                  @click="submit()"
                >
                </q-btn>
                <q-btn v-if="activeOrganisation.deleted" flat icon="restore_from_trash"
                  label="Restore"
                  @click="restoreOrgClick()"
                >
                </q-btn>
                <q-btn v-else flat icon="delete"
                  label="Delete"
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
  if ( _.isNil(this.organisations) || _.isNil(value)) {
    return true;
  }
  let index = this.organisations.findIndex(org => {
    return (org.name.toLowerCase() == value.toLowerCase()) && (vm.id != org.id);
  })
  return index == -1;
};

const duplicateOrganisationAbn = function (value, vm) {
  if ( _.isNil(this.organisations)) {
    return true;
  }
  let index = this.organisations.findIndex(org => {
    if (_.isNil(org.abn) || _.isNil(value) ||
      org.abn.length == 0 || value.length == 0) {
      return false;
    }
    return (org.abn.toLowerCase() == value.toLowerCase()) && (vm.id != org.id);
  })
  return index == -1;
};

export default Vue.extend({
  mixins: [DirtyRouteGuard, errorHandler],
  beforeMount() {
    this.setDeletedOrganisations(null);
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
      'deletedOrganisations',
      'dirty',
      'organisations',
    ]),
  },

  methods: {
    ...mapActions('organisation', [
      'getOrganisations',
      'saveOrganisation',
      'deleteOrganisation',
      'restoreOrganisation',
    ]),
    ...mapMutations('organisation', {
      'setActiveOrganisation': mTypes.SET_ACTIVE_ORGANISATION,
      'setDeletedOrganisations': mTypes.SET_DELETED_ORGANISATIONS,
      'setDirty': mTypes.SET_DIRTY,
      'updateActiveOrganisationValue': mTypes.UPDATE_ACTIVE_ORGANISATION_VALUE,
    }),

    setDeletedOrganisationsChange(deletedOrganisations) {
      // deletedOrganisations can be true, false, or null
      this.setDeletedOrganisations(deletedOrganisations);
      this.getFormData();
    },

    getFormData() {
      this.getOrganisations().then(() => {
        this.updateActiveOrganisation();
      });
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
          deleted: false,
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

    restoreOrgClick() {
      this.restoreOrganisation(this.activeOrganisation.id)
      .then(org => {
        this.updateActiveOrganisationValue('deleted', false);
        this.setDirty(false);
        this.notifySuccess('Organisation restored');
        if (!_.isNil(this.deletedOrganisations)) {
          // don't need to get form data if we are looking at complete
          // list or orgs including deleted, and non-deleted
          this.getFormData();
        }
      });
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
        }).onOk(() => {
          this.deleteOrganisation({ id: this.id })
          .then(pmd => {
            //delete org handler sets active org to undefined, so no need here
            this.notifySuccess('Organisation deleted');
            if (!_.isNil(this.deletedOrganisations)) {
              // don't need to get form data if we are looking at complete
              // list or orgs including deleted, and non-deleted
              this.getFormData();
            }
          });
        }).onCancel(() => {
          //do nothing
        }).onDismiss(() => {
          //do nothing
        })

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
      abn: { duplicateOrganisationAbn },
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
        'duplicateOrganisationName': "Organisation name already exists",
        'duplicateOrganisationAbn': "ABN assigned to other organisation"
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

.organisation-name-plain {

}
.organisationnamedeleted {
  text-decoration: line-through;
  color: grey;
}
</style>
