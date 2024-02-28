<template>
  <v-text-field single-line outlined dense v-bind="$attrs" v-on="$listeners">
    <template v-if="$scopedSlots['append-outer']" v-slot:append-outer>
      <slot name="append-outer"></slot>
    </template>
  </v-text-field>
</template>

<script>
export default {
  props: {},
};
</script>

<style lang="scss" scoped></style>
