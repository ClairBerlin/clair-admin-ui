import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }
      // { path: 'dashboard', component: () => import('pages/Dashboard.vue') },
    ]
  },

  // map all other requests to 404
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
