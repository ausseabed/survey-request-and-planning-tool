<template>

  <q-select multiple
    :label="field.label ? field.label : field.name"
    :value="getValue()"
    :options="valueOptions"
    @input="setValue($event)"
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
    setValue(e) {
      this.deliverableData[this.field.name] = e;
    },
    getValue() {
      const val = this.deliverableData[this.field.name];
      if (val == undefined) {
        return [];
      } else {
        return val;
      }
    },
  },
  computed: {
    valueOptions: function () {
      if (!this.field || !this.field.options) {
        return [];
      }
      const opts = this.field.options.map(opt => {
        return {label: opt, value: opt};
      });
      return opts;
    },
  },
});

</script>
