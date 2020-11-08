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
        .post<ServerResponse>('/auth/login/', params)
        .then(response => {
          const token = response.data.data.id;
          context.commit('SET_TOKEN', token);
          setAxiosHeaders(token);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

function setAxiosHeaders(token: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

export default actions;
