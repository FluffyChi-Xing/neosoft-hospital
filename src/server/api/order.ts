import $request from '../request'
import { IPage } from '../../types'
import { IEditAppointment, IOrderCreateReqDto, IOrderStatusUpdateReqDto } from '../../types/common'

// export const queryAppointmentPage = (config: IPage<never>) =>
//   $request({ url: '/api/order/page', method: 'POST', data: config })

export const deleteAppointment = (index: string) =>
  $request({ url: '/api/order/delete', method: 'POST', data: { index } })

export const addAppointment = (data: IEditAppointment) =>
  $request({ url: '/api/order/add', method: 'POST', data })

export const updateAppointment = (data: IEditAppointment) =>
  $request({ url: '/api/order/update', method: 'POST', data })

export const finishAppointment = (index: string) =>
  $request({ url: '/api/order/finish', method: 'POST', data: { index } })

export const queryOrderPage = (params: IPage) =>
  $request({ url: '/order/page', method: 'POST', data: { ...params } })

export const cancelOrder = (data: IOrderStatusUpdateReqDto) =>
  $request({ url: '/order/cancel', method: 'POST', data })

export const confirmOrder = (data: IOrderStatusUpdateReqDto) =>
  $request({ url: '/order/confirm', method: 'POST', data })

export const finishOrder = (data: IOrderStatusUpdateReqDto) =>
  $request({ url: '/order/finish', method: 'POST', data })

export const deleteOrder = (data: IOrderStatusUpdateReqDto) =>
  $request({ url: '/order/delete', method: 'POST', data })

export const createOrder = (data: IOrderCreateReqDto) =>
  $request({ url: '/order/create', method: 'POST', data })
