<template>
  <q-toolbar color="primary">
    <router-link to="/">
      <img class="ml-2" height="43" src="~/assets/aus-seabed-logo.png"/>
    </router-link>

    <q-toolbar-title>
      <router-link to="/" style="color: white; text-decoration:none;">
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
      <q-item-side>
        <q-btn flat round dense icon="settings" to="/admin">
          <q-tooltip>Administration</q-tooltip>
        </q-btn>
      </q-item-side>
      <q-item-side :avatar="profile.avatar">
        <q-popover ref="popover">
          <q-list link>
            <q-item @click.native="show_profile">
              <q-item-side icon="face" />
              <q-item-main label="Profile" />
            </q-item>
            <q-item @click.native="show_settings">
              <q-item-side icon="settings" />
              <q-item-main label="Settings" />
            </q-item>
            <q-item @click.native="logout">
              <q-item-side icon="exit_to_app" />
              <q-item-main label="Log Out" />
            </q-item>
          </q-list>
        </q-popover>
      </q-item-side>
    </q-item>
  </q-toolbar>
</template>
<script>
  import Vue from 'vue'
  import { Quasar,
    QToolbar, QToolbarTitle, QBtn, QTooltip,
    QItem, QItemMain, QItemSide, QPopover, QList
  } from 'quasar'

  export default Vue.extend({
    components: {
      QToolbar, QToolbarTitle, QBtn, QTooltip,
      QItem, QItemMain, QItemSide, QPopover, QList
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
        this.$auth.logout();
        this.isAuthenticated = this.$auth.isAuthenticated();
        this.$router.push('/login');
      },
      auth() {
        if (this.$auth.isAuthenticated()) {
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
    }
  });
</script>
