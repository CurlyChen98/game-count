<template>
  <div class="box-head">
    <slot></slot>
    <slot name="tabs"></slot>
    <v-spacer />
    <slot name="button-list"></slot>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.box-head {
  display: flex;
  align-items: center;
  width: 100%;
  .v-tabs {
    width: auto;
    overflow: hidden;
  }
  .button-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    flex-shrink: 0;
    width: 50%;
    margin-top: -8px;
    :deep(.v-btn) {
      margin-left: 8px;
      margin-top: 8px;
    }
  }
}
@media (max-width: 960px) {
  .box-head {
    flex-direction: column;
    align-items: flex-start;
    .v-tabs {
      width: 100%;
    }
    .button-list {
      justify-content: flex-start;
      margin-top: 16px;
      width: 100%;
      padding-top: 0;
      :deep(.v-btn) {
        margin-left: 0px;
        margin-right: 8px;
      }
    }
  }
}
</style>
