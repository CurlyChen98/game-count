<template>
  <div class="cover-select" @click="clear">
    <v-select
      v-model="valIn"
      :items="itemsIn"
      :menu-props="{
        ...menuOptions,
        ...menuProps,
      }"
      outlined
      dense
      v-bind="$attrs"
      v-on="$listeners"
    >
    </v-select>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: [String, Number, Object, Boolean, Array],
    label: String,
    items: Array,
    haveColor: Boolean,
    menuProps: Object,
    clickClear: { type: Boolean, default: true },
  },
  data() {
    return {
      valIn: this.value,
      itemsIn: this.items,
      menuOptions: {
        'content-class': 'cover-select-menu',
        maxWidth: '500px',
        'offset-y': true,
      },
    };
  },
  watch: {
    value(to) {
      this.valIn = to;
    },
    valIn(to) {
      this.$emit('change', to);
    },
    items(to) {
      this.itemsIn = to;
    },
  },
  methods: {
    clear() {
      if (this.clickClear) this.valIn = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.cover-select {
  flex-grow: 1;
  overflow: hidden;
}
</style>
