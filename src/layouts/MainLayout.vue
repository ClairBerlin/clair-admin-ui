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
      @hook:mounted="loadUserOrgs()"
      v-model="leftDrawerOpen"
      show-if-above
      :width="220"
      :breakpoint="500"
      bordered
    >
      <div class="q-pa-md row flex-center">
        <q-btn-dropdown :label="toLabel(selectedOrg)" v-if="orgs.length > 1">
          <q-list style="min-width: 100px">
            <q-item
              clickable
              v-close-popup
              v-for="org in orgs"
              :key="org.id"
              @click="selectedOrg = org"
            >
              <q-item-section>
                <q-item-label>{{ org.attributes.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn disable :label="toLabel(selectedOrg)" v-else />
      </div>

      <q-separator />
      <q-list>
        <q-expansion-item
          key="account"
          :label="$t('My Account')"
          icon="fa fa-user"
          default-closed
        >
          <template v-for="item in accountItems">
            <q-item
              :key="item.name"
              :inset-level="0.5"
              clickable
              v-ripple
              @click="openAccountSettings(item.path)"
            >
              <q-item-section>
                {{ $t(item.name) }}
              </q-item-section>
            </q-item>
          </template>
        </q-expansion-item>
        <q-separator />
        <!-- TODO: add once the sites the menu items point to exist -->
        <!-- <q-expansion-item
          key="manage"
          :label="$t('Manage')"
          icon="settings"
          default-opened
        >
          <template v-for="(item, index) in manageItems">
            <q-item
              :inset-level="0.5"
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
          </template>
        </q-expansion-item>
        <q-separator /> -->
        <q-item
          tag="a"
          href="mailto:kontakt@clair-berlin.de"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon name="feedback" />
          </q-item-section>
          <q-item-section>
            {{ $t('Feedback') }}
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="openFaq()">
          <q-item-section avatar>
            <q-icon name="help" />
          </q-item-section>
          <q-item-section>
            {{ $t('Help') }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view :selectedOrg="selectedOrg" />
    </q-page-container>
  </q-layout>
</template>

<script>
import de from 'quasar/lang/de';
import en from 'quasar/lang/en-us';
import { openURL } from 'quasar';

import { mapActions, mapGetters } from 'vuex';

class MenuItem {
  constructor(icon, label, link) {
    this.icon = icon;
    this.label = label;
    this.link = link;
  }
}

const accountItems = [
  { name: 'Manage Email', path: '/accounts/email' },
  { name: 'Change Password', path: '/accounts/password/change' }
];

const manageItems = [
  new MenuItem('fa fa-sitemap', 'Organizations', 'organizations'),
  new MenuItem('fa fa-map-marker', 'Locations', 'locations'),
  new MenuItem('fa fa-cube', 'Rooms', 'rooms'),
  new MenuItem('fa fa-thermometer-half', 'Sensors', 'sensors'),
  new MenuItem('fa fa-tools', 'Installations', 'installations')
];
const items = [
  new MenuItem('feedback', 'Feedback', 'feedback'),
  new MenuItem('help', 'Help', 'help')
];

const orgs = [];
const selectedOrg = null;

export default {
  name: 'MainLayout',
  data() {
    return {
      leftDrawerOpen: true,
      langOptions: [
        { value: 'en', label: 'English' },
        { value: 'de', label: 'Deutsch' }
      ],
      selected: '-',
      items: items,
      accountItems: accountItems,
      manageItems: manageItems,
      orgs: orgs,
      selectedOrg: selectedOrg
    };
  },
  computed: {
    ...mapGetters({
      getUserById: 'users/byId',
      getOrgsRelated: 'organizations/related'
    })
  },
  methods: {
    ...mapActions({
      loadUserById: 'users/loadById',
      loadOrgsRelated: 'organizations/loadRelated'
    }),
    openFaq() {
      return openURL('https://clair-berlin.de/faq.html');
    },
    openAccountSettings(path) {
      return openURL(window.location.host + path);
    },
    loadUserOrgs: async function() {
      const uid = await this.$store.dispatch('user/getUserId');
      await this.loadUserById({ id: uid });
      let parent = { type: 'users', id: uid };
      await this.loadOrgsRelated({ parent });
      const orgs = this.getOrgsRelated({ parent });
      this.orgs = orgs;
      this.selectedOrg = orgs[0];
    },
    toLabel(org, maxLength = 15) {
      if (!org) {
        return '-';
      }
      if (org.attributes.name.length > maxLength) {
        return org.attributes.name.substring(0, maxLength) + ' ...';
      }
      return org.attributes.name;
    },
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
