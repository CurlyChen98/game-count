<template>
  <DataTable
    v-model="tableSelected"
    :headers="tableHeaders"
    :items="tableItems"
    :options="tableOptions"
    :server-items-length="itemsCount"
    class="mt-4"
    not-footer
    :in-scroll="false"
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
</template>

<script>
import { mapState } from 'vuex';
import { cloneDeep } from 'lodash-es';
import tablePageMixin from '@/mixins/tablePage.js';
import * as dateFilter from '@/utils/date-filter.js';
import { FaxTenderBoxApi } from '@/api/index.js';
import { bidBoxStatuses, trueFalse, objFindValue, objFindColor } from '@/utils/stock.js';

export default {
  mixins: [tablePageMixin],
  data() {
    return {
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
      bidBoxStatuses,
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

        let statusList = [];
        if (this.$checkPermission(['TENDER_BOX_VIEW_NO_START'])) statusList.push('NOT_STARTED');
        if (this.$checkPermission(['TENDER_BOX_VIEW_ING'])) statusList.push('PROCEED');
        if (this.$checkPermission(['TENDER_BOX_VIEW_END_TIME'])) statusList.push('END_TENDER');
        if (this.$checkPermission(['TENDER_BOX_VIEW_DOWNLOAD']))
          statusList.push('ALREADY_DOWNLOAD');
        if (this.$checkPermission(['TENDER_BOX_VIEW_DELETE'])) statusList.push('DELETE');
        if (statusList.length === 0) return;

        let { ...filterOptions } = cloneDeep(this.filterOptions);
        const { content, totalElements } = await FaxTenderBoxApi.search({
          ...this.getPagination(this.tableOptions),
          sort: this.getSort(this.tableOptions, {
            _encrypted: 'encrypted',
            _openDateTime: 'openDateTime',
            _deadDateTime: 'deadDateTime',
          }),
          obj: {
            ...filterOptions,
            statusList,
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
