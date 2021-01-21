<template>
  <q-list bordered class="rounded-borders">
    <q-item
      clickable
      v-ripple
      @click="openEditSensorDialog(sensor)"
      v-for="sensor in sensors"
      :key="sensor.id"
    >
      <q-tooltip>{{ $t('Click to edit sensor details') }}</q-tooltip>
      <q-item-section>{{ sensor.attributes.alias }}</q-item-section>
      <q-item-section avatar>
        <q-icon name="edit" />
      </q-item-section>
    </q-item>
    <q-separator />
    <q-item
      clickable
      v-ripple
      key="add-new-sensor"
      @click="openAddSensorDialog()"
    >
      <q-tooltip>{{ $t('Click to add a new sensor') }}</q-tooltip>
      <q-item-section class="text-grey">
        {{ $t('Add new sensor') }}</q-item-section
      >
      <q-item-section avatar>
        <q-icon name="add" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  components: {},
  props: {
    sensors: Array
  },
  methods: {
    openAddSensorDialog() {
      console.log('clicked on add new sensor item');
    },
    openEditSensorDialog(sensor) {
      console.log('clicked on edit sensor for id' + sensor.id);
    }
  }
};
</script>
