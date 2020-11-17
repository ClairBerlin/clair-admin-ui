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
        <img class="clair-logo" src="~assets/clair-logo.svg" />
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

<script>
import de from 'quasar/lang/de';
import en from 'quasar/lang/en-us';

class MenuItem {
  constructor(icon, label, link, separator = false) {
    this.icon = icon;
    this.label = label;
    this.link = link;
    this.separator = separator;
  }
}

const items = [
  new MenuItem('cloud', 'Overview', 'dashboard', true),
  new MenuItem('fa fa-sitemap', 'Organizations', 'orgs'),
  new MenuItem('fa fa-map-marker', 'Locations', 'locations'),
  new MenuItem('fa fa-cube', 'Rooms', 'rooms'),
  new MenuItem('fa fa-thermometer-half', 'Sensors', 'sensors', true),
  new MenuItem('settings', 'Settings', 'settings'),
  new MenuItem('feedback', 'Feedback', 'feedback'),
  new MenuItem('help', 'Help', 'help')
];

export default {
  name: 'MainLayout',
  data() {
    return {
      leftDrawerOpen: true,
      langOptions: [
        { value: 'en', label: 'English' },
        { value: 'de', label: 'Deutsch' }
      ],
      selected: 'dashboard',
      items: items
    };
  },
  methods: {
    setLang(lang) {
      this.$i18n.locale = lang;
      this.$q.lang.set(lang === 'en' ? en : de);
    },
    isLoggedIn() {
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
};
</script>

<style lang="scss" scoped>
.clair-logo {
  height: 50px;
  padding: 5px 10px 5px 10px;
}
.clair-title {
  font-size: 2em;
  padding: 10px;
}
</style>
