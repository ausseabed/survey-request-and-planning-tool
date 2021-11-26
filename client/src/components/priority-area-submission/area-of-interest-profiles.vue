<template>
  <div class="scroll">
    <div class="q-pa-sm">Foo</div>

    <div class="column q-pa-sm q-gutter-y-sm">
      <div v-for="(n, i) in 100">Foo {{ i }}</div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
const _ = require("lodash");
import { mapGetters } from "vuex";

import { errorHandler } from "../mixins/error-handling";
import { permission } from "../mixins/permission";

export default Vue.extend({
  mixins: [errorHandler, permission],

  props: ["readonly"],

  mounted() {
    console.log("moungted");
  },

  methods: {
    isValid() {
      this.$v.$touch();
      return !this.$v.$error;
    }
  },

  watch: {},

  computed: {
    ...mapGetters("priorityAreaSubmission", {
      priorityAreaSubmission: "activePriorityAreaSubmission"
    })
  },

  data() {
    return {};
  }
});
</script>


<style scoped lang="stylus"></style>
