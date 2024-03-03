<template>
  <div class="page">
    <!--  -->
    <page-breadcrumbs />
    <!--  -->
    <v-card class="search-card">
      <TableFilter @clearFilter="filterOptions = {}" @reload="reload">
        <TableFilterItem label="賬號" isOne>
          <cover-input
            v-model="filterOptions.username"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="名稱" isTwo>
          <cover-input
            v-model="filterOptions.name"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="設定群組" isThree>
          <cover-autocomplete
            v-model="filterOptions.department"
            :items="groups"
            :placeholder="$t('Common.label.plsSelect')"
            hide-details
          />
        </TableFilterItem>
        <!-- <TableFilterItem label="設定角色">
          <cover-input
            v-model="filterOptions.aaa1"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem> -->
        <TableFilterItem label="偏好語言">
          <cover-select
            v-model="filterOptions.preferredLanguage"
            :items="preferredLanguages"
            :placeholder="$t('Common.label.plsSelect')"
            hide-details
          />
        </TableFilterItem>
        <TableFilterItem label="狀態">
          <cover-select
            v-model="filterOptions.enabled"
            :items="userStatuses"
            :placeholder="$t('Common.label.plsSelect')"
            hide-details
          />
        </TableFilterItem>
      </TableFilter>
    </v-card>
    <!--  -->
    <v-card class="table-card">
      <div v-if="$checkPermission(['USER_EDIT'])" class="table-control">
        <div>
          <v-btn v-if="$checkPermission(['USER_EDIT'])" color="primary" @click="onAddClick"
            >新增</v-btn
          >
        </div>
        <div>
          <v-menu
            v-if="$checkPermission(['USER_EDIT'])"
            v-model="lockDialog.show"
            :close-on-content-click="false"
            offset-y
            left
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="mx-2" color="primary" v-bind="attrs" v-on="on">上鎖次數設定</v-btn>
            </template>
            <v-card style="width: 250px">
              <div class="pa-4 pb-0">
                <cover-input v-model="lockDialog.lockNumber" hide-details />
              </div>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text small @click="lockDialog.show = false">取消</v-btn>
                <v-btn color="primary" text small @click="onLockSetClick">儲存</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
          <v-btn
            v-if="$checkPermission(['USER_EDIT'])"
            :disabled="!hasSelected"
            color="primary"
            @click="onUnlockClick"
            >解鎖</v-btn
          >
          <v-btn
            v-if="$checkPermission(['USER_EDIT'])"
            :disabled="!hasSelected"
            color="error"
            @click="onDeleteClick"
          >
            刪除</v-btn
          >
          <v-btn
            v-if="$checkPermission(['USER_EDIT'])"
            :disabled="!hasSelected"
            color="primary"
            @click="onPasswordClick"
            >重置密碼</v-btn
          >
        </div>
      </div>
      <DataTable
        v-model="tableSelected"
        :headers="tableHeaders"
        :items="tableItems"
        :options="tableOptions"
        :server-items-length="itemsCount"
        :show-select="$checkPermission(['USER_EDIT'])"
        @update:options="onOptionsChange"
        @click:row="onRowClick"
      >
        <template v-slot:[`item.departmentList`]="{ item }">
          <LongString
            :dataList="item.departmentList"
            :spread.sync="item.spread"
            labelKey="nameTc"
          />
        </template>
        <template v-slot:[`item.groups`]="{ item }">
          <LongString :dataList="item.groups" :spread.sync="item.spread" labelKey="name" />
        </template>
        <template v-slot:[`item.type`]="{ item }">
          <div>
            {{ objFindValue({ list: userTypes, value: item.type }) }}
          </div>
        </template>
        <template v-slot:[`item.failedAttempts`]="{ item }">
          <div>
            <span v-if="item.failedAttempts === 0">--</span>
            <span v-else-if="item.failedAttempts >= lockDialog.lockNumber" class="red--text"
              >已鎖定</span
            >
            <span v-else>{{ item.failedAttempts }}</span>
          </div>
        </template>
        <template v-slot:[`item.preferredLanguage`]="{ item }">
          <div>
            {{ objFindValue({ list: preferredLanguages, value: item.preferredLanguage }) }}
          </div>
        </template>
        <template v-slot:[`item.enabled`]="{ item }">
          <v-btn class="v-btn-status" text @click.stop="onStatusChange(item)">
            <div
              class="rect-status"
              :style="[objFindColor({ list: userStatuses, value: item.enabled })]"
            >
              {{ objFindValue({ list: userStatuses, value: item.enabled }) }}
            </div>
          </v-btn>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="primary" text @click.stop="onEditClick(item)">編輯</v-btn>
        </template>
      </DataTable>
    </v-card>
    <!--  -->
    <EditDialog ref="editDialog" @success="init" />
    <PasswordDialog ref="passwordDialog" @success="load" />
    <!--  -->
  </div>
