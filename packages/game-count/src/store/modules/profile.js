// import { cloneDeep } from 'lodash-es';
import { UserProfileApi } from '@/api';
import { handlePermissions } from '@/utils/stock.js';

export default {
  namespaced: true,
  state: () => ({
    profile: null,
    cType: null, // currentType IT ADMIN USER
    cRoles: null, // currentRoles
    cPermissions: [], // currentPermissions
    profileTemp: null,
  }),
  getters: {},
  mutations: {
    setProfile(state, payload) {
      state.profile = payload;
    },
    setUserType(state, payload) {
      state.cType = payload;
    },
    setRoles(state, payload) {
      state.cRoles = payload;
    },
    clearProfile(state) {
      state.profile = null;
      state.cType = null;
      state.cRoles = null;
      state.cPermissions = [];
      state.profileTemp = null;
    },
  },
  actions: {
    //
    async getProfile({ state, commit, dispatch }) {
      const profile = await UserProfileApi.getProfileDetail();
      if (profile.needChangePassword) {
        state.profileTemp = profile;
        return;
      }
      commit('setProfile', profile);
      commit('setUserType', profile.userType);
      commit('setRoles', profile.roles);

      await handlePermissions();
      dispatch('setPermission');
    },
    //
    async setPermission({ state }) {
      let { cRoles } = state;
      let permissions = [];

      // if (['dev'].includes(process.env.VUE_APP_ENV)) {
      if (['dev'].includes(process.env.VUE_APP_ENV) && !1) {
        permissions = [
          'TENDER_BOX_EDIT',
          // 'TENDER_SUP_BOX_EDIT',
          'GROUP_EDIT',
          'AC_LOG_VIEW',
          'TENDER_BOX_VIEW_DELETE',
          'TENDER_BOX_VIEW_DOWNLOAD',
          'TENDER_BOX_VIEW_NO_START',
          'USER_VIEW',
          'DEPARTMENT_EDIT',
          'IN_RECORD_VIEW',
          'TENDER_SUP_BOX_BACK_EDIT',
          'ROLE_VIEW',
          'HOLIDAY_VIEW',
          'USER_EDIT',
          'GROUP_VIEW',
          'SUPPLIER_VIEW',
          'TENDER_BOX_VIEW_END_TIME',
          'SUPPLIER_EDIT',
          'TENDER_RECORD_MOVE',
          'TENDER_BOX_VIEW_ING',
          'ROLE_EDIT',
          'IN_RECORD_EDIT_DOWNLOAD',
          'TENDER_SUP_BOX_EDIT_UNG',
          'DEPARTMENT_VIEW',
          'HOLIDAY_EDIT',
        ];
      } else {
        cRoles.forEach((item) => item.permissions.forEach((it) => permissions.push(it.alias)));
      }

      if (['development'].includes(process.env.NODE_ENV)) permissions.unshift('DEV');

      state['cPermissions'] = permissions;
    },
  },
};
