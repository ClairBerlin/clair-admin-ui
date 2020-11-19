const mutation = {
  SET_TOKEN(user, token) {
    user.token = token;
    localStorage.setItem('token', token);
  },
  REMOVE_TOKEN(user) {
    user.token = null;
    localStorage.removeItem('token');
  },
  SET_ID(user, id) {
    user.id = id;
  }
};

export default mutation;
