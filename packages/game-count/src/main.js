console.info(`${process.env.VUE_APP_ENV} ${process.env.VUE_APP_VERSION}`);
// vue
import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import i18n, { getAcceptLanguage } from './i18n';
import vuetify from './plugins/vuetify';
// 外部引用
// 本地引用
// 內部引用
import PageBreadcrumbs from '@/components/PageBreadcrumbs.vue';
import TableFilterItem from '@/components/TableFilterItem.vue';
import TableFilter from '@/components/TableFilter.vue';
import importFormItem from '@/components/form/import-form-item.js';
import util from '@/utils/util.js';
import AxiosPlugin from '@/plugins/axios';
import '@/utils/auto-update.js';

Vue.use(AxiosPlugin, {
  async requestInterceptor(config) {
    config.headers['Accept-Language'] = getAcceptLanguage(i18n.locale);
    return config;
  },
  async responseInterceptor(config) {
    return config;
  },
  beforeError({ response }) {
    if (response && response.status === 401) {
      store.commit('profile/clearProfile');
      if (router.currentRoute.name === 'profile') {
        return;
      } else {
        router.replace({
          name: 'profile',
          query: {
            redirect: router.currentRoute.fullPath,
          },
        });
      }
    }
  },
});
Vue.use(importFormItem);
Vue.use(util, { i18n });

Vue.config.productionTip = false;
Vue.component('PageBreadcrumbs', PageBreadcrumbs);
Vue.component('TableFilter', TableFilter);
Vue.component('TableFilterItem', TableFilterItem);
Vue.prototype.$bus = new Vue();

document.title = 'game-count';

new Vue({
  router,
  i18n,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
