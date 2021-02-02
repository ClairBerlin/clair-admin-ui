const mutation = {
  START_LOADING(authuser) {
    authuser.isLoading = true;
  },
  STOP_LOADING(authuser) {
    authuser.isLoading = false;
  },
  MARK_ERROR(authuser) {
    authuser.error = true;
  },
  MARK_SUCCESS(authuser) {
    authuser.error = false;
  },
  SET_ID(authuser, id) {
    authuser.id = id;
  },
  SET_AUTHUSER(authuser, { email, first_name, last_name, username }) {
    authuser.email = email;
    authuser.firstName = first_name;
    authuser.lastName = last_name;
    authuser.userName = username;
  },
  SET_MEMBERSHIPS(authuser, memberships) {
    // Simplify the memberhship objects.
    authuser.memberships = [];
    for (const ms of memberships) {
      const simplifiedMs = {
        id: ms.id,
        role: ms.attributes.role,
        orgName: ms.attributes.organization_name,
        orgId: ms.relationships.organization.data.id
      };
      authuser.memberships.push(simplifiedMs);
    }
  }
};

export default mutation;
