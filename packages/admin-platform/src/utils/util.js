import router from '@/router';
import store from '@/store';

export default {
  install(Vue, { i18n }) {
    //
    let setList = ['Tc', 'Sc', 'Pt', 'En'];
    Vue.prototype.$l = function (obj, key = 'name', tempList) {
      if (!obj) return '--';

      let _setList = setList;
      if (tempList) _setList = tempList;

      const locale = _setList[['zh-Hant', 'zh-Hans', 'pt', 'en'].indexOf(i18n.locale)] || 'Tc';
      return obj[`${key}${locale}`] ?? '--';
    };

    Vue.prototype.$e = function (val) {
      if (val == null) return '--';
      if (val == '') return '--';
      return val;
    };

    /**
     * @function 過濾價格
     */
    Vue.prototype.$filterMoney = (val) => {
      let text = '--';
      if (val || val == 0) {
        text = `${(Math.floor(val * 100) / 100).toLocaleString()}`;
        let cut = text.split('.');
        if (!cut[1]) text += '.00';
        else if (cut[1].length === 1) text += '0';
      }
      return text;
    };

    /**
     * @function
     */
    Vue.prototype.$getCodeText = (obj, codeKey = 'code', textKey) => {
      let text = '';
      text += obj?.[codeKey] ? obj?.[codeKey] : '--';
      text += '/';
      text += Vue.prototype.$l(obj, textKey);
      return text;
    };

    /**
     * @function
     */
    Vue.prototype.$openRelevance = (options) => {
      let { href } = router.resolve(options);
      let { origin } = window.location;
      let link = `${origin}${href}`;
      window.open(link, '_blank');
    };

    /**
     * @function 用戶類型檢查
     * @example this.$checkCType(['IT', 'ADMIN', 'USER'])
     */
    // Vue.prototype.$checkCType = (permissions) => {
    //   const { cType } = store.state.profile;
    //   let find = permissions.includes(cType);
    //   return find;
    // };

    /**
     * @function 標書編號過濾
     * @example this.$filterBoxNumber(value)
     */
    Vue.prototype.$filterBoxNumber = (value) => {
      let test = /(unfied|Unfied).+/.test(value);
      if (test) return '----';
      else return value;
    };

    /**
     * @function 用戶權限檢查
     * @example this.$checkPermission(['IT', 'ADMIN', 'USER'])
     */
    Vue.prototype.$checkPermission = (permissions) => {
      const { cPermissions } = store.state.profile;
      let find = permissions.find((permission) => {
        return cPermissions.includes(permission);
      });
      if (find) return true;
      else return false;
    };
  },
};
