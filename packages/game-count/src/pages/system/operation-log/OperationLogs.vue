<template>
  <div class="page">
    <!--  -->
    <page-breadcrumbs />
    <!--  -->
    <v-card class="search-card">
      <TableFilter @clearFilter="filterOptions = {}" @reload="reload">
        <TableFilterItem label="操作用戶" isOne>
          <cover-input
            v-model="filterOptions.operator"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="操作日期" isTwo>
          <cover-date-range
            v-model="filterOptions.operationTime"
            :placeholder="$t('Common.label.plsSelect')"
            hide-details
          />
        </TableFilterItem>
        <TableFilterItem label="操作內容" isThree>
          <cover-input
            v-model="filterOptions.description"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="對象類型">
          <cover-input
            v-model="filterOptions.module"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
      </TableFilter>
    </v-card>
    <!--  -->
    <v-card class="table-card">
      <DataTable
        v-model="tableSelected"
        :headers="tableHeaders"
        :items="tableItems"
        :options="tableOptions"
        :server-items-length="itemsCount"
        @update:options="onOptionsChange"
      >
        <template v-slot:[`item.operationTime`]="{ item }">
          <div>{{ filterDateTime(item.operationTime) }}</div>
        </template>
        <template v-slot:[`item.result`]="{ item }">
          <div v-if="item.result == 200">成功</div>
          <div v-else>{{ item.result }}</div>
        </template>
      </DataTable>
    </v-card>
    <!--  -->
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';
import { AuditLogApi } from '@/api/index.js';
import tablePageMixin from '@/mixins/tablePage.js';
import * as dateFilter from '@/utils/date-filter.js';
import { objFindValue } from '@/utils/stock.js';

export default {
  mixins: [tablePageMixin],
  data() {
    return {
      filterOptions: {},
      tableOptions: {
        sortBy: ['operationTime'],
        sortDesc: [true],
      },
      tableHeaders: [
        { value: 'operator', text: '操作用戶', width: 180 },
        { value: 'operationTime', text: '操作時間', width: 180 },
        { value: 'ip', text: 'IP', width: 180 },
        { value: 'module', text: '對象類型', width: 180 },
        { value: 'description', text: '操作內容', width: 180 },
        { value: 'result', text: '結果', width: 220 },
      ],
    };
  },
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

        let { operationTime, ...filterOptions } = cloneDeep(this.filterOptions);
        let operationTimeStart =
          operationTime?.[0] && dayjs(`${operationTime[0]} 00:00:00`).toISOString();
        let operationTimeEnd =
          operationTime?.[1] && dayjs(`${operationTime[1]} 23:59:00`).toISOString();

        let { content, totalElements } = await AuditLogApi.search({
          ...this.getPagination(this.tableOptions),
          sort: this.getSort(this.tableOptions),
          obj: { ...filterOptions, operationTimeStart, operationTimeEnd },
        });

        this.tableItems = content;
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
