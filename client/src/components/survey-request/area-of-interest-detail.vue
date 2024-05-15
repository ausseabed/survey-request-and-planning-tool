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
            v-if="!readonly && count > 1"
            label="Apply to All"
            icon="format_line_spacing"
            @click="applyToAllClicked"
          >
            <q-tooltip>
              Copy the metadata from this record to all other records in this submission
            </q-tooltip>
          </sct-btn>
        </div>
      </div>

      <div class="col column q-gutter-xs">

        <form-field-validated-select
          inline
          outlined
          :name="`surveyRequest.aois.$each.${index}.surveyStandard`"
          label="Survey Standard *"
          attribute="Survey Standard"
          :value="aoi.surveyStandard"
          @input="valueChanged('surveyStandard',$event)"
          :options="surveyStandardOptions"
          @blur="`$v.surveyRequest.aois.$each.${index}.surveyStandard.$touch`"
          :readonly="readonly"
          :hide-bottom-space="true"
        >
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
            >
              <q-item-section>
                <q-item-label v-html="scope.opt" />
                <q-item-label
                  caption
                  style="max-width: 400px;"
                >
                  {{ getStandardDescription(scope.opt) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </form-field-validated-select>
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
          label="Overall Risk *"
          attribute="Overall Risk"
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
          label="Preferred Timeframe *"
          attribute="Preferred Timeframe"
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
          label="Data Types to Capture *"
          attribute="Data Types to Capture"
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
    'count',
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
    getStandardDescription(standardName) {
      return this.surveyStandards.find((opt) => opt.name == standardName).description;
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
    surveyStandardOptions() {
      return this.surveyStandards.map((opt) => opt.name);
    }
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
