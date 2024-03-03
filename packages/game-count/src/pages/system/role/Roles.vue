<template>
  <div class="page">
    <!--  -->
    <page-breadcrumbs />
    <!--  -->
    <v-card class="search-card">
      <TableFilter @clearFilter="filterOptions = {}" @reload="reload">
        <TableFilterItem label="角色編號" isOne>
          <cover-input
            v-model="filterOptions.alias"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="角色名稱" isTwo>
          <cover-input
            v-model="filterOptions.name"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
      </TableFilter>
    </v-card>
    <!--  -->
    <v-card class="table-card">
      <div v-if="$checkPermission(['ROLE_EDIT'])" class="table-control">
        <div>
          <v-btn v-if="$checkPermission(['ROLE_EDIT'])" color="primary" @click="onAddClick"
            >新增</v-btn
          >
        </div>
        <div>
          <v-btn
            v-if="$checkPermission(['ROLE_EDIT'])"
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
        :show-select="$checkPermission(['ROLE_EDIT'])"
        @update:options="onOptionsChange"
        @click:row="onRowClick"
      >
        <template v-slot:[`item.permissions`]="{ item }">
          <LongString :dataList="item.permissions" :spread.sync="item.spread" labelKey="name" />
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="primary" text @click.stop="onEditClick(item)">編輯</v-btn>
          <v-btn color="primary" text @click.stop="onUserClick(item)">用戶管理</v-btn>
        </template>
      </DataTable>
    </v-card>
    <!--  -->
    <EditDialog ref="editDialog" @success="init" />
    <UserDialog ref="userDialog" @success="init" />
    <!--  -->
  </div>
</template>

<script>
// API 角色權限，已被使用的角色不可被刪除。
import { cloneDeep } from 'lodash-es';
import tablePageMixin from '@/mixins/tablePage.js';
import * as dateFilter from '@/utils/date-filter.js';
import { UsersGroupApi } from '@/api/index.js';
import LongString from '@/components/LongString.vue';
import { ac, handlePermissions, objFindValue, objFindColor } from '@/utils/stock.js';
import EditDialog from './EditDialog';
import UserDialog from './UserDialog';

export default {
  mixins: [tablePageMixin],
  components: { LongString, EditDialog, UserDialog },
  data() {
    return {
      autoRefresh: true,
      filterOptions: {},
      tableOptions: {
        sortBy: ['modifiedTime'],
        sortDesc: [true],
      },
      tableHeaders: [
        { value: 'alias', text: '角色編號', width: 180 },
        { value: 'name', text: '角色名稱', width: 180 },
        { value: 'permissions', text: '權限功能', width: 180, sortable: false },
        { value: 'actions', text: '操作', width: 160, fixed: true, sortable: false },
      ],
      ac,
      permissions: [],
    };
  },
  computed: {},
  created() {
    if (!this.$checkPermission(['ROLE_EDIT'])) this.tableHeaders.splice(-1, 1);

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

        this.permissions = await handlePermissions();

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
        let { content, totalElements } = await UsersGroupApi.search({
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

        let ids = this.tableSelected;
        for (let index = 0; index < ids.length; index++) {
          await UsersGroupApi.delete({ id: ids[index].id });
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
    onEditClick(item) {
      this.$refs['editDialog'].setDialog({ item });
    },
    //
    onUserClick(item) {
      this.$refs['userDialog'].setDialog({ item });
    },
  },
};
</script>

<style lang="scss" scoped></style>
