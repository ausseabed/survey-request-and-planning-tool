<template>
  <div class="bg-grey-2 q-pa-sm rounded-borders">
    <div class="field-label" :class="{error: error}">{{ label }}</div>
    <q-btn-toggle
      no-caps unelevated spread
      :toggle-color="error ? 'red' : 'primary'"
      color="white"
      :text-color="error ? 'red' : 'primary'"
      v-bind="$attrs"
      v-on="$listeners"
      :label="label"
      :options="groupOptions"
      :error="hasErrors"
      :error-message="firstErrorMessage"
      :readonly="readonly"
    >
    </q-btn-toggle>
  </div>
</template>
<script>
import { singleErrorExtractorMixin } from "vuelidate-error-extractor";
export default {
  name: "FormFieldValidatedButtonToggle",
  extends: singleErrorExtractorMixin,
  inheritAttrs: false,

  props: {
    options: undefined,
    label: "",
    readonly: true,
  },

  computed: {
    error () {
      return this.hasErrors;
    },

    groupOptions() {
      return this.options.map((opt) => {
        return {
          label: opt,
          value: opt,
        };
      })
    }
  }
};
</script>

<style scoped>

.field-label {
  color: rgba(0,0,0,0.6);
  font-size: 12px;
  font-weight: 400;
}

.error {
  color: red;
}

.my-custom-toggle {
  border: 1px solid #027be3
}

</style>
