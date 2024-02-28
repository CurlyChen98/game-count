<template>
  <v-textarea
    :rows="rows"
    single-line
    outlined
    dense
    v-bind="$attrs"
    v-on="$listeners"
  ></v-textarea>
</template>

<script>
export default {
  props: {
    rows: {
      type: [Number, String],
      default: 3,
    },
  },
};
</script>

<style lang="scss" scoped></style>
