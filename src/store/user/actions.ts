import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { UserState } from './state';
import axios from 'axios'; // TODO get from this?

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
        .post<Token>('/auth/login/', params)
        .then(response => {
          const token = response.data;
          context.commit('SET_TOKEN', token.id);
          setAxiosHeaders(token.id);
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
  axios.defaults.headers.common['Authorization'] = 'Basic ' + token;
}

export default actions;
