<template>

  <q-input
    type="text"
    v-model="value"
  />

</template>
<script>

import Vue from 'vue'

export default Vue.extend({
  props: ['definition', 'field'],
  components: {

  },
  data() {
    return {
      value: undefined,
    }
  },
  methods: {

  },
  computed: {

  }
});

</script>
