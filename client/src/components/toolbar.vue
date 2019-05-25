<template>
  <q-toolbar color="primary">
    <router-link to="/">
      <img class="ml-2" height="43" src="~/assets/aus-seabed-logo.png"/>
    </router-link>

    <q-toolbar-title>
      <router-link to="/" style="color: white; text-decoration:none;" class="gt-xs">
        {{ title }}
      </router-link>

      <span slot="subtitle">
        {{ description }}
      </span>
    </q-toolbar-title>
    <q-btn v-if="!isAuthenticated" color="primary" @click="auth" label="Log In">
      <q-tooltip anchor="bottom right" self="top right" :offset="[10, 10]" :delay="400">
        Login with CRCSI
      </q-tooltip>
    </q-btn>
    <q-item v-if="isAuthenticated">
      <q-item-section>
        <q-btn flat round dense icon="settings" to="/admin">
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 4]">Administration</q-tooltip>
        </q-btn>
      </q-item-section>

      <q-item-section avatar>
        <q-avatar rounded text-color="white">
          <img :src="profile.avatar"/>
          <q-menu content-class="bg-primary text-white" :offset="[0, 10]" auto-close>
            <q-list link style="min-width: 140px">
              <q-item @click="show_profile" clickable class="row">
                <q-item-section>
                  <q-avatar icon="face" />
                </q-item-section>
                <q-item-section>Profile</q-item-section>
              </q-item>
              <q-separator />
              <q-item @click="logout" clickable>
                <q-item-section>
                  <q-avatar icon="exit_to_app" />
                </q-item-section>
                <q-item-section>Log Out</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-avatar>
      </q-item-section>


    </q-item>
  </q-toolbar>
</template>
<script>
  import Vue from 'vue'
  import { Quasar,
    QToolbar, QToolbarTitle, QBtn, QTooltip,
    QItem, QList
  } from 'quasar'

  export default Vue.extend({
    components: {
      QToolbar, QToolbarTitle, QBtn, QTooltip,
      QItem, QList
    },
    data() {
      return {
        isAuthenticated: this.$auth.isAuthenticated()
      }
    },
    methods: {
      show_settings() {
        console.log("Show settings here");
      },
      show_profile() {
        console.log("Show profile here");
      },
      logout() {
        this.$q.cookies.remove('Authorization');
        this.$auth.logout();
        this.isAuthenticated = this.$auth.isAuthenticated();
        this.$router.push('/login');
      },
      auth() {
        if (this.$auth.isAuthenticated()) {
          this.$q.cookies.remove('Authorization')
          this.$auth.logout()
        }

        this.$auth.authenticate('crcsi')
        .then(() => {
          this.isAuthenticated = this.$auth.isAuthenticated();
          if (this.isAuthenticated) {
            if (this.$route.query.redirect) {
              this.$router.push(this.$route.query.redirect);
            } else {
              this.$router.push('/');
            }
          }
        })
        .catch((e) => {
          this.isAuthenticated = this.$auth.isAuthenticated();
        });
      }
    },
    computed: {
      profile() {
        if (this.isAuthenticated) {
          return this.$auth.getPayload();
        }
        else {
          return {};
        }
      },
      title() {
        return process.env.PRODUCT_NAME;
      },
      description() {
        return process.env.DESCRIPTION;
      }
    },
    watch: {
      // call again the method if the route changes
      '$route': function (newRoute, oldRoute) {
        this.isAuthenticated = this.$auth.isAuthenticated();
      },
    }

  });
</script>
