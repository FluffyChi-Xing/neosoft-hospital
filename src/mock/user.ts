import setupMock, { successResponseWrap } from '../utils/setup-mock'
import { DEFAULT_USER } from '../const'
import { IEditUser, IUserLogin } from '../types/common'
import Mock from 'mockjs'

const getUserDetail = (userId: string) => {
  if (userId === '1111') {
    return DEFAULT_USER
  } else {
    return null
  }
}

const updateUserDetail = (data: IEditUser) => {
  return '更新成功'
}

const userLogin = (data: IUserLogin) => {
  return DEFAULT_USER
}

setupMock({
  setup: () => {
    Mock.mock(new RegExp('/api/user/detail'), 'post', (options) => {
      const userId = JSON.parse(options.body)?.userId
      return successResponseWrap(getUserDetail(userId as string))
    })

    Mock.mock(new RegExp('/api/user/update'), 'post', (options) => {
      const data = JSON.parse(options.body) as IEditUser
      return successResponseWrap(updateUserDetail(data))
    })

    Mock.mock(new RegExp('/api/user/login'), 'post', (options) => {
      const data = JSON.parse(options.body) as IUserLogin
      return successResponseWrap(userLogin(data))
    })
  },
})
