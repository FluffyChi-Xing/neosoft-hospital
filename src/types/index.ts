export type IPage = {
  current: number
  size: number
  queryBean?: Record<string, never>
}

export type IKVType = {
  key: string
  value: string
}

export type IPageVo<T> = {
  current: number
  size: number
  total: number
  records: T[]
}
