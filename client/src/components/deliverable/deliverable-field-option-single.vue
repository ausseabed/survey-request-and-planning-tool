<template>

  <q-option-group
    :value="value"
    :options="valueOptions"
    @change="setValue($event)"
  />

</template>
<script>

import Vue from 'vue'

export default Vue.extend({
  props: ['definition', 'field'],
  components: {

  },
  mouted() {
    if (!field.options) {
      throw "no options defined for this option field type";
    }
  },
  data() {
    return {
      value: undefined,
    }
  },
  methods: {
    setValue(e) {
      this.value = e;
    }
  },
  computed: {
    valueOptions: function () {
      const opts = this.field.options.map(opt => {
        return {label: opt, value: opt};
      });
      return opts;
    },
  }
});

</script>
