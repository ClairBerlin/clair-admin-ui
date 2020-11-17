const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'login', component: () => import('pages/Login.vue') },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('pages/Dashboard.vue'),
        meta: { requiresAuth: true }
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