import setupMock, { successResponseWrap } from '../utils/setup-mock'
import { IDashboard } from '../types/common'
import Mock from 'mockjs'

const queryDashboard = (userId: string) => {
  let result: IDashboard = {}
  if (userId === '1111') {
    result = {
      patientCount: Mock.mock('@integer(100, 1000)'),
      appointmentCount: Mock.mock('@integer(100, 1000)'),
      medicineCount: Mock.mock('@integer(100, 1000)'),
      doctorCount: Mock.mock('@integer(100, 1000)'),
      registrationCount: Mock.mock('@integer(100, 1000)'),
    }
  } else {
    result = {
      patientCount: Mock.mock('@integer(100, 1000)'),
      medicineCount: Mock.mock('@integer(100, 1000)'),
      doctorCount: Mock.mock('@integer(100, 1000)'),
    }
  }
  return result
}

setupMock({
  setup: () => {
    Mock.mock(new RegExp('/api/dashboard'), 'post', (options) => {
      const userId = JSON.parse(options.body)?.userId
      return successResponseWrap(queryDashboard(userId as string))
    })
  },
})
