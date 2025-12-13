import { DEFAULT_LAYOUT } from '../../layout'

const app = {
  path: '/',
  name: 'Index',
  component: DEFAULT_LAYOUT,
  meta: {
    title: '首页',
  },
  children: [
    {
      path: '/index',
      name: 'IndexPage',
      component: () => import('../../../views/index.vue'),
      meta: {
        // hideInMenu: true, 不需要在菜单中显示
        title: '首页',
        icon: 'House',
      },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../../../views/dashboard/index.vue'),
      meta: {
        title: '仪表盘',
        icon: 'Odometer',
      },
    },
  ],
}

export default app
