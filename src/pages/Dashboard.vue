<template>
  <q-page class="q-pa-md row items-start q-gutter-md">
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
      :installationName="getNodeName(installation)"
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
      getSitesRelated: 'sites/related',
      getNodeById: 'nodes/byId'
    })
  },
  methods: {
    ...mapActions({
      loadRoomsRelated: 'rooms/loadRelated',
      loadInstallationsRelated: 'installations/loadRelated',
      loadSitesRelated: 'sites/loadRelated',
      loadNodeById: 'nodes/loadById'
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
      const nodeId = installation.relationships.node.data.id;
      const node = this.getNodeById({ id: nodeId });
      return node.attributes.alias;
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
    async getNodeForInstallation(installation) {
      const nodeId = installation.relationships.node.data.id;
      await this.loadNodeById({ id: nodeId });
      return this.getNodeById({ id: nodeId });
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
              for (const newInstall of newInstalls) {
                if (!existingInstallIds.includes(newInstall.id)) {
                  const node = await this.getNodeForInstallation(newInstall);
                  if (node) {
                    this.installations.push(newInstall);
                  }
                }
              }
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
