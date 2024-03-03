<template>
  <div class="profile-page page">
    <template v-if="!['load'].includes(pageType)">
      <div class="input__box">
        <v-text-field
          v-model="form.username"
          :label="$t('Global.label.account')"
          @keydown="onKeyDown"
        ></v-text-field>
        <v-text-field
          v-model="form.password"
          :label="$t('Global.label.password')"
          type="password"
          @keydown="onKeyDown"
        ></v-text-field>
      </div>
      <div class="button__box">
        <v-btn color="primary" @click="onLoginClick">
          {{ $t('Common.action.login') }}
        </v-btn>
      </div>
    </template>
    <!--  -->
    <PasswordDialog ref="passwordDialog" @success="reLogin" />
    <!--  -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { throttle } from 'lodash-es';
import { LoginApi } from '@/api/index.js';
import PasswordDialog from '@/pages/system/user/PasswordDialog.vue';

export default {
  components: { PasswordDialog },
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
    };
  },
  computed: {
    ...mapState('profile', ['profileTemp']),
    pageType() {
      return this.$route.query.type;
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        if (['profile'].includes(to.name) && ['load'].includes(this.pageType)) {
          this.getProfile();
        }
      },
    },
  },
  async created() {
    if (process.env.VUE_APP_ENV === 'dev') {
      this.form = {
        username: 'curly-it',
        password: '123456',
      };
    }
  },
  methods: {
    //
    onLoginClick: throttle(
      async function () {
        if (this.form.username === '') {
          this.$error(this.$t('Common.message.plsAccount'));
          return;
        }
        if (this.form.password === '') {
          this.$error(this.$t('Common.message.plsPassword'));
          return;
        }

        try {
          this.$showDelayLoading();
          await LoginApi.login({
            username: this.form.username,
            password: this.form.password,
          });
          this.getProfile();
        } catch (error) {
          if (error?.response?.data?.error === 'Unauthorized') {
            this.$error('登入失敗，請重試');
          } else {
            this.$error(error);
          }
        } finally {
          this.$hideLoading();
        }
      },
      500,
      { trailing: false }
    ),
    //
    async getProfile() {
      try {
        this.$showDelayLoading();
        await this.$store.dispatch('profile/getProfile');

        if (this.profileTemp) {
          this.$refs['passwordDialog'].setDialog({
            type: 'force',
            item: this.profileTemp,
          });
          return;
        }

        if (!['load'].includes(this.pageType)) {
          this.$success(this.$t('Common.message.loginSuccess'));
        }

        const { redirect = '/' } = this.$route.query;
        this.$router.replace({
          path: redirect,
        });
      } catch (error) {
        this.$error(error);
        this.reLogin();
      } finally {
        this.$hideLoading();
      }
    },
    //
    async reLogin() {
      try {
        this.$showDelayLoading();

        await LoginApi.logout();
        this.$store.commit('profile/clearProfile');
        this.$router.replace({
          name: 'profile',
          query: {
            redirect: this.$route.query.redirect,
          },
        });
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    onKeyDown(event) {
      if (event.keyCode === 13) this.onLoginClick();
    },
  },
};
</script>

<style lang="scss" scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .input__box {
    width: 25%;
    max-width: 300px;
  }
  .button__box {
    text-align: center;
  }
}
</style>
