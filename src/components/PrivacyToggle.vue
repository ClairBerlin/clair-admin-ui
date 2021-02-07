<template>
  <q-card flat>
    <q-item tag="label" v-ripple :disabled="isPublicToggleDisabled">
      <q-item-section avatar>
        <q-toggle
          v-model="isPublic"
          checked-icon="check"
          color="orange"
          unchecked-icon="clear"
          :disable="isPublicToggleDisabled"
          @input="togglePrivacy"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ publicLabel }}</q-item-label>
        <q-item-label caption>{{ installationName }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  props: ['installationId'],
  data() {
    return {
      orgMembership: undefined,
      installation: undefined,
      roomId: undefined,
      room: undefined,
      nodeId: undefined,
      node: undefined,
      siteId: undefined,
      site: undefined,
      isPublic: false,
      isPublicToggleDisabled: true
    };
  },
  computed: {
    ...mapGetters({
      getInstallationById: 'Installation/byId',
      getRoomById: 'Room/byId',
      getSiteById: 'Site/byId',
      getNodeById: 'Node/byId',
      getMembershipByOrgId: 'authuser/getMembershipByOrgId'
    }),
    publicLabel() {
      return 'Measurements are ' + (this.isPublic ? 'public' : 'private');
    },
    installationName() {
      return (
        'from ' +
        this.site?.attributes.name +
        '/' +
        this.room?.attributes.name +
        '/' +
        this.node?.attributes.alias
      );
    }
  },
  methods: {
    ...mapActions({
      fetchInstallationById: 'Installation/loadById',
      fetchRoomById: 'Room/loadById',
      fetchSiteById: 'Site/loadById',
      fetchNodeById: 'Node/loadById',
      updateInstallation: 'Installation/update'
    }),
    togglePrivacy() {
      const updatedInstallation = {
        id: this.installation.id,
        type: this.installation.type,
        attributes: { is_public: this.isPublic }
      };
      this.updateInstallation(updatedInstallation);
    }
  },
  async mounted() {
    this.orgMembership = this.getMembershipByOrgId(this.$route.params.orgId);
    this.isPublicToggleDisabled = this.orgMembership.role !== 'O';
    this.installation = this.getInstallationById({ id: this.installationId });
    if (!this.installation) {
      await this.fetchInstallationById({ id: this.installationId });
      this.installation = this.getInstallationById({ id: this.installationId });
    }
    this.isPublic = this.installation.attributes.is_public;
    this.roomId = this.installation.relationships?.room.data.id;
    this.room = this.getRoomById({ id: this.roomId });
    if (!this.room) {
      await this.fetchRoomById({ id: this.roomId });
      this.room = this.getRoomById({ id: this.roomId });
    }
    this.nodeId = this.installation.relationships?.node.data.id;
    this.node = this.getNodeById({ id: this.nodeId });
    if (!this.node) {
      await this.fetchNodeById({ id: this.nodeId });
      this.node = this.getNodeById({ id: this.nodeId });
    }
    this.siteId = this.room.relationships?.site.data.id;
    this.site = this.getSiteById({ id: this.siteId });
    if (!this.site) {
      await this.fetchSiteById({ id: this.siteId });
      this.site = this.getSiteById({ id: this.siteId });
    }
  }
};
</script>

<style lang="scss"></style>
