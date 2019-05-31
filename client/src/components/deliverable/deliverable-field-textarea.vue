<template>

  <q-input
    :label="field.label ? field.label : field.name"
    type="textarea"
    v-model="deliverableData[field.name]"
    :readonly="readOnly"
  />

</template>
<script>

import Vue from 'vue'

export default Vue.extend({
  props: ['definition', 'field', 'deliverableData', 'readOnly'],
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
