import { DEFAULT_LAYOUT } from '../../layout'

const user = {
  path: '/user',
  name: 'User',
  component: DEFAULT_LAYOUT,
  meta: {
    title: '用户管理',
    permission: ['doctor'],
  },
  children: [
    {
      path: '/user/index',
      name: 'UserIndex',
      component: () => import('../../../views/user/index.vue'),
      meta: {
        title: '用户管理',
        icon: 'User',
      },
    },
  ],
}

export default user
