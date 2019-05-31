<template>

  <q-field
    :label="field.label ? field.label : field.name"
    stack-label
    :readonly="readOnly"
    >
    <q-option-group
      :value="getValue()"
      :options="valueOptions"
      @input="setValue($event)"
    />
  </q-field>

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
      return this.deliverableData[this.field.name];
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
