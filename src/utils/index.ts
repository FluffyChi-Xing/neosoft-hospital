import { ElMessage, ElNotification } from 'element-plus'
import useStorage from '../hook/storage'

export const Message = ElMessage

export const Notice = ElNotification

export const isLogin = () => {
  const { get } = useStorage('local')
  const userInfo = get('userInfo')
  return !!userInfo
}

export const getUserId = () => {
  const { get } = useStorage('local')
  const userInfo = get('userInfo')
  return userInfo?.id || ''
}
