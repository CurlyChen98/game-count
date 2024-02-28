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
      </TableFilter>
    </v-card>
    <!--  -->
    <v-card class="table-card">
      <div class="table-control">
        <v-tabs v-model="typeTabIndex" @change="init">
          <v-tab v-for="item in fileRecordTyeps" :key="item.value">{{ item.text }}</v-tab>
          <v-btn style="align-self: center" @click="chooseTypeDiglog.show = true">新增</v-btn>
        </v-tabs>
        <div class="d-flex">
          <v-btn disabled>已下載發送結果</v-btn>
          <v-btn disabled>發送</v-btn>
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
          <div class="text--click" @click="$refs['editDialog'].setDialog()">
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
    <v-dialog v-model="chooseTypeDiglog.show" width="400" persistent>
      <v-card>
        <v-card-title>
          <div>
            <span>新增文件記錄類型</span>
          </div>
          <v-spacer />
          <v-icon @click="chooseTypeDiglog.show = false">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <div class="py-4">
          <v-row no-gutters>
            <v-col cols="12" class="d-flex flex-column align-center">
              <v-btn @click="onTypeClick('test1')">標書/詢價文件</v-btn>
              <span class="text-caption">*供應商選擇關聯</span>
            </v-col>
            <v-col cols="12" class="d-flex flex-column align-center mt-4">
              <v-btn @click="onTypeClick('test2')">采購單/公函/其他</v-btn>
              <span class="text-caption">*采購單選擇關聯</span>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-dialog>
    <EditDialog ref="editDialog" @success="init" />
    <SetRecordDialog ref="setRecordDialog" @success="init" />
    <!--  -->
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';
import tablePageMixin from '@/mixins/tablePage.js';
import * as dateFilter from '@/utils/date-filter.js';
import { FaxTenderBoxApi } from '@/api/index.js';
import { fileRecordTyeps, objFindValue } from '@/utils/stock.js';
import EditDialog from './dialog/EditDialog';
import SetRecordDialog from './dialog/SetRecordDialog';

export default {
  mixins: [tablePageMixin],
  components: { EditDialog, SetRecordDialog },
  data() {
    return {
      typeTabIndex: 0,
      filterOptions: {},
      tableOptions: {
        sortBy: ['modifiedTime'],
        sortDesc: [true],
      },
      tableHeaders: [
        { value: 'test1', text: '文件編號', width: 160 },
        { value: 'test2', text: '文件類型', width: 160 },
        { value: 'test3', text: '發送結果', width: 160 },
        { value: 'test4', text: '建立者', width: 160 },
        { value: 'test5', text: '發送記錄數', width: 300 },
        { value: 'actions', text: '操作', width: 120, fixed: true, sortable: false },
      ],
      fileRecordTyeps,
      chooseTypeDiglog: {
        show: false,
      },
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
          };
        });
        this.itemsCount = totalElements;
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    onTypeClick(type) {
      this.chooseTypeDiglog.show = false;
      this.$refs['editDialog'].setDialog({ type });
    },
  },
};
</script>

<style lang="scss" scoped></style>
