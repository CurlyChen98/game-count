<template>
  <v-app-bar height="60px" app>
    <!--  -->
    <div class="left" @click="goHome">
      <v-img src="@/assets/ssm.webp" height="54px" width="54px" contain></v-img>
      <span>{{ '傳真標書報價\n文件收發系統' }}</span>
    </div>
    <!--  -->
    <div class="right">
      <!--  -->
      <div v-if="profile" class="business-menu">
        <!-- 主頁 -->
        <v-btn :to="{ name: 'home' }" class="text-h6 font-weight-bold" color="white" text x-large
          >主頁</v-btn
        >
        <!-- 接收 -->
        <v-menu v-show="faxInShow" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              :input-value="faxInButton"
              class="text-h6 font-weight-bold"
              color="white"
              text
              x-large
              v-bind="attrs"
              v-on="on"
            >
              接收
              <v-icon right large>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-show="
                $checkPermission([
                  'TENDER_BOX_VIEW_NO_START',
                  'TENDER_BOX_VIEW_ING',
                  'TENDER_BOX_VIEW_END_TIME',
                  'TENDER_BOX_VIEW_DOWNLOAD',
                  'TENDER_BOX_VIEW_DELETE',
                ])
              "
              :to="{ name: 'bidBoxs' }"
              class="text-subtitle-1 font-weight-medium"
            >
              投標箱
            </v-list-item>
            <v-list-item
              v-show="$checkPermission(['IN_RECORD_VIEW'])"
              :to="{ name: 'receiveRecords' }"
              class="text-subtitle-1 font-weight-medium"
              >收件記錄</v-list-item
            >
          </v-list>
        </v-menu>
        <!-- 發送 -->
        <v-menu v-show="faxOutShow" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              :input-value="faxOutButton"
              class="text-h6 font-weight-bold"
              color="white"
              text
              x-large
              v-bind="attrs"
              v-on="on"
            >
              發送
              <v-icon right large>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item :to="{ name: 'fileRecords' }" class="text-subtitle-1 font-weight-medium"
              >文件記錄</v-list-item
            >
            <v-list-item :to="{ name: 'sendRecords' }" class="text-subtitle-1 font-weight-medium"
              >發送記錄</v-list-item
            >
            <v-list-item :to="{ name: 'sendQueue' }" class="text-subtitle-1 font-weight-medium">
              發送隊列</v-list-item
            >
          </v-list>
        </v-menu>
        <!-- 報表 -->
        <v-btn class="text-h6 font-weight-bold ma-0" color="white" text x-large @click="showAlert2"
          >報表</v-btn
        >
        <!-- 系統管理 -->
        <v-btn
          v-show="
            $checkPermission([
              'USER_VIEW',
              'DEPARTMENT_VIEW',
              'ROLE_VIEW',
              'SUPPLIER_VIEW',
              'GROUP_VIEW',
              'HOLIDAY_VIEW',
              'AC_LOG_VIEW',
            ])
          "
          class="text-h6 font-weight-bold ma-0"
          color="white"
          text
          x-large
          @click="onSettingClick"
          >系統管理</v-btn
        >
      </div>
      <!-- 系統管理 end -->
      <div class="login-menu">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="white" text v-bind="attrs" v-on="on">
              <v-icon left>mdi-account</v-icon>
              <span>{{ username }}</span>
            </v-btn>
          </template>
          <v-list v-if="profile">
            <v-list-item @click="onPasswordClick">
              {{ $t('User.action.changePassword') }}
            </v-list-item>
            <v-list-item @click="logout">
              {{ $t('Common.action.logout') }}
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <!--  -->
      <PasswordDialog ref="passwordDialog" />
      <!--  -->
    </div>
    <!-- right end -->
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex';
import { LoginApi } from '@/api/index.js';
import PasswordDialog from '@/pages/system/user/PasswordDialog.vue';

