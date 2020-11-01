<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-icon class="clair-logo" name="img:icons/favicon-96x96.png" />
        <q-toolbar-title class="clair-title">
          Clair Admin UI
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'MainLayout'
});
</script>

<style lang="scss" scoped>
.clair-logo {
  font-size: 4em;
  padding: 10px;
}
.clair-title {
  font-size: 2em;
  padding: 5px;
}
</style>
