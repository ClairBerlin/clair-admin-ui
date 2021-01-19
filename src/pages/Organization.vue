<template>
  <q-page padding>
    <div class="text-h4">My Organizations</div>
    <div class="q-pa-md" style="max-width: 350px">
      <q-list bordered separator>
        <p v-if="organizationIsLoading">Loading...</p>
        <p v-else-if="organizationIsError">Error loading organizations.</p>
        <ul v-else>
          <q-expansion-item
            expand-separator
            default-opened
            v-for="org in allOrganizations"
            :key="org.attributes.name"
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
                <q-item-section> {{ pers.attributes.username }} </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </ul>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Organizations',
  data() {
    return {
      usersIsLoading: false, // Loading of user data under way?
      usersIsError: null, // Did fetching user data end with an error?
      orgUsers: [] // Users of all organizations the authenticated user is a member of.
    }
  },
  created() {
    // Fetch data from the API when the view is created and the data is
    // already being observed. Option 1 in the Vue Router documentation here:
    // https://router.vuejs.org/guide/advanced/data-fetching.html#fetching-after-navigation
    this.fetchUsers()
  },
  computed: {
    ...mapGetters({
      organizationIsLoading: 'organizations/isLoading',
      organizationIsError: 'organizations/isError',
      allOrganizations: 'organizations/all',
      getRelatedUsers: 'users/related'
    })
  },
  methods: {
    ...mapActions({
      loadRelatedUsers: 'users/loadRelated'
    }),
    async fetchUsers() {
      // For now, assume that the organizations are fetched already.
      this.usersIsLoading = true
      for (const org of this.allOrganizations) {
        // This loop will execute in order, despite the asynchronous fetch.
        // See https://lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795/
        const parent = { type: 'organizations', id: org.id }
        await this.loadRelatedUsers({ parent })
        const user = this.getRelatedUsers({ parent })
        this.orgUsers[org.id] = user
      }
      this.usersIsLoading = false
    },
  }
}
</script>
