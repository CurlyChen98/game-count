<template>
  <div class="api-search-expand">
    <cover-autocomplete
      v-model="searchCurrent"
      :search-input="searchInput"
      :loading="searchLoading"
      :items="searchItems"
      :placeholder="$t('Common.label.plsSelect')"
      :menu-props="menuProps"
      hide-details
      @update:search-input="onSearchInput"
      @input="onChange"
    >
    </cover-autocomplete>
    <div class="choose-list">
      <v-chip
        v-for="(item, index) in chooseList"
        :key="index"
        close
        close-icon="mdi-close"
        @click:close="onCloseClick(index)"
      >
        {{ item.username }}
      </v-chip>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash-es';
//
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: [Array],
    searchFun: Function,
    defaultSearch: Boolean,
  },
  data() {
    return {
      menuProps: {
        'max-width': '800px',
      },
      searchCurrent: null,
      searchInput: '',
      searchLoading: false,
      searchItems: [],
      chooseList: [],
    };
  },
  watch: {
    value(to) {
      this.chooseList = to;
    },
    chooseList(to) {
      this.$emit('change', to);
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
    //
    onChange(event) {
      let find = this.searchItems.find((item) => event === item.id);

      let isHave = this.chooseList.findIndex((item) => event === item.id);
      if (isHave > -1) this.chooseList.splice(isHave, 1);

      this.chooseList.unshift(find);
    },
    //
    onCloseClick(index) {
      this.chooseList.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.api-search-expand {
  flex-grow: 1;
  .choose-list {
    margin-top: 8px;
    .v-chip {
      margin-right: 4px;
      margin-bottom: 4px;
    }
  }
}
</style>
