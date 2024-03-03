<template>
  <v-tooltip
    v-model="showTooltip"
    :open-on-hover="openOnHover"
    :open-on-focus="openOnFocus"
    :open-on-click="openOnClick"
    :open-delay="openDelay"
    top
  >
    <template v-slot:activator="{ on, attrs }">
      <div class="tooltip-activator" @mouseleave="mouseleave" v-bind="attrs" v-on="on">
        <slot name="activator" />
      </div>
    </template>
    <slot />
  </v-tooltip>
</template>

<script>
export default {
  props: {
    openOnHover: {
      type: Boolean,
      default: false,
    },
    openOnFocus: {
      type: Boolean,
      default: false,
    },
    openOnClick: {
      type: Boolean,
      default: true,
    },
    openDelay: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      showTooltip: false,
    };
  },
  methods: {
    //
    mouseleave() {
      if (this.openOnClick && this.showTooltip) this.showTooltip = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.tooltip-activator {
  display: inline-block;
}
</style>
