import { DEFAULT_LAYOUT } from '../../layout'

const medicine = {
  path: '/stock',
  name: 'Stock',
  component: DEFAULT_LAYOUT,
  meta: {
    title: '库存',
    role: ['admin']
  },
  children: [
    {
      path: '/stock/index',
      name: 'StockIndex',
      component: () => import('../../../views/stock/index.vue'),
      meta: {
        title: '库存管理',
        icon: 'Box',
      },
    },
  ],
}

export default medicine
