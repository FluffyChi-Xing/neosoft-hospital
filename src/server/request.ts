import axios from 'axios'
import { Message } from '@/utils'
import { PROD_HOST } from '@/__prod__'
import { getToken } from '../utils/token'

const $request = axios.create({
  // baseURL: isProd ? PROD_HOST : import.meta.env.VITE_API_BASE_URL,
  baseURL: PROD_HOST,
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
  return request
})

$request.interceptors.response.use(
  (response) => {
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
    // 处理 HTTP 错误（如 404, 500 等）
    const message = error.response?.data?.message || error.message || '网络请求失败'
    Message.error('请求失败', message)
    console.error('请求失败:', error)
    return Promise.reject(error)
  },
)

export default $request