</template>

<script>
// API 用戶管理，需要增加根據已有角色搜索功能。
import { mapState } from 'vuex';
import { cloneDeep } from 'lodash-es';
import tablePageMixin from '@/mixins/tablePage.js';
import * as dateFilter from '@/utils/date-filter.js';
import { UsersApi } from '@/api/index.js';
import LongString from '@/components/LongString.vue';
import {
  preferredLanguages,
  userStatuses,
  userTypes,
  handleGroups,
  objFindValue,
  objFindColor,
} from '@/utils/stock.js';
import EditDialog from './EditDialog';
import PasswordDialog from './PasswordDialog';

export default {
  mixins: [tablePageMixin],
  components: { LongString, EditDialog, PasswordDialog },
  data() {
    return {
      autoRefresh: true,
      filterOptions: {},
      tableOptions: {
        sortBy: ['modifiedTime'],
        sortDesc: [true],
      },
      tableHeaders: [
        { value: 'username', text: '賬號', width: 180 },
        { value: 'nameCn', text: '中文名稱', width: 180 },
        { value: 'nameEn', text: '外文名稱', width: 180 },
        { value: 'departmentList', text: '設定群組', width: 200, sortable: false },
        { value: 'groups', text: '設定角色', width: 200, sortable: false },
        { value: 'type', text: '用戶類型', width: 200 },
        { value: 'failedAttempts', text: '錯誤驗證次數', width: 160 },
        { value: 'preferredLanguage', text: '偏好語言', width: 180 },
        { value: 'enabled', text: '狀態', width: 120, fixed: true },
        { value: 'actions', text: '操作', width: 120, fixed: true, sortable: false },
      ],
      userStatuses,
      preferredLanguages,
      userTypes,
      groups: [],
      lockDialog: {
        show: false,
        lockNumber: null,
      },
    };
  },
  computed: {
    ...mapState('profile', ['cType']),
  },
  created() {
    if (!this.$checkPermission(['USER_EDIT'])) this.tableHeaders.splice(-1, 1);

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

        this.groups = await handleGroups();
        let lockNumber = await UsersApi.getUnlockTime();
        this.lockDialog.lockNumber = lockNumber.value;

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
        let { content, totalElements } = await UsersApi.search({
          ...this.getPagination(this.tableOptions),
          sort: this.getSort(this.tableOptions),
          obj: { ...filterOptions },
        });

        this.tableItems = content.map((item) => {
          return {
            ...item,
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
    async onLockSetClick() {
      try {
        this.$showDelayLoading();

        await UsersApi.setUnlockTime({ lockTime: this.lockDialog.lockNumber });

        this.$success('設置次數成功');
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
    async onUnlockClick() {
      try {
        if (['ADMIN'].includes(this.cType)) {
          let find = this.tableSelected.find((item) => ['IT'].includes(item.type));
          if (find) throw '部門主管不可編輯系統管理員';
        }

        await this.$confirmDialog({
          showCancel: true,
          text: this.$t('Common.message.unlockConfirm'),
        });
        this.$showDelayLoading();

        for (const i in this.tableSelected)
          await UsersApi.unlock({ userId: this.tableSelected[i].id });

        this.load();
        this.$success(this.$t('Common.message.unlockSuccess'));
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    async onDeleteClick() {
      try {
        if (['ADMIN'].includes(this.cType)) {
          let find = this.tableSelected.find((item) => ['IT', 'ADMIN'].includes(item.type));
          if (find) throw '部門主管不可刪除系統管理員、部門主管';
        }

        await this.$confirmDialog({
          showCancel: true,
          text: this.$t('Common.message.deleteConfirmMulti'),
        });
        this.$showDelayLoading();

        for (let index = 0; index < this.tableSelected.length; index++) {
          if (!['ADMIN'].includes(this.tableSelected[index].type))
            await UsersApi.delete({ id: this.tableSelected[index].id });
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
    onPasswordClick() {
      try {
        if (['ADMIN'].includes(this.cType)) {
          let find = this.tableSelected.find((item) => ['IT'].includes(item.type));
          if (find) throw '部門主管不可編輯系統管理員';
        }

        this.$refs['passwordDialog'].setDialog({ type: 'admin', items: this.tableSelected });
      } catch (error) {
        this.$error(error);
      }
    },
    //
    async onStatusChange(item) {
      try {
        this.$showDelayLoading();

        let temp = cloneDeep(item);
        temp.enabled = !temp.enabled;
        await UsersApi.update(temp);

        this.load();
        this.$success(this.$t('Common.message.changeSuccess'));
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    onEditClick(item) {
      try {
        if (['ADMIN'].includes(this.cType)) {
          let find = ['IT'].includes(item.type);
          if (find) throw '部門主管不可編輯系統管理員';
        }

        this.$refs['editDialog'].setDialog({ item });
      } catch (error) {
        this.$error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
