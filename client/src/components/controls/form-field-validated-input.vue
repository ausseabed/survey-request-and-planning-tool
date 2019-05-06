<template>
  <q-input
    v-bind="$attrs"
    v-on="$listeners"
    :label="label"
    bottom-slots
    :error="hasErrors"
    :error-message="firstErrorMessage"
  >
  </q-input>
</template>
<script>
import { singleErrorExtractorMixin } from "vuelidate-error-extractor";
export default {
  name: "FormFieldValidated",
  extends: singleErrorExtractorMixin,
  inheritAttrs: false
};
</script>
