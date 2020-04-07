<template>
  <div> Confirmation </div>
</template>

<script>
import Vue from 'vue';
const _ = require('lodash');
import { mapActions, mapGetters, mapMutations } from 'vuex';

import { errorHandler } from './../mixins/error-handling';
import { permission } from './../mixins/permission';

export default Vue.extend({
  mixins: [errorHandler, permission],

  async mounted() {

  },

  methods: {

    isValid() {
      this.$v.$touch();
      return !this.$v.$error;
    },
  },

  watch: {

  },

  validations() {
    return {
      priorityAreaSubmission: {

      }
    }
  },

  computed: {
    ...mapGetters('priorityAreaSubmission',{
      'priorityAreaSubmission': 'activePriorityAreaSubmission',
    }),
  },

  data() {
    return {

    }
  },

});
</script>


<style scoped lang="stylus">

</style>
