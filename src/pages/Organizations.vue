<template>
  <q-page padding>
    <div class="text-h4">My Organizations</div>
    <div class="q-pa-md" style="max-width: 500px">
      <q-list bordered separator>
        <p v-if="organizationIsLoading">Loading...</p>
        <p v-else-if="organizationIsError">Error loading organizations.</p>
        <p v-else-if="areMembersLoading">Error loading organization members.</p>
        <ul v-else>
          <q-expansion-item
            expand-separator
            default-closed
            v-for="org in allOrganizations"
            :key="org.id"
            v-bind:label="org.attributes.name"
            v-bind:caption="'Members: ' + orgMembers[org.id].length"
          >
            <q-list
              bordered
              separator
              v-for="member in orgMembers[org.id]"
              :key="member.id"
            >
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-icon name="perm_identity" />
                </q-item-section>
                <q-item-section>
                  {{ member.attributes.user_name }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </ul>
      </q-list>
    </div>
    <div class="q-pa-md" style="max-width: 500px">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">Add an Organization</div>
          <div class="text-subtitle3">You will be its owner</div>
        </q-card-section>

        <q-separator />
        <q-card-section>
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
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Create Organization" type="submit" color="primary" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'Organizations',
  data() {
    return {
      areMembersLoading: false,
      isMemberLoadingError: null,
      orgMembers: [], // Members of all organizations the authenticated user is a member of.
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
        this.fetchMembers();
      }
    }
  },
  computed: {
    ...mapGetters({
      organizationIsLoading: 'Organization/isLoading',
      organizationIsError: 'Organization/isError',
      allOrganizations: 'Organization/all',
      getRelatedMembers: `Membership/related`
    })
  },
  methods: {
    ...mapActions({
      loadRelatedMembers: 'Membership/loadRelated'
    }),
    async fetchMembers() {
      // For now, assume that the organizations are fetched already.
      this.areMembersLoading = true;
      const organizations = this.allOrganizations;
      try {
        for (const org of organizations) {
          // This loop will execute in order, despite the asynchronous fetch.
          // See https://lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795/
          const parent = { type: 'organizations', id: org.id };
          await this.loadRelatedMembers({ parent });
          const members = this.getRelatedMembers({ parent });
          console.log(members);
          // Reactively change the array. See https://vuejs.org/v2/guide/reactivity.html#For-Arrays
          this.$set(this.orgMembers, org.id, members);
        }
      } catch (error) {
        console.log(error);
        this.isMemberLoadingError = true;
        this.$q.notify({
          color: 'red',
          textColor: 'white',
          icon: 'error',
          message: `Could not fetch members of all organizations.`
        });
      } finally {
        this.areMembersLoading = false;
      }
    },
    onReset() {
      this.newOrgName = null;
      this.newOrgDesc = null;
    },
    async onSubmit(event) {
      const newOrg = {
        attributes: {
          name: this.newOrgName,
          description: this.newOrgDesc
        },
        type: 'Organization'
      };
      try {
        await this.$store.dispatch('Organization/create', newOrg);
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: `Organization ${newOrg.name} created.`
        });
      } catch (error) {
        console.log(error);
        this.$q.notify({
          color: 'red',
          textColor: 'white',
          icon: 'error',
          message: `Could not create the organization; maybe it already exists?`
        });
      }
    }
  }
};
</script>
