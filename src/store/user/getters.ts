import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { UserState } from './state';

const getters: GetterTree<UserState, StateInterface> = {
  isLoggedIn(user: UserState) {
    return user.token !== null;
  }
};

export default getters;
