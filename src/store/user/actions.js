import axios from 'axios';

const actions = {
  logout() {
    return axios.post('/api/v1/auth/logout/');
  },
  getUserId(context) {
    return new Promise((resolve, reject) => {
      axios
        .get('/api/v1/auth/user')
        .then(response => {
          const userId = response.data.data.id;
          context.commit('SET_ID', { userId });
          resolve(userId);
        })
        .catch(error => reject(error));
    });
  }
};

export default actions;
