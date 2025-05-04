export default [
  {
    path: '/',
    component: () => import('@/pages/index.vue'),
    name: 'home',
  },
  {
    path: '/login',
    component: () => import('@/pages/login.vue'),
    name: 'login',
  },
  {
    path: '/forgot-password',
    component: () => import('@/pages/forgot-password.vue'),
    name: 'forgot-password',
  },
]
