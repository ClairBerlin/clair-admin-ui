import axios from 'axios';

const actions = {
  login(context, { username, password }) {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    return new Promise((resolve, reject) => {
      axios
        .post('/api/v1/auth/login/', params)
        .then(response => {
          const token = response.data.data.id;
          context.commit('SET_TOKEN', token);
          setAuthHeader(token);
          resolve();
        })
        .catch(error => reject(error));
    });
  },
  logout(context) {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/v1/auth/logout/')
        .then(() => {
          context.commit('REMOVE_TOKEN');
          removeAuthHeader();
          resolve();
        })
        .catch(error => reject(error));
    });
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

function setAuthHeader(token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

function removeAuthHeader() {
  delete axios.defaults.headers.common['Authorization'];
}

export default actions;
