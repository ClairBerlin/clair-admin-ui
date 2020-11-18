import { Cookies } from 'quasar';

const getters = {
  isLoggedIn(user) {
    return user.token !== null && Cookies.has('csrftoken');
  }
};

export default getters;
