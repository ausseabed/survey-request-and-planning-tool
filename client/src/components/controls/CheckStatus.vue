<template>
  <q-select flat style="max-width: 180px; "
            :value="status"
            @input="onStatusChanged"
            :color="color"
            :before="beforeicon"
            :after="[]"
            :disabled="disabled"
            :display-value="display_value"
            inverted
            :options="options" />
</template>
<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: ['value', 'disabled', 'status_changed'],
    computed: {
      color() {
        if (this.status === 'PASS') return 'green'
        else if (this.status === 'FAIL') return 'red'
        else if (this.status === 'CPASS') return 'orange'
        else if (this.status === 'PENDING') return 'grey'
        else if (this.status === 'N/A') return 'black'
        else return 'white'
      },
      beforeicon() {
        if (this.status === 'PASS') return [{icon: 'done'}]
        else if (this.status === 'FAIL') return [{icon: 'clear'}]
        else if (this.status === 'CPASS') return [{icon: 'warning'}]
        else if (this.status === 'PENDING') return [{icon: 'hourglass_empty'}]
        else if (this.status === 'N/A') return [{icon: 'block'}]
        else return []
      },
      display_value() {
        return this.status + (this.status_changed === true ? ' *': '')
      }
    },
    methods: {
      onStatusChanged() {
        this.$emit('input', this.status);
      }
    },
    updated() {
      this.status = this.value;
    },
    data() {
      return {
        status: this.value,
        options: [
          { label: 'PASS', value: 'PASS', icon: 'done', leftColor: 'green' },
          { label: 'FAIL', value: 'FAIL', icon: 'clear', leftColor: 'red' },
          { label: 'CPASS', value: 'CPASS', icon: 'warning', leftColor: 'orange' },
          { label: 'PENDING', value: 'PENDING', icon: 'hourglass_empty', leftColor: 'grey' },
          { label: 'N/A', value: 'N/A', icon: 'block', leftColor: 'black' },
        ]
      }
    }
  })
</script>
<style lang="stylus">
</style>
