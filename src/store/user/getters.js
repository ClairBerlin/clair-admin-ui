import { Cookies } from 'quasar';

const getters = {
  isLoggedIn(user) {
    return user.id !== null && Cookies.has('csrftoken');
  },
  getUserId(user) {
    return user.id ? user.id.userId : undefined;
  }
};

export default getters;
