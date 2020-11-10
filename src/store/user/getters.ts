import { GetterTree } from 'vuex';
import { Cookies } from 'quasar';
import { StateInterface } from '../index';
import { UserState } from './state';

const getters: GetterTree<UserState, StateInterface> = {
  isLoggedIn(user: UserState) {
    return user.token !== null && Cookies.has('csrftoken');
  }
};

export default getters;
