import $request from '../request'

// 后端需要根据 userId 对应的 role 判断是否应该返回 预约和挂号数量
export const queryDashboard = (userId: string) =>
  $request({ url: '/api/dashboard', method: 'POST', data: { userId } })
