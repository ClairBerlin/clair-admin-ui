<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-icon class="clair-logo" name="img:icons/favicon-96x96.png" />
        <q-toolbar-title class="clair-title">
          Clair Admin UI
        </q-toolbar-title>
        <q-btn
          v-if="isLoggedIn()"
          flat
          dense
          round
          @click="logout()"
          icon="exit_to_app"
        />
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
  name: 'MainLayout',
  methods: {
    isLoggedIn() {
      // eslint-disable-next-line
      return this.$store.getters['user/isLoggedIn'];
    },
    logout() {
      this.$q.loading.show();
      this.$store
        .dispatch('user/logout')
        .then(() => {
          this.$q.cookies.remove('csrftoken');
          return this.$router.push({ name: 'login' });
        })
        .catch(error => {
          console.log(error);
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Logout failed'
          });
        })
        .finally(() => this.$q.loading.hide());
    }
  }
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
