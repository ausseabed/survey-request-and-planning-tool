<template>

  <q-field :label-width="2"
           inset="full"
           :label="field.name">
    <!-- <q-input :value="techSpec.gridSize"
             @input="UPDATE({path:'techSpec.gridSize', value: $event})"
             type="text" /> -->
    <component
      :is="field.type"
      :field="field">
    </component>
  </q-field>

</template>
<script>

import Vue from 'vue'
import DeliverableFieldText from './deliverable-field-text';
import DeliverableFieldOptionSingle from './deliverable-field-option-single';

export default Vue.extend({
  props: ['definition', 'field'],
  components: {
    'deliverable-field-text': DeliverableFieldText,
    'deliverable-field-option-single': DeliverableFieldOptionSingle,
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
