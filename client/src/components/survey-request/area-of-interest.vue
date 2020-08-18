<template>

  <q-card flat bordered class="full-width" >
    <q-card-section class="row q-col-gutter-md">
      <div class="column col-auto">
        <div class="column q-gutter-sm">
          <q-badge v-if="aoi.isNew" color="yellow-6" text-color="black">
            New Area of Interest
          </q-badge>
          <q-img
            class="rounded-borders"
            style="width:250px; max-height:250px; "
            :src="`api/survey-request-aoi/${aoi.id}/thumbnail`"
            :ratio="1"
            contain
          />
          <sct-btn
            v-if="!readonly"
            label="Remove"
            icon="delete"
            @click="deleteClicked"
          />
        </div>

      </div>

      <div class="col column q-gutter-xs">
        <form-field-validated-input
          :name="`surveyRequest.aois.$each.${index}.name`"
          label="Area Name"
          attribute="Area Name"
          :value="aoi.name"
          @input="valueChanged('name', $event)"
          type="text"
          @blur="onNameBlur"
          :readonly="readonly"
          outlined
          >
        </form-field-validated-input>

        <q-field
          stack-label borderless
          label="Calculated Area"
          class="bg-grey-2 q-px-sm rounded-borders"
          inline
        >
          <template v-slot:control>
            <div class="self-center full-width no-outline">
              {{aoi.calculatedArea / (1000*1000) | formatNumber}} km²
            </div>
          </template>
        </q-field>

      </div>
    </q-card-section>

  </q-card>

</template>

<script>
import Vue from 'vue';
const _ = require('lodash');
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import { required } from 'vuelidate/lib/validators';

import { errorHandler } from './../mixins/error-handling';
import { permission } from './../mixins/permission';

export default Vue.extend({
  mixins: [errorHandler, permission],

  async mounted() {

  },

  props: [
    'aoi',
    'index',
    'readonly',
    'validator'
  ],

  methods: {
    onNameBlur() {
      this.$v.surveyRequest.aois.$each[this.index].name.$touch();
    },

    valueChanged(propertyName, value) {
      this.$emit(
        'aoi-value-changed',
        {
          'aoi': this.aoi,
          'propertyName': propertyName,
          'value': value,
        }
      );
    },
    deleteClicked() {
      this.$emit(
        'aoi-deleted',
        {
          'aoi': this.aoi,
        }
      );
    },
  },

  watch: {

  },

  computed: {
    $v () {
      return this.validator;
    },
  },

  data() {
    return {

    }
  },

});
</script>


<style scoped lang="stylus">

.calculated-area-div {
  border: 1px solid light-grey;
}

</style>
