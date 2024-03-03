<template>
  <CoverToolTip :openOnClick="false" :openDelay="500" openOnHover>
    <template v-slot:activator>
      <v-btn icon v-bind="$attrs" v-on="$listeners">
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <template>
      <div>{{ label }}</div>
    </template>
  </CoverToolTip>
</template>

<script>
import CoverToolTip from '@/components/form/CoverToolTip.vue';

export default {
  components: { CoverToolTip },
  props: {
    label: String,
    icon: String,
  },
};
</script>

<style lang="scss" scoped></style>
