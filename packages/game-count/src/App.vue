<template>
  <v-app :class="[$i18n.locale]" :style="{ '--appBarHeight': `${appBarHeight}px` }">
    <!--  -->
    <!-- <EnvLogo /> -->
    <!--  -->
    <!-- <AppHeader></AppHeader> -->
    <!--  -->
    <!-- <v-main> -->
    <router-view />
    <!-- </v-main> -->
    <!--  -->
    <Message />
    <ConfirmDialog />
    <EdgeDialog />
    <Loading />
    <!--  -->
  </v-app>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
// import EnvLogo from '@/components/EnvLogo.vue';
// import AppHeader from '@/components/AppHeader.vue';
import Message from '@/components/common/Message.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import EdgeDialog from '@/components/common/EdgeDialog.vue';
import Loading from '@/components/common/Loading.vue';

export default {
  name: 'App',
  components: { Message, ConfirmDialog, EdgeDialog, Loading },
  data() {
    return {
      loading: false,
      loadingText: null,
    };
  },
  computed: {
    ...mapState('profile', ['cPermissions']),
    appBarHeight() {
      return this.$vuetify.application.top;
    },
  },
  created() {
    this.init();

    this.$vuetify.lang.current = ['zhHant', 'pt', 'en'][
      ['zh-Hant', 'pt', 'en'].indexOf(this.$i18n.locale) ?? 0
    ];
  },
  methods: {
    // 初始化
    async init() {
      try {
        Vue.prototype.$checkPermission = (permissions) => {
          let find = permissions.find((permission) => {
            return this.cPermissions.includes(permission);
          });
          if (find) return true;
          else return false;
        };
      } catch (error) {
        this.$error(error);
      }
    },
  },
};
</script>

<style lang="scss">
@import './scss/common.scss';
#app {
  font-family: 'PingFang SC', 'Microsoft YaHei', 'sans-serif';
  background-color: #dbe5f0;
  --appMinWidth: 960px;
  // min-width: var(--appMinWidth);
}
</style>
