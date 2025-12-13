// 使用范例
import $request from '../request'

export const queryOrderList = () => $request({ url: '/api/queryOrderList', method: 'GET' })
