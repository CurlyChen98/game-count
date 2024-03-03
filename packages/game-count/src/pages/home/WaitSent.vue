<template>
  <DataTable
    v-model="tableSelected"
    :headers="tableHeaders"
    :items="tableItems"
    :options="tableOptions"
    :server-items-length="itemsCount"
    class="mt-4"
    not-footer
    :in-scroll="false"
    @update:options="onOptionsChange"
  >
    <template v-slot:[`item.actions`]="{}">
      <v-btn color="primary" text>編輯</v-btn>
    </template>
  </DataTable>
</template>

<script>
import tablePageMixin from '@/mixins/tablePage.js';
import * as dateFilter from '@/utils/date-filter.js';
import { objFindValue } from '@/utils/stock.js';

export default {
  mixins: [tablePageMixin],
  data() {
    return {
      filterOptions: {},
      tableOptions: {
        sortBy: ['modifiedTime'],
        sortDesc: [true],
      },
      tableHeaders: [
        { value: 'cstNbr', text: '標書編號', width: 160 },
        { value: 'cstDsc', text: '標書名稱', width: 160 },
        { value: 'countRecord', text: '收件記錄數', width: 160, sortable: false },
        { value: '_openDateTime', text: '展開時間', width: 180 },
        { value: '_deadDateTime', text: '截標時間', width: 180 },
        { value: 'createdBy', text: '建立者', width: 160 },
        { value: '_encrypted', text: '加密', width: 160 },
        { value: 'tenderStatus', text: '投標箱狀態', width: 160, fixed: true },
      ],
    };
  },
  computed: {},
  created() {
    // this.init();
  },
  methods: {
    ...dateFilter,
    objFindValue,
    // 頁面初始化
    async init() {
      try {
        this.$showDelayLoading();

        this.load();
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    // 加載初始化內容
    async load() {},
    //
    onDetailClick({ licenseId }) {
      this.$openRelevance({ name: 'licenseDeatil', query: { licenseId: licenseId } });
    },
    //
    async batch() {},
  },
};
</script>

<style lang="scss" scoped></style>
