<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card v-if="installations.length == 0">
      <q-card-section class="text-h4">
        {{ $t('No installations found') }}
      </q-card-section>
    </q-card>
    <installation-card
      v-else
      v-for="installation in installations"
      :siteName="getSiteName(installation)"
      :roomName="getRoomName(installation)"
      :installationName="installation.id"
      :installationId="installation.id"
      :key="installation.id"
    />
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import InstallationCard from '../components/InstallationCard.vue';
export default {
  name: 'Dashboard',
  props: {
    selectedOrg: Object
  },
  components: { InstallationCard },
  data() {
    return {
      installations: []
    };
  },
  computed: {
    ...mapGetters({
      getSiteById: 'sites/byId',
      getRoomsById: 'rooms/byId',
      getRoomsRelated: 'rooms/related',
      getInstallationsRelated: 'installations/related',
      getSitesRelated: 'sites/related'
    })
  },
  methods: {
    ...mapActions({
      loadRoomsRelated: 'rooms/loadRelated',
      loadInstallationsRelated: 'installations/loadRelated',
      loadSitesRelated: 'sites/loadRelated'
    }),
    getRoom(installation) {
      const roomId = installation.relationships.room.data.id;
      return this.getRoomsById({ id: roomId });
    },
    getSiteName(installation) {
      const room = this.getRoom(installation);
      const siteId = room.relationships.site.data.id;
      const site = this.getSiteById({ id: siteId });
      return site.attributes.name;
    },
    getRoomName(installation) {
      const room = this.getRoom(installation);
      return room.attributes.name;
    },
    getNodeName(installation) {
      return installation.relationships.node.data.id;
    },
    async getSitesForOrg(org) {
      let parent = { type: 'organizations', id: org.id };
      await this.loadSitesRelated({ parent });
      return this.getSitesRelated({ parent });
    },
    async getRoomsForSite(site) {
      parent = { type: 'sites', id: site.id };
      await this.loadRoomsRelated({ parent });
      return this.getRoomsRelated({ parent });
    },
    async getInstallationsForRoom(room) {
      parent = { type: 'rooms', id: room.id };
      await this.loadInstallationsRelated({ parent });
      return this.getInstallationsRelated({ parent });
    },
    getInstallationsForOrg: async function(organization) {
      const sites = await this.getSitesForOrg(organization);
      if (!sites) return;
      for (const site of sites) {
        const rooms = await this.getRoomsForSite(site);
        if (rooms) {
          for (const room of rooms) {
            const newInstalls = await this.getInstallationsForRoom(room);
            if (newInstalls) {
              // avoid adding any installation twice
              const existingInstallIds = this.installations.map(i => i.id);
              newInstalls.forEach(newInstall => {
                if (!existingInstallIds.includes(newInstall.id)) {
                  this.installations.push(newInstall);
                }
              });
            }
          }
        }
      }
    }
  },
  mounted() {
    if (this.selectedOrg) {
      this.getInstallationsForOrg(this.selectedOrg);
    }
  },
  watch: {
    selectedOrg: async function(newOrg) {
      // clear installations of any previously selected organization
      this.installations = [];
      this.getInstallationsForOrg(newOrg);
    }
  }
};
</script>
