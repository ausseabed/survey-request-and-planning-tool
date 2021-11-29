<template>
  <form-wrapper :validator="$v">
    <q-card flat bordered class="full-width">
      <q-card-section>
        <div class="main-page-sub-title">{{ areaOfInterest.name }}</div>
      </q-card-section>
      <q-card-section class="row q-col-gutter-md">
        <div
          class="column justify-between q-gutter-y-sm"
          style="max-width: 250px"
        >
          <!-- <div class="column q-gutter-sm"> -->
          <q-img
            class="rounded-borders"
            :src="`api/priority-area/${areaOfInterest.id}/thumbnail`"
            :ratio="1"
            contain
          />
          <!-- </div> -->
          <div class="column q-pt-xs q-gutter-xs">
            <q-badge color="secondary" text-color="white">
              Registration details
            </q-badge>
            <div class="column q-pl-sm reg-details-text">
              <div><b>Identified area name:</b> {{ areaOfInterest.name }}</div>
              <div>
                <b>Seacountry name:</b> {{ areaOfInterest.seacountryName }}
              </div>
              <div>
                <b>Ecological area:</b> {{ areaOfInterest.ecologicalAreaName }}
              </div>
            </div>
          </div>
        </div>

        <div class="col column q-gutter-xs">
          <div>other col</div>
          <div>other col</div>
        </div>
      </q-card-section>
    </q-card>
  </form-wrapper>
</template>

<script>
import Vue from "vue";
const _ = require("lodash");
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { required } from "vuelidate/lib/validators";

import { errorHandler } from "./../mixins/error-handling";
import { permission } from "./../mixins/permission";

export default Vue.extend({
  mixins: [errorHandler, permission],

  async mounted() {},

  props: {
    areaOfInterest: {},
    readonly: true
  },

  methods: {
    isValid() {
      this.$v.$touch();
      return !this.$v.$error;
    }
  },

  watch: {},

  validations() {
    return {
      priorityArea: {}
    };
  },

  computed: {},

  data() {
    return {};
  }
});
</script>


<style scoped lang="stylus">
.reg-details-text {
  div, b {
    font-size: 0.9em;
  }
}
</style>
