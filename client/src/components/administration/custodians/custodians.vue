<template>

  <div class="fit">
    <div class="fit">
      <div class="row q-col-gutter-sm fit items-stretch">
        <div class="col-sm-12 col-md-6">
          <q-card class="fit column">
            <q-card-section>
              <div class="text-h6">Custodians</div>
            </q-card-section>
            <q-separator style="height:1px"/>
            <q-card-section class="full-height col" style="padding:0px">
              <div v-if="custodians.length == 0">
                No custodians.
              </div>
              <q-scroll-area v-else class="fit">
                <q-list highlight no-border>
                  <q-item
                    v-for="custodian in custodians"
                    :key="custodian.id"
                    :to="`/admin/custodians/${custodian.id}`"
                    >
                      <q-item-label v-bind:class="{ custodiannamedeleted: custodian.deleted }">
                        {{custodian.name}}
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
                  :value="deletedCustodians"
                  @input="setDeletedCustodiansChange($event)"
                  toggle-indeterminate
                >
                  <div class="q-pl-sm"><small>Show deleted</small></div>
                </q-checkbox>
                <q-btn
                  v-if="hasPermission('canEditCustodian')"
                  flat
                  icon="add"
                  label="Add new"
                  to="/admin/custodians/new"
                >
                </q-btn>

              </q-card-actions>
            </div>
          </q-card>
        </div>

        <div class="col-sm-12 col-md-6">
          <q-card v-if="activeCustodian">
            <q-card-section class="row">
              <div class="text-h6">
                <strong v-if="activeCustodian.deleted">Deleted - </strong>
                <span v-bind:class="{ custodiannamedeleted: activeCustodian.deleted }"> {{activeCustodian.name}} </span>
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
                  <form-field-validated-select
                    name="activeCustodian.name"
                    label="Name"
                    use-input
                    input-debounce="200"
                    @filter="filterOrganisationFunction"
                    :value="activeCustodian.name"
                    @input="updateActiveCustodianValue({path:'name', value:$event})"
                    @new-value="updateActiveCustodianValue({path:'name', value:$event})"
                    :options="organisationNamesList"
                    @blur="$v.activeCustodian.name.$touch"
                    :readonly="!hasPermission('canEditCustodian')"
                    clearable
                    fill-input
                    hide-selected
                    new-value-mode="add-unique"
                    >
                  </form-field-validated-select>
                </div>

              </form-wrapper>
            </q-card-section>
            <!-- @input="updateActiveCustodian({path:'name', value:$event})" -->
            <div
              v-if="hasPermission('canEditCustodian')"
              class="col-auto"
              >
              <q-separator />
              <q-card-actions align="right">
                <q-btn flat icon="save"
                  label="Save"
                  @click="submit()"
                >
                </q-btn>
                <q-btn v-if="activeCustodian.deleted" flat icon="restore_from_trash"
                  label="Restore"
                  @click="restoreCustodianClick()"
                >
                </q-btn>
                <q-btn v-else flat icon="delete"
                  label="Delete"
                  @click="deleteCustodianClick()"
                >
                </q-btn>
              </q-card-actions>
            </div>

          </q-card>
          <div v-else class="no-active-custodian column justify-center fit">
            <div class="self-center">
              No custodian selected.
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

import { DirtyRouteGuard } from './../../mixins/dirty-route-guard'
import { permission } from './../../mixins/permission'
import { errorHandler } from './../../mixins/error-handling'
import * as mTypes
  from '../../../store/modules/custodian/custodian-mutation-types'
import * as organisationMutTypes
  from '../../../store/modules/organisation/organisation-mutation-types'

// custom validators
const duplicateCustodianName = function (value, vm) {
  if ( _.isNil(this.custodians) || _.isNil(value)) {
    return true;
  }
  let index = this.custodians.findIndex(custodian => {
    return (custodian.name.toLowerCase() == value.toLowerCase()) && (vm.id != custodian.id);
  })
  return index == -1;
};

