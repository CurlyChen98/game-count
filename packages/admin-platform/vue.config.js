const { defineConfig } = require('@vue/cli-service');
const dayjs = require('dayjs');
const pkg = require('./package.json');

process.env.VUE_APP_VERSION = `v${pkg.version}.r${dayjs().format('MMDDHHmm')}`;

module.exports = defineConfig({
  publicPath: process.env.VUE_APP_API_PUBLIC_PATH,
  productionSourceMap: false,
  transpileDependencies: ['vuetify'],
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  pluginOptions: {
    i18n: {
      locale: 'zh-Hant',
      fallbackLocale: 'zh-Hant',
      localeDir: 'locales',
      enableInSFC: false,
      enableBridge: false,
    },
  },
  devServer: {
    port: process.env.DEV_SERVER_PORT || 8080,
    hot: true,
    proxy: {
      [process.env.VUE_APP_API_CONTEXT_PATH]: {
        target: process.env.DEV_SERVER_PROXY_TARGET,
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
