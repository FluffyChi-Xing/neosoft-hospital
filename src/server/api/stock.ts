import $request from '../request'
import type { IPage } from '@/types'
import type {
  IEditMedicine,
  InsertStockReqDto,
  IStockAddReqDto,
  IStockUpdateReqDto,
} from '@/types/common.ts'

export const stockStatus: Record<string, string> = {
  available: '可售',
  unavailable: '停售',
  out_of_stock: '缺货',
  reserved: '预留',
  low_stock: '低库存',
}

export const queryMedicinePage = (config: IPage) =>
  $request({ url: '/api/stock/page', method: 'POST', data: config })

export const addMedicine = (data: IEditMedicine) =>
  $request({ url: '/api/stock/add', method: 'POST', data })

export const updateMedicine = (data: IEditMedicine) =>
  $request({ url: '/api/stock/update', method: 'POST', data })

export const deleteMedicine = (index: string) =>
  $request({ url: '/api/stock/delete', method: 'POST', data: { index } })

export const queryStockPage = (page: IPage) =>
  $request({ url: '/stock/queryPage', method: 'POST', data: { ...page } })

export const deleteStock = (skuId: string) =>
  $request({ url: '/stock/delete', method: 'POST', data: { skuId } })

export const updateStock = (data: IStockUpdateReqDto) =>
  $request({ url: '/stock/update', method: 'POST', data })

export const addStockCount = (data: IStockAddReqDto) =>
  $request({ url: '/stock/add', method: 'POST', data })

export const createStock = (data: InsertStockReqDto) =>
  $request({ url: '/stock/create', method: 'POST', data })

export const queryStockDict = () => $request({ url: '/stock/queryDict', method: 'GET' })
