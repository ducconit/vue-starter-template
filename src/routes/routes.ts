export default [
  {
    path: '/',
    component: () => import('@/pages/index.vue'),
    name: 'home',
    meta: {
      layout: 'AppLayout',
      auth: true,
    },
  },
  {
    path: '/ecommerce',
    component: () => import('@/pages/ecommerce.vue'),
    name: 'ecommerce',
    meta: {
      layout: 'AppLayout',
      auth: true,
    },
  },
  {
    path: '/crypto',
    component: () => import('@/pages/crypto.vue'),
    name: 'crypto',
    meta: {
      layout: 'AppLayout',
      auth: true,
    },
  },
  {
    path: '/user-management',
    component: () => import('@/pages/user-management.vue'),
    name: 'user-management',
    meta: {
      layout: 'AppLayout',
      auth: true,
    },
  },
  {
    path: '/user-management/edit/:id',
    component: () => import('@/pages/user-management-edit.vue'),
    name: 'user-management-edit',
    meta: {
      layout: 'AppLayout',
      auth: true,
    },
  },
  {
    path: '/login',
    component: () => import('@/pages/login.vue'),
    name: 'login',
    meta: {
      guest: true,
    },
  },
  {
    path: '/forgot-password',
    component: () => import('@/pages/forgot-password.vue'),
    name: 'forgot-password',
    meta: {
      guest: true,
    },
  },
  {
    path: '/signup',
    component: () => import('@/pages/signup.vue'),
    name: 'signup',
    meta: {
      guest: true,
    },
  },
  {
    // callback route
    path: '/:path(.*)*',
    component: () => import('@/pages/callback.vue'),
    name: 'callback',
  },
]
