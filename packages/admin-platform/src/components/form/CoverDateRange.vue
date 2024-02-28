<template>
  <v-dialog v-model="show" persistent width="290px">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="showVal"
        :label="label"
        :hide-details="hideDetails"
        :placeholder="placeholder"
        append-icon="mdi-calendar"
        readonly
        single-line
        outlined
        dense
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker v-model="inVal" :type="onlyMonth ? 'month' : 'date'" range scrollable>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="onCancel">
        {{ $t('Common.action.cancel') }}
      </v-btn>
      <v-btn text color="primary" @click="onConfirmClick">
        {{ $t('Common.action.confirm') }}
      </v-btn>
    </v-date-picker>
  </v-dialog>
  <!--  -->
</template>

<script>
import dayjs from 'dayjs';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    label: String,
    hideDetails: Boolean,
    placeholder: String,
    //
    value: Array,
    onlyMonth: Boolean,
  },
  data() {
    return {
      show: false,
      inVal: null,
      showVal: null,
    };
  },
  computed: {
    textFormat() {
      return 'YYYY-MM-DD';
    },
    valFormat() {
      if (this.onlyMonth) return 'YYYY-MM';
      else return 'YYYY-MM-DD';
    },
  },
  watch: {
    value(to) {
      if (to) {
        this.inVal = to;
      } else {
        this.inVal = null;
        this.showVal = null;
      }
    },
  },
  methods: {
    onConfirmClick() {
      if (this.inVal.length === 1) {
        this.inVal[1] = dayjs().format(this.valFormat);
      }
      if (!dayjs(this.inVal[1]).isAfter(dayjs(this.inVal[0]))) {
        this.inVal = [this.inVal[1], this.inVal[0]];
      }

      if (this.onlyMonth) {
        this.showVal = [
          dayjs(this.inVal[0]).startOf('month').format(this.textFormat),
          dayjs(this.inVal[1]).endOf('month').format(this.textFormat),
        ].join(' ~ ');
      } else {
        this.showVal = [
          dayjs(this.inVal[0]).format(this.textFormat),
          dayjs(this.inVal[1]).format(this.textFormat),
        ].join(' ~ ');
      }

      this.sendOut(this.inVal);
      this.closeDialog();
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
