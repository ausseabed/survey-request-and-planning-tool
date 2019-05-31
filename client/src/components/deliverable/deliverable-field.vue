<template>
  <component
    :is="field.type"
    :field="field"
    :deliverableData="deliverable.data"
    :readOnly="readOnly"
    >
  </component>

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
  props: ['definition', 'field', 'deliverable', 'readOnly'],
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
