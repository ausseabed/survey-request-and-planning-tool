<template>
  <form-wrapper :validator="$v">
    <q-card flat bordered class="full-width">
      <q-card-section>
        <div class="main-page-sub-title">{{ areaOfInterest.name }}</div>
      </q-card-section>
      <q-card-section class="row q-gutter-md">
        <div class="column justify-between" style="max-width: 250px">
          <q-img
            class="rounded-borders"
            :src="`api/priority-area/${areaOfInterest.id}/thumbnail`"
            :ratio="1"
            contain
          />
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

        <q-list bordered class="col rounded-borders" ref="expansionItemList">
          <q-expansion-item expand-separator label="Purpose">
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            label="Data collection timeline and cadence"
            icon="schedule"
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
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
    setExpanded(expanded) {
      // expands or contracts all expansion controls
      for (const expansionItem of this.$refs.expansionItemList.$children) {
        if (expanded) {
          expansionItem.show();
        } else {
          expansionItem.hide();
        }
      }
    },

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
