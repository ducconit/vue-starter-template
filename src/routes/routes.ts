export default [
  {
    path: '/',
    component: () => import('@/pages/index.vue'),
    name: 'index',
  },
  {
    path: '/login',
    component: () => import('@/pages/login.vue'),
    name: 'login',
  },
]
