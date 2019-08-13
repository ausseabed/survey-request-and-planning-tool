<template>

  <div class="fit">
    <div class="fit">
      <div class="row q-col-gutter-sm fit items-stretch">
        <div class="col-sm-12 col-md-6">
          <q-card class="fit column">
            <q-card-section class="column ">
              <div class="text-h6">Organisations</div>

              <q-input
                outlined
                dense
                debounce="300"
                v-model="filter"
                placeholder="Search"
                class="q-pt-sm"
              >
                <template v-slot:append>
                  <q-icon v-if="filter !== ''" name="close" @click="filter = ''" class="cursor-pointer" />
                  <q-icon name="search" />
                </template>

                <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, -4]">Search by name or ABN</q-tooltip>
              </q-input>

            </q-card-section>
            <q-separator style="height:1px"/>
            <q-card-section class="full-height col" style="padding:0px">
              <div v-if="organisations.length == 0">
                No organisations.
              </div>

              <q-scroll-area v-else class="fit" ref="scrollTargetRef">
                <q-list highlight no-border>
                  <q-infinite-scroll @load="onLoad" :offset="250" :scroll-target="$refs.scrollTargetRef">
                    <q-item
                      v-for="organisation in organisations"
                      :key="organisation.id"
                      :to="`/admin/organisations/${organisation.id}`"
                    >
                      <q-item-label>{{organisation.name}}</q-item-label>
                    </q-item>
                    <template v-slot:loading>
                      <div class="row justify-center q-my-md">
                        <q-circular-progress
                          indeterminate
                          size="20px"
                        />
                      </div>
                    </template>
                  </q-infinite-scroll>
                </q-list>
              </q-scroll-area>

            </q-card-section>
            <div class="col-auto">
              <q-separator />
              <q-card-actions align="between">
                <q-btn
                  v-if="hasPermission('canEditOrganisation')"
                  flat
                  icon="add"
                  label="Add new"
                  to="/admin/organisations/new"
                >
                </q-btn>

              </q-card-actions>
            </div>
          </q-card>
        </div>

        <div class="col-sm-12 col-md-6">
          <q-card v-if="activeOrganisation">
            <q-card-section class="row">
              <div class="text-h6">
                <span> {{activeOrganisation.name}} </span>
              </div>
              <div class="column">
                <div v-if="activeOrganisation && activeOrganisation.requestCount == 0 && activeOrganisation.planCount == 0">This organisation is not referenced by any survey requests or plans and can be edited.</div>
                <div v-else>This organisation is referenced by {{activeOrganisation.requestCount}} survey requests and {{activeOrganisation.planCount}} plans and cannot be edited.</div>
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
                  <form-field-validated-input
                    name="activeOrganisation.name"
                    attribute="Name"
                    label="Name"
                    :value="activeOrganisation.name"
                    @input="updateActiveOrganisationValue({path:'name', value:$event})"
                    @blur="$v.activeOrganisation.name.$touch"
                    type="text"
                    :readonly="readonly"
                   >
                  </form-field-validated-input>

                  <form-field-validated-input
                    name="activeOrganisation.abn"
                    attribute="ABN"
                    label="ABN"
                    hint="Optional"
                    :value="activeOrganisation.abn"
                    @input="updateActiveOrganisationValue({path:'abn', value:$event})"
                    @blur="$v.activeOrganisation.abn.$touch"
                    type="text"
                    :readonly="readonly"
                    >
                  </form-field-validated-input>

                  <form-field-validated-input
                    name="activeOrganisation.description"
                    attribute="Description"
                    label="Description"
                    hint="Optional"
                    :value="activeOrganisation.description"
                    @input="updateActiveOrganisationValue({path:'description', value:$event})"
                    @blur="$v.activeOrganisation.description.$touch"
                    type="text"
                    :readonly="readonly"
                    >
                  </form-field-validated-input>

                  <form-field-validated-input
                    name="activeOrganisation.source"
                    attribute="Source"
                    label="Source"
                    hint="Optional - Link or reference to source of organisation data"
                    :value="activeOrganisation.source"
                    @input="updateActiveOrganisationValue({path:'source', value:$event})"
                    @blur="$v.activeOrganisation.source.$touch"
                    type="text"
                    :readonly="readonly"
                    >
                  </form-field-validated-input>

                  <form-field-validated-input
                    name="activeOrganisation.sourceId"
                    attribute="Source ID"
                    label="Source ID"
                    hint="Optional - Identification number or code used to identify organisation in source data"
                    :value="activeOrganisation.sourceId"
                    @input="updateActiveOrganisationValue({path:'sourceId', value:$event})"
                    @blur="$v.activeOrganisation.sourceId.$touch"
                    type="text"
                    :readonly="readonly"
                    >
                  </form-field-validated-input>
                </div>

              </form-wrapper>
            </q-card-section>

            <div
              v-if="!readonly"
              class="col-auto"
              >
              <q-separator />
              <q-card-actions align="right">
                <q-btn flat icon="save"
                  label="Save"
                  @click="submit()"
                >
                </q-btn>
                <q-btn flat icon="delete"
                  label="Delete"
                  @click="deleteOrganisationClick()"
                >
                </q-btn>

              </q-card-actions>
            </div>

          </q-card>
          <div v-else class="no-active-organisation column justify-center fit">
            <div class="self-center">
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
import { permission } from './../mixins/permission'
import { errorHandler } from './../mixins/error-handling'
import * as mTypes
  from '../../store/modules/organisation/organisation-mutation-types'

