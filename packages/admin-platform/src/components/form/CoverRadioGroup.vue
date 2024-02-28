<template>
  <div class="cover-radio-group">
    <v-radio-group :value="inVal" v-bind="$attrs" v-on="$listeners" @change="onValueChange">
      <template v-for="(item, key) in $slots" v-slot:[key]>
        <slot :name="key"></slot>
      </template>
    </v-radio-group>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: [String, Number, Boolean],
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
  },
  methods: {
    onValueChange(val) {
      this.$emit('change', val);
    },
  },
};
</script>

<style lang="scss" scoped>
.cover-radio-group {
  :deep(.v-messages) {
    padding: 0 12px !important;
    margin-top: 2px;
    margin-bottom: 2px;
  }
}
.item-label {
  display: block;
  padding-bottom: 16px;
}
.v-input {
  margin-top: 0;
  padding-top: 0;
  :deep(.v-input__control) {
    .v-input__slot {
      margin-bottom: 0;
    }
    .v-text-field__details {
      margin-top: 2px;
      margin-bottom: 2px;
    }
  }
}
</style>
