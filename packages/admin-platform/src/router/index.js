import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import i18n from '@/i18n';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: { name: 'home' },
    meta: {},
  },
  {
    path: '/home',
    name: 'home',
    meta: {},
    component: () => import('@/pages/home/HomePage.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    meta: {},
    component: () => import('@/pages/ProfilePage.vue'),
  },
  {
    path: '/template',
    name: 'template',
    meta: {},
    component: () => import('@/pages/Template.vue'),
  },
  {
    path: '/fax-in',
    meta: {
      title: '接收',
    },
    component: () => import('@/pages/fax-in/Home.vue'),
    children: [
      {
        name: 'bidBoxs',
        path: 'bid-boxs',
        meta: {
          title: '投標箱列表',
          permissions: [
            'TENDER_BOX_VIEW_NO_START',
            'TENDER_BOX_VIEW_ING',
            'TENDER_BOX_VIEW_END_TIME',
            'TENDER_BOX_VIEW_DOWNLOAD',
            'TENDER_BOX_VIEW_DELETE',
          ],
        },
        component: () => import('@/pages/fax-in/BidBoxs.vue'),
      },
      {
        name: 'bidBoxDetail',
        path: 'bid-box-detail',
        meta: {
          title: '投標箱詳細',
          rely: {
            name: 'bidBoxs',
            title: '投標箱列表',
          },
          permissions: [
            'TENDER_BOX_VIEW_NO_START',
            'TENDER_BOX_VIEW_ING',
            'TENDER_BOX_VIEW_END_TIME',
            'TENDER_BOX_VIEW_DOWNLOAD',
            'TENDER_BOX_VIEW_DELETE',
          ],
        },
        component: () => import('@/pages/fax-in/BidBoxDetail.vue'),
      },
      {
        name: 'receiveRecords',
        path: 'receive-records',
        meta: {
          title: '收件記錄',
          permissions: ['IN_RECORD_VIEW'],
        },
        component: () => import('@/pages/fax-in/ReceiveRecords.vue'),
      },
    ],
  },
  {
    path: '/fax-out',
    meta: {
      title: '發送',
    },
    component: () => import('@/pages/fax-out/Home.vue'),
    children: [
      {
        name: 'fileRecords',
        path: 'file-records',
        meta: {
          title: '文件記錄',
          permissions: ['DEV'],
        },
        component: () => import('@/pages/fax-out/FileRecord.vue'),
      },
      {
        name: 'sendRecords',
        path: 'send-records',
        meta: {
          title: '發送記錄',
          permissions: ['DEV'],
        },
        component: () => import('@/pages/fax-out/SendRecords.vue'),
      },
      {
        name: 'sendQueue',
        path: 'send-queue',
        meta: {
          title: '發送隊列',
          permissions: ['DEV'],
        },
        component: () => import('@/pages/fax-out/SendQueue.vue'),
      },
    ],
  },
  {
    name: 'system',
    path: '/system',
    meta: {
      title: '系統管理',
    },
    component: () => import('@/pages/system/Home.vue'),
    children: [
      {
        name: 'users',
        path: 'users',
        meta: {
          title: '用戶管理',
          permissions: ['USER_VIEW'],
        },
        component: () => import('@/pages/system/user/Users.vue'),
      },
      {
        name: 'groups',
        path: 'groups',
        meta: {
          title: '群組管理',
          permissions: ['DEPARTMENT_VIEW'],
        },
        component: () => import('@/pages/system/group/Groups.vue'),
      },
      {
        name: 'roles',
        path: 'roles',
        meta: {
          title: '角色權限',
          permissions: ['ROLE_VIEW'],
        },
        component: () => import('@/pages/system/role/Roles.vue'),
      },
      {
        name: 'suppliers',
        path: 'suppliers',
        meta: {
          title: '供應商管理',
          permissions: ['SUPPLIER_VIEW'],
        },
        component: () => import('@/pages/system/supplier/Suppliers.vue'),
      },
      {
        name: 'supplierGroups',
        path: 'supplier-groups',
        meta: {
          title: '供應商群組管理',
          permissions: ['GROUP_VIEW'],
        },
        component: () => import('@/pages/system/supplier-group/SupplierGroups.vue'),
      },
      {
        name: 'holidays',
        path: 'holidays',
        meta: {
          title: '假期管理',
          permissions: ['HOLIDAY_VIEW'],
        },
        component: () => import('@/pages/system/holiday/Holidays.vue'),
      },
      {
        name: 'operationLogs',
        path: 'operation-logs',
        meta: {
          title: '操作日志',
          permissions: ['AC_LOG_VIEW'],
        },
        component: () => import('@/pages/system/operation-log/OperationLogs.vue'),
      },
    ],
  },
  {
    path: '/file',
    meta: {
      title: '文件',
    },
    component: () => import('@/pages/file/Home.vue'),
    children: [
      {
        name: 'filePreview',
        path: 'file-preview',
        meta: {
          title: '文件預覽',
        },
        component: () => import('@/pages/file/Preview.vue'),
      },
    ],
  },
];

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition;
  } else {
    const position = {};
    if (to.hash) position.selector = to.hash;
    position.x = 0;
    position.y = 0;
    return position;
  }
};

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_API_PUBLIC_PATH,
  routes,
  scrollBehavior,
});

router.beforeEach((to, from, next) => {
  if (!['profile'].includes(to.name)) {
    const { profile, cPermissions } = store.state.profile;

    // 判斷當前是否有登入
    if (!profile) {
      return next({
        name: 'profile',
        replace: true,
        query: {
          redirect: to.fullPath,
          type: 'load',
        },
      });
    }

    // 判斷進入頁面是否有權限
    if (to.meta.permissions && cPermissions) {
      let find = to.meta.permissions.find((permission) => {
        return cPermissions.includes(permission);
      });
      if (!find) {
        Vue.prototype.$error(i18n.t('ERROR_CODE_MESSAGE.ACCESS_DENIED'));
        return next({
          path: '/',
          replace: true,
        });
      }
    }
  }

  next();
});

const routerRePush = VueRouter.prototype.push;
VueRouter.prototype.push = function (location) {
  return routerRePush.call(this, location).catch((error) => error);
};
const routerReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function (location) {
  return routerReplace.call(this, location).catch((error) => error);
};

export default router;
