<template>

  <div class="fit">
    <div class="fit">
      <div class="row q-col-gutter-sm fit items-stretch">
        <div class="col-sm-12 col-md-6">
          <q-card class="fit column">
            <q-card-section>
              <div class="text-h6">Users</div>
            </q-card-section>
            <q-separator style="height:1px"/>
            <q-card-section class="full-height col" style="padding:0px">
              <div v-if="users.length == 0">
                No users.
              </div>
              <q-scroll-area v-else class="fit">
                <q-list highlight no-border>
                  <q-item
                    v-for="user in users"
                    :key="user.id"
                    :to="`/admin/users/${user.id}`"
                    >
                      <q-item-label>
                        {{user.name}}
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
          <q-card v-if="activeUser">
            <q-card-section class="row">
              <div class="text-h6">
                <strong v-if="activeUser.deleted">Deleted - </strong>
                <span v-bind:class="{ usernamedeleted: activeUser.deleted }"> {{activeUser.name}} </span>
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
                    name="activeUser.name"
                    attribute="Name"
                    label="Name"
                    :value="activeUser.name"
                    @input="updateActiveUserValue({path:'name', value:$event})"
                    @blur="$v.activeUser.name.$touch"
                    type="text"
                    >
                  </form-field-validated-input>

                  <form-field-validated-select
                    name="activeUser.role"
                    label="Role"
                    attribute="Role"
                    :value="activeUser.role"
                    @input="updateActiveUserValue({path:'role', value:$event})"
                    :options="roles"
                    @blur="$v.activeUser.role.$touch"
                    option-value="id"
                    option-label="name"
                    >
                  </form-field-validated-select>
                </div>

              </form-wrapper>
            </q-card-section>
            <div class="col-auto">
              <q-separator />
              <q-card-actions align="right">
                <q-btn flat icon="save"
                  label="Save"
                  @click="submit()"
                >
                </q-btn>
              </q-card-actions>
            </div>

          </q-card>
          <div v-else class="no-active-user column justify-center">
            <div class="self-center">
              No user selected.
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
  from '../../store/modules/user/user-mutation-types'


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
    ...mapGetters('user', [
      'activeUser',
      'dirty',
      'users',
    ]),
    ...mapGetters('role', [
      'roles',
    ]),
  },

  methods: {
    ...mapActions('user', [
      'getUsers',
      'saveUser',
    ]),
    ...mapActions('role', [
      'getRoles',
    ]),
    ...mapMutations('user', {
      'setActiveUser': mTypes.SET_ACTIVE_USER,
      'setDirty': mTypes.SET_DIRTY,
      'updateActiveUserValue': mTypes.UPDATE_ACTIVE_USER_VALUE,
    }),

    getFormData() {
      this.getRoles();
      this.getUsers().then(() => {
        this.updateActiveUser();
      });
    },

    updateActiveUser() {
      if (_.isNil(this.id)) {
        this.setActiveUser(undefined);
      } else {
        let user = this.users.find(existingUser => {
          return existingUser.id == this.id;
        });
        this.setActiveUser(user);
      }
    },

    submit() {
      // save the user
      this.$v.$touch()

      if (this.$v.$error) {
        this.notifyError('Please review fields')
        return
      }

      const isNew = _.isNil(this.activeUser.id)

      this.saveUser(this.activeUser).then(org => {
        // this.getFormData();
        const successMsg = isNew ? 'User created' : 'User updated';
        this.notifySuccess(successMsg);

        // need to check the route, as it may have already been set to something
        // else via "save and continue".
        const currentId = this.$route.params.id;
        if (isNew && currentId == 'new') {
          // then updated the route for the org
          this.$router.replace({ path: `/admin/users/${org.id}` });
        }
      });
    }
  },

  validations: {
    activeUser: {
      name: { required },
      role: { required },
    }
  },

  watch: {
    // call again the method if the route changes
    '$route': function (newRoute, oldRoute) {
      const id =  newRoute.params.id;
      this.id = id;
    },
    'id': function (newId, oldId) {
      console.log(`user id = ${newId}`);
      this.updateActiveUser();
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
.no-active-user {
  width: 100%;
  height: 200px;
}

.user-name-plain {

}
.usernamedeleted {
  text-decoration: line-through;
  color: grey;
}
</style>
