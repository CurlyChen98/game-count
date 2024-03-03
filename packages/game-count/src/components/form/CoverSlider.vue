<template>
  <div class="cover-slider">
    <v-slider
      v-model="inVal"
      :rules="[commissionCheck]"
      :errorStatus="!!errorMessage"
      :error-messages="errorMessage"
      :min="min"
      :max="max"
      class="slider"
    >
      <template v-slot:append>
        <v-text-field
          :value="inputVal"
          class="mt-0 pt-0"
          style="width: 100px"
          suffix="%"
          single-line
          hide-details
          outlined
          dense
          @input="onInput"
        />
      </template>
    </v-slider>
  </div>
</template>

<script>
import * as formRule from '@/utils/form-rule.js';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: [String, Number],
    min: [String, Number],
    max: [String, Number],
  },
  data() {
    return {
      inVal: null,
      errorMessage: null,
      inputVal: null,
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(to) {
        let temp = Math.round(to * 100);
        this.inVal = temp;
        this.inputVal = temp;
      },
    },
    inVal(to) {
      let temp = to / 100;
      if (this.value != temp) {
        this.$emit('change', temp);
      }
    },
  },
  methods: {
    ...formRule,
    //
    commissionCheck(event) {
      let amountCheck = this.amountCheck(event);
      if (amountCheck !== true) return this.$t('FormRule.message.minMaxNumber', [0, 100]);
      else if (event < 0 || event > 100) return this.$t('FormRule.message.minMaxNumber', [0, 100]);
      return true;
    },
    //
    onInput(event) {
      if (this.commissionCheck(event) !== true) {
        this.errorMessage = this.$t('FormRule.message.minMaxNumber', [0, 100]);
      } else {
        this.$set(this, 'inVal', event);
        this.errorMessage = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.cover-slider {
  :deep(.v-input__slot) {
    height: 40px;
  }
  :deep(.v-input__append-outer) {
    margin: 0;
  }
}
</style>
