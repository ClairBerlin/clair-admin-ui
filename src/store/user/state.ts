export interface UserState {
  token: string | null;
}

const state: UserState = {
  token: localStorage.getItem('token') || null
};

export default state;
