<!--
Ideally this component shouldn't exist; we should just use the
form-field-validated-select component. BUT I couldn't figure out how to handle
passing the slot params into the slot of the select.
 -->
<template>
  <q-select
    v-bind="$attrs"
    v-on="$listeners"
    :label="label"
    bottom-slots
    :error="hasErrors"
    :error-message="firstErrorMessage"
  >

    <template v-slot:option="scope">
      <q-item v-if="!scope.opt.group"
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section avatar>
          <q-icon v-if="scope.selected" name="check_box" ></q-icon>
          <q-icon v-else="scope.selected" name="check_box_outline_blank" ></q-icon>
        </q-item-section>

        <q-item-section>
          <q-item-label v-if="scope.opt.name" v-html="scope.opt.name" ></q-item-label>
          <q-item-label v-else v-html="scope.opt" ></q-item-label>

          <q-item-label v-if="scope.opt.description" caption>{{ scope.opt.description }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item
        class="q-pl-none q-py-none request-purpose-group-item"
        v-if="scope.opt.group"
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-label header>{{ scope.opt.group }}</q-item-label>
      </q-item>
    </template>

  </q-select>
</template>
<script>
import { singleErrorExtractorMixin } from "vuelidate-error-extractor";
export default {
  name: "FormFieldValidated",
  extends: singleErrorExtractorMixin,
  inheritAttrs: false
};
</script>
<style>
.date-range-field-label {
  color: rgba(0,0,0,0.6);
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
}

.request-purpose-group-item {
    border-top-color: rgba(0, 0, 0, 0.12);
    border-top-style: solid;
    border-top-width: 1px;
}
</style>
