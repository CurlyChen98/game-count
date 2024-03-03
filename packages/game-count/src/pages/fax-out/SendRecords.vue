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
          <cover-date-range
            v-model="filterOptions.test2"
            :placeholder="$t('Common.label.plsSelect')"
            hide-details
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
        <div class="d-flex">
          <v-btn @click="$refs['sendDetailDialog'].setDialog()">新增</v-btn>
        </div>
        <div class="d-flex">
          <v-btn :disabled="!hasSelected">發送</v-btn>
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
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="primary" text @click.stop="$refs['setRecordDialog'].setDialog({ item })">
            發送資料
          </v-btn>
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
        { value: 'test5', text: '傳真號碼', width: 160 },
        { value: 'test6', text: '供應商編號', width: 160 },
        { value: 'test7', text: '供應商名稱', width: 160 },
        { value: 'test8', text: '發送狀態', width: 160 },
        { value: 'test9', text: '發送日期', width: 160 },
      ],
    };
  },
  computed: {},
  created() {
    this.init();
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
          };
        });
        this.itemsCount = totalElements;
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
