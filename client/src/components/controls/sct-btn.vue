<template>
  <q-btn
    v-bind="$attrs"
    v-on="$listeners"
    unelevated
    color="grey-3"
    text-color="primary"
  >
    <slot/>
  </q-btn>
</template>
<script>

export default {
  name: "SctBtn",
};
</script>
