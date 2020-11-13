import Vue from 'vue';
import Vuex from 'vuex';
import user from './user';

Vue.use(Vuex);

export default (function () {
  const Store = new Vuex.Store({
    modules: { user },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEBUGGING,
  });

  return Store;
});
