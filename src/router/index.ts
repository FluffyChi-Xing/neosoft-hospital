import { createRouter, createWebHashHistory } from 'vue-router'
import { appRoutes } from './const'
import 'nprogress/nprogress.css'
import { createRouteGuard } from './utils'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/login/index.vue'),
      meta: {
        title: '登录页',
      },
    },
    ...appRoutes,
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

// console.log(appRoutes);

createRouteGuard(router)

export default router
