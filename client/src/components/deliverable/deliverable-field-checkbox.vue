<template>

  <q-checkbox v-model="deliverableData[field.name]" />

</template>
<script>

import Vue from 'vue'

export default Vue.extend({
  props: ['definition', 'field', 'deliverableData'],
  components: {

  },
  data() {
    return {
    }
  },
  methods: {

  },
  computed: {

  }
});

</script>
