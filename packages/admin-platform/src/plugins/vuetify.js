import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import zhHant from 'vuetify/lib/locale/zh-Hant';
import pt from 'vuetify/lib/locale/pt';
import en from 'vuetify/lib/locale/en';

Vue.use(Vuetify);

export default new Vuetify({
  breakpoint: {
    mobileBreakpoint: 'xs',
  },
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    options: {
      customProperties: true,
      variations: true,
    },
    themes: {},
  },
  lang: {
    locales: { zhHant, pt, en },
    current: 'zhHant',
  },
});
