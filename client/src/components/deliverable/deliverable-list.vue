<template>
  <div style="padding-bottom: 30px;" class="q-gutter-sm q-px-xs">
    <deliverable v-for="deliverable in deliverableList"
      :key="deliverable.id"
      :id="'deliverable-' + deliverable.id"
      :definition="definitionForDeliverable(deliverable)"
      :deliverable="deliverable"
      :selected="selectedId == deliverable.id">
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
    'selectedId',
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
