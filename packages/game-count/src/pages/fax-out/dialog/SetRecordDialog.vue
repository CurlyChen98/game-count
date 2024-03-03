<template>
  <div>
    <v-dialog v-model="show" width="900" persistent>
      <v-card>
        <v-card-title>
          <div class="text-h6 font-weight-bold">
            <span>發送資料</span>
          </div>
          <v-spacer />
          <v-icon style="font-size: 24px; cursor: pointer" @click="onDialogClose">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-form ref="editDialogForm" class="card__content">
          <div class="d-flex">
            <v-btn @click="$refs['suppliers'].setDialog()">關聯供應商生成</v-btn>
            <v-btn @click="$refs['manuallyAddDialog'].setDialog()">單獨新增</v-btn>
            <v-spacer />
            <v-btn color="primary">發送</v-btn>
            <v-btn color="error">刪除</v-btn>
          </div>
          <DataTable
            v-model="tableSelected"
            :headers="tableHeaders"
            :items="tableItems"
            :options="tableOptions"
            :server-items-length="itemsCount"
            class="mt-2"
            style="height: 60vh"
            not-footer
            @update:options="onOptionsChange"
          >
          </DataTable>
        </v-form>
        <v-card-actions class="d-flex align-center justify-center">
          <v-btn @click="onDialogClose">取消</v-btn>
          <v-btn color="primary" @click="onDialogConfirm">儲存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <SuppliersDialog ref="suppliers" @confirm="supplierChange" />
    <ManuallyAddDialog ref="manuallyAddDialog" @confirm="supplierAdd" />
  </div>
</template>

<script>
import tablePageMixin from '@/mixins/tablePage.js';
import { ViewUserApi } from '@/api/index.js';
import { cloneDeep } from 'lodash-es';
import SuppliersDialog from './SuppliersDialog.vue';
import ManuallyAddDialog from './ManuallyAddDialog.vue';

export default {
  components: { SuppliersDialog, ManuallyAddDialog },
  mixins: [tablePageMixin],
  data() {
    return {
      show: false,
      tableOptions: {
        itemsPerPage: -1,
      },
      tableHeaders: [
        { value: 'cstYr', text: '發送記錄編號', width: 160 },
        { value: 'cstNbr', text: '發送者名稱', width: 140 },
        { value: 'cstSto', text: '傳真號碼', width: 140 },
        { value: 'cstTyp', text: '供應商編號', width: 140 },
        { value: 'cstDsc', text: '供應商名稱', width: 200 },
        { value: 'vldDay', text: '發送狀態', width: 140 },
        { value: 'deadDt', text: '發送日期', width: 140 },
        { value: 'deadHr', text: '創建時間', width: 140 },
      ],
    };
  },
  created() {
    // this.setDialog();
  },
  methods: {
    //
    async setDialog({ show = true } = {}) {
      try {
        this.$showDelayLoading();

        this._numbers = await ViewUserApi.searchNumber();
        this.tableItems = cloneDeep(this._numbers);

        this.show = show;
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    supplierChange(event) {
      console.log('🔨[ event ]\n', event);
    },
    //
    supplierAdd(event) {
      console.log('🔨[ event ]\n', event);
    },
    //
    onDialogClose() {
      this.resetDialog();
    },
    //
    async onDialogConfirm() {
      this.$emit('success');

      this.resetDialog();
    },
    //
    resetDialog() {
      this.show = false;

      this.$nextTick(() => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
