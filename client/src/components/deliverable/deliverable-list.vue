<template>
  <div>
    <div v-for="definition in definitionList">
      <deliverable :definition="definition">
      </deliverable>

    </div>
  </div>



</template>
<script>

import Vue from 'vue'

import Deliverable from './deliverable'

export default Vue.extend({
  props: ['definitionList'],
  components: {
    'deliverable': Deliverable
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
