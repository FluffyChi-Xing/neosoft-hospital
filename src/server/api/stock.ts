import $request from '../request'
import { IPage } from '../../types'
import { IEditMedicine, IStockAddReqDto, IStockUpdateReqDto } from '../../types/common'

export const queryMedicinePage = (config: IPage<never>) =>
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
