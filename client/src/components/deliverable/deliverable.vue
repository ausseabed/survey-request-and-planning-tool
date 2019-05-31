<template>
  <q-card class="column">
    <q-card-section >
      <div v-bind:style="{fontWeight: fontWeight}" class="text-subtitle1">
        {{definition.name}}
      </div>

      <div class="caption" v-if="definition.description">
        {{definition.description}}
      </div>
      <q-separator />
    </q-card-section>

    <q-card-section>
      <deliverable-field
        v-for="field in definition.fields"
        :key="field.name"
        :field="field"
        :definition="definition"
        :deliverable="deliverable"
        :readOnly="readOnly">
      </deliverable-field>
    </q-card-section>
  </q-card>

</template>
<script>

import Vue from 'vue'


import DeliverableField from './deliverable-field'


export default Vue.extend({
  props: ['definition', 'deliverable', 'selected', 'readOnly'],
  components: {
    'deliverable-field': DeliverableField,
  },
  data() {
    return {

    }
  },
  methods: {

  },
  computed: {
    fontWeight: function() {
      return this.selected ? 'bold' : 'normal';
    }
  }
});

</script>