export default {
  components: { PasswordDialog },
  data() {
    return {
      routerList: [],
      faxOutButton: false,
      faxInButton: false,
    };
  },
  computed: {
    ...mapState('profile', ['profile', 'cPermissions']),
    username() {
      return this.profile?.username ?? this.$t('Common.message.notlogin');
    },
    faxInShow() {
      return this.$checkPermission([
        'TENDER_BOX_VIEW_NO_START',
        'TENDER_BOX_VIEW_ING',
        'TENDER_BOX_VIEW_END_TIME',
        'TENDER_BOX_VIEW_DOWNLOAD',
        'TENDER_BOX_VIEW_DELETE',
        'IN_RECORD_VIEW',
      ]);
    },
    faxOutShow() {
      return true;
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        if (!to.matched[0]) {
          this.faxOutButton = false;
          this.faxInButton = false;
          return;
        }

        if (to.matched[0].path === '/fax-out') this.faxOutButton = true;
        else this.faxOutButton = false;

        if (to.matched[0].path === '/fax-in') this.faxInButton = true;
        else this.faxInButton = false;
      },
    },
  },
  created() {},
  methods: {
    //
    showAlert2() {
      this.$message('待提供資料確認');
    },
    //
    goHome() {
      this.$router.push('/');
    },
    //
    onSettingClick() {
      if (this.cPermissions.includes('USER_VIEW')) {
        this.$router.push({ name: 'users' });
      } else if (this.cPermissions.includes('DEPARTMENT_VIEW')) {
        this.$router.push({ name: 'groups' });
      } else if (this.cPermissions.includes('ROLE_VIEW')) {
        this.$router.push({ name: 'roles' });
      } else if (this.cPermissions.includes('SUPPLIER_VIEW')) {
        this.$router.push({ name: 'suppliers' });
      } else if (this.cPermissions.includes('GROUP_VIEW')) {
        this.$router.push({ name: 'supplierGroups' });
      } else if (this.cPermissions.includes('HOLIDAY_VIEW')) {
        this.$router.push({ name: 'holidays' });
      } else if (this.cPermissions.includes('AC_LOG_VIEW')) {
        this.$router.push({ name: 'operationLogs' });
      }
    },
    //
    async changeRole(item) {
      localStorage.setItem('current_role', item.id);
      await this.$store.dispatch('profile/setRolePermission', item);
      this.$router.replace('/');
    },
    //
    onLocaleChange(locale) {
      localStorage.setItem('serviceLanguage', locale);
      location.reload();
    },
    //
    onPasswordClick() {
      this.$refs['passwordDialog'].setDialog({
        type: 'myself',
        item: this.profile,
      });
    },
    //
    async logout() {
      try {
        this.$showDelayLoading();

        await LoginApi.logout();
        this.$store.commit('profile/clearProfile');
        this.$success(this.$t('Common.message.logoutSuccess'));
        this.$router.replace({
          name: 'profile',
        });
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-app-bar {
  box-shadow: 0px 2px 2px 1px rgba(0, 0, 0, 0.05) !important;
  min-width: var(--appMinWidth);
  :deep(.v-toolbar__content) {
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    background-image: linear-gradient(#3f77b5, #335e8c);
  }
  .left {
    display: flex;
    align-items: center;
    padding-left: 16px;
    span {
      flex-shrink: 0;
      white-space: pre-line;
      margin-left: 8px;
      font-weight: bold;
      font-size: 24px;
      line-height: 1.1;
      color: #ffffff;
    }
  }
  .right {
    display: flex;
    align-items: center;
    .business-menu {
      // display: flex;
    }
    .login-menu {
      display: flex;
      justify-content: flex-end;
      min-width: 200px;
      margin-left: 16px;
    }
  }
}
@media screen and (max-width: 1264px) {
  .v-app-bar {
    .right {
      .login-menu {
        display: none;
      }
    }
  }
}
</style>
