<template>
  <cover-autocomplete
    v-model="searchCurrent"
    :search-input="searchInput"
    :loading="searchLoading"
    :items="searchItems"
    :placeholder="$t('Common.label.plsSelect')"
    :click-clear="false"
    :multiple="multiple"
    :hide-details="hideDetails"
    :chips="chip"
    :small-chips="chip"
    :deletable-chips="chip"
    :class="['api-search', { 'mode-chip': chip }]"
    @update:search-input="onSearchInput"
  >
  </cover-autocomplete>
</template>

<script>
import { debounce } from 'lodash-es';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: [String, Number, Object, Boolean, Array],
    multiple: Boolean,
    hideDetails: Boolean,
    //
    chip: Boolean,
    searchFun: Function,
    defaultSearch: Boolean,
  },
  data() {
    return {
      searchCurrent: this.value,
      searchInput: '',
      searchLoading: false,
      searchItems: [],
    };
  },
  watch: {
    value(to) {
      this.searchCurrent = to;
    },
    searchCurrent(to) {
      this.$emit('change', to);

      if (!to) {
        return null;
      } else if (this.multiple) {
        let newList = to.map((item) => {
          let find = this.searchItems.find((it) => item === it.id);
          return find;
        });
        this.$emit('changeReturnObj', newList);
      } else {
        let find = this.searchItems.find((item) => to === item.id);
        this.$emit('changeReturnObj', find);
      }
    },
  },
  created() {
    if (this.defaultSearch) this.searchData(null);
  },
  methods: {
    //
    onSearchInput: debounce(async function (evnet) {
      if (!evnet) return;
      this.searchData(evnet);
    }, 500),
    //
    async searchData(event) {
      if (!this.searchFun) return;

      try {
        this.searchLoading = true;

        let searchItems = await this.searchFun(event, this.searchItems);
        this.searchItems = [...searchItems, ...this.searchItems];
      } catch (error) {
        this.$error(error);
      } finally {
        this.searchLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.api-search.mode-chip {
  :deep(.v-input) {
    .v-select__selections {
      padding-bottom: 0 !important;
    }
    .v-chip {
      margin-bottom: 4px;
    }
  }
}
</style>
