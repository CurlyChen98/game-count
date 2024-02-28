<template>
  <!--  -->
  <v-row :class="{ 'row-half': half }" align="center" no-gutters>
    <v-col :cols="labelCol">
      <div class="item-label">
        <span>{{ label }}</span>
        <span v-if="labelRequired" class="red--text">*</span>
      </div>
    </v-col>
    <v-col :cols="contentCol">
      <slot />
    </v-col>
  </v-row>
  <!--  -->
</template>

<script>
export default {
  props: {
    label: String,
    labelRequired: Boolean,
    labelCol: {
      type: [String, Number],
      default: '3',
    },
    contentCol: {
      type: [String, Number],
      default: '9',
    },
    half: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.row-half {
  width: 50%;
}
.item-label {
  display: block;
  padding-bottom: 18px;
}
</style>
