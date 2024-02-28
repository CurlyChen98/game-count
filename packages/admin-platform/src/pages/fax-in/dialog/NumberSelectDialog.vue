<template>
  <v-dialog v-model="show" width="900" persistent>
    <v-card>
      <v-card-title>
        <div class="text-h6 font-weight-bold">
          <span>投標箱：標書編號</span>
        </div>
        <v-spacer />
        <v-icon style="font-size: 24px; cursor: pointer" @click="onDialogClose">mdi-close</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <v-form ref="editDialogForm" class="card__content pt-0">
        <v-card class="not-shadow mt-2">
          <TableFilter @clearFilter="filterOptions = {}" @reload="reload">
            <TableFilterItem label="標書年份" allCol="4" isOne>
              <cover-select
                v-model="filterOptions.cstYr"
                :items="years"
                :placeholder="$t('Common.label.plsSelect')"
                hide-details
              />
            </TableFilterItem>
            <TableFilterItem label="標書編號" allCol="4" isTwo>
              <cover-input
                v-model="filterOptions.cstNbr"
                :placeholder="$t('Common.label.plsInput')"
                hide-details
                @keydown.enter="reload"
              />
            </TableFilterItem>
            <TableFilterItem label="標書名稱" allCol="4">
              <cover-input
                v-model="filterOptions.cstDsc"
                :placeholder="$t('Common.label.plsInput')"
                hide-details
                @keydown.enter="reload"
              />
            </TableFilterItem>
            <TableFilterItem label="截標時間" allCol="6">
              <cover-date-range
                v-model="filterOptions.deadDateRange"
                :placeholder="$t('Common.label.plsSelect')"
                hide-details
              />
            </TableFilterItem>
          </TableFilter>
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
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn color="primary" text @click="onNumberChoose(item)">選擇</v-btn>
            </template>
          </DataTable>
        </v-card>
      </v-form>
      <v-card-actions class="d-flex align-center justify-center">
        <v-btn @click="onDialogClose">关闭</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import dayjs from 'dayjs';
import tablePageMixin from '@/mixins/tablePage.js';
import { handleYears } from '@/utils/stock.js';
import { cloneDeep } from 'lodash-es';
let formTemp = function () {
  return {};
};

export default {
  mixins: [tablePageMixin],
  data() {
    return {
      show: false,
      form: formTemp(),
      currentNumber: '',
      inputNumber: '',
      numberType: 'default',
      filterOptions: {},
      tableOptions: {
        itemsPerPage: -1,
      },
      tableHeaders: [
        { value: 'cstYr', text: '標書年份', width: 140 },
        { value: 'cstNbr', text: '標書編號', width: 140 },
        { value: 'cstSto', text: '倉庫編號', width: 140 },
        { value: 'cstTyp', text: '標書類別', width: 140 },
        { value: 'cstDsc', text: '標書名稱', width: 200 },
        { value: 'vldDay', text: '有效天數', width: 140 },
        { value: 'deadDt', text: '截標日期', width: 140 },
        { value: 'deadHr', text: '截標時間', width: 140 },
        { value: 'openDt', text: '折標日期', width: 140 },
        { value: 'openHr', text: '折標時間', width: 140 },
        { value: 'adjDat', text: '甄選日期', width: 140 },
        { value: 'autDat', text: '公佈/上網日期', width: 140, sortable: false },
        { value: 'aprDat', text: '批回日期', width: 140 },
        { value: 'actions', text: '操作', width: 120, fixed: true, sortable: false },
      ],
      years: [],
    };
  },
  methods: {
    //
    async setDialog({ show = true, numbers } = {}) {
      try {
        this.$showDelayLoading();

        this.years = handleYears();
        this._numbers = numbers.filter((item) => item.id);
        this.tableItems = cloneDeep(this._numbers);

        this.show = show;
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    async reload() {
      try {
        this.$showDelayLoading();
        let numbers = cloneDeep(this._numbers);

        let { cstYr, cstNbr, cstDsc, deadDateRange } = this.filterOptions;

        this.tableItems = numbers.filter((item) => {
          if (cstYr && cstYr != item.cstYr) {
            return false;
          } else if (cstNbr && !item.cstNbr?.includes(cstNbr)) {
            return false;
          } else if (cstDsc && !item.cstDsc?.includes(cstDsc)) {
            return false;
          } else if (
            deadDateRange &&
            (!item.deadDt ||
              !dayjs(item.deadDt).isBetween(deadDateRange[0], deadDateRange[1], null, '[['))
          ) {
            return false;
          }

          return true;
        });
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    // onTypeChange(event) {
    //   if (event === 'custom') this.currentNumber = this._lastInput;
    //   else this.currentNumber = '';
    // },
    //
    // onNumberInput(event) {
    //   this.numberType = 'custom';
    //   this.currentNumber = `other${event}`;
    //   this._lastInput = this.currentNumber;
    // },
    //
    onNumberChoose(item) {
      let sendData = {
        number: item.cstNbr,
        choose: item,
      };
      this.$emit('success', sendData);
      this.resetDialog();
    },
    //
    onDialogClose() {
      this.resetDialog();
    },
    //
    // async onDialogConfirm() {
    // if (!this.currentNumber) return this.$error(`請確認編號。`);
    // // if (this.currentNumber.length > 10)
    // //   return this.$error(`編號${this.$t('FormRule.message.maxLength', [10])}`);

    // let sendData = {
    //   number: this.currentNumber,
    //   choose: this.numberType === 'default' && this._lastChoose ? this._lastChoose : null,
    // };
    // this.$emit('success', sendData);
    // this.resetDialog();
    // },
    //
    resetDialog() {
      this.show = false;

      this.$nextTick(() => {
        this.$set(this, 'form', formTemp());
        this.filterOptions = {};
        this.$refs['editDialogForm'].resetValidation();
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
