import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { resourceModule, mapResourceModules } from '@reststate/vuex';
import user from './user';

Vue.use(Vuex);

const httpClient = axios.create({
  baseURL: '/api/v1/',
  headers: {
    common: {
      'Content-Type': 'application/vnd.api+json'
    }
  }
});

export default (function() {
  const Store = new Vuex.Store({
    modules: {
      user,
      // TODO: do we need this?
      Address: resourceModule({
        name: 'addresses',
        httpClient: httpClient
      }),
      ...mapResourceModules({
        names: [
          'users',
          'organizations',
          'sites',
          'rooms',
          'nodes',
          'installations',
          'installation-timeseries'
        ],
        httpClient
      })
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEBUGGING
  });

  return Store;
});
