import axios from 'axios';

export default function() {
  const token = localStorage.getItem('token') || null;
  if (token) axios.defaults.headers.common['Authorization'] = 'Token ' + token;
  return {
    token: token,
    id: null
  };
}
