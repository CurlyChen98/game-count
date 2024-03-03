<template>
  <v-col
    ref="tableFilterItem"
    v-bind="$attrs"
    v-on="$listeners"
    :order="inOrder"
    class="table-filter-item pr-4 my-2"
    :cols="allCol ? allCol : cols"
    :md="allCol ? allCol : md"
    :lg="allCol ? allCol : lg"
  >
    <v-tooltip
      v-model="showTooltip"
      :open-on-hover="false"
      :open-on-focus="false"
      :open-on-click="true"
      top
    >
      <template v-slot:activator="{ on, attrs }">
        <div class="name" @mouseleave="mouseleave" v-bind="attrs" v-on="on">
          <span>{{ label }}</span>
          <span>:</span>
          <span v-if="labelRequired" class="red--text">*</span>
        </div>
      </template>
      <span>{{ label }}</span>
    </v-tooltip>
    <slot />
  </v-col>
</template>

<script>
export default {
  props: {
    label: String,
    labelRequired: Boolean,
    isOne: Boolean,
    isTwo: Boolean,
    isThree: Boolean,
    allCol: { type: [String, Number] },
    cols: { type: [String, Number], default: 6 },
    md: { type: [String, Number], default: 4 },
    lg: { type: [String, Number], default: 3 },
  },
  data() {
    return {
      inOrder: null,
      showTooltip: false,
    };
  },
  methods: {
    //
    setOrder(val) {
      this.inOrder = val;
    },
    //
    mouseleave() {
      if (this.showTooltip) this.showTooltip = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.table-filter-item {
  display: flex;
  align-items: center;
  .name {
    flex-shrink: 0;
    width: 100px;
    padding-right: 8px;
    line-height: 1.1;
    overflow: hidden;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
}
</style>
