<template>
  <v-dialog v-model="show" width="900" persistent>
    <v-card>
      <v-card-title>
        <div class="text-h6 font-weight-bold">
          <span>投標箱：活動記錄</span>
        </div>
        <v-spacer />
        <v-icon style="font-size: 24px; cursor: pointer" @click="onDialogClose">mdi-close</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <v-form ref="editDialogForm" class="card__content pt-2">
        <TableFilter @clearFilter="filterOptions = {}" @reload="reload">
          <TableFilterItem label="操作用戶" allCol="6">
            <cover-input
              v-model="filterOptions.operator"
              :placeholder="$t('Common.label.plsInput')"
              hide-details
              @keydown.enter="reload"
            />
          </TableFilterItem>
          <TableFilterItem label="操作日期" allCol="6">
            <cover-date-range
              v-model="filterOptions.operationTime"
              :placeholder="$t('Common.label.plsSelect')"
              hide-details
            />
          </TableFilterItem>
        </TableFilter>
        <DataTable
          v-model="tableSelected"
          :headers="tableHeaders"
          :items="tableItems"
          :options="tableOptions"
          :server-items-length="itemsCount"
          class="mt-2"
          style="height: 35vh"
          show-select
          @update:options="onOptionsChange"
          @click:row="onRowClick"
        >
          <template v-slot:[`item.operationTime`]="{ item }">
            <div>{{ filterDateTime(item.operationTime) }}</div>
          </template>
          <template v-slot:[`item.result`]="{ item }">
            <div v-if="item.result == 200">成功</div>
            <div v-else>{{ item.result }}</div>
          </template>
        </DataTable>
      </v-form>
      <v-card-actions class="d-flex align-center justify-center">
        <v-btn color="primary" @click="onDialogClose">關閉</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
      show: false,
      item: null,
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
  methods: {
    ...dateFilter,
    objFindValue,
    //
    async setDialog({ show = true, item = {} } = {}) {
      if (!item.id) return;

      this.item = item;
      this.init();
      this.show = show;
    },
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
          obj: { ...filterOptions, operationTimeStart, operationTimeEnd, parameter: this.item.id },
        });

        this.tableItems = content;
        this.itemsCount = totalElements;
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    onDialogClose() {
      this.resetDialog();
    },
    //
    resetDialog() {
      this.show = false;

      this.$nextTick(() => {
        this.$refs['editDialogForm'].resetValidation();
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
