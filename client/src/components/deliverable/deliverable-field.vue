<template>

  <q-field :label-width="4"
           :label="field.label ? field.label : field.name">
    <component
      :is="field.type"
      :field="field"
      :deliverableData="deliverable.data">
    </component>
  </q-field>

</template>
<script>

import Vue from 'vue'
import DeliverableFieldCheckbox from './deliverable-field-checkbox';
import DeliverableFieldText from './deliverable-field-text';
import DeliverableFieldTextArea from './deliverable-field-textarea';
import DeliverableFieldOptionMultiple
  from './deliverable-field-option-multiple';
import DeliverableFieldOptionSingle from './deliverable-field-option-single';

export default Vue.extend({
  props: ['definition', 'field', 'deliverable'],
  components: {
    'deliverable-field-checkbox': DeliverableFieldCheckbox,
    'deliverable-field-text': DeliverableFieldText,
    'deliverable-field-textarea': DeliverableFieldTextArea,
    'deliverable-field-option-multiple': DeliverableFieldOptionMultiple,
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
