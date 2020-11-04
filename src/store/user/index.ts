import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { UserState } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const user: Module<UserState, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};

export default user;
