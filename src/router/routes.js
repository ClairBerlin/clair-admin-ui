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
        path: 'installations',
        name: 'installations',
        component: () => import('pages/Installations.vue')
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
