import setupMock, { successResponseWrap } from '../utils/setup-mock'
import Mock from 'mockjs'
import { IAppointment } from '../types/common'

const getAppointmentPage = (config: IPage<never>) => {
  const records: IAppointment[] = []
  const { index, size } = config
  // _newList 通过 index 和 size 生成模拟数据
  for (let i = 0; i < size; i++) {
    records.push({
      id: Mock.mock('@id'),
      patientId: Mock.mock('@id'),
      appointmentTime: Mock.mock('@datetime'),
      status: Mock.mock('@integer(0, 2)'),
      createTime: Mock.mock('@datetime'),
      updateTime: Mock.mock('@datetime'),
    })
  }
  return {
    index: index,
    size: size,
    records: records,
    total: index * size,
  }
}

setupMock({
  setup: () => {
    Mock.mock(new RegExp('/api/order/page'), 'post', (options) => {
      const config = JSON.parse(options.body)
      const resultList = getAppointmentPage(config)
      return successResponseWrap({ resultList })
    })

    Mock.mock(new RegExp('/api/order/add'), 'post', (options) => {
      const data = JSON.parse(options.body)
      return successResponseWrap({ message: '新增预约成功', status: 200 })
    })

    Mock.mock(new RegExp('/api/order/update'), 'post', (options) => {
      const data = JSON.parse(options.body)
      return successResponseWrap({ message: '更新预约成功', status: 200 })
    })

    Mock.mock(new RegExp('/api/order/delete'), 'post', (options) => {
      const data = JSON.parse(options.body)
      return successResponseWrap({ message: '删除预约成功', status: 200 })
    })

    Mock.mock(new RegExp('/api/order/finish'), 'post', (options) => {
      const data = JSON.parse(options.body)
      return successResponseWrap({ message: '接诊成功', status: 200 })
    })
  },
})
