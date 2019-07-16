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
                      <q-item-section>
                        {{role.name}}
                      </q-item-section>
                      <q-item-section avatar>
                        <div class="row q-gutter-xs">
                          <q-avatar
                            v-if="role.isDefault"
                            color="primary"
                            text-color="white"
                            size="24px">
                            D
                            <q-tooltip>
                              Default role
                            </q-tooltip>
                          </q-avatar>
                          <q-avatar
                            v-if="role.isAdmin"
                            color="secondary"
                            text-color="white"
                            size="24px">
                            A
                            <q-tooltip>
                              Administration role
                            </q-tooltip>
                          </q-avatar>
                        </div>
                      </q-item-section>
                  </q-item>
                </q-list>
              </q-scroll-area>
            </q-card-section>
            <div class="col-auto">
              <q-separator />
              <q-card-actions align="between">
                <q-btn
                  v-if="!readonly"
                  flat
                  icon="add"
                  label="Add role"
                  to="/admin/roles/new"
                >
                </q-btn>
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

              <form-field-validated-input
                name="activeRole.name"
                attribute="Name"
                label="Name"
                :value="activeRole.name"
                @input="updateActiveRoleValue({path:'name', value:$event})"
                @blur="$v.activeRole.name.$touch"
                type="text"
                v-if="!readonly"
               >
              </form-field-validated-input>

              <q-field
                hint="Default role is automatically assigned to all new users"
                bottom-slots
                borderless
                v-if="!readonly"
                >
                <q-checkbox
                  :disable="activeRole.isDefault"
                  label="Default role"
                  :value="activeRole.isDefault"
                  @input="updateActiveRoleValue({path:'isDefault', value: $event})"
                >
                  <q-tooltip v-if="activeRole.isDefault">
                    To change default role first switch to the desired role and select this toggle.
                  </q-tooltip>
                </q-checkbox>
              </q-field>

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
                          :disable="readonly"
                          :value="activeRole[permission.key]"
                          @input="updateActiveRoleValue({path:permission.key, value:$event})"
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
                <q-btn
                  v-if="!readonly"
                  flat icon="save"
                  label="Save"
                  @click="submit()"
                >
                </q-btn>
                <div>
                  <q-btn
                    v-if="!readonly"
                    :disable="activeRole.isDefault"
                    flat icon="delete"
                    label="Delete"
                    @click="deleteRoleClick()"
                  >
                  </q-btn>
                  <q-tooltip v-if="activeRole.isDefault">
                    Cannot delete default role.
                  </q-tooltip>
                </div>

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
import { permission } from './../mixins/permission'
import * as mTypes
  from '../../store/modules/role/role-mutation-types'


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
    ...mapGetters('role', [
      'activeRole',
      'roles',
      'permissions',
      'dirty',
    ]),
    readonly: function() {
      if (this.hasPermission('canEditRole')) {
        return false;
      } else {
        return true;
      }
    },
    rolePermissions: function () {
      if (_.isNil(this.permissions)) {
        return []
      }
      const ignoreAttrs = ['id', 'name', 'deleted', 'isDefault'];
      const rps = [];
      for (let key of this.permissions) {
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
      'getPermissions',
      'saveRole',
      'deleteRole',
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
      this.getPermissions();
    },

    getNewName() {
      if (this.roles instanceof Array) {
        return `Role (${this.roles.length + 1})`
      } else {
        return 'Role (1)'
      }
    },

    updateActiveRole() {
      if (_.isNil(this.id)) {
        console.log("undefined role")
        this.setActiveRole(undefined);
      } else if (this.id == 'new') {

        let role = {
          id: undefined,
          name: this.getNewName(),
          deleted: false,
          isDefault: false,
        };

        for (let rp of this.rolePermissions) {
          const permName = rp.key;
          role[permName] = false;
        }

        this.setActiveRole(role);
        this.setDirty(true);
      } else {
        let role = this.roles.find(existingRole => {
          return existingRole.id == this.id;
        });
        console.log(`defined role ${role}`)
        this.setActiveRole(role);
      }
    },

    deleteRoleClick() {
      if (_.isNil(this.activeRole)) {
        // shouldn't ever happen
        console.log("Deleting undefined activeRole")
        return
      }
      if (this.activeRole.id) {
        // an existing id indicated this project has been saved, so check
        // with user if they really want to delete project.
        this.$q.dialog({
          title: 'Delete Role',
          message: `Role ${this.activeRole.name} will be deleted. Users with this role will have the default role automatically assigned.`,
          ok: 'Delete',
          cancel: 'Cancel'
        }).onOk(() => {
          this.deleteRole({ id: this.activeRole.id })
          .then(pmd => {
            this.notifySuccess('Deleted Role');
            this.$router.replace({ path: `/admin/roles/` });
          });
        })
      } else {
        // no id, so hasn't been saved. I this case reset form and go back
        // to main page.
        this.setActiveRole(undefined);
        this.$router.replace({ path: `/admin/roles/` })
      }
    },

    submit() {
      this.$v.$touch()

      if (this.$v.$error) {
        this.notifyError('Please review fields')
        return
      }

      const isNew = _.isNil(this.activeRole.id)

      this.saveRole(this.activeRole).then(role => {
        const successMsg = isNew ? 'Role created' : 'Role updated';
        this.notifySuccess(successMsg);

        if (role.isDefault) {
          this.getRoles();
        }

        // need to check the route, as it may have already been set to something
        // else via "save and continue".
        const currentId = this.$route.params.id;
        if (isNew && currentId == 'new') {
          // then updated the route for the org
          this.$router.replace({ path: `/admin/roles/${role.id}` });
        }
      });
    }
  },

  validations: {
    activeRole: {
      name: { required },
    }
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
