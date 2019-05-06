<template>
  <q-field
    v-bind="$attrs"
    :label="label"
    :error="hasErrors"
    :error-message="firstErrorMessage"
    stack-label
    bottom-slots
  >
    <template v-slot:control>
      <slot/>
    </template>
  </q-field>
</template>
<script>
import { singleErrorExtractorMixin } from "vuelidate-error-extractor";
export default {
  name: "FormFieldValidated",
  extends: singleErrorExtractorMixin,
  inheritAttrs: false
};
</script>
