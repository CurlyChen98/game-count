<template>
  <v-data-table
    :class="[language, { 'table--scroll': inScroll }]"
    :no-data-text="$t('Common.label.noData')"
    :options="inOptions"
    :headers="inHeaders"
    class="date-table"
    must-sort
    fixed-header
    hide-default-footer
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:[key]="props" v-for="key in scopedSlotKeys">
      <slot :name="key" v-bind="props"></slot>
    </template>
    <template v-slot:footer="{ props, on }">
      <template v-if="!notFooter && recordTotal(props) > 0">
        <div class="date-table-page d-flex align-center justify-center mt-2">
          <div class="total-item">共{{ props.pagination.itemsLength }}個</div>
          <v-pagination
            :value="props && props.pagination.page"
            :length="props && props.pagination.pageCount"
            total-visible="8"
            outlined
            @input="on['update:options']({ ...props.options, page: $event })"
          ></v-pagination>
          <v-select
            :value="props && props.pagination.itemsPerPage"
            :items="paginations"
            :menu-props="{
              top: true,
            }"
            class="page-size__select"
            hide-details
            dense
            outlined
            @input="on['update:options']({ ...props.options, page: 1, itemsPerPage: $event })"
          >
          </v-select>
        </div>
      </template>
    </template>
  </v-data-table>
</template>

<script>
import { cloneDeep, isEqual } from 'lodash-es';

export default {
  props: {
    options: Object,
    headers: Array,
    notFooter: Boolean,
    forceMobile: Boolean,
    inScroll: { type: Boolean, default: true },
  },
  data() {
    return {
      inOptions: {},
      inHeaders: [],
      paginations: [
        // { text: `${this.$t('Common.label.showTotal', [5])}`, value: 5 },
        // { text: `${this.$t('Common.label.showTotal', [10])}`, value: 10 },
        { text: `${this.$t('Common.label.showTotal', [20])}`, value: 20 },
        { text: `${this.$t('Common.label.showTotal', [50])}`, value: 50 },
        { text: `${this.$t('Common.label.showTotal', [100])}`, value: 100 },
        { text: `${this.$t('Common.action.all')}`, value: 999999 },
      ],
    };
  },
  computed: {
    scopedSlotKeys() {
      return Object.keys(this.$scopedSlots);
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile || this.forceMobile;
    },
    language() {
      return this.$i18n.locale;
    },
  },
  watch: {
    options: {
      immediate: true,
      deep: true,
      handler(to) {
        if (!isEqual(this.inOptions, to)) this.inOptions = cloneDeep(to);
      },
    },
    headers: {
      immediate: true,
      deep: true,
      handler(to) {
        let inHeaders = cloneDeep(to);
        let isFixed = false;
        this.inHeaders = inHeaders.map((item, index) => {
          if (item.fixed) {
            if (['status', 'tenderStatus'].includes(item.value)) item.align = 'left';
            else if (['actions'].includes(item.value)) item.align = 'center';
            item.class = 'header-fixed';
            item.cellClass = 'item-fixed';

            let distance = 0;
            for (let i = index + 1; i < inHeaders.length; i++) distance += inHeaders[i].width;
            item.class += ` header-fixed-r${distance}`;
            item.cellClass += ` item-fixed-r${distance}`;
          }
          if (item.fixed && !isFixed) {
            isFixed = true;
            item.class += ' header-fixed-shadow';
            item.cellClass += ' item-fixed-shadow';
          }
          return item;
        });
      },
    },
  },
  methods: {
    recordTotal(props) {
      return props && props.pagination.itemsLength;
    },
  },
};
</script>

<style lang="scss" scoped>
.date-table {
  display: flex;
  flex-direction: column;
  background-color: transparent;
  // 處理列固定
  :deep(.v-data-table__wrapper) {
    .header-fixed,
    .item-fixed {
      position: sticky;
      right: 0;
    }
    .header-fixed {
      z-index: 2;
    }
    .item-fixed {
      z-index: 1;
    }
    td {
      padding-top: 2px !important;
      padding-bottom: 2px !important;
    }
    .v-data-table-header {
      th {
        background-color: #ebebeb !important;
      }
    }
    tbody {
      td {
        background-color: #ffffff;
      }
    }
    .header-fixed-shadow {
      filter: drop-shadow(-2px -2px 2px rgba(212, 212, 212, 0.6));
    }
    .item-fixed-shadow {
      filter: drop-shadow(-2px 0px 2px rgba(212, 212, 212, 0.6));
    }
    $distances: 100, 120, 140, 160, 180, 200, 220, 240;
    @each $distance in $distances {
      .header-fixed-r#{$distance},
      .item-fixed-r#{$distance} {
        right: #{$distance}px;
      }
    }
  }
  .date-table-page {
    .total-item {
      font-size: 14px;
    }
  }
  :deep(.v-input) {
    flex-grow: 0;
    .v-input__slot {
      max-width: 110px;
      height: 34px;
      min-height: 34px !important;
    }
    .v-input__append-inner {
      display: none;
    }
    .v-select__selection {
      margin-top: 3px;
      font-size: 14px;
    }
    .v-text-field__prefix,
    .v-text-field__suffix {
      font-size: 14px;
    }
  }
  :deep(.v-pagination) {
    .v-pagination__navigation,
    .v-pagination__item {
      height: 34px;
      min-width: 34px;
      box-shadow: none;
      border: 1px solid rgba(0, 0, 0, 0.15);
    }
  }
  :deep(.page-size__select) {
    .v-select__selection {
      transition: all 0.2s;
    }
  }
  :deep(.page-size__select.v-input--is-focused) {
    .v-select__selection {
      color: var(--v-primary-base);
      caret-color: var(--v-primary-base);
    }
  }
}
.date-table.table--scroll {
  height: 0;
  flex-grow: 1;
  :deep(.v-data-table__wrapper) {
    overflow-y: scroll;
  }
}
</style>