export default Vue.extend({
  mixins: [DirtyRouteGuard, errorHandler, permission],
  beforeMount() {
    this.setDeletedCustodians(null);
    this.getFormData();
  },
  mounted() {
    const id = this.$route.params.id;
    this.id = id;
  },
  components: {
  },
  computed: {
    ...mapGetters('custodian', [
      'activeCustodian',
      'deletedCustodians',
      'dirty',
      'custodians',
    ]),
    ...mapGetters('organisation', {
      organisationsList: 'organisations',
      organisationsCount: 'count',
    }),
    organisationNamesList: function() {
      return this.organisationsList.map((org) => org.name);
    }
  },

  methods: {
    ...mapActions('custodian', [
      'getCustodians',
      'saveCustodian',
      'deleteCustodian',
      'restoreCustodian',
    ]),
    ...mapActions('organisation', [
      'getOrganisations',
    ]),
    ...mapMutations('custodian', {
      'setActiveCustodian': mTypes.SET_ACTIVE_CUSTODIAN,
      'setDeletedCustodians': mTypes.SET_DELETED_CUSTODIANS,
      'setDirty': mTypes.SET_DIRTY,
      'updateActiveCustodianValue': mTypes.UPDATE_ACTIVE_CUSTODIAN_VALUE,
    }),
    ...mapMutations('organisation', {
      'setOrganisationFilter': organisationMutTypes.SET_FILTER,
    }),

    filterOrganisationFunction(val, update, abort) {
      // setting the custodian name here is a workaround for setting the name
      // on when focus is lost. Without the user is required to press enter
      // on non-autocomplete options.
      this.updateActiveCustodianValue({path:'name', value:val})
      this.setOrganisationFilter(val)
      this.getOrganisations().then((orgs) => {
        update()
      })
    },

    setDeletedCustodiansChange(deletedCustodians) {
      // deletedCustodians can be true, false, or null
      this.setDeletedCustodians(deletedCustodians);
      this.getFormData();
    },

    getFormData() {
      this.getCustodians().then(() => {
        this.updateActiveCustodian();
      });
    },

    getNewCustodianName(base) {
      let count = 0;
      let validNumber = 0;
      // should never be more than 100 custodians that start with "New custodian"
      while (count < 100) {
        let checkFor = count == 0 ? base : `${base} (${count})`;
        let existingIndex = this.custodians.findIndex(existingCustodian => {
          return existingCustodian.name == checkFor;
        });
        if (existingIndex == -1) {
          return checkFor;
        }
        count++;
      }

      return `${base} (something is wrong)`;
    },

    updateActiveCustodian() {
      if (_.isNil(this.id)) {
        this.setActiveCustodian(undefined);
      } else if (this.id == 'new') {
        let custodian = {
          id: undefined,
          name: this.getNewCustodianName("New custodian"),
          deleted: false,
        };
        this.setActiveCustodian(custodian);
        this.setDirty(true);
      } else {
        let custodian = this.custodians.find(existingCustodian => {
          return existingCustodian.id == this.id;
        });
        this.setActiveCustodian(custodian);
      }

    },

    restoreCustodianClick() {
      this.restoreCustodian(this.activeCustodian.id)
      .then(custodian => {
        this.updateActiveCustodianValue('deleted', false);
        this.setDirty(false);
        this.notifySuccess('Custodian restored');
        if (!_.isNil(this.deletedCustodians)) {
          // don't need to get form data if we are looking at complete
          // list or custodians including deleted, and non-deleted
          this.getFormData();
        }
      });
    },

    deleteCustodianClick() {
      if (!_.isNil(this.activeCustodian.id)) {
        // an existing id indicated this custodian has been saved

        this.$q.dialog({
          title: 'Delete custodian',
          message:
            `Custodian ${this.activeCustodian.name} will be deleted`,
          ok: 'Delete',
          cancel: 'Cancel'
        }).onOk(() => {
          this.deleteCustodian({ id: this.id })
          .then(pmd => {
            //delete custodian handler sets active custodian to undefined, so no need here
            this.notifySuccess('Custodian deleted');
            if (!_.isNil(this.deletedCustodians)) {
              // don't need to get form data if we are looking at complete
              // list or custodians including deleted, and non-deleted
              this.getFormData();
            }
          });
        }).onCancel(() => {
          //do nothing
        }).onDismiss(() => {
          //do nothing
        })

      } else {
        // no id, so hasn't been saved. Simply replace active custodian with nothing
        this.setActiveCustodian(undefined);
        this.$router.replace({ path: `/admin/custodians/` });
      }
    },

    submit() {
      // save the custodian
      this.$v.$touch()

      if (this.$v.$error) {
        this.notifyError('Please review fields')
        return
      }

      const isNew = _.isNil(this.activeCustodian.id)

      this.saveCustodian(this.activeCustodian).then(custodian => {
        // this.getFormData();
        const successMsg = isNew ? 'Custodian created' : 'Custodian updated';
        this.notifySuccess(successMsg);

        // need to check the route, as it may have already been set to something
        // else via "save and continue".
        const currentId = this.$route.params.id;
        if (isNew && currentId == 'new') {
          // then updated the route for the custodian
          this.$router.replace({ path: `/admin/custodians/${custodian.id}` });
        }
      });
    }
  },

  validations: {
    activeCustodian: {
      name: { required, duplicateCustodianName },
    }
  },

  watch: {
    // call again the method if the route changes
    '$route': function (newRoute, oldRoute) {
      const id =  newRoute.params.id;
      this.id = id;
    },
    'id': function (newId, oldId) {
      console.log(`custodian id = ${newId}`);
      this.updateActiveCustodian();
    }
  },

  data() {
    return {
      id: undefined,
      validationMessagesOverride: {
        'duplicateCustodianName': "Custodian name already exists",
      }
    }
  }
})
</script>

<style>
.no-active-custodian {
  width: 100%;
  height: 200px;
}

.custodian-name-plain {

}
.custodiannamedeleted {
  text-decoration: line-through;
  color: grey;
}
</style>
