<template>
  <div class="page">
    <!--  -->
    <page-breadcrumbs />
    <!--  -->
    <v-card class="search-card">
      <TableFilter @clearFilter="filterOptions = {}" @reload="reload">
        <TableFilterItem label="標書編號" isOne>
          <cover-input
            v-model="filterOptions.cstNbr"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="傳真號碼" isTwo>
          <cover-input
            v-model="filterOptions.fax"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="供應商編號" isThree>
          <cover-input
            v-model="filterOptions.supplierCode"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="供應商名稱">
          <cover-input
            v-model="filterOptions.supplierName"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="標書板數">
          <cover-input
            v-model="filterOptions.page"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="逾期收件">
          <cover-select
            v-model="filterOptions.fileOutOfDate"
            :placeholder="$t('Common.label.plsInput')"
            :items="trueFalse"
            hide-details
          />
        </TableFilterItem>
        <TableFilterItem label="所在投標箱">
          <ApiSearch
            v-model="filterOptions.tenderBoxId"
            :searchFun="searchBox"
            hide-details
            default-search
          />
        </TableFilterItem>
        <TableFilterItem label="收件記錄編號">
          <cover-input
            v-model="filterOptions.recordCode"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="接收日期">
          <cover-date-range
            v-model="filterOptions.receivedDateTime"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
          />
        </TableFilterItem>
      </TableFilter>
    </v-card>
    <!--  -->
    <v-card class="table-card">
      <div class="table-control">
        <div>
          <v-checkbox
            v-model="autoRefresh"
            label="定時刷新(1)分鐘"
            class="pt-0 mt-0"
            hide-details
            @change="onAutoChange"
          />
        </div>
        <div>
          <v-btn color="primary" @click="addFileDiglog.show = true">新增收件（測試）</v-btn>
          <v-btn
            v-if="$checkPermission(['TENDER_RECORD_MOVE'])"
            :disabled="!hasSelected"
            color="primary"
            @click="onFileMoveClick"
            >收件移動</v-btn
          >
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
        @click:row="onRowClick"
      >
        <template v-slot:[`item.recordCode`]="{ item }">
          <span class="text--click" @click="onFileDetaillick(item)">{{ item.recordCode }}</span>
        </template>
        <template v-slot:[`item.deadTimeDes`]="{ item }">
          <span class="red--text">{{ item.deadTimeDes }}</span>
        </template>
        <template v-slot:[`item.tenderBox.cstDsc`]="{ item }">
          <span
            class="text--click"
            @click="
              $openRelevance({
                name: 'bidBoxDetail',
                query: {
                  boxId: item.tenderBox.id,
                  encrypted: item.tenderBox.encrypted ? 'y' : 'n',
                },
              })
            "
            >{{ item.tenderBox.cstDsc }}</span
          >
        </template>
        <template v-slot:[`item.receivedDateTime`]="{ item }">
          <span>{{ filterDateTime(item.receivedDateTime) }}</span>
        </template>
      </DataTable>
    </v-card>
    <!--  -->
    <v-dialog v-model="addFileDiglog.show" width="600" persistent>
      <v-card>
        <v-card-title>
          <div class="text-h6 font-weight-bold">
            <span>新增收件（測試）</span>
          </div>
          <v-spacer />
        </v-card-title>
        <v-divider></v-divider>
        <v-form ref="editDialogForm" class="card__content">
          <form-item label="傳真號碼">
            <cover-input v-model="addFileDiglog.fax" :items="tenderBoxs" />
          </form-item>
          <form-item label="標書版數">
            <cover-input v-model="addFileDiglog.page" :items="tenderBoxs" />
          </form-item>
        </v-form>
        <v-card-actions class="d-flex align-center justify-center">
          <v-btn depressed @click="addFileDiglog.show = false">{{
            $t('Common.action.cancel')
          }}</v-btn>
          <v-btn color="primary" depressed @click="addFile">選擇文件</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <FileMoveDialog ref="fileMoveDialog" @success="init" />
    <FileDetailDialog ref="fileDetailDialog" />
    <!--  -->
  </div>
</template>

<script>
import { selectFile } from '@metaarchit/common-utils/lib/file';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';
import tablePageMixin from '@/mixins/tablePage.js';
import * as dateFilter from '@/utils/date-filter.js';
import { FaxTenderBoxApi, FaxInRecordApi } from '@/api/index.js';
import ApiSearch from '@/components/ApiSearch';
import { trueFalse, objFindValue, objFindColor } from '@/utils/stock.js';
import FileMoveDialog from './dialog/FileMoveDialog';
import FileDetailDialog from './dialog/FileDetailDialog';

