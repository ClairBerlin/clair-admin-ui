import { Cookies } from 'quasar';

const getters = {
  isLoggedIn(authuser) {
    return authuser.id !== null && Cookies.has('csrftoken');
  },
  isLoading(authUser) {
    return authUser.userIsLoading || authUser.membershipsAreLoading
  },
  isError(authuser) {
    return authuser.error;
  },
  getId(authuser) {
    return authuser.id ? authuser.id : undefined;
  },
  getInfo(authuser) {
    return authuser.id
      ? {
          id: authuser.id,
          email: authuser.email,
          firstName: authuser.firstName,
          lastName: authuser.lastName,
          userName: authuser.userName
        }
      : undefined;
  },
  getMemberships(authuser) {
    return authuser.id ? authuser.memberships : undefined;
  },
  getMembershipByOrgId: authuser => orgId => {
    return authuser.memberships.find(ms => ms.orgId === orgId);
  }
};

export default getters;
