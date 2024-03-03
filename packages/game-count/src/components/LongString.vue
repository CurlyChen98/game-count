<template>
  <div class="long-string" @click="onCoverClick()">
    <div :class="['content', { 'content--spread': inSpread }]">
      <template v-if="inList.length === 0">
        <div>--</div>
      </template>
      <template v-for="(item, index) in inList">
        <span
          :key="`text-${index}`"
          :class="['item', { 'text--click': allowClick }]"
          @click.stop="onItemClick(item)"
          >{{ item }}</span
        >
        <span v-if="index < inList.length - 1" :key="`symbol-${index}`">, </span>
        <br v-if="itemBr && inSpread" :key="`br-${index}`" />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataList: Array,
    spread: Boolean,
    labelKey: String,
    allowClick: Boolean,
    itemBr: Boolean,
  },
  data() {
    return {
      inList: [],
      inSpread: false,
    };
  },
  watch: {
    spread: {
      immediate: true,
      handler(to) {
        if (this.inSpread != to) this.inSpread = to;
      },
    },
    dataList: {
      immediate: true,
      handler(to) {
        if (!to) return;
        this.inList = to
          .map((item) => {
            return this.labelKey ? item[this.labelKey] : item;
          })
          .filter((item) => item);
      },
    },
  },
  methods: {
    //
    onCoverClick() {
      // this.inSpread = !this.inSpread;
      // this.$emit('update:spread', this.inSpread);
    },
    //
    onItemClick(item) {
      // if (this.inSpread == false) {
      //   this.onCoverClick();
      // } else {
      if (!this.allowClick) return;
      this.$emit('itemClick', item);
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
.long-string {
  display: flex;
  align-items: center;
  height: 100%;
  width: calc(100% + 16px + 16px);
  padding: 0 16px;
  margin-left: -16px;
}
.content {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.content.content--spread {
  display: block;
}
</style>
