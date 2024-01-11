<template>
  <q-select
    ref="select"
    v-bind="$attrs"
    v-on="$listeners"
    :label="label"
    bottom-slots
    :error="hasErrors"
    :error-message="firstErrorMessage"
  >
  <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope"><slot :name="slot" v-bind="scope"/></template>
  </q-select>
</template>
<script>
import { singleErrorExtractorMixin } from "vuelidate-error-extractor";
export default {
  name: "FormFieldValidated",
  extends: singleErrorExtractorMixin,
  inheritAttrs: false,

  methods: {
    refresh(index) {
      this.$refs.select.refresh(index);
    }
  }
};
</script>
