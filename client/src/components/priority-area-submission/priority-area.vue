<template>
  <form-wrapper
    :validator="$v"
  >
    <q-card flat bordered class="full-width" >
      <q-card-section class="row q-col-gutter-md">
        <div class="column col-auto justify-between">
          <div class="column q-gutter-sm">
            <q-badge v-if="priorityArea.isNew" color="yellow-6" text-color="black">
              New Priority Area
            </q-badge>
            <q-img
              class="rounded-borders"
              style="width:250px; max-height:250px; "
              :src="`api/priority-area/${priorityArea.id}/thumbnail`"
              :ratio="1"
              contain
            />
          </div>
          <div class="column q-gutter-xs">
            <sct-btn
              v-if="!readonly"
              label="Apply to All"
              icon="format_line_spacing"
              @click="applyToAllClicked"
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
            name="priorityArea.name"
            label="Identified Area Name"
            attribute="Identified Area Name"
            :value="priorityArea.name"
            @input="valueChanged('name', $event)"
            type="text"
            @blur="$v.priorityArea.name.$touch"
            :readonly="readonly"
            outlined
            >
          </form-field-validated-input>

          <form-field-validated-button-toggle
            inline
            name="priorityArea.preferredTimeframe"
            label="Preferred Timeframe"
            :value="priorityArea.preferredTimeframe"
            @input="valueChanged('preferredTimeframe',$event)"
            :options="preferredTimeframeOptions"
            @blur="$v.priorityArea.preferredTimeframe.$touch"
            :readonly="readonly"
          />

          <form-field-validated-button-toggle
            inline
            name="priorityArea.riskRating"
            label="Risk Rating"
            :value="priorityArea.riskRating"
            @input="valueChanged('riskRating',$event)"
            :options="riskRatingOptions"
            @blur="$v.priorityArea.riskRating.$touch"
            :readonly="readonly"
          />

          <form-field-validated-select
            class="bg-grey-2 q-pa-sm rounded-borders"
            inline
            name="priorityArea.requiredDataQuality"
            label="Required Data Quality"
            :value="priorityArea.requiredDataQuality"
            @input="valueChanged('requiredDataQuality',$event)"
            :options="requiredDataQualityOptions"
            @blur="$v.priorityArea.requiredDataQuality.$touch"
            :readonly="readonly"
          />

          <form-field-validated-button-toggle
            inline
            name="priorityArea.priority"
            label="Priority"
            :value="priorityArea.priority"
            @input="valueChanged('priority',$event)"
            :options="priorityOptions"
            @blur="$v.priorityArea.priority.$touch"
            :readonly="readonly"
          />

        </div>
      </q-card-section>

    </q-card>
  </form-wrapper>

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

  props: {
    priorityArea: {},
    readonly: true
  },

  methods: {
    valueChanged(propertyName, value) {
      this.$emit(
        'priority-area-value-changed',
        {
          'priorityArea': this.priorityArea,
          'propertyName': propertyName,
          'value': value,
        }
      );
    },
    deleteClicked() {
      this.$emit(
        'priority-area-deleted',
        {
          'priorityArea': this.priorityArea,
        }
      );
    },

    applyToAllClicked() {
      this.$emit(
        'priority-area-apply-to-all',
        {
          'propertyName': 'preferredTimeframe',
          'value': this.priorityArea.preferredTimeframe,
        }
      );
      this.$emit(
        'priority-area-apply-to-all',
        {
          'propertyName': 'riskRating',
          'value': this.priorityArea.riskRating,
        }
      );
      this.$emit(
        'priority-area-apply-to-all',
        {
          'propertyName': 'requiredDataQuality',
          'value': this.priorityArea.requiredDataQuality,
        }
      );
      this.$emit(
        'priority-area-apply-to-all',
        {
          'propertyName': 'priority',
          'value': this.priorityArea.priority,
        }
      );

    },

    isValid() {
      this.$v.$touch();
      return !this.$v.$error;
    },
  },

  watch: {

  },

  validations() {
    return {
      priorityArea: {
        name: { required },
        preferredTimeframe: { required },
        riskRating: { required },
        requiredDataQuality: { required },
        priority: { required },
      }
    }
  },

  computed: {
    // these are all loaded by the parent component
    ...mapState('priorityAreaSubmission',[
      'preferredTimeframeOptions',
      'riskRatingOptions',
      'requiredDataQualityOptions',
      'priorityOptions',
    ]),
  },

  data() {
    return {

    }
  },

});
</script>


<style scoped lang="stylus">

</style>
