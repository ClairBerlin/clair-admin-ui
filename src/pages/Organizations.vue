<template>
  <q-page padding>
    <div class="text-h4">My Organizations</div>
    <div class="q-pa-md" style="max-width: 500px">
      <q-list bordered separator>
        <p v-if="organizationIsLoading">Loading...</p>
        <p v-else-if="organizationIsError">Error loading organizations.</p>
        <ul v-else>
          <q-expansion-item
            expand-separator
            default-closed
            v-for="org in allOrganizations"
            :key="org.id"
            v-bind:label="org.attributes.name"
          >
            <q-list
              bordered
              separator
              v-for="pers in orgUsers[org.id]"
              :key="pers.id"
            >
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-icon name="perm_identity" />
                </q-item-section>
                <q-item-section>
                  {{ pers.attributes.username }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </ul>
      </q-list>
    </div>
    <div class="q-pa-md" style="max-width: 500px">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-input
          filled
          v-model="newOrgName"
          label="Organization"
          hint="Name of your new organization"
          lazy-rules
          :rules="[
            val =>
              (val && val.length > 2) ||
              'Please enter an organization name of at least three characters.'
          ]"
        />

        <q-input
          filled
          v-model="newOrgDesc"
          label="Description (optional)"
          hint="Describe your organization"
          lazy-rules
        />

        <div>
          <q-btn label="Create Organization" type="submit" color="primary" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'Organizations',
  data() {
    return {
      usersIsLoading: false, // Loading of user data under way?
      usersIsError: null, // Did fetching user data end with an error?
      orgUsers: [], // Users of all organizations the authenticated user is a member of.
      newOrgName: null,
      newOrgDesc: null
    };
  },
  watch: {
    // Fetch the users of all organizations the currently authenticated users is a
    // member of. Because the organizations themselves are loaded asynchronously, watch
    // them and load the users once the organizations are available.
    allOrganizations: {
      immediate: true, // Trigger user fetch, n case organizations are already loaded.
      handler: async function(newOrgs) {
        this.fetchUsers();
      }
    }
  },
  computed: {
    ...mapGetters({
      organizationIsLoading: 'Organization/isLoading',
      organizationIsError: 'Organization/isError',
      allOrganizations: 'Organization/all',
      getRelatedUsers: 'users/related'
    })
  },
  methods: {
    ...mapActions({
      loadRelatedUsers: 'users/loadRelated'
    }),
    async fetchUsers() {
      // For now, assume that the organizations are fetched already.
      this.usersIsLoading = true;
      const organizations = this.allOrganizations;
      for (const org of organizations) {
        // This loop will execute in order, despite the asynchronous fetch.
        // See https://lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795/
        const parent = { type: 'organizations', id: org.id };
        await this.loadRelatedUsers({ parent });
        const user = this.getRelatedUsers({ parent });
        // Reactively change the array. See https://vuejs.org/v2/guide/reactivity.html#For-Arrays
        this.$set(this.orgUsers, org.id, user);
      }
      this.usersIsLoading = false;
    },
    onReset() {
      this.newOrgName = null;
      this.newOrgDesc = null;
      console.log('reset succeeded.');
    },
    onSubmit(event) {
      const newOrg = {
        attributes: {
          name: this.newOrgName,
          description: this.newOrgDesc
        },
        type: 'Organization'
      }
      this.$store.dispatch('Organization/create', newOrg);
    }
  }
};
</script>
