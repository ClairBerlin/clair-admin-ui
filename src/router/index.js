import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import store from '../store/index';

Vue.use(VueRouter);

export default (function() {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

  Router.beforeEach((to, from, next) => {
    if (!to.meta?.requiresAuth || store().getters['user/isLoggedIn']) {
      return next();
    } else {
      return next({ name: 'login' });
    }
  });

  return Router;
});
