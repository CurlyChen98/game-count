<template>
  <v-dialog v-model="show" width="900" persistent>
    <v-card>
      <v-card-title>
        <div class="text-h6 font-weight-bold">
          <span>角色權限：用戶管理</span>
        </div>
        <v-spacer />
        <v-icon style="font-size: 24px; cursor: pointer" @click="onDialogClose">mdi-close</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <div class="card__content pt-2">
        <v-row>
          <v-col order="12" class="d-flex">
            <ApiSearchExpand v-model="readyList" :searchFun="searchUser" default-search />
            <div class="ml-2" style="margin-top: 2px">
              <v-btn :disabled="readyList.length === 0" color="primary" @click="onAddClick">
                添加
              </v-btn>
              <v-btn :disabled="!hasSelected" color="error" @click="onDeleteClick">刪除</v-btn>
            </div>
          </v-col>
        </v-row>
        <DataTable
          v-model="tableSelected"
          :headers="tableHeaders"
          :items="tableItems"
          :options="tableOptions"
          :server-items-length="itemsCount"
          class="mt-2"
          style="height: 50vh"
          show-select
          @update:options="onOptionsChange"
          @click:row="onRowClick"
        >
        </DataTable>
      </div>
      <v-card-actions class="d-flex align-center justify-center">
        <v-btn color="primary" @click="onDialogClose">關閉</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { UsersGroupApi, UsersApi } from '@/api/index.js';
import ApiSearchExpand from '@/components/ApiSearchExpand.vue';
import tablePageMixin from '@/mixins/tablePage.js';

export default {
  mixins: [tablePageMixin],
  components: { ApiSearchExpand },
  data() {
    return {
      show: false,
      item: null,
      readyList: [],
      filterOptions: {},
      tableOptions: {
        sortBy: ['operationTime'],
        sortDesc: [true],
      },
      tableHeaders: [
        { value: 'username', text: '賬號', width: 180 },
        { value: 'nameCn', text: '中文名稱', width: 180 },
        { value: 'nameEn', text: '外文名稱', width: 180 },
      ],
    };
  },
  methods: {
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

        let { content, totalElements } = await UsersGroupApi.getUser({
          ...this.getPagination(this.tableOptions),
          groupId: this.item.id,
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
    async searchUser(evnet, currentItems) {
      let find = currentItems.find((item) => evnet === item.text);
      if (find) return currentItems;

      const { content } = await UsersApi.search({
        page: 0,
        size: 50,
        sort: 'modifiedTime:desc',
        obj: { name: evnet },
      });
      return content.map((item) => {
        return {
          ...item,
          text: item.username,
          value: item.id,
        };
      });
    },
    //
    async onAddClick() {
      try {
        this.$showDelayLoading();

        let userIds = this.readyList.map((item) => item.id);
        await UsersGroupApi.addUser({
          groupId: this.item.id,
          userIds,
        });

        this.$success(this.$t('Common.message.addSuccess'));
        this.load();
        this.readyList = [];
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    async onDeleteClick() {
      try {
        this.$showDelayLoading();

        let userIds = this.tableSelected.map((item) => item.id);
        await UsersGroupApi.deleteUser({
          groupId: this.item.id,
          userIds,
        });

        this.$success('刪除成功');
        this.load();
        this.tableSelected = [];
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
        this.readyList = [];
        this.tableClear();
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