export default {
  mixins: [tablePageMixin],
  components: { ApiSearch, FileMoveDialog, FileDetailDialog },
  data() {
    return {
      autoRefresh: true,
      autoTime: 100 * 60,
      filterOptions: {},
      tableOptions: {
        sortBy: ['receivedDateTime'],
        sortDesc: [true],
      },
      tableHeaders: [
        { value: 'recordCode', text: '收件記錄編號', width: 160 },
        { value: 'qrCodeText', text: '傳真識別資料', width: 160 },
        { value: 'tenderBox.cstNbr', text: '標書編號', width: 160 },
        { value: 'fax', text: '傳真號碼', width: 160 },
        { value: 'supplier.supCode', text: '供應商編號', width: 160 },
        { value: 'supplier.supChnFn', text: '供應商名稱', width: 280 },
        { value: 'page', text: '標書版數', width: 160 },
        { value: 'deadTimeDes', text: '逾期收件', width: 180 },
        { value: 'tenderBox.cstDsc', text: '所在投標箱', width: 200 },
        { value: 'receivedDateTime', text: '接收時間', width: 160 },
      ],
      trueFalse,
      addFileDiglog: {
        show: false,
        fax: 'test',
        page: '1',
      },
      tenderBoxs: [],
      suppliers: [],
    };
  },
  computed: {
    isDev() {
      return ['dev'].includes(process.env.VUE_APP_ENV);
    },
  },
  watch: {},
  created() {
    this.init();
  },
  beforeDestroy() {
    if (this._autoRefreshTime) clearTimeout(this._autoRefreshTime);
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

        let { receivedDateTime, ...filterOptions } = cloneDeep(this.filterOptions);
        let receivedDateTimeStart =
          receivedDateTime?.[0] && dayjs(`${receivedDateTime[0]} 00:00:00`).toISOString();
        let receivedDateTimeEnd =
          receivedDateTime?.[1] && dayjs(`${receivedDateTime[1]} 23:59:00`).toISOString();
        let { content, totalElements } = await FaxInRecordApi.search({
          ...this.getPagination(this.tableOptions),
          sort: this.getSort(this.tableOptions),
          obj: { ...filterOptions, receivedDateTimeStart, receivedDateTimeEnd },
        });

        this.tableItems = content.map((item) => {
          if (item.tenderBox?.cstNbr === 'Unfied') item.tenderBox.cstDsc = 'Unfile-暫定投標箱';
          return {
            ...item,
          };
        });
        this.itemsCount = totalElements;

        if (this.autoRefresh) {
          if (this._autoRefreshTime) clearTimeout(this._autoRefreshTime);
          this._autoRefreshTime = setTimeout(() => {
            this.load();
          }, this.autoTime);
        }
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    async searchBox(evnet, currentItems) {
      let find = currentItems.find(
        (item) => this.filterOptions.tenderBoxId === item.id && evnet === item.text
      );
      if (find) return currentItems;

      const { content } = await FaxTenderBoxApi.search({
        page: 0,
        size: 50,
        sort: '',
        obj: { cstDsc: evnet },
      });
      return content.map((item) => {
        return {
          ...item,
          text: item.cstDsc,
          value: item.id,
        };
      });
    },
    //
    onAutoChange(event) {
      if (this._autoRefreshTime) clearTimeout(this._autoRefreshTime);
      if (event)
        this._autoRefreshTime = setTimeout(() => {
          this.load();
        }, this.autoTime);
    },
    //
    onFileMoveClick() {
      this.$refs['fileMoveDialog'].setDialog({ items: this.tableSelected });
    },
    //
    onFileDetaillick(item) {
      this.$refs['fileDetailDialog'].setDialog({ item });
    },
    //
    async addFile() {
      let file = await selectFile({
        accept: '',
        multiple: false,
      });

      try {
        this.$showDelayLoading();

        let formData = new FormData();
        let obj = {
          fax: this.addFileDiglog.fax,
          page: this.addFileDiglog.page * 1,
        };
        formData.append('value', new Blob([JSON.stringify(obj)], { type: 'application/json' }));
        formData.append('file', file);

        await FaxInRecordApi.add(formData);
        this.addFileDiglog.show = false;
        this.reload();
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
