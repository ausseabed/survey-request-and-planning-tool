<template>

  <div class="fit">
    <div class="fit">
      <div class="row q-col-gutter-sm fit items-stretch">
        <div class="col-sm-12 col-md-6">
          <q-card class="fit column">
            <q-card-section>
              <div class="text-h6">Roles</div>
            </q-card-section>
            <q-separator style="height:1px"/>
            <q-card-section class="full-height col" style="padding:0px">
              <div v-if="roles.length == 0">
                No roles.
              </div>
              <q-scroll-area v-else class="fit">
                <q-list highlight no-border>
                  <q-item
                    v-for="role in roles"
                    :key="role.id"
                    :to="`/admin/roles/${role.id}`"
                    >
                      <q-item-label>
                        {{role.name}}
                      </q-item-label>
                  </q-item>
                </q-list>
              </q-scroll-area>
            </q-card-section>
            <div class="col-auto">
              <q-separator />
              <q-card-actions align="between">

              </q-card-actions>
            </div>
          </q-card>
        </div>

        <div class="col-sm-12 col-md-6">
          <q-card v-if="activeRole" class="fit column">
            <q-card-section class="column q-pb-xs">
              <div class="text-h6">
                {{activeRole.name}}
              </div>
              <div class="column">
                <div v-if="activeRole.isDefault">This is the default role assigned to all new users.</div>
                <div v-if="activeRole.isAdmin">This role allows access to the administration user interface.</div>
              </div>
              <div class="text-subtitle2 q-pt-md">Permissions</div>
            </q-card-section>
            <q-separator style="height:1px !important"/>
            <q-card-section class="full-height col" style="padding:0px">
              <form-wrapper
                :validator="$v"
                :messages="validationMessagesOverride"
                class="overflow-hidden fit column"
              >
                <q-scroll-area class="col">
                  <q-list highlight no-border>
                    <q-item
                      v-for="permission in rolePermissions"
                      :key="permission.key"
                      >
                      <div class="q-gutter-sm full-width">
                        <q-checkbox
                          :disabled="true"
                          :value="activeRole[permission.key]"
                          :label="permission.label" />
                      </div>
                    </q-item>
                  </q-list>
                </q-scroll-area>
              </form-wrapper>
            </q-card-section>
            <div class="col-auto">
              <q-separator />
              <q-card-actions align="right">
                <!-- <q-btn flat icon="save"
                  label="Save"
                  @click="submit()"
                >
                </q-btn> -->
              </q-card-actions>
            </div>

          </q-card>
          <div v-else class="no-active-role column justify-center fit">
            <div class="self-center">
              No role selected.
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
  from '../../store/modules/role/role-mutation-types'


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
    ...mapGetters('role', [
      'activeRole',
      'roles',
    ]),
    rolePermissions: function () {
      if (_.isNil(this.activeRole)) {
        return []
      }
      const ignoreAttrs = ['id', 'name', 'deleted', 'isDefault'];
      const rps = [];
      for (let [key, value] of Object.entries(this.activeRole)) {
        if (ignoreAttrs.includes(key)) {
          continue;
        }
        // convert camelcase attribute name into something a little more
        // human readable for presentation
        var notCamelCase = key.replace( /([A-Z])/g, " $1" );
        notCamelCase = notCamelCase.toLowerCase();
        var label = notCamelCase.charAt(0).toUpperCase() + notCamelCase.slice(1);
        let rp = {
          key: key,
          label: label,
        }
        rps.push(rp)
      }
      return rps
    }
  },

  methods: {
    ...mapActions('role', [
      'getRoles',
    ]),
    ...mapMutations('role', {
      'setActiveRole': mTypes.SET_ACTIVE_ROLE,
      'setDirty': mTypes.SET_DIRTY,
      'updateActiveRoleValue': mTypes.UPDATE_ACTIVE_ROLE_VALUE,
    }),

    getFormData() {
      this.getRoles().then((roles) => {
        if (_.isNil(this.activeRole)) {
          this.updateActiveRole();
        }
      });
    },

    updateActiveRole() {
      if (_.isNil(this.id)) {
        console.log("undefined role")
        this.setActiveRole(undefined);
      } else {
        let role = this.roles.find(existingRole => {
          return existingRole.id == this.id;
        });
        console.log(`defined role ${role}`)
        this.setActiveRole(role);
      }
    },

    submit() {
      this.$v.$touch()

      if (this.$v.$error) {
        this.notifyError('Please review fields')
        return
      }

      const isNew = _.isNil(this.activeUser.id)

      this.saveUser(this.activeUser).then(org => {
        // this.getFormData();
        const successMsg = isNew ? 'Role created' : 'Role updated';
        this.notifySuccess(successMsg);

        // need to check the route, as it may have already been set to something
        // else via "save and continue".
        const currentId = this.$route.params.id;
        if (isNew && currentId == 'new') {
          // then updated the route for the org
          this.$router.replace({ path: `/admin/roles/${org.id}` });
        }
      });
    }
  },

  validations: {
  },

  watch: {
    // call again the method if the route changes
    '$route': function (newRoute, oldRoute) {
      const id =  newRoute.params.id;
      this.id = id;
    },
    'id': function (newId, oldId) {
      this.updateActiveRole();
    }
  },

  data() {
    return {
      id: undefined,
      validationMessagesOverride: {}
    }
  }
})
</script>

<style>
.no-active-role {
  width: 100%;
  height: 200px;
}

</style>
