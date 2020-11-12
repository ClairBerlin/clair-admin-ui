<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="isLoggedIn()"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-icon class="clair-logo" name="img:icons/favicon-96x96.png" />
        <q-toolbar-title class="clair-title">
          Clair Admin UI
        </q-toolbar-title>

        <q-btn-dropdown round dense flat color="white" :label="$i18n.locale">
          <q-list style="min-width: 100px">
            <q-item
              clickable
              v-close-popup
              v-for="option in langOptions"
              :key="option.value"
              @click="setLang(option.value)"
            >
              <q-item-section>
                <q-item-label>{{ option.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-btn
          class="q-mr-xs"
          flat
          round
          @click="$q.dark.toggle()"
          :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"
        />
        <q-btn
          v-if="isLoggedIn()"
          flat
          dense
          round
          @click="logout()"
          icon="fas fa-sign-out-alt"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="isLoggedIn()"
      v-model="leftDrawerOpen"
      show-if-above
      :width="200"
      :breakpoint="500"
      bordered
    >
      <q-list>
        <template v-for="(item, index) in items">
          <q-item
            clickable
            v-ripple
            :key="index"
            :acive="selected === item.link"
            @click="selected = item.link"
            :to="item.link"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>
              {{ $t(item.label) }}
            </q-item-section>
          </q-item>
          <q-separator :key="'sep' + index" v-if="item.separator" />
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

class MenuItem {
  icon: string;
  label: string;
  link: string;
  separator: boolean;

  constructor(icon: string, label: string, link: string, separator = false) {
    this.icon = icon;
    this.label = label;
    this.link = link;
    this.separator = separator;
  }
}

const items = [
  new MenuItem('cloud', 'Overview', 'dashboard', true),
  new MenuItem('fa fa-sitemap', 'Organisation', 'orgs'),
  new MenuItem('fa fa-map-marker', 'Locations', 'locations'),
  new MenuItem('fa fa-cube', 'Rooms', 'rooms'),
  new MenuItem('fa fa-thermometer-half', 'Sensors', 'sensors', true),
  new MenuItem('settings', 'Settings', 'settings'),
  new MenuItem('feedback', 'Feedback', 'feedback'),
  new MenuItem('help', 'Help', 'help')
];

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const leftDrawerOpen = ref(true);
    const langOptions = [
      { value: 'en', label: 'English' },
      { value: 'de', label: 'Deutsch' }
    ];
    const selected = ref('dashboard');
    return { leftDrawerOpen, langOptions, selected, items };
  },
  methods: {
    setLang(lang: string) {
      this.$i18n.locale = lang;
    },
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
            message: this.$t('Logout failed').toString()
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
