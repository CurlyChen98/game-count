<template>
  <div class="page">
    <!--  -->
    <page-breadcrumbs />
    <!--  -->
    <v-card class="search-card">
      <TableFilter @clearFilter="filterOptions = {}" @reload="reload">
        <TableFilterItem label="文件編號" isOne>
          <cover-input
            v-model="filterOptions.test"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="發送者名稱" isTwo>
          <cover-input
            v-model="filterOptions.test"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="傳真號碼" isThree>
          <cover-input
            v-model="filterOptions.test"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="供應商編號">
          <cover-input
            v-model="filterOptions.test"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="供應商名稱">
          <cover-input
            v-model="filterOptions.test"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="發送日期">
          <cover-input
            v-model="filterOptions.test"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="發送狀態">
          <cover-input
            v-model="filterOptions.test"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="發送者記錄編號">
          <cover-input
            v-model="filterOptions.test"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
      </TableFilter>
    </v-card>
    <!--  -->
    <v-card class="table-card">
      <div class="table-control">
        <div>
          <v-checkbox
            v-model="autoRefresh"
            label="定時刷新(1)分鐘"
            class="pt-0 mt-0"
            hide-details
            @change="onAutoChange"
          />
        </div>
        <div class="d-flex progress">
          <div class="status">
            <span class="name">待發送：</span>
            <span class="number primary--text">4</span>
          </div>
          <div class="status">
            <span class="name">發送中：</span>
            <span class="number primary--text">1</span>
          </div>
          <v-progress-linear color="primary" indeterminate></v-progress-linear>
        </div>
      </div>
      <DataTable
        v-model="tableSelected"
        :headers="tableHeaders"
        :items="tableItems"
        :options="tableOptions"
        :server-items-length="itemsCount"
        show-select
        @update:options="onOptionsChange"
      >
        <template v-slot:[`item.test1`]="{ item }">
          <div class="text--click" @click="$refs['sendDetailDialog'].setDialog({ item })">
            {{ item.test1 }}
          </div>
        </template>
        <template v-slot:[`item.test2`]="{ item }">
          <div class="text--click" @click="$refs['sendDetailDialog'].setDialog({ item })">
            {{ item.test1 }}
          </div>
        </template>
        <template v-slot:[`item.actions`]="{ item, index }">
          <v-btn v-if="index % 2 === 0" color="success" text @click="setStatus(item)">優先</v-btn>
          <v-btn v-if="index % 2 !== 0" color="primary" text @click="setStatus(item)">延後</v-btn>
          <v-btn color="error" text @click="setStatus(item)">退回</v-btn>
        </template>
      </DataTable>
    </v-card>
    <!--  -->
    <SendDetailDialog ref="sendDetailDialog" @success="init" />
    <!--  -->
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';
import tablePageMixin from '@/mixins/tablePage.js';
import * as dateFilter from '@/utils/date-filter.js';
import { FaxTenderBoxApi } from '@/api/index.js';
import { objFindValue } from '@/utils/stock.js';
import SendDetailDialog from './dialog/SendDetailDialog';

export default {
  mixins: [tablePageMixin],
  components: { SendDetailDialog },
  data() {
    return {
      autoRefresh: true,
      autoTime: 100 * 60,
      typeTabIndex: 0,
      filterOptions: {},
      tableOptions: {
        sortBy: ['modifiedTime'],
        sortDesc: [true],
      },
      tableHeaders: [
        { value: 'test1', text: '發送記錄編號', width: 160 },
        { value: 'test2', text: '文件編號', width: 160 },
        { value: 'test3', text: '文件類型', width: 160 },
        { value: 'test4', text: '建立者', width: 160 },
        { value: 'test5', text: '傳真號碼', width: 300 },
        { value: 'test6', text: '供應商編號', width: 300 },
        { value: 'test7', text: '供應商名稱', width: 300 },
        { value: 'test9', text: '發送日期', width: 300 },
        { value: 'test10', text: '排隊順序號', width: 300 },
        { value: 'status', text: '發送狀態', width: 120, fixed: true },
        { value: 'actions', text: '操作', width: 180, fixed: true, sortable: false },
      ],
    };
  },
  computed: {},
  created() {
    this.init();
  },
  beforeDestroy() {
    if (this._autoRefreshTime) clearTimeout(this._autoRefreshTime);
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
    async load() {
      try {
        this.$showDelayLoading();

        let { dateTime, ...filterOptions } = cloneDeep(this.filterOptions);
        let openDateTime = dateTime?.[0] && dayjs(`${dateTime[0]} 00:00:00`).toISOString();
        let deadDateTime = dateTime?.[1] && dayjs(`${dateTime[1]} 23:59:00`).toISOString();
        let { content, totalElements } = await FaxTenderBoxApi.search({
          ...this.getPagination(this.tableOptions),
          sort: this.getSort(this.tableOptions, {
            _encrypted: 'encrypted',
            _openDateTime: 'openDateTime',
            _deadDateTime: 'deadDateTime',
          }),
          obj: {
            ...filterOptions,
            openDateTime,
            deadDateTime,
          },
        });

        this.tableItems = content.map((item) => {
          return {
            ...item,
            test1: 'testData',
            test2: 'testData',
            test3: 'testData',
            test4: 'testData',
            test5: 'testData',
            test6: 'testData',
            test7: 'testData',
            test8: 'testData',
            test9: 'testData',
            test10: 'testData',
            status: 'status',
          };
        });
        this.itemsCount = totalElements;

        if (this.autoRefresh) {
          if (this._autoRefreshTime) clearTimeout(this._autoRefreshTime);
          this._autoRefreshTime = setTimeout(() => {
            this.load();
          }, this.autoTime);
        }
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    onAutoChange(event) {
      if (this._autoRefreshTime) clearTimeout(this._autoRefreshTime);
      if (event)
        this._autoRefreshTime = setTimeout(() => {
          this.load();
        }, this.autoTime);
    },
    //
    setStatus(item) {
      console.log('🔨[ item ]\n', item);
    },
  },
};
</script>

<style lang="scss" scoped>
.progress {
  position: relative;
  .status + .status {
    margin-left: 24px;
  }
  .name {
    font-size: 20px;
  }
  .number {
    font-size: 24px;
    font-weight: bolder;
  }
  .v-progress-linear {
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
</style>
