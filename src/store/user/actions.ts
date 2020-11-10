import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { UserState } from './state';
import axios from 'axios';

interface ServerResponse {
  data: Token;
}

interface Token {
  id: string;
}

const actions: ActionTree<UserState, StateInterface> = {
  login(context, { username, password }) {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    return new Promise((resolve, reject) => {
      axios
        .post<ServerResponse>('/api/v1/auth/login/', params)
        .then(response => {
          const token = response.data.data.id;
          context.commit('SET_TOKEN', token);
          setAuthHeader(token);
          resolve();
        })
        .catch(error => reject(error));
    });
  },
  logout(context) {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/v1/auth/logout/')
        .then(() => {
          context.commit('REMOVE_TOKEN');
          removeAuthHeader();
          resolve();
        })
        .catch(error => reject(error));
    });
  }
};

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
function setAuthHeader(token: string) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

function removeAuthHeader() {
  delete axios.defaults.headers.common['Authorization'];
}

export default actions;
