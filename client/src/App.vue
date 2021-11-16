<template>
  <q-layout view="hHh Lpr lFf" id="q-app">
    <q-header>
      <toolbar></toolbar>
    </q-header>

    <q-page-container>
      <router-view></router-view>

      <q-dialog
        v-model="showDialogue"
        persistent
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card style="width: 450px">
          <q-card-section>
            <div class="text-h6">Thank you for signing up</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            The admin team will need to link your user account to the
            appropriate organisation to gain access to unpublished data. To
            support this process could you please indicate which organisation
            you wish to be assigned too.
          </q-card-section>

          <q-card-section>
            <q-input
              ref="requestedCustodian"
              outlined
              :value="currentUser ? currentUser.requestedCustodian : undefined"
              label="Requested Organisation"
              @input="
                updateCurrentUserValue({
                  path: 'requestedCustodian',
                  value: $event,
                })
              "
              :rules="[(val) => !!val || 'Requested Organisation is required']"
            />
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-primary">
            <sct-btn label="OK" @click="onSubmit" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script>
import Toolbar from "components/toolbar";
import { EventBus } from "./event-bus.js";
import { mapActions, mapMutations } from "vuex";

import { errorHandler } from "./components/mixins/error-handling";
import { permission } from "./components/mixins/permission";

import * as userMutTypes from "./store/modules/user/user-mutation-types";

const appIcons = {
  "app:survey-plan": "layers",
  "app:survey-request": "device_hub",
  "app:priority-areas": "img:statics/icons/priority-areas.svg",
  "app:priority-areas-dark": "img:statics/icons/priority-areas-dark.svg"
};

export default {
  name: "App",
  mixins: [errorHandler, permission],
  components: {
    toolbar: Toolbar
  },
  mounted() {
    if (this.$route.path == "/login" || this.$route.path == "/auth/callback") {
      // part of the login process, don't request role & custodian as these will
      // fail and that causes issues in Safari
    } else {
      this.checkAuthentication();
      try {
        this.getCurrentUser();
      } catch (error) {
        console.log(error);
      }
    }
  },
  created() {
    EventBus.$on("redirect", this.redirectURL);

    this.$q.iconMapFn = iconName => {
      const icon = appIcons[iconName];
      if (icon !== void 0) {
        return { icon: icon };
      }
    };
  },
  methods: {
    ...mapActions("auth", ["checkAuthentication"]),
    ...mapActions("user", ["getCurrentUser", "saveCurrentUser"]),
    ...mapMutations("user", {
      updateCurrentUserValue: userMutTypes.UPDATE_CURRENT_USER_VALUE
    }),
    resetScroll(el, done) {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      done();
    },
    redirectURL(path) {
      this.$router.push(path);
    },
    onSubmit() {
      this.$refs.requestedCustodian.validate();

      if (!this.$refs.requestedCustodian.hasError) {
        this.showDialogue = false;
        this.saveCurrentUser()
          .then(() => {
            this.notifySuccess("User profile updated");
          })
          .catch(err => {
            this.notifyError(`Failed to update user profile`, err);
          });
      }
    }
  },

  data() {
    return {
      showDialogue: false
    };
  },

  watch: {
    currentUser: {
      immediate: false,
      handler(newUser, oldUser) {
        if (!newUser.custodian && !newUser.requestedCustodian) {
          this.showDialogue = true;
        } else {
          this.showDialogue = false;
        }
      }
    }
  }
};
</script>

<style>
</style>
