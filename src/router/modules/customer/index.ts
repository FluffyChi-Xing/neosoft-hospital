import { DEFAULT_LAYOUT } from '../../layout'

const customer = {
  path: '/customer',
  name: 'Customer',
  component: DEFAULT_LAYOUT,
  meta: {
    title: '移动端订单页',
    role: ['user'],
  },
  children: [
    {
      path: '/customer/index',
      name: 'CustomerIndex',
      component: () => import('../../../views/customer/index.vue'),
      meta: {
        // hideInMenu: true, 不需要在菜单中显示
        title: '移动端订单页',
        icon: 'Phone',
      },
    },
  ],
}

export default customer
