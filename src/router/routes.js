const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/Login.vue')
      },
      {
        path: '',
        name: 'dashboard',
        component: () => import('pages/Dashboard.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'installations/:id',
        component: () => import('pages/InstallationView.vue')
      }
    ]
  },

  // map all other requests to 404
  {
    path: '*',
    component: () => import('pages/NotFound.vue')
  }
];

export default routes;