// custom validators
const duplicateOrganisationName = function (value, vm) {
  if ( _.isNil(this.organisations) || _.isNil(value)) {
    return true;
  }
  let index = this.organisations.findIndex(organisation => {
    return (organisation.name.toLowerCase() == value.toLowerCase()) && (vm.id != organisation.id);
  })
  return index == -1;
};

const duplicateOrganisationAbn = function (value, vm) {
  if ( _.isNil(this.organisations)) {
    return true;
  }
  let index = this.organisations.findIndex(organisation => {
    if (_.isNil(organisation.abn) || _.isNil(value) ||
      organisation.abn.length == 0 || value.length == 0) {
      return false;
    }
    return (organisation.abn.toLowerCase() == value.toLowerCase()) && (vm.id != organisation.id);
  })
  return index == -1;
};

export default Vue.extend({
  mixins: [DirtyRouteGuard, errorHandler, permission],
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
      'count',
    ]),
    readonly() {
      if (
        !_.isNil(this.activeOrganisation) &&
        (this.activeOrganisation.requestCount != 0 ||
        this.activeOrganisation.planCount != 0)) {
        return true
      } else if (!this.hasPermission('canEditOrganisation')) {
        return true
      }
      return false
    },
  },

  methods: {
    ...mapActions('organisation', [
      'getOrganisations',
      'saveOrganisation',
      'getActiveOrganisation',
      'deleteOrganisation',
    ]),
    ...mapMutations('organisation', {
      'setActiveOrganisation': mTypes.SET_ACTIVE_ORGANISATION,
      'setDirty': mTypes.SET_DIRTY,
      'updateActiveOrganisationValue': mTypes.UPDATE_ACTIVE_ORGANISATION_VALUE,
      'setFilter': mTypes.SET_FILTER,
    }),

    getFormData() {
      this.getOrganisations().then(() => {
      });
      this.updateActiveOrganisation();
    },

    onLoad(index, done) {
      this.getOrganisations().then(() => {
        // console.log('got orgs ' + index + ' '+ this.organisations.length + ' ' + this.count)
        const loadedAll = _.isNil(this.count) ?
          false :
          this.organisations.length >= this.count

        done(loadedAll)
      });
    },

    getNewOrganisationName(base) {
      let count = 0;
      let validNumber = 0;
      // should never be more than 100 organisations that start with "New organisation"
      while (count < 100) {
        let checkFor = count == 0 ? base : `${base} (${count})`;
        let existingIndex = this.organisations.findIndex(existingOrganisation => {
          return existingOrganisation.name == checkFor;
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
        let organisation = {
          id: undefined,
          name: this.getNewOrganisationName("New organisation"),
          description: undefined,
          abn: undefined,
          source: undefined,
          sourceId: undefined,
        };
        this.setActiveOrganisation(organisation);
        this.setDirty(true);
      } else {
        this.getActiveOrganisation(this.id);
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

      this.saveOrganisation(this.activeOrganisation).then(organisation => {
        // this.getFormData();
        const successMsg = isNew ? 'Organisation created' : 'Organisation updated';
        this.notifySuccess(successMsg);

        // need to check the route, as it may have already been set to something
        // else via "save and continue".
        const currentId = this.$route.params.id;
        if (isNew && currentId == 'new') {
          // then updated the route for the organisation
          this.$router.replace({ path: `/admin/organisations/${organisation.id}` });
        }
      }).catch((err) => {
        this.notifyError(`Failed to save organisation`);
      });
    },

    deleteOrganisationClick() {
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
          }).catch(() => {
            this.notifyError('Failed to delete organisation');
          });
        }).onCancel(() => {
          //do nothing
        }).onDismiss(() => {
          //do nothing
        })

      } else {
        // no id, so hasn't been saved. Simply replace active custodian with nothing
        this.setActiveOrganisation(undefined);
        this.$router.replace({ path: `/admin/organisations/` });
      }
    },

    // async saveLots() {
    //   for (let i = 0; i < 120; i++) {
    //     let organisation = {
    //       id: undefined,
    //       name: this.getNewOrganisationName("Test organisation"),
    //       description: undefined,
    //       abn: undefined,
    //       source: undefined,
    //       sourceId: undefined,
    //     };
    //     await this.saveOrganisation(organisation)
    //   }
    // }
  },

  validations: {
    activeOrganisation: {
      name: { required, duplicateOrganisationName },
      abn: { duplicateOrganisationAbn },
      description: {},
      source: {},
      sourceId: {},
    }
  },

  watch: {
    // call again the method if the route changes
    '$route': function (newRoute, oldRoute) {
      const id =  newRoute.params.id;
      this.id = id;
    },
    'id': function (newId, oldId) {
      this.updateActiveOrganisation();
    },
    'filter': function (newFilter, oldFilter) {
      this.setFilter(newFilter)
      this.getOrganisations()
    }
  },

  data() {
    return {
      id: undefined,
      filter: undefined,
      validationMessagesOverride: {
        'duplicateOrganisationName': "Organisation name already exists",
        'duplicateOrganisationAbn': "ABN assigned to other organisation"
      }
    }
  }
})
</script>

<style>


</style>
