<template>
  <q-page class="flex flex-center q-pa-md">
    <div class="row q-col-gutter-x-xs q-col-gutter-y-lg">
      <div class="" v-for="n in 5" :key="`none-${n}`">
        <installation-card
          siteName="site"
          roomName="room"
          installationName="installation"
          installationId="1"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import InstallationCard from '../components/InstallationCard.vue';
export default {
  name: 'Dashboard',
  components: { InstallationCard }
};
</script>
