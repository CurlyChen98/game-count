<template>
  <div class="cover-autocomplete" @click="clear">
    <v-autocomplete
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
      <!-- item -->
      <template v-if="haveColor" v-slot:item="{ item }">
        <div class="point" :style="{ '--point-color': item.color }">
          <span>{{ item.text }}</span>
        </div>
      </template>
      <!-- item -->
      <template v-else-if="$scopedSlots['item']" v-slot:item="data">
        <slot name="item" v-bind="data"></slot>
      </template>
      <!-- append-outer -->
      <template v-if="$scopedSlots['append-outer']" v-slot:append-outer>
        <slot name="append-outer"></slot>
      </template>
      <!-- append-item -->
      <template v-if="$scopedSlots['append-item']" v-slot:append-item>
        <slot name="append-item"></slot>
      </template>
      <!-- selection -->
      <template v-if="$scopedSlots['selection']" v-slot:selection="data">
        <slot name="selection" v-bind="data"></slot>
      </template>
      <!--  -->
      <!-- <template v-for="(item, key) in $slots" v-slot:[key]>
        <slot :name="key"></slot>
      </template> -->
      <!--  -->
      <!-- <template v-for="index in Object.keys(this.$scopedSlots)" v-slot:[index]="data">
        <slot :name="index" v-bind="data"></slot>
      </template> -->
      <!--  -->
    </v-autocomplete>
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
        contentClass: 'cover-autocomplete-content',
        'max-width': '500px',
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
      this.$set(this, 'itemsIn', to);
    },
  },
  created() {},
  methods: {
    clear() {
      if (this.clickClear) this.valIn = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.cover-autocomplete {
  flex-grow: 1;
  overflow: hidden;
}
</style>
<style lang="scss">
.cover-autocomplete-content {
  .v-list-item__action {
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>
