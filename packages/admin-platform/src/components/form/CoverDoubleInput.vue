<template>
  <div class="cover-double-input">
    <v-text-field
      v-model="inVal1"
      type="number"
      single-line
      outlined
      dense
      v-bind="$attrs"
    ></v-text-field>
    <span class="cut-line">-</span>
    <v-text-field
      v-model="inVal2"
      type="number"
      single-line
      outlined
      dense
      v-bind="$attrs"
    ></v-text-field>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: Array,
  },
  data() {
    return {
      inVal1: null,
      inVal2: null,
    };
  },
  watch: {
    value(to) {
      if (to) {
        this.inVal1 = to[0];
        this.inVal2 = to[1];
      } else {
        this.inVal1 = null;
        this.inVal2 = null;
      }
    },
    inVal1(to) {
      if (to < 0) to = 0;
      this.$emit('change', [to, this.inVal2]);
    },
    inVal2(to) {
      if (to < 0) to = 0;
      this.$emit('change', [this.inVal1, to]);
    },
  },
};
</script>

<style lang="scss" scoped>
.cover-double-input {
  flex-grow: 1;
  display: flex;
  align-items: center;
}
.cut-line {
  margin: 0 4px;
}
</style>
