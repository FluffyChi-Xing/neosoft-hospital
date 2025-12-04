import $request from '../request'
import { IPage } from '../../types'
import { IEditAppointment } from '../../types/common'

export const queryAppointmentPage = (config: IPage<never>) =>
  $request({ url: '/api/order/page', method: 'POST', data: config })

export const deleteAppointment = (index: string) =>
  $request({ url: '/api/order/delete', method: 'POST', data: { index } })

export const addAppointment = (data: IEditAppointment) =>
  $request({ url: '/api/order/add', method: 'POST', data })

export const updateAppointment = (data: IEditAppointment) =>
  $request({ url: '/api/order/update', method: 'POST', data })

export const finishAppointment = (index: string) =>
  $request({ url: '/api/order/finish', method: 'POST', data: { index } })
