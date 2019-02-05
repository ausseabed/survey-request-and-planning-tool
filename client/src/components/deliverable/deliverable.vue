<template>
  <q-card inline class="row" style="width:100%; margin-left: 2px;">
    <q-card-title >
      <div v-bind:style="{fontWeight: fontWeight}">
        {{definition.name}}
      </div>

      <span slot="subtitle" v-if="definition.description">
        {{definition.description}}
      </span>
    </q-card-title>
    <q-card-main>
      <deliverable-field
        v-for="field in definition.fields"
        :key="field.name"
        :field="field"
        :definition="definition"
        :deliverable="deliverable">
      </deliverable-field>
    </q-card-main>
  </q-card>

</template>
<script>

import Vue from 'vue'


import DeliverableField from './deliverable-field'


export default Vue.extend({
  props: ['definition', 'deliverable', 'selected'],
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
