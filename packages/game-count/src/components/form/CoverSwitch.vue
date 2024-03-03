<template>
  <v-switch v-model="inVal" :label="switchLabel" inset dense v-bind="$attrs" v-on="$listeners">
  </v-switch>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: [String, Boolean],
    labelRequired: Boolean,
    switchLabel: String,
  },
  data() {
    return {
      inVal: this.value,
    };
  },
  watch: {
    value(to) {
      this.inVal = to;
    },
    inVal(to) {
      this.$emit('change', to);
    },
  },
};
</script>

<style lang="scss" scoped>
.v-input--switch {
  margin-top: 0;
  padding-top: 0;
}
</style>
