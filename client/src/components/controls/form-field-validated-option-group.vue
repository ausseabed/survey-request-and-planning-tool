<template>
  <div class="bg-grey-2 q-pa-sm rounded-borders">
    <div class="field-label" :class="{error: error}">{{ label }}</div>
    <q-option-group
      style="margin-top:-6px; margin-bottom:-6px"
      v-bind="$attrs"
      v-on="$listeners"
      :label="label"
      :options="groupOptions"
      bottom-slots
      :error="hasErrors"
      :error-message="firstErrorMessage"
      :class="{error: error}"
      :color="error ? 'red' : 'black'"
      :keep-color="true"
    >
    <!-- :color="error ? 'red' : 'black'" -->
    </q-option-group>
  </div>
</template>
<script>
import { singleErrorExtractorMixin } from "vuelidate-error-extractor";
export default {
  name: "FormFieldValidatedOptionGroup",
  extends: singleErrorExtractorMixin,
  inheritAttrs: false,

  props: {
    options: undefined,
    label: "",
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

</style>
