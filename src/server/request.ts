import axios from 'axios'
import { Message } from '@/utils'
import { PROD_HOST } from '@/__prod__'
import { getToken } from '../utils/token'
import { isProd } from '@/utils/env'

// 存储所有进行中的请求
const pendingRequests = new Map<string, AbortController>()

// 生成请求的唯一标识
const generateRequestKey = (config: never) => {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

// 取消所有进行中的请求
export const cancelAllPendingRequests = () => {
  pendingRequests.forEach((controller, key) => {
    controller.abort()
    pendingRequests.delete(key)
  })
}

// 取消指定的请求
export const cancelRequest = (key: string) => {
  const controller = pendingRequests.get(key)
  if (controller) {
    controller.abort()
    pendingRequests.delete(key)
  }
}

const $request = axios.create({
  // 在生产环境使用相对路径，通过 Vercel 代理
  // 在开发环境直接访问后端
  baseURL: isProd ? '/api/v1' : PROD_HOST,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  },
})

$request.interceptors.request.use((request) => {
  if (!request.method) {
    request.method = 'get'
  }
  if (!request.headers['Authorization']) {
    request.headers['Authorization'] = 'Bearer your-token'
  }

  // 为每个请求创建 AbortController
  const controller = new AbortController()
  request.signal = controller.signal

  // 生成请求标识并存储
  const requestKey = generateRequestKey(request as unknown as never)

  // 如果已存在相同的请求，取消之前的
  if (pendingRequests.has(requestKey)) {
    const oldController = pendingRequests.get(requestKey)
    oldController?.abort()
  }

  pendingRequests.set(requestKey, controller)

  return request
})

$request.interceptors.response.use(
  (response) => {
    // 请求成功后，从 pending 列表中移除
    const requestKey = generateRequestKey(response.config as unknown as never)
    pendingRequests.delete(requestKey)

    const { status } = response
    console.log('response status', status)
    // 检查业务状态码，200 或 201 都表示成功
    if (status === 200 || status === 201) {
      return response.data
    } else {
      Message.error('请求失败', response.data.message)
      console.error('请求失败:', response.data.message)
      return Promise.reject(new Error(response.data.message || '请求失败'))
    }
  },
  (error) => {
    // 请求失败后，从 pending 列表中移除
    if (error.config) {
      const requestKey = generateRequestKey(error.config as unknown as never)
      pendingRequests.delete(requestKey)
    }

    // 如果是取消请求，不显示错误提示
    if (axios.isCancel(error)) {
      console.log('请求已取消:', error.message)
      return Promise.reject(error)
    }

    // 处理 HTTP 错误（如 404, 500 等）
    const message = error.response?.data?.message || error.message || '网络请求失败'
    Message.error('请求失败', message)
    console.error('请求失败:', error)
    return Promise.reject(error)
  },
)

export default $request
