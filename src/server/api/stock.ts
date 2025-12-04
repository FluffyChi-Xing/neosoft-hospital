import $request from '../request'
import { IPage } from '../../types'
import { IEditMedicine } from '../../types/common'

export const queryMedicinePage = (config: IPage<never>) =>
  $request({ url: '/api/stock/page', method: 'POST', data: config })

export const addMedicine = (data: IEditMedicine) =>
  $request({ url: '/api/stock/add', method: 'POST', data })

export const updateMedicine = (data: IEditMedicine) =>
  $request({ url: '/api/stock/update', method: 'POST', data })

export const deleteMedicine = (index: string) =>
  $request({ url: '/api/stock/delete', method: 'POST', data: { index } })
