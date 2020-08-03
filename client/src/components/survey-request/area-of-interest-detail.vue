<template>

  <q-card flat bordered class="full-width" >
    <q-card-section class="row q-col-gutter-md">
      <div class="column col-auto justify-between">
        <div class="column q-gutter-sm">
          <div>
            {{ aoi.name }}
          </div>
          <q-img
            class="rounded-borders"
            style="width:250px; max-height:250px; "
            :src="`api/survey-request-aoi/${aoi.id}/thumbnail`"
            :ratio="1"
            contain
          />
        </div>
      </div>

      <div class="col column q-gutter-xs">

        <form-field-validated-select
          class="bg-grey-2 q-pa-sm rounded-borders"
          inline
          :name="`surveyRequest.aois.$each.${index}.surveyStandard`"
          label="Survey Standard"
          :value="aoi.surveyStandard"
          @input="valueChanged('surveyStandard',$event)"
          :options="surveyStandards"
          @blur="`$v.surveyRequest.aois.$each.${index}.surveyStandard.$touch`"
          :readonly="readonly"
        />

        <form-field-validated-button-toggle
          class="bg-grey-2 q-pa-sm rounded-borders"
          inline
          :name="`surveyRequest.aois.$each.${index}.overallRisk`"
          label="Overall Risk"
          :value="aoi.overallRisk"
          @input="valueChanged('overallRisk',$event)"
          :options="overallRisks"
          @blur="`$v.surveyRequest.aois.$each.${index}.overallRisk.$touch`"
          :readonly="readonly"
        />

        <form-field-validated-button-toggle
          class="bg-grey-2 q-pa-sm rounded-borders"
          inline
          :name="`surveyRequest.aois.$each.${index}.preferredTimeframe`"
          label="Preferred Timeframe"
          :value="aoi.preferredTimeframe"
          @input="valueChanged('preferredTimeframe',$event)"
          :options="preferredTimeframes"
          @blur="`$v.surveyRequest.aois.$each.${index}.preferredTimeframe.$touch`"
          :readonly="readonly"
        />

        <form-field-validated-select-multiple-check
          class="bg-grey-2 q-pa-sm rounded-borders"
          inline
          multiple
          :name="`surveyRequest.aois.$each.${index}.dataTypesToCapture`"
          label="Data Types to Capture"
          :value="aoi.dataTypesToCapture"
          @input="valueChanged('dataTypesToCapture',$event)"
          :options="dataTypes"
          @blur="`$v.surveyRequest.aois.$each.${index}.dataTypesToCapture.$touch`"
          :readonly="readonly"
        />

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
    ...mapState('surveyRequest',[
      'dataTypes',
      'surveyStandards',
      'overallRisks',
      'preferredTimeframes',
    ]),
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
