import $request from '../request'
import { IUserLogin, IUserUpdateReqDto } from '../../types/common'

export const getUserDetail = (userId: number) =>
  $request({ url: `/user/getUserDetail?.userId=${userId}`, method: 'GET' })

export const updateUser = (data: IUserUpdateReqDto) =>
  $request({ url: '/user/updateUserInfo', method: 'POST', data })

export const userLogin = (data: IUserLogin) =>
  $request({ url: '/user/login', method: 'POST', data })
