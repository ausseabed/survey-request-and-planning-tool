<template>
  <div style="padding-right: 8px; padding-bottom: 30px;">
    <deliverable v-for="deliverable in deliverableList"
      :definition="definitionForDeliverable(deliverable)"
      :deliverable="deliverable">
    </deliverable>
  </div>



</template>
<script>

import Vue from 'vue'

import Deliverable from './deliverable'

export default Vue.extend({
  props: [
    'definitionList',
    'deliverableList',
  ],
  components: {
    'deliverable': Deliverable
  },
  data() {
    return {

    }
  },
  methods: {
    definitionForDeliverable(deliverable) {
      const defn = this.definitionList.find((def) => {
        return def.id == deliverable.definitionId;
      });
      if (!defn) {
        throw `Could not find definition with id ${deliverable.definitionId}`;
      }
      return defn;
    }
  },
  computed: {

  }
});

</script>
