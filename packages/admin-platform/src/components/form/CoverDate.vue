<template>
  <v-dialog v-model="show" persistent width="290px">
    <!--  -->
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="showVal"
        :label="label"
        :hide-details="hideDetails"
        :disabled="disabled"
        :rules="rules"
        append-icon="mdi-calendar"
        readonly
        single-line
        outlined
        dense
        v-bind="attrs"
        v-on="on"
      />
    </template>
    <!--  -->
    <v-date-picker
      v-if="current === 'date'"
      v-model="date"
      :type="onlyMonth ? 'month' : 'date'"
      scrollable
    >
      <v-spacer />
      <v-btn color="primary" outlined @click="onCancel">
        {{ $t('Common.action.cancel') }}
      </v-btn>
      <v-btn color="primary" @click="dateConfirm" :disabled="!date">
        {{ $t('Common.action.confirm') }}
      </v-btn>
    </v-date-picker>
    <!--  -->
    <v-time-picker v-if="current === 'time'" v-model="time" format="24hr" scrollable>
      <v-spacer />
      <v-btn color="primary" outlined @click="onCancel">
        {{ $t('Common.action.cancel') }}
      </v-btn>
      <v-btn color="primary" @click="timeConfirm" :disabled="!time">
        {{ $t('Common.action.confirm') }}
      </v-btn>
    </v-time-picker>
    <!--  -->
  </v-dialog>
  <!--  -->
</template>

<script>
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    label: String,
    rules: Array,
    clearable: Boolean,
    dense: Boolean,
    hideDetails: Boolean,
    solo: Boolean,
    //
    value: String,
    disabled: Boolean,
    onlyMonth: Boolean,
    onlyDate: Boolean,
    onlyTime: Boolean,
  },
  data() {
    return {
      show: false,
      date: '',
      time: '',
      showVal: '',
      current: 'date',
    };
  },
  computed: {
    textFormat() {
      if (this.onlyMonth) return 'YYYY-MM';
      else if (this.onlyDate) return 'YYYY-MM-DD';
      else if (this.onlyTime) return 'HH:mm';
      else return 'YYYY-MM-DD HH:mm';
    },
    valFormat() {
      if (this.onlyMonth) return 'YYYY-MM';
      else if (this.onlyDate) return 'YYYY-MM-DD';
      else if (this.onlyTime) return 'HH:mm';
      else return 'YYYY-MM-DD HH:mm';
    },
  },
  watch: {
    show: {
      immediate: true,
      handler(val) {
        if (!val) return;
        if (this.onlyTime) this.current = 'time';
        else this.current = 'date';
      },
    },
    value: {
      immediate: true,
      handler(val) {
        if (!val) {
          this.date = null;
          this.time = null;
          this.showVal = null;
          return;
        }
        // 復顯到操作組件
        const date = this.getDate(val);
        const time = this.getTime(val);
        if (this.date !== date) this.date = date;
        if (this.time !== time) this.time = time;
        this.setShowVal(val);
      },
    },
  },
  created() {},
  methods: {
    //
    getDate(val) {
      if (val) {
        if (this.onlyMonth) return dayjs(val, ['YYYY-MM']).format('YYYY-MM');
        if (this.onlyDate) return dayjs(val, ['YYYY-MM-DD']).format('YYYY-MM-DD');
        else return dayjs(val, ['YYYY-MM-DD HH:mm']).format('YYYY-MM-DD');
      }
      return null;
    },
    //
    getTime(val) {
      if (val) {
        if (this.onlyTime) return dayjs(val, ['HH:mm']).format('HH:mm');
        else return dayjs(val, ['YYYY-MM-DD HH:mm']).format('HH:mm');
      }
      return null;
    },
    // 顯示組件文本顯示
    setShowVal(val) {
      if (this.onlyMonth) this.showVal = dayjs(val, ['YYYY-MM']).format(this.textFormat);
      else if (this.onlyDate) this.showVal = dayjs(val, ['YYYY-MM-DD']).format(this.textFormat);
      else if (this.onlyTime) this.showVal = dayjs(val, ['HH:mm']).format(this.textFormat);
      else this.showVal = dayjs(val, ['YYYY-MM-DD HH:mm']).format(this.textFormat);
    },
    //
    dateConfirm() {
      if (this.onlyMonth || this.onlyDate) {
        this.setShowVal(this.date);
        this.sendOut(`${this.date}`);
        this.closeDialog();
      } else {
        this.current = 'time';
      }
    },
    //
    timeConfirm() {
      if (this.onlyTime) {
        this.setShowVal(this.date);
        this.sendOut(`${this.time}`);
        this.closeDialog();
      } else {
        this.setShowVal(`${this.date} ${this.time}`);
        this.sendOut(`${this.date} ${this.time}`);
        this.closeDialog();
      }
    },
    //
    sendOut(val) {
      this.$emit('change', val);
    },
    //
    onCancel() {
      this.closeDialog();
    },
    //
    closeDialog() {
      this.show = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
