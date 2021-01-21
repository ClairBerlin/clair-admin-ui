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
httpClient.defaults.xsrfHeaderName = 'X-CSRFToken';
httpClient.defaults.xsrfCookieName = 'csrftoken';

function redirectOn401(error) {
  console.log(error);
  if (error.response.status === 401) {
    window.location.href = window.location.origin + '/accounts/login/';
  }
  Promise.reject(error);
}

httpClient.interceptors.response.use(
  response => {
    return response;
  },
  error => redirectOn401(error)
);
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => redirectOn401(error)
);

export default (function() {
  const Store = new Vuex.Store({
    modules: {
      user,
      Address: resourceModule({
        name: 'addresses',
        httpClient: httpClient
      }),
      Organization: resourceModule({
        name: 'organizations',
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
