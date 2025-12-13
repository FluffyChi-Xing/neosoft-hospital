import type { userStoreType } from '../store/user/types'
import type { IKVType } from '@/types'

export const PAGE_HEADER_CONTENT = '开放原子餐饮管理系统'

export const DISEASE_LIST = [
  '高血压',
  '糖尿病',
  '冠心病',
  '脑卒中',
  '慢性阻塞性肺病',
  '慢性肾病',
  '慢性肝病',
  '慢性胃病',
  '慢性肠炎',
  '慢性胆囊炎',
]

export const DEFAULT_USER: userStoreType = {
  id: 1,
  username: '默认用户',
  password: '123456',
  token: 'ejh-token',
  role: 'doctor',
  createAt: '2023-01-01 00:00:00',
  updateAt: '2023-01-01 00:00:00',
  email: '',
  status: '',
  isDelete: false
}

export const DEFAULT_AVATAR = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'

// // 0 已挂号 1 已完成 2 退号
// export const REGISTER_STATUS: IKVType[] = [
//   { key: '已挂号', value: 0 },
//   { key: '已完成', value: 1 },
//   { key: '退号', value: 2 },
// ]
//
// // 0停售 1正常
// export const MEDICINE_STATUS: IKVType[] = [
//   { key: '停售', value: 0 },
//   { key: '正常', value: 1 },
// ]
//
// // 0 待就诊 1 已完成 2 已取消
// export const APPOINTMENT_STATUS: IKVType[] = [
//   { key: '待就诊', value: 0 },
//   { key: '已完成', value: 1 },
//   { key: '已取消', value: 2 },
// ]

// doctor - 医生 patient - 患者
export const USER_ROLE: IKVType[] = [
  { key: '普通用户', value: 'user' },
  { key: '管理员', value: 'admin' },
]
