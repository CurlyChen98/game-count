<template>
  <div class="page">
    <!--  -->
    <page-breadcrumbs />
    <!--  -->
    <v-card class="search-card">
      <TableFilter @clearFilter="filterOptions = {}" @reload="reload">
        <TableFilterItem label="供應商編號" isOne>
          <cover-input
            v-model="filterOptions.supCode"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="供應商名稱" isTwo>
          <cover-input
            v-model="filterOptions.supName"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="群組名稱" isThree>
          <cover-input
            v-model="filterOptions.groupName"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="更新時間">
          <cover-date-range
            v-model="filterOptions.updateTime"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
          />
        </TableFilterItem>
        <TableFilterItem label="數據來源">
          <cover-select
            v-model="filterOptions.source"
            :items="suppliceSources"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
          />
        </TableFilterItem>
        <TableFilterItem label="狀態">
          <cover-select
            v-model="filterOptions.status"
            :items="ac"
            :placeholder="$t('Common.label.plsSelect')"
            hide-details
          />
        </TableFilterItem>
      </TableFilter>
    </v-card>
    <!--  -->
    <v-card class="table-card">
      <div v-if="$checkPermission(['SUPPLIER_EDIT'])" class="table-control">
        <div>
          <v-btn v-if="$checkPermission(['SUPPLIER_EDIT'])" color="primary" @click="onAddClick"
            >新增</v-btn
          >
          <v-btn v-if="$checkPermission(['SUPPLIER_EDIT'])" color="primary" @click="onSyncClick"
            >同步更新</v-btn
          >
        </div>
        <div>
          <v-btn
            v-if="$checkPermission(['SUPPLIER_EDIT'])"
            :disabled="!hasSelected"
            color="error"
            @click="onDeleteClick"
            >刪除</v-btn
          >
        </div>
      </div>
      <DataTable
        v-model="tableSelected"
        :headers="tableHeaders"
        :items="tableItems"
        :options="tableOptions"
        :server-items-length="itemsCount"
        :show-select="$checkPermission(['SUPPLIER_EDIT'])"
        @update:options="onOptionsChange"
        @click:row="onRowClick"
      >
        <template v-slot:[`item.supChnSn`]="{ item }">
          {{ `${item.supChnSn ?? '--'}（${item.supPorSn ?? '--'}）` }}
        </template>
        <template v-slot:[`item.supeAddr1`]="{ item }">
          <LongString
            :dataList="[item.supeAddr1, item.supeAddr2]"
            :spread.sync="item.spread"
            itemBr
          />
        </template>
        <template v-slot:[`item.supTlFn1`]="{ item }">
          <LongString
            :dataList="[item.supTlFn1, item.supTlFn2, item.supTlFn3]"
            :spread.sync="item.spread"
            itemBr
          />
        </template>
        <template v-slot:[`item.source`]="{ item }">
          <div>
            {{ objFindValue({ list: suppliceSources, value: item.source }) }}
          </div>
        </template>
        <template v-slot:[`item.modifiedTime`]="{ item }">
          <div>{{ filterDateTime(item.modifiedTime) }}</div>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-btn class="v-btn-status" text @click.stop="onStatusChange(item)">
            <div class="rect-status" :style="[objFindColor({ list: ac, value: item.status })]">
              {{ objFindValue({ list: ac, value: item.status }) }}
            </div>
          </v-btn>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="primary" text @click="onEditClick(item)">編輯</v-btn>
        </template>
      </DataTable>
    </v-card>
    <!--  -->
    <EditDialog ref="editDialog" @success="init" />
    <!--  -->
  </div>
</template>

<script>
// NOTE 供應商類型用“source”
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';
import tablePageMixin from '@/mixins/tablePage.js';
import * as dateFilter from '@/utils/date-filter.js';
import { SupplierApi } from '@/api/index.js';
import LongString from '@/components/LongString.vue';
import { ac, suppliceSources, objFindValue, objFindColor } from '@/utils/stock.js';
import EditDialog from './EditDialog';

export default {
  mixins: [tablePageMixin],
  components: { LongString, EditDialog },
  data() {
    return {
      filterOptions: {},
      tableOptions: {
        sortBy: ['modifiedTime'],
        sortDesc: [true],
      },
      tableHeaders: [
        { value: 'supCode', text: '供應商編號', width: 180 },
        { value: 'supChnSn', text: '供應商簡稱', width: 240 },
        { value: 'supeAddr1', text: '供應商地址', width: 220 },
        { value: 'supTlFn1', text: '聯絡電話', width: 180 },
        { value: 'supFaxNo', text: '傳真號碼', width: 180 },
        { value: 'source', text: '來源', width: 180 },
        { value: 'modifiedTime', text: '最後更新時間', width: 180 },
        { value: 'status', text: '狀態', width: 120, fixed: true },
        { value: 'actions', text: '操作', width: 120, fixed: true, sortable: false },
      ],
      ac,
      suppliceSources,
    };
  },
  computed: {},
  created() {
    if (!this.$checkPermission(['SUPPLIER_EDIT'])) this.tableHeaders.splice(-1, 1);

    this.init();
  },
  methods: {
    ...dateFilter,
    objFindValue,
    objFindColor,
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

        let { updateTime, ...filterOptions } = cloneDeep(this.filterOptions);
        let updateTimeStart = updateTime?.[0] && dayjs(`${updateTime[0]} 00:00:00`).toISOString();
        let updateTimeEnd = updateTime?.[1] && dayjs(`${updateTime[1]} 23:59:00`).toISOString();

        let { content, totalElements } = await SupplierApi.search({
          ...this.getPagination(this.tableOptions),
          sort: this.getSort(this.tableOptions),
          obj: { ...filterOptions, updateTimeStart, updateTimeEnd },
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
    async onSyncClick() {
      try {
        await this.$confirmDialog({
          showCancel: true,
          text: '是否確認同步供應商資料',
        });
        this.$showDelayLoading();

        await SupplierApi.syncData();

        this.$success('同步成功');
        this.reload();
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    onAddClick() {
      this.$refs['editDialog'].setDialog();
    },
    //
    async onDeleteClick() {
      try {
        await this.$confirmDialog({
          showCancel: true,
          text: this.$t('Common.message.deleteConfirmMulti'),
        });
        this.$showDelayLoading();

        for (let index = 0; index < this.tableSelected.length; index++) {
          await SupplierApi.delete({ id: this.tableSelected[index].id });
        }

        this.$success(this.$t('Common.message.deleteSuccess'));
        this.reload();
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    async onStatusChange({ status, ...other }) {
      try {
        this.$showDelayLoading();

        let newStatus = status === 'A' ? 'C' : 'A';
        await SupplierApi.update({ ...other, status: newStatus });

        this.$success(this.$t('Common.message.changeSuccess'));
        this.load();
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    onEditClick(item) {
      this.$refs['editDialog'].setDialog({ item });
    },
  },
};
</script>

<style lang="scss" scoped></style>
