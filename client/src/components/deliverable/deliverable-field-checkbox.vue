<template>

  <q-field
    :label="field.label ? field.label : field.name"
    stack-label
    >
    <q-checkbox v-model="deliverableData[field.name]" />
  </q-field>

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
