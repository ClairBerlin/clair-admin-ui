const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: ':orgId/graphs',
        name: 'graphs',
        component: () => import('pages/Graphs.vue')
      },
      {
        path: 'org-management',
        name: 'org-management',
        component: () => import('pages/OrgManagement.vue')
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
