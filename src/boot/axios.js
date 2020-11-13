import Vue from 'vue';
import axios from 'axios';

Vue.prototype.$axios = axios;
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.xsrfCookieName = 'csrftoken';
