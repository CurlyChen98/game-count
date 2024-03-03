<template>
  <div :class="['table-filter', { 'show-detail': showFilterDetail }]">
    <v-row align="center" no-gutters>
      <slot></slot>
      <v-col
        v-if="!notButton"
        :order="order"
        :order-md="orderMd"
        :order-lg="orderLg"
        class="button-item my-2"
      >
        <v-btn color="secondary" outlined @click="clearFilter">
          {{ $t('Common.action.reset') }}
        </v-btn>
        <v-btn class="ml-2" color="primary" @click="reload">
          {{ $t('Common.action.search') }}
        </v-btn>
        <v-btn
          v-if="needFilterDetail"
          class="arrow-button ml-2 pa-0"
          color="primary"
          text
          @click="setFilterDetail"
        >
          <template v-if="showFilterDetail">
            {{ $t('Common.action.hidden') }}
            <v-icon right>mdi-chevron-up</v-icon>
          </template>
          <template v-else>
            {{ $t('Common.action.show') }}
            <v-icon right>mdi-chevron-down</v-icon>
          </template>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    notHidden: { type: Boolean, default: false },
    notButton: Boolean,
  },
  data() {
    return {
      needFilterDetail: false,
      showFilterDetail: false,
    };
  },
  computed: {
    order() {
      return this.showFilterDetail ? 12 : 1;
    },
    orderMd() {
      return this.showFilterDetail ? 12 : 2;
    },
    orderLg() {
      return this.showFilterDetail ? 12 : 3;
    },
  },
  watch: {
    '$vuetify.breakpoint.name': {
      immediate: true,
      handler() {
        if (this.notHidden) {
          this.showFilterDetail = true;
        } else {
          this.setOrder();
        }
      },
    },
  },
  mounted() {
    if (this.notHidden) {
      this.showFilterDetail = true;
    } else {
      this.setOrder();
    }
  },
  methods: {
    //
    setOrder() {
      let countIndex = 0;
      this.$children.forEach((item) => {
        let ele = item.$refs;
        if (ele.hasOwnProperty.call(ele, 'tableFilterItem')) {
          ++countIndex;
          let order = 4;
          if (this.showFilterDetail) order = 1;
          else if (item.isOne) order = 1;
          else if (item.isTwo) order = 2;
          else if (item.isThree) order = 3;
          item.setOrder(order);
        }
      });

      let name = this.$vuetify.breakpoint.name;
      if (['xs', 'sm'].includes(name) && countIndex > 1) {
        this.needFilterDetail = true;
      } else if (name === 'md' && countIndex > 2) {
        this.needFilterDetail = true;
      } else if (['lg', 'xl'].includes(name) && countIndex > 3) {
        this.needFilterDetail = true;
      } else {
        this.needFilterDetail = false;
      }
    },
    //
    setFilterDetail() {
      this.showFilterDetail = !this.showFilterDetail;
      this.setOrder();
    },
    //
    clearFilter() {
      this.$emit('clearFilter');
    },
    //
    reload() {
      this.$emit('reload');
    },
  },
};
</script>

<style lang="scss" scoped>
.table-filter {
  display: flex;
  justify-content: space-between;
  height: calc(40px + 16px);
  padding-bottom: 8px;
  margin-right: -16px;
  overflow: hidden;
  .button-item {
    align-self: stretch;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 16px;
    min-height: 40px;
  }
}
.table-filter.show-detail {
  height: auto;
  margin-bottom: -8px;
}
</style>
