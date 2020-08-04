<template>
  <q-input
    v-bind="$attrs"
    v-on="$listeners"
    :label="label"
    bottom-slots
    :error="hasErrors"
    :error-message="firstErrorMessage"
    filled
    :value="formattedDate"
    :readonly="readonly"
    @input="setFormattedDate($event)"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy>
          <q-date
            :readonly="readonly"
            :value="formattedDate"
            @input="setFormattedDate($event)"
            @blur="doBlur()"
            />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
<script>
import _ from 'lodash'
import { date } from 'quasar'
import { singleErrorExtractorMixin } from "vuelidate-error-extractor";
import Vue from 'vue'

const UPDATED_DATE = 'updated-date';
const BLUR = 'blur';

export default Vue.extend({
  name: "FormFieldValidatedDate",
  extends: singleErrorExtractorMixin,
  inheritAttrs: false,
  props: [
    'date',
    'readonly',
  ],
  mounted() {
    this.tmpDateEntry = undefined;
  },
  data() {
    return {
      tmpDateEntry: undefined,
    }
  },
  methods: {
    doBlur() {
      this.$emit(BLUR, {});
    },
    setFormattedDate(requestDate) {
      this.tmpDateEntry = requestDate;
      // check if no text provided, or if the string contains two / chars
      if (_.isNil(requestDate) || (requestDate.match(/\//g) || []).length != 2) {
        this.$emit(UPDATED_DATE, undefined);
        return
      }
      let d = Date.parse(requestDate)
      if (_.isNaN(d)) {
        this.$emit(UPDATED_DATE, undefined);
        return
      }
      this.$emit(UPDATED_DATE, d);
    },
  },
  computed: {
    formattedDate: function() {
      if (_.isNil(this.tmpDateEntry) && !_.isNil(this.date)) {
        const d = new Date();
        d.setTime(this.date);
        let formattedString = date.formatDate(d, 'YYYY/MM/DD')
        this.tmpDateEntry = formattedString
      }
      return this.tmpDateEntry
    },
  },
  watch: {
  },

});
</script>
