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
        <TableFilterItem label="標書名稱" isTwo>
          <cover-input
            v-model="filterOptions.cstDsc"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="進行日期" isThree>
          <cover-date-range
            v-model="filterOptions.dateTime"
            :placeholder="$t('Common.label.plsSelect')"
            hide-details
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
        <TableFilterItem label="投標箱加密">
          <cover-select
            v-model="filterOptions.encrypted"
            :items="trueFalse"
            :placeholder="$t('Common.label.plsSelect')"
            hide-details
          />
        </TableFilterItem>
      </TableFilter>
    </v-card>
    <!--  -->
    <v-card class="table-card">
      <div class="table-control">
        <div>
          <v-tabs v-model="statusTabIndex" @change="init">
            <v-tab v-for="item in bidBoxStatuses" :key="item.value">{{ item.text }}</v-tab>
          </v-tabs>
        </div>
        <div>
          <v-btn color="primary" @click="$refs['editDialog'].setDialog()">新增投標箱</v-btn>
        </div>
      </div>
      <DataTable
        v-model="tableSelected"
        :headers="tableHeaders"
        :items="tableItems"
        :options="tableOptions"
        :server-items-length="itemsCount"
        @update:options="onOptionsChange"
      >
        <template v-slot:[`item.cstNbr`]="{ item }">
          <span
            class="text--click"
            @click="
              $openRelevance({
                name: 'bidBoxDetail',
                query: { boxId: item.id, encrypted: item.encrypted ? 'y' : 'n' },
              })
            "
          >
            {{ $filterBoxNumber(item.cstNbr) }}
          </span>
        </template>
        <template v-slot:[`item.tenderStatus`]="{ item }">
          <div
            v-if="item.deleted"
            class="rect-status"
            :style="[objFindColor({ list: bidBoxStatuses, value: 'DELETE' })]"
          >
            {{ objFindValue({ list: bidBoxStatuses, value: 'DELETE' }) }}
          </div>
          <div
            v-else
            class="rect-status"
            :style="[objFindColor({ list: bidBoxStatuses, value: item.tenderStatus })]"
          >
            {{ objFindValue({ list: bidBoxStatuses, value: item.tenderStatus }) }}
          </div>
        </template>
      </DataTable>
    </v-card>
    <!--  -->
    <EditDialog ref="editDialog" @success="init" />
    <!--  -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';
import tablePageMixin from '@/mixins/tablePage.js';
import * as dateFilter from '@/utils/date-filter.js';
import { FaxTenderBoxApi } from '@/api/index.js';
import { bidBoxStatuses, trueFalse, objFindValue, objFindColor } from '@/utils/stock.js';
import EditDialog from './dialog/EditDialog';

export default {
  mixins: [tablePageMixin],
  components: { EditDialog },
  data() {
    return {
      statusTabIndex: 0,
      filterOptions: {},
      tableOptions: {
        sortBy: ['modifiedTime'],
        sortDesc: [true],
      },
      tableHeaders: [
        { value: 'cstNbr', text: '標書編號', width: 160 },
        { value: 'cstDsc', text: '標書名稱', width: 160 },
        { value: 'countRecord', text: '收件記錄數', width: 160, sortable: false },
        { value: '_openDateTime', text: '展開時間', width: 180 },
        { value: '_deadDateTime', text: '截標時間', width: 180 },
        { value: 'createdBy', text: '建立者', width: 160 },
        { value: '_encrypted', text: '加密', width: 160 },
        { value: 'tenderStatus', text: '投標箱狀態', width: 160, fixed: true },
      ],
      bidBoxStatuses: [],
      trueFalse,
    };
  },
  computed: {
    ...mapState('profile', ['cPermissions']),
  },
  created() {
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

        let proceedIndex = bidBoxStatuses.findIndex((item) => item.value === 'PROCEED');
        let proceed = bidBoxStatuses.splice(proceedIndex, 1);
        bidBoxStatuses.unshift(...proceed);
        this.bidBoxStatuses = bidBoxStatuses.filter((item) => {
          if (
            this.$checkPermission(['TENDER_BOX_VIEW_NO_START']) &&
            ['NOT_STARTED'].includes(item.value)
          )
            return true;
          if (this.$checkPermission(['TENDER_BOX_VIEW_ING']) && ['PROCEED'].includes(item.value))
            return true;
          if (
            this.$checkPermission(['TENDER_BOX_VIEW_END_TIME']) &&
            ['END_TENDER'].includes(item.value)
          )
            return true;
          if (
            this.$checkPermission(['TENDER_BOX_VIEW_DOWNLOAD']) &&
            ['ALREADY_DOWNLOAD'].includes(item.value)
          )
            return true;
          if (this.$checkPermission(['TENDER_BOX_VIEW_DELETE']) && ['DELETE'].includes(item.value))
            return true;
          return false;
        });

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
            statusList: [this.bidBoxStatuses[this.statusTabIndex].value],
          },
        });

        this.tableItems = content.map((item) => {
          let { encrypted, openDateTime, deadDateTime } = item;
          return {
            ...item,
            _encrypted: encrypted ? '是' : '否',
            _openDateTime: this.filterDateTime(openDateTime),
            _deadDateTime: this.filterDateTime(deadDateTime),
          };
        });
        this.itemsCount = totalElements;
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
