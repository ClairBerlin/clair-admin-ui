import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { resourceModule, mapResourceModules } from '@reststate/vuex';
import authuser from './authuser';

Vue.use(Vuex);

const httpClient = axios.create({
  baseURL: '/api/v1/',
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json, application/json, text/plain, */*'
  },
  // To work with Django's CSRF protection. Read the CSRF token from the cookie and
  // return it in a CSRF-header with each request.
  // See https://build.vsupalov.com/avoid-csrf-errors-axios-django/
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFTOKEN'
});

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
      authuser,
      Address: resourceModule({
        name: 'addresses',
        httpClient: httpClient
      }),
      Organization: resourceModule({
        name: 'organizations',
        httpClient: httpClient
      }),
      Membership: resourceModule({
        name: 'memberships',
        httpClient: httpClient
      }),
      Room: resourceModule({
        name: 'rooms',
        httpClient: httpClient
      }),
      Site: resourceModule({
        name: 'sites',
        httpClient: httpClient
      }),
      User: resourceModule({
        name: 'users',
        httpClient: httpClient
      }),
      Node: resourceModule({
        name: 'nodes',
        httpClient: httpClient
      }),
      Installation: resourceModule({
        name: 'installations',
        httpClient: httpClient
      }),
      ...mapResourceModules({
        names: [
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
