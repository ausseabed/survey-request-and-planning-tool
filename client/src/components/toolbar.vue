<template>
  <q-toolbar color="primary">
    <router-link to="/">
      <img class="ml-2" height="43" src="~/assets/aus-seabed-logo.png"/>
    </router-link>

    <div style="width: 20px" class="gt-xs">
    </div>


    <q-toolbar-title>
      <router-link to="/" style="color: white; text-decoration:none;" class="gt-xs">
        <div class="column">
          <div>
            {{ title }}
          </div>
          <div class="tabs-toolbar-sub-title">
            {{ description }}
          </div>
        </div>

      </router-link>

    </q-toolbar-title>
    <q-btn v-if="!isAuthenticated" color="primary" @click="auth" label="Sign In">
      <q-tooltip anchor="bottom right" self="top right" :offset="[10, 10]" :delay="400">
        Login to AusSeabed
      </q-tooltip>
    </q-btn>
    <q-item v-if="isAuthenticated">
      <q-item-section>
        <q-btn
          flat round dense
          icon="help_outline"
          type="a"
          :href="`/api/document/User Guide/download`"
          target="_blank"
        >
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 4]">Open user guide</q-tooltip>
        </q-btn>
      </q-item-section>

      <q-item-section
        v-if="hasPermission('isAdmin')"
        >
        <q-btn flat round dense icon="settings" to="/admin">
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 4]">Administration</q-tooltip>
        </q-btn>
      </q-item-section>

      <q-item-section>
        <q-btn icon="account_circle" round dense text-color="white">
          <q-menu content-class="bg-primary text-white" :offset="[0, 10]" auto-close>
            <q-list link style="min-width: 140px">
              <!-- <q-item @click="show_profile" clickable class="row">
                <q-item-section>
                  <q-avatar icon="face" />
                </q-item-section>
                <q-item-section>Profile</q-item-section>
              </q-item> -->
              <q-separator />
              <q-item @click="logoutClick" clickable>
                <q-item-section>
                  <q-avatar icon="exit_to_app" />
                </q-item-section>
                <q-item-section>Log Out</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-item-section>


    </q-item>
  </q-toolbar>
</template>
<script>
  import Vue from 'vue'
  import { mapActions, mapMutations, mapState } from 'vuex'

  import { permission } from './mixins/permission'
  import * as mutRoleTypes
    from '../store/modules/role/role-mutation-types'
  import * as mutCustodianTypes
    from '../store/modules/custodian/custodian-mutation-types'

  export default Vue.extend({
    mixins: [permission],

    data() {
      return {

      }
    },

    methods: {
      ...mapActions('auth', [
        'authenticate',
        'logout',
      ]),
      ...mapActions('role', [
        'getUserRole',
      ]),
      ...mapActions('custodian', [
        'getUserCustodian',
      ]),
      ...mapMutations('role', {
        'setUserRole': mutRoleTypes.SET_USER_ROLE,
      }),
      ...mapMutations('custodian', {
        'setUserCustodian': mutCustodianTypes.SET_USER_CUSTODIAN,
      }),
      show_settings() {
        console.log("Show settings here");
      },
      show_profile() {
        console.log("Show profile here");
      },
      logoutClick() {
        this.logout();
        this.$router.push('/login');
      },
      async auth() {
        const authed = await this.authenticate()
        if (authed) {

          if (this.$route.query.redirect) {
            this.$router.push(this.$route.query.redirect);
          } else {
            this.$router.push('/');
          }
        }

      }
    },
    computed: {
      ...mapState('auth', [
        'isAuthenticated',
      ]),
      profile() {
        return {};
      },
      title() {
        return process.env.PRODUCT_NAME;
      },
      description() {
        return process.env.DESCRIPTION;
      }
    },

  });
</script>
