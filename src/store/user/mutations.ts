import { MutationTree } from 'vuex';
import { UserState } from './state';

const mutation: MutationTree<UserState> = {
  SET_TOKEN(user, token: string) {
    user.token = token;
    localStorage.setItem('token', token);
  },
  REMOVE_TOKEN(user) {
    user.token = null;
    localStorage.removeItem('token');
  }
};

export default mutation;
