<template>

  <div class="fit">
    foo bar
  </div>
</template>

<script>
import Vue from 'vue'
const _ = require('lodash');
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { required } from 'vuelidate/lib/validators';

import { DirtyRouteGuard } from './../mixins/dirty-route-guard'
import { errorHandler } from './../mixins/error-handling'
import * as mTypes
  from '../../store/modules/role/role-mutation-types'


export default Vue.extend({
  data() {
    return {
    }
  }
});
</script>

<style>


</style>
