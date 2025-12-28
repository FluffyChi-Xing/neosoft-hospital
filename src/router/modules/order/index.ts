import { DEFAULT_LAYOUT } from '../../layout'

const appointment = {
  path: '/order',
  name: 'Order',
  component: DEFAULT_LAYOUT,
  meta: {
    title: '订单管理',
    role: ['admin']
  },
  children: [
    {
      path: '/order/index',
      name: 'OrderIndex',
      component: () => import('../../../views/order/index.vue'),
      meta: {
        // hideInMenu: true, 不需要在菜单中显示
        title: '订单管理',
        icon: 'ShoppingCart',
      },
    },
  ],
}

export default appointment
