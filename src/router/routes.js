const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('pages/Dashboard.vue')
      },
      {
        path: 'organization',
        name: 'organization',
        component: () => import('pages/Organization.vue')
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
