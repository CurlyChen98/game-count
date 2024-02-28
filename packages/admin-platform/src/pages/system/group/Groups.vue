<template>
  <div class="page">
    <!--  -->
    <page-breadcrumbs />
    <!--  -->
    <v-card class="search-card">
      <TableFilter @clearFilter="filterOptions = {}" @reload="reload">
        <TableFilterItem label="群組編號" isOne>
          <cover-input
            v-model="filterOptions.code"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="群組名稱" isTwo>
          <cover-input
            v-model="filterOptions.name"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="狀態" isThree>
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
      <div v-if="$checkPermission(['DEPARTMENT_EDIT'])" class="table-control">
        <div>
          <v-btn v-if="$checkPermission(['DEPARTMENT_EDIT'])" color="primary" @click="onAddClick"
            >新增</v-btn
          >
        </div>
        <div>
          <v-btn
            v-if="$checkPermission(['DEPARTMENT_EDIT'])"
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
        :show-select="$checkPermission(['DEPARTMENT_EDIT'])"
        @update:options="onOptionsChange"
        @click:row="onRowClick"
      >
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
    <!--  -->
    <EditDialog ref="editDialog" @success="init" />
    <!--  -->
  </div>
</template>

<script>
// API 群組管理，已被使用的群组不可被刪除。
import { cloneDeep } from 'lodash-es';
import tablePageMixin from '@/mixins/tablePage.js';
import * as dateFilter from '@/utils/date-filter.js';
import { DepartmentApi } from '@/api/index.js';
import { ac, objFindValue, objFindColor } from '@/utils/stock.js';
import EditDialog from './EditDialog';

export default {
  mixins: [tablePageMixin],
  components: { EditDialog },
  data() {
    return {
      autoRefresh: true,
      filterOptions: {},
      tableOptions: {
        sortBy: ['modifiedTime'],
        sortDesc: [true],
      },
      tableHeaders: [
        { value: 'code', text: '群組編號', width: 180 },
        { value: 'nameTc', text: '群組名稱', width: 180 },
        // { value: 'a1', text: '群組類型', width: 180 },
        // { value: 'a1', text: '用戶', width: 180 },
        { value: 'modifiedBy', text: '編輯人員', width: 180 },
        { value: 'modifiedTime', text: '編輯時間', width: 180 },
        { value: 'status', text: '狀態', width: 120, fixed: true },
        { value: 'actions', text: '操作', width: 120, fixed: true, sortable: false },
      ],
      ac,
      lockDialog: false,
      lockNumber: 10,
    };
  },
  computed: {},
  created() {
    if (!this.$checkPermission(['DEPARTMENT_EDIT'])) this.tableHeaders.splice(-1, 1);

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
        let { content, totalElements } = await DepartmentApi.search({
          ...this.getPagination(this.tableOptions),
          sort: this.getSort(this.tableOptions),
          obj: { ...filterOptions },
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

        let ids = this.tableSelected.map((item) => item.id);
        await DepartmentApi.delete({ ids });

        this.$success(this.$t('Common.message.deleteSuccess'));
        this.reload();
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    async onStatusChange({ id, status }) {
      try {
        this.$showDelayLoading();

        let newStatus = status === 'A' ? 'C' : 'A';
        await DepartmentApi.updateStatus({ ids: [id], status: newStatus });

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
