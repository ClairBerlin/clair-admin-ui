import { Cookies } from 'quasar';

const getters = {
  isLoggedIn(user) {
    return user.id !== null && Cookies.has('csrftoken');
  }
};

export default getters;
