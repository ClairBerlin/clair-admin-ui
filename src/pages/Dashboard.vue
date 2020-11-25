<template>
  <q-page class="flex flex-center q-pa-md">
    <installation-card
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
    orgId: String
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
      getOrganizationById: 'sites/byId',
      getRoomsById: 'rooms/byId',
      getRoomsRelated: 'rooms/related',
      getInstallationsRelated: 'installations/related',
      getSitesRelated: 'sites/related'
    })
  },
  methods: {
    ...mapActions({
      loadInstallationById: 'sites/loadById',
      loadRoomsRelated: 'rooms/loadRelated',
      loadInstallationsRelated: 'installations/loadRelated',
      loadInstallationById: 'installations/loadById',
      loadOrganizationById: 'organizations/loadById',
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
    getInstallationsForOrg: async function() {
      // TODO:load sites for the selected org (-> bind from main layout)
      const oid = 1;
      await this.loadOrganizationById({ id: oid });
      const org = this.getOrganizationById({ id: oid });
      let parent = { type: 'organizations', id: oid };
      await this.loadSitesRelated({ parent });
      const sites = this.getSitesRelated({ parent });
      sites.forEach(async site => {
        parent = { type: 'sites', id: site.id };
        await this.loadRoomsRelated({ parent });
        const rooms = this.getRoomsRelated({ parent });
        rooms.forEach(async room => {
          parent = { type: 'rooms', id: room.id };
          await this.loadInstallationsRelated({ parent });
          const installations = this.getInstallationsRelated({ parent });
          if (installations) {
            this.installations.push(...installations);
          }
        });
      });
    }
  },
  mounted() {
    this.getInstallationsForOrg();
  },
  watch: {
    installations: function(newVal) {
      console.log(JSON.stringify(newVal));
    }
  }
};
</script>
