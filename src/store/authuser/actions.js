import axios from 'axios';

const actions = {
  logout() {
    return axios.post('/api/v1/auth/logout/');
  },
  async fetchMemberships(context) {
    context.commit('START_MEMBERSHIPSLOADING');
    try {
      const userId = context.getters.getId;
      const parent = { type: 'users', id: userId };
      // Load related organizations into the store.
      await context.dispatch(
        'Membership/loadRelated',
        { parent: parent },
        { root: true }
      );
      const memberships = context.rootGetters['Membership/related']({
        parent: parent
      });
      context.commit('SET_MEMBERSHIPS', memberships);
    } catch (error) {
      context.commit('MARK_ERROR');
      throw error;
    } finally {
      context.commit('STOP_MEMBERSHIPSLOADING');
    }
  },
  async fetchAuthenticatedUser(context) {
    context.commit('START_USERLOADING');
    try {
      const authUser = await axios.get('/api/v1/auth/user');
      const userId = authUser.data.data.id;
      await context.dispatch(
        'users/loadById',
        { id: userId },
        {
          root: true
        }
      );
      const userInfo = context.rootGetters['users/byId']({ id: userId });
      context.commit('SET_ID', userId);
      context.commit('SET_AUTHUSER', userInfo.attributes);
      context.dispatch('fetchMemberships');
      context.commit('MARK_SUCCESS');
    } catch (error) {
      context.commit('MARK_ERROR');
      throw error;
    } finally {
      context.commit('STOP_USERLOADING');
    }
  }
};

export default actions;
