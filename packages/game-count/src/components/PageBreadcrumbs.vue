<template>
  <div :class="['page-breadcrumbs']">
    <!--  -->
    <v-breadcrumbs v-if="!hideBreadcrumb" :items="breadcrumbList || currentBreadcrumbList">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :to="item.to" :disabled="item.disabled">
          {{ item.text }}
        </v-breadcrumbs-item>
      </template>
      <template v-slot:divider>
        <span class="divider">/</span>
      </template>
    </v-breadcrumbs>
    <!--  -->
  </div>
</template>

<script>
export default {
  props: {
    hideBreadcrumb: Boolean,
    breadcrumbList: Array,
  },
  data() {
    return {};
  },
  computed: {
    currentBreadcrumbList() {
      let matched = this.$route.matched;
      let breadcrumbList = [];
      for (const i in matched) {
        let isLast = i * 1 === matched.length - 1;
        if (matched[i].meta.rely) {
          breadcrumbList.push({
            text: matched[i].meta.rely.title,
            to: { name: matched[i].meta.rely.name },
            disabled: false,
          });
        }
        breadcrumbList.push({ text: matched[i].meta.title, disabled: !isLast });
      }

      return breadcrumbList;
    },
  },
};
</script>

<style lang="scss" scoped>
.page-breadcrumbs {
  // display: flex;
  // flex-direction: column;
  // width: calc(100% + 16px * 2);
  // margin-left: -16px;
  // padding: 0 16px 16px;
  // background-color: #ffffff;
  // :deep(.v-breadcrumbs) {
  //   padding: 16px 0;
  //   .v-breadcrumbs__item {
  //     font-size: 14px;
  //     color: var(--v-secondary-lighten5);
  //   }
  //   li:last-child .v-breadcrumbs__item {
  //     color: var(--v-secondary-lighten2);
  //   }
  // }
  // .bottom {
  //   display: flex;
  //   justify-content: space-between;
  // }
  // .page-name {
  //   font-size: 20px;
  //   font-weight: bolder;
  // }
  // .button__content {
  //   min-height: 40px;
  //   .v-btn + .v-btn {
  //     margin-left: 8px;
  //   }
  // }
  margin-top: -8px;
  margin-bottom: 8px;
  :deep(.v-breadcrumbs) {
    padding: 0;
    .v-breadcrumbs__item {
      font-size: 16px;
      color: var(--v-secondary-lighten4);
    }
    li:last-child .v-breadcrumbs__item {
      color: var(--v-secondary-lighten2);
    }
  }
  .divider {
    color: var(--v-secondary-lighten4);
    opacity: 0.5;
  }
}
</style>
