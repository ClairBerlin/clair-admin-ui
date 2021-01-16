<template>
  <q-page padding>
    <div class="text-h4">My Organizations</div>
    <div class="q-pa-md" style="max-width: 350px">
      <q-list bordered separator>
        <p v-if="isLoading">Loading...</p>
        <p v-else-if="isError">Error loading organizations.</p>
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
              v-for="pers in getOrganizationUsers(org)"
              :key="pers.name"
            >
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-icon name="perm_identity" />
                </q-item-section>
                <q-item-section> {{ pers.name }} </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </ul>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'Members',
  data() {
    return {
      members: [{ name: 'Person A' }, { name: 'Person B' }]
    };
  },
  computed: {
    ...mapGetters({
      isLoading: 'organizations/isLoading',
      isError: 'organizations/isError',
      allOrganizations: 'organizations/all',
      getRelatedUsers: 'users/related'
    })
  },
  methods: {
    ...mapActions({
      loadRelatedUsers: 'users/loadRelated'
    }),
    async getOrganizationUsers(org) {
      const parent = { type: 'organizations', id: org.id };
      await this.loadRelatedUsers({ parent });
      return this.getRelatedUsers({ parent });
    }
  }
};
</script>
