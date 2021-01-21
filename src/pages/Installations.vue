<template>
  <q-page class="q-pa-md">
    <q-card class="uninstalled-card">
      <q-card-section class="text-h5">
        {{ $t('Uninstalled Sensors') }}</q-card-section
      >
      <sensor-list :sensors="uninstalled" />
    </q-card>

    <h4>
      {{ $t('Locations') }}
      <q-btn round icon="add" @click="openAddLocationDialog()">
        <q-tooltip> {{ $t('Add new location') }} </q-tooltip></q-btn
      >
    </h4>

    <div v-for="location in locations" :key="location.id">
      <h5>
        {{ location.attributes.name }}
        <q-btn round icon="add" @click="openAddRoomDialog()">
          <q-tooltip>{{ $t('Add new room') }}</q-tooltip></q-btn
        >
      </h5>
      <div class="row q-gutter-x-xl">
        <q-card
          class="rooms-card"
          v-for="room in rooms.get(location)"
          :key="room.id"
        >
          <q-card-section class="text-h6">
            {{ room.attributes.name }}
          </q-card-section>
          <sensor-list :sensors="room.sensors" />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import SensorList from '../components/SensorList.vue';
export default {
  name: 'Installations',
  props: {
    selectedOrg: Object
  },
  components: { SensorList },
  data() {
    return {
      installations: [],
      uninstalled: [],
      locations: [],
      rooms: new Map()
    };
  },
  computed: {
    ...mapGetters({
      getSiteById: 'sites/byId',
      getRoomsById: 'rooms/byId',
      getRoomsRelated: 'rooms/related',
      getInstallationsRelated: 'installations/related',
      getSitesRelated: 'sites/related',
      getNodeById: 'nodes/byId',
      getNodesRelated: 'nodes/related'
    })
  },
  methods: {
    ...mapActions({
      loadRoomsRelated: 'rooms/loadRelated',
      loadInstallationsRelated: 'installations/loadRelated',
      loadSitesRelated: 'sites/loadRelated',
      loadNodesRelated: 'nodes/loadRelated',
      loadNodeById: 'nodes/loadById'
    }),
    openAddRoomDialog() {
      console.log('clicked on add new room');
    },
    openAddLocationDialog() {
      console.log('clicked on add new location');
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
    async getSensorsForOrg(org) {
      let parent = { type: 'organizations', id: org.id };
      await this.loadNodesRelated({ parent });
      return this.getNodesRelated({ parent });
    },
    getUninstalledSensors: async function(org) {
      const sensors = await this.getSensorsForOrg(org);
      for (const sensor of sensors) {
        let parent = { type: 'nodes', id: sensor.id };
        await this.loadInstallationsRelated({ parent });
        const installations = await this.getInstallationsRelated({ parent });
        if (Array.isArray(installations) && !installations.length) {
          this.uninstalled.push(sensor);
        }
      }
    },
    getLocationsForOrg: async function(org) {
      const locations = await this.getSitesForOrg(org);
      for (const location of locations) {
        const rooms = await this.getRoomsForSite(location);
        this.rooms.set(location, rooms);
      }
      this.locations = locations;
    }
  },
  mounted() {
    if (this.selectedOrg) {
      this.getUninstalledSensors(this.selectedOrg);
      this.getLocationsForOrg(this.selectedOrg);
    }
  },
  watch: {
    selectedOrg: async function(newOrg) {
      this.uninstalled = [];
      this.locations = [];
      this.getUninstalledSensors(this.selectedOrg);
      this.getLocationsForOrg(this.selectedOrg);
    }
  }
};
</script>

<style lang="css" scoped>
.uninstalled-card,
.rooms-card {
  width: 100%;
  max-width: 400px;
}
</style>
