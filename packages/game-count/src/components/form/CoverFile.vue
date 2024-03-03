<template>
  <v-file-input
    v-model="valueIn"
    outlined
    dense
    show-size
    prepend-icon=""
    append-icon="mdi-file-find"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-if="openDownload && valueIn" v-slot:append-outer>
      <v-btn color="primary" text @click="onDownloadClick()">
        {{ $t('Common.action.download') }}
      </v-btn>
    </template>
  </v-file-input>
  <!--  -->
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: [Array, File, Object],
    openDownload: Boolean,
  },
  data() {
    return {
      valueIn: this.value,
    };
  },
  watch: {
    value(to) {
      this.valueIn = to;
    },
    valueIn(to) {
      this.$emit('change', to);
    },
  },
  methods: {
    onDownloadClick() {
      this.$emit('download');
    },
  },
};
</script>

<style lang="scss" scoped>
.v-input {
  :deep(.v-input__control) {
    .v-input__slot {
      margin-bottom: 0;
    }
    .v-text-field__details {
      margin-top: 2px;
      margin-bottom: 2px;
    }
  }
  :deep(.v-input__append-outer) {
    margin: 2px 0 0 !important;
  }
}
</style>
