<template>
  <div class="page">
    <!--  -->
    <page-breadcrumbs />
    <!--  -->
    <v-card class="search-card">
      <TableFilter @clearFilter="filterOptions = {}" @reload="reload">
        <TableFilterItem label="群組編號" isOne>
          <cover-input
            v-model="filterOptions.groupCode"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="群組名稱" isTwo>
          <cover-input
            v-model="filterOptions.groupName"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="下屬供應商" isThree>
          <cover-input
            v-model="filterOptions.supChnFn"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="狀態">
          <cover-select
            v-model="filterOptions.status"
            :items="ac"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
          />
        </TableFilterItem>
      </TableFilter>
    </v-card>
    <!--  -->
    <v-card class="table-card">
      <div v-if="this.$checkPermission(['GROUP_EDIT'])" class="table-control">
        <div>
          <v-btn v-if="this.$checkPermission(['GROUP_EDIT'])" color="primary" @click="onAddClick"
            >新增</v-btn
          >
          <!-- <v-btn color="primary" @click="onSyncClick">同步更新</v-btn> -->
        </div>
        <div>
          <v-btn
            v-if="this.$checkPermission(['GROUP_EDIT'])"
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
        :show-select="$checkPermission(['GROUP_EDIT'])"
        @update:options="onOptionsChange"
        @click:row="onRowClick"
      >
        <template v-slot:[`item.suppliers`]="{ item }">
          <LongString
            :dataList="item.suppliers"
            :spread.sync="item.spread"
            labelKey="supSn"
            itemBr
          />
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
import { cloneDeep } from 'lodash-es';
import tablePageMixin from '@/mixins/tablePage.js';
import * as dateFilter from '@/utils/date-filter.js';
import { SupplierGroupApi } from '@/api/index.js';
import LongString from '@/components/LongString.vue';
import { ac, objFindValue, objFindColor } from '@/utils/stock.js';
import EditDialog from './EditDialog';

export default {
  mixins: [tablePageMixin],
  components: { LongString, EditDialog },
  data() {
    return {
      autoRefresh: true,
      filterOptions: {},
      tableOptions: {
        sortBy: ['modifiedTime'],
        sortDesc: [true],
      },
      tableHeaders: [
        { value: 'groupCode', text: '群組編號', width: 180 },
        { value: 'groupName', text: '群組名稱', width: 180 },
        { value: 'suppliers', text: '供應商', width: 240, sortable: false },
        { value: 'status', text: '狀態', width: 120, fixed: true },
        { value: 'actions', text: '操作', width: 120, fixed: true, sortable: false },
      ],
      ac,
    };
  },
  computed: {},
  created() {
    if (!this.$checkPermission(['GROUP_EDIT'])) this.tableHeaders.splice(-1, 1);

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

        let { ...filterOptions } = cloneDeep(this.filterOptions);
        let { content, totalElements } = await SupplierGroupApi.search({
          ...this.getPagination(this.tableOptions),
          sort: this.getSort(this.tableOptions),
          obj: { ...filterOptions },
        });

        this.tableItems = content.map((item) => {
          return {
            ...item,
            suppliers: item.suppliers.map((it) => {
              return {
                ...it,
                supSn: `${it.supChnSn ?? '--'}（${it.supPorSn ?? '--'}）`,
              };
            }),
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
    async onSyncClick() {
      try {
        await this.$confirmDialog({
          showCancel: true,
          text: '是否確認同步供應商群組資料',
        });
        this.$showDelayLoading();

        await SupplierGroupApi.syncData();

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
          await SupplierGroupApi.delete({ id: this.tableSelected[index].id });
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
        await SupplierGroupApi.update({ ...other, status: newStatus });

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
