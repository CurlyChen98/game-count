<template>
  <v-dialog v-model="show" width="900" persistent>
    <v-card>
      <v-card-title>
        <div class="text-h6 font-weight-bold">
          <span>供應商選擇</span>
        </div>
        <v-spacer />
        <v-icon style="font-size: 24px; cursor: pointer" @click="onDialogClose">mdi-close</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <v-form class="card__content pt-0">
        <TableFilter @clearFilter="filterOptions = {}" @reload="reload">
          <TableFilterItem label="供應商編號" allCol="4">
            <cover-input
              v-model="filterOptions.supCode"
              :placeholder="$t('Common.label.plsInput')"
              hide-details
              @keydown.enter="reload"
            />
          </TableFilterItem>
          <TableFilterItem label="供應商名稱" allCol="4">
            <cover-input
              v-model="filterOptions.supName"
              :placeholder="$t('Common.label.plsInput')"
              hide-details
              @keydown.enter="reload"
            />
          </TableFilterItem>
        </TableFilter>
        <DataTable
          v-model="tableSelected"
          :headers="tableHeaders"
          :items="tableItems"
          :options="tableOptions"
          :server-items-length="itemsCount"
          style="height: 50vh"
          show-select
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
        </DataTable>
      </v-form>
      <v-card-actions class="d-flex align-center justify-center">
        <v-btn @click="onDialogClose">取消</v-btn>
        <v-btn color="primary" @click="onDialogConfirm">確認</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { cloneDeep } from 'lodash-es';
import { SupplierApi } from '@/api/index.js';
import LongString from '@/components/LongString.vue';
import tablePageMixin from '@/mixins/tablePage.js';

export default {
  mixins: [tablePageMixin],
  components: { LongString },
  data() {
    return {
      show: false,
      filterOptions: {},
      tableOptions: {
        sortBy: ['modifiedTime'],
        sortDesc: [true],
      },
      tableHeaders: [
        { value: 'supCode', text: '供應商編號', width: 140 },
        { value: 'supChnSn', text: '供應商簡稱', width: 220 },
        { value: 'supeAddr1', text: '供應商地址', width: 220 },
        { value: 'supFaxNo', text: '傳真號碼', width: 180 },
        { value: 'supTlFn1', text: '聯絡電話', width: 180 },
      ],
      years: [],
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

        this.load();

        this.show = show;
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

        let { content, totalElements } = await SupplierApi.search({
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
    onDialogClose() {
      this.resetDialog();
    },
    //
    async onDialogConfirm() {
      this.tableSelected = [];
      this.$emit('confirm', this.tableSelected);

      this.resetDialog();
    },
    //
    resetDialog() {
      this.show = false;

      this.$nextTick(() => {
        this.filterOptions = {};
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
