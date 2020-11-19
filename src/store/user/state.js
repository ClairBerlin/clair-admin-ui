export default function() {
  return {
    token: localStorage.getItem('token') || null,
    id: null
  };
}
