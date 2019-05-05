<template>

  <q-input
    :label="field.label ? field.label : field.name"
    type="text"
    v-model="deliverableData[field.name]"
  />

</template>
<script>

import Vue from 'vue'

export default Vue.extend({
  props: ['definition', 'field', 'deliverableData'],
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
