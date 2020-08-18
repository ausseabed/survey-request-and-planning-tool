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
          <sct-btn
            v-if="!readonly"
            label="Apply to All"
            icon="format_line_spacing"
            @click="applyToAllClicked"
          />
        </div>
      </div>

      <div class="col column q-gutter-xs">

        <form-field-validated-select
          inline
          outlined
          :name="`surveyRequest.aois.$each.${index}.surveyStandard`"
          label="Survey Standard"
          :value="aoi.surveyStandard"
          @input="valueChanged('surveyStandard',$event)"
          :options="surveyStandards"
          @blur="`$v.surveyRequest.aois.$each.${index}.surveyStandard.$touch`"
          :readonly="readonly"
          :hide-bottom-space="true"
        />
        <div
          v-if="aoi.surveyStandard === 'HIPP Precise'"
          class="q-pl-sm hint-text"
        >
          Selection of HIPP Precise must be clearly supported in your survey
          justification or business case.
        </div>
        <div
          v-if="aoi.surveyStandard === 'IHO Special Order'"
          class="q-pl-sm hint-text"
        >
          Selection of IHO Special Order must be clearly supported in your
          survey justification or business case.
        </div>

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
          outlined
          inline
          multiple
          :name="`surveyRequest.aois.$each.${index}.dataTypesToCapture`"
          label="Data Types to Capture"
          :value="aoi.dataTypesToCapture"
          @input="valueChanged('dataTypesToCapture',$event)"
          :options="dataTypes"
          @blur="`$v.surveyRequest.aois.$each.${index}.dataTypesToCapture.$touch`"
          :readonly="readonly"
          :hide-bottom-space="true"
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
    applyToAllClicked() {
      this.$emit(
        'aoi-apply-to-all',
        {
          'propertyName': 'surveyStandard',
          'value': this.aoi.surveyStandard,
        }
      );
      this.$emit(
        'aoi-apply-to-all',
        {
          'propertyName': 'overallRisk',
          'value': this.aoi.overallRisk,
        }
      );
      this.$emit(
        'aoi-apply-to-all',
        {
          'propertyName': 'preferredTimeframe',
          'value': this.aoi.preferredTimeframe,
        }
      );
      this.$emit(
        'aoi-apply-to-all',
        {
          'propertyName': 'dataTypesToCapture',
          'value': this.aoi.dataTypesToCapture,
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
