<template>
  <q-card inline style="width:100%">
    <q-card-title>
      {{definition.name}}
      <span slot="subtitle" v-if="definition.description">
        {{definition.description}}
      </span>
    </q-card-title>
    <q-card-main>
      <deliverable-field
        v-for="field in definition.fields"
        :field="field"
        :definition="definition"
        :deliverable="deliverable">
      </deliverable-field>
    </q-card-main>
    <pre>{{definition}}</pre>
  </q-card>

</template>
<script>

import Vue from 'vue'


import DeliverableField from './deliverable-field'


export default Vue.extend({
  props: ['definition', 'deliverable'],
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

  }
});

</script>
