<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="row justify-between">
        <div class="row">
          <q-btn
            v-if="isLoggedIn && showDrawer"
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
          <img class="clair-logo" src="~assets/clair-logo.svg" />
          <q-toolbar-title class="clair-title">
            Clair Dashboard
          </q-toolbar-title>
        </div>

        <q-btn-dropdown
          no-caps
          stretch
          round
          flat
          color="white"
          :label="headerLabel"
        >
          <q-list style="min-width: 100px">
            <q-item
              clickable
              v-close-popup
              v-for="ms in memberships"
              :key="ms.orgId"
            >
              <q-item-section
                @click="
                  $router.push({ name: 'graphs', params: { orgId: ms.orgId } })
                "
              >
                {{ ms.orgName }}
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-icon name="groups" />
              </q-item-section>
              <q-item-section @click="$router.push({ name: 'org-management' })">
                {{ $t('main.manage-org') }}
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item-label header>{{ $t('main.manage-account') }}</q-item-label>
            <template v-for="item in accountItems">
              <q-item
                :key="item.name"
                :inset-level="0.5"
                clickable
                v-close-popup
                v-ripple
                @click="openAccountSettings(item.path)"
              >
                <q-item-section>
                  {{ $t(item.nameKey) }}
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-btn-dropdown>

        <div class="row">
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
            v-if="isLoggedIn"
            flat
            dense
            round
            @click="logout()"
            icon="fas fa-sign-out-alt"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="showDrawer"
      v-model="leftDrawerOpen"
      show-if-above
      :width="220"
      :breakpoint="500"
      bordered
    >
      <q-list>
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
        </q-expansion-item> -->
        <q-separator />
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
            {{ $t('main.feedback') }}
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="openFaq()">
          <q-item-section avatar>
            <q-icon name="help" />
          </q-item-section>
          <q-item-section>
            {{ $t('main.help') }}
          </q-item-section>
        </q-item>
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
import { openURL } from 'quasar';

import { mapActions, mapGetters } from 'vuex';

class MenuItem {
  constructor(icon, label, link) {
    this.icon = icon;
    this.label = label;
    this.link = link;
  }
}

const manageItems = [
  new MenuItem('fa fa-sitemap', 'Organizations', 'org-management'),
  new MenuItem('fa fa-map-marker', 'Locations', 'locations'),
  new MenuItem('fa fa-cube', 'Rooms', 'rooms'),
  new MenuItem('fa fa-thermometer-half', 'Sensors', 'sensors'),
  new MenuItem('fa fa-tools', 'Installations', 'installations')
];
const accountItems = [
  {
    nameKey: 'main.account.change_email',
    path: '/accounts/email',
    newTab: true
  },
  {
    nameKey: 'main.account.change_password',
    path: '/accounts/password/change',
    newTab: false
  }
];
const items = [
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
      items: items,
      accountItems: accountItems,
      manageItems: manageItems
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'authuser/isLoggedIn',
      userId: 'authuser/getId',
      memberships: 'authuser/getMemberships',
      membershipByOrgId: 'authuser/getMembershipByOrgId'
    }),
    selectedOrgLabel() {
      let label = this.$t('no_org');
      if (this.$route.name === 'graphs') {
        const selectedOrg = this.membershipByOrgId(this.$route.params.orgId);
        if (selectedOrg) {
          label = selectedOrg.orgName;
        }
      }
      return label;
    },
    headerLabel() {
      if (this.$route.name === 'org-management') {
        return this.$t('main.manage-org');
      } else {
        return this.selectedOrgLabel;
      }
    },
    showDrawer() {
      return this.$route.name !== 'org-management';
    }
  },
  methods: {
    ...mapActions({
      loadOrgsRelated: 'Organization/loadRelated',
      fetchAuthenticatedUser: 'authuser/fetchAuthenticatedUser'
    }),
    openFaq() {
      return openURL('https://clair-berlin.de/faq.html');
    },
    openAccountSettings(path, openInNewTab) {
      const url = window.location.origin + path;
      if (openInNewTab) {
        return openURL(url);
      }
      window.location.href = url;
    },
    async loadUserAndOrgs() {
      await this.fetchAuthenticatedUser();
      let parent = { type: 'users', id: this.userId };
      await this.loadOrgsRelated({ parent });
    },
    setLang(lang) {
      this.$i18n.locale = lang;
      this.$q.lang.set(lang === 'en' ? en : de);
    },
    logout() {
      this.$q.loading.show();
      this.$store
        .dispatch('authuser/logout')
        .then(() => {
          this.$q.cookies.remove('csrftoken');
          window.location.href = window.location.origin + '/accounts/login/';
          return;
        })
        .catch(error => {
          console.log(error);
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: this.$t('main.logout_failure')
          });
        })
        .finally(() => this.$q.loading.hide());
    }
  },
  async mounted() {
    await this.loadUserAndOrgs();
    // Set the default page if none is explicitly given via the URL.
    if (this.$route.name && this.$route.name === 'dashboard') {
      if (this.memberships.length) { // The authenticated is organization member.
        const orgToView = this.memberships[0].orgId;
        this.$router.push({ name: 'graphs', params: { orgId: orgToView } });
      } else { // The authenticated user is not yet member in any organization.
        this.$router.push({ name: 'org-management' });
      }
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
