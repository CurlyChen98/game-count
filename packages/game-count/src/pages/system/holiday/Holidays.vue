<template>
  <div class="page">
    <!--  -->
    <page-breadcrumbs />
    <!--  -->
    <v-card class="search-card">
      <TableFilter @clearFilter="filterOptions = {}" @reload="reload">
        <TableFilterItem label="假期年份" isOne>
          <cover-select
            v-model="filterOptions.year"
            :items="years"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
          />
        </TableFilterItem>
        <TableFilterItem label="假期日期" isTwo>
          <cover-date
            v-model="filterOptions.holidayDate"
            :placeholder="$t('Common.label.plsInput')"
            only-date
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
        <TableFilterItem label="假期類型" isThree>
          <cover-select
            v-model="filterOptions.holidayType"
            :items="holidayTypesCover"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
          />
        </TableFilterItem>
        <TableFilterItem label="假期描述">
          <cover-input
            v-model="filterOptions.description"
            :placeholder="$t('Common.label.plsInput')"
            hide-details
            @keydown.enter="reload"
          />
        </TableFilterItem>
      </TableFilter>
    </v-card>
    <!--  -->
    <v-card class="table-card">
      <div v-if="this.$checkPermission(['HOLIDAY_EDIT'])" class="table-control">
        <div>
          <v-btn v-if="this.$checkPermission(['HOLIDAY_EDIT'])" color="primary" @click="onSyncClick"
            >同步更新</v-btn
          >
        </div>
        <div></div>
      </div>
      <DataTable
        v-model="tableSelected"
        :headers="tableHeaders"
        :items="tableItems"
        :options="tableOptions"
        :server-items-length="itemsCount"
        @update:options="onOptionsChange"
      >
        <template v-slot:[`item.holidayDate`]="{ item }">
          <div>{{ filterDate(item.holidayDate) }}</div>
        </template>
        <template v-slot:[`item.holidayType`]="{ item }">
          <div>{{ objFindValue({ list: holidayTypes, value: item.holidayType }) }}</div>
        </template>
      </DataTable>
    </v-card>
    <!--  -->
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';
import tablePageMixin from '@/mixins/tablePage.js';
import * as dateFilter from '@/utils/date-filter.js';
import { FaxHolidayApi } from '@/api/index.js';
import { holidayTypes, handleYears, objFindValue, objFindColor } from '@/utils/stock.js';

export default {
  mixins: [tablePageMixin],
  data() {
    return {
      autoRefresh: true,
      filterOptions: {},
      tableOptions: {
        sortBy: ['holidayDate'],
        sortDesc: [true],
      },
      tableHeaders: [
        { value: 'description', text: '假期描述', width: 180 },
        { value: 'holidayDate', text: '假日日期', width: 180 },
        { value: 'year', text: '假期年份', width: 180 },
        { value: 'holidayType', text: '假期類型', width: 180 },
      ],
      years: [],
      holidayTypes,
      holidayTypesCover: holidayTypes.filter((it) => ![''].includes(it.value)),
    };
  },
  computed: {},
  created() {
    this.init();
  },
  methods: {
    ...dateFilter,
    objFindValue,
    objFindColor,
    // 頁面初始化
    async init() {
      let year1 = handleYears({ range: -10 });
      let year2 = handleYears({ range: 10 });
      year2.splice(0, 1);
      year2.reverse();
      this.years = [...year2, ...year1];
      this.$set(this.filterOptions, 'year', dayjs().year());

      this.load();
    },
    // 加載初始化內容
    async load() {
      try {
        this.$showDelayLoading();

        let { ...filterOptions } = cloneDeep(this.filterOptions);
        let { content, totalElements } = await FaxHolidayApi.search({
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
    async onSyncClick() {
      try {
        this.$showDelayLoading();

        await FaxHolidayApi.sync();
        this.$success('同步成功');
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
