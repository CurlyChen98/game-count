<template>
  <v-dialog v-model="show" width="600" persistent>
    <v-card>
      <v-card-title>
        <div class="text-h6 font-weight-bold">
          <span>投標箱</span>
          <span v-if="isEdit">：編輯</span>
          <span v-else>：新增</span>
        </div>
        <v-spacer />
        <v-icon style="font-size: 24px; cursor: pointer" @click="onDialogClose">mdi-close</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <v-form ref="editDialogForm" class="card__content">
        <form-item label="標書編號" labelRequired>
          <cover-autocomplete
            v-model="form.cstNbr"
            :rules="[required]"
            :items="numbers"
            :disabled="isEdit"
            :search-input.sync="searchInput"
            :menu-props="{
              closeOnContentClick: true,
            }"
            :click-clear="false"
            @input="numberInput"
          >
            <template v-slot:item="{ item, attrs, on }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-content>
                  <v-list-item-title v-if="item.cstDsc">{{
                    `${item.value}（${item.cstDsc}）`
                  }}</v-list-item-title>
                  <v-list-item-title v-else>{{ `${item.value}` }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-if="searchInput" v-slot:append-item>
              <div>
                <v-divider class="mb-2"></v-divider>
                <v-list-item @click="numberInput(searchInput, 'other')">
                  <v-list-item-content>
                    <v-list-item-title>使用自定義（other{{ searchInput }}）</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </template>
            <template v-slot:append-outer>
              <div style="margin-top: -6px" @click.stop>
                <v-btn
                  :disabled="isEdit"
                  color="primary"
                  @click="$refs['numberSelectDialog'].setDialog({ numbers })"
                >
                  進階
                </v-btn>
              </div>
            </template>
          </cover-autocomplete>
        </form-item>
        <form-item label="標書名稱" labelRequired>
          <cover-input v-model="form.cstDsc" :rules="[required]" />
        </form-item>
        <form-item label="展開日期" labelRequired>
          <cover-date
            v-model="form._openDate"
            :rules="[required]"
            :placeholder="$t('Common.label.plsSelect')"
            :disabled="isEdit && !['NOT_STARTED'].includes(form.tenderStatus)"
            onlyDate
            @change="onDateChange('_openDate', '_openTime', '10:00')"
          />
        </form-item>
        <form-item label="展開時間" labelRequired>
          <cover-date
            v-model="form._openTime"
            :rules="[required]"
            :placeholder="$t('Common.label.plsSelect')"
            :disabled="isEdit && !['NOT_STARTED'].includes(form.tenderStatus)"
            onlyTime
          />
        </form-item>
        <form-item label="截標日期" labelRequired>
          <cover-date
            v-model="form._deadDate"
            :rules="[required]"
            :placeholder="$t('Common.label.plsSelect')"
            :disabled="isEdit && !['NOT_STARTED', 'PROCEED'].includes(form.tenderStatus)"
            onlyDate
            @change="onDateChange('_deadDate', '_deadTime', '23:59')"
          />
        </form-item>
        <form-item label="截標時間" labelRequired>
          <cover-date
            v-model="form._deadTime"
            :rules="[required]"
            :placeholder="$t('Common.label.plsSelect')"
            :disabled="isEdit && !['NOT_STARTED', 'PROCEED'].includes(form.tenderStatus)"
            onlyTime
          />
        </form-item>
        <template v-if="!isEdit">
          <form-item label="是否加密" labelRequired>
            <cover-radio-group v-model="form.encrypted" row>
              <v-radio label="加密" :value="true" />
              <v-radio label="不加密" :value="false" />
            </cover-radio-group>
          </form-item>
          <form-item v-if="form.encrypted" label="密碼" labelRequired>
            <cover-input v-model="form.password" :rules="[required]" type="password" />
          </form-item>
          <form-item v-if="form.encrypted" label="再次輸入密碼" labelRequired>
            <cover-input v-model="form._passwordConfirm" :rules="[required]" type="password" />
          </form-item>
        </template>
      </v-form>
      <v-card-actions class="d-flex align-center justify-center">
        <v-btn depressed @click="onDialogClose">{{ $t('Common.action.cancel') }}</v-btn>
        <v-btn color="primary" depressed @click="onDialogConfirm">
          {{ $t('Common.action.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <NumberSelectDialog ref="numberSelectDialog" @success="numberChange" />
  </v-dialog>
</template>

<script>
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';
import { FaxTenderBoxApi, ViewUserApi } from '@/api/index.js';
import * as formRule from '@/utils/form-rule.js';
import * as dateFilter from '@/utils/date-filter.js';
import NumberSelectDialog from './NumberSelectDialog';
let formTemp = function () {
  return {
    encrypted: false,
  };
};

export default {
  components: { NumberSelectDialog },
  props: {
    password: String,
  },
  data() {
    return {
      show: false,
      form: formTemp(),
      numbers: [],
      searchInput: null,
    };
  },
  computed: {
    isEdit() {
      return !!this.form.id;
    },
  },
  created() {},
  methods: {
    ...formRule,
    ...dateFilter,
    //
    async setDialog({ show = true, item = {} } = {}) {
      try {
        this.$showDelayLoading();

        let numbers = await ViewUserApi.searchNumber();
        this.numbers = numbers.map((item) => {
          return {
            text: item.cstNbr,
            value: item.cstNbr,
            ...item,
          };
        });

        if (item.id) {
          let { openDateTime, deadDateTime, ...other } = item;
          this.$set(this, 'form', {
            ...this.form,
            ...other,
            _openDate: dayjs(openDateTime).format('YYYY-MM-DD'),
            _openTime: dayjs(openDateTime).format('HH:mm'),
            _deadDate: dayjs(deadDateTime).format('YYYY-MM-DD'),
            _deadTime: dayjs(deadDateTime).format('HH:mm'),
          });
        } else {
          this.$set(this.form, '_openDate', dayjs().format('YYYY-MM-DD'));
          this.$set(
            this.form,
            '_openTime',
            dayjs()
              .minute(dayjs().minute() + 5)
              .format('HH:mm')
          );
        }

        this.show = show;
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    numberInput(searchInput, prefix) {
      if (prefix) {
        let custom = `${prefix}${searchInput}`;
        this.numbers.push({
          text: custom,
          value: custom,
        });
        this.$set(this.form, 'cstNbr', custom);
      } else {
        let find = this.numbers.find((item) => searchInput === item.cstNbr);
        this.numberChange({ choose: find });
      }
    },
    //
    numberChange({ number, choose }) {
      if (number) {
        this.$set(this.form, 'cstNbr', number);
      }

      if (choose?.id) {
        let { deadDt, deadHr, cstDsc } = choose;
        this.$set(this.form, 'cstDsc', cstDsc);
        this.$set(this.form, '_deadDate', deadDt);
        this.$set(this.form, '_deadTime', deadHr.slice(0, 2) + ':' + deadHr.slice(2));
      } else {
        this.$set(this.form, 'cstDsc', null);
        this.$set(this.form, '_deadDate', null);
        this.$set(this.form, '_deadTime', null);
        this.$refs.editDialogForm.resetValidation();
      }
    },
    //
    onDateChange(main, relevance, time) {
      if (!this.form[relevance]) {
        this.$set(this.form, relevance, time);
      }
    },
    //
    onDialogClose() {
      this.resetDialog();
    },
    //
    async onDialogConfirm() {
      if (!this.$refs.editDialogForm.validate()) return;

      try {
        this.$showDelayLoading();

        let {
          _openDate,
          _openTime,
          _deadDate,
          _deadTime,
          encrypted,
          password,
          _passwordConfirm,
          ...form
        } = cloneDeep(this.form);

        let openDateTime = dayjs(`${_openDate} ${_openTime}`, ['YYYY-MM-DD HH:mm']);
        let deadDateTime = dayjs(`${_deadDate} ${_deadTime}`, ['YYYY-MM-DD HH:mm']);
        if (openDateTime.isAfter(deadDateTime)) {
          throw '展開日期不可小於截標日期';
        }
        if (password !== _passwordConfirm) {
          throw '兩次輸入的密碼不一致';
        }

        form.openDateTime = openDateTime.toISOString();
        form.deadDateTime = deadDateTime.toISOString();

        Reflect.deleteProperty(form, 'createdTime');
        Reflect.deleteProperty(form, 'createdBy');
        Reflect.deleteProperty(form, 'modifiedTime');
        Reflect.deleteProperty(form, 'modifiedBy');

        if (this.isEdit) {
          form.password = this.password;
          await FaxTenderBoxApi.edit(form);
          this.$success(this.$t('Common.message.editSuccess'));
          this.$emit('success', { type: 'edit' });
        } else {
          form.tenderStatus = 'NOT_STARTED';
          let { id } = await FaxTenderBoxApi.create(form);
          await FaxTenderBoxApi.editPassword({
            id,
            encrypted,
            password,
          });
          this.$success(this.$t('Common.message.addSuccess'));
          this.$emit('success', { type: 'add' });
        }

        this.resetDialog();
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    resetDialog() {
      this.show = false;

      this.$nextTick(() => {
        this.$set(this, 'form', formTemp());
        this.$refs['editDialogForm'].resetValidation();
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
