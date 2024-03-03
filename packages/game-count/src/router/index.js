import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: { name: 'index' },
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('@/pages/Index.vue'),
  },
  {
    path: '*',
    redirect: { name: 'index' },
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
