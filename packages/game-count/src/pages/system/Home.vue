<template>
  <div class="d-flex">
    <v-list class="system-nav flex-shrink-0">
      <v-list-item v-for="(item, index) in navList" :key="index" :to="item.path">
        <span class="text">{{ item.title }}</span>
      </v-list-item>
    </v-list>
    <div style="width: 0; flex-grow: 1">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      navList: [],
    };
  },
  computed: {
    ...mapState('profile', ['cPermissions']),
  },
  watch: {
    cPermissions: {
      immediate: true,
      handler(to) {
        if (to && to.length > 0) this.setNav();
        else this.navList = [];
      },
    },
  },
  methods: {
    // 根據路由自動生成nav列表
    setNav() {
      let fun = (list, lastPath) => {
        return list
          .map((item) => {
            // 權限判斷
            if (item.meta.permissions) {
              let find = item.meta.permissions.find((permission) => {
                return this.cPermissions.includes(permission);
              });
              if (!find) return false;
            }

            let temp = {
              title: item.meta.title,
              name: item.name,
              path: `${lastPath}${item.path}`,
              // action: false,
              // hiddenNav: item.meta.hiddenNav,
            };

            if (item.children) {
              temp.children = fun(item.children, `${temp.path}/`);
              // temp.action = true;
            }
            // 無需自動展開，隱藏注釋分組
            // if (item.meta.group) temp.group = item.meta.group;

            return temp;
          })
          .filter((item) => item);
      };

      let routes = this.$router.options.routes;
      let systemRoutes = routes.find((item) => item.name === 'system');
      let navList = fun(systemRoutes.children, `${systemRoutes.path}/`);
      this.$set(this, 'navList', navList);
    },
  },
};
</script>

<style lang="scss" scoped>
.system-nav {
  background-color: #393d49;
  .v-list-item {
    position: relative;
    margin-bottom: 8px;
    .text {
      display: block;
      width: 100%;
      padding: 16px 32px;
      text-align: center;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 0;
        background-color: #5cb67e;
      }
    }
  }
  .v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
    color: #d9d9d9;
    &:hover {
      color: #f3f3f3;
    }
  }
  .v-list-item.v-list-item--active {
    color: #ffffff;
    .text {
      &::after {
        width: 6px;
      }
    }
  }
}
</style>
