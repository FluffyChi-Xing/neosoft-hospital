export type IPage<T extends Record<never, never> = Record<never, never>> = {
  current: number
  size: number
  total?: number;
  queryBean?: T
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
