import setupMock, { successResponseWrap } from '../utils/setup-mock'
import Mock from 'mockjs'

const getMedicinePage = (config: IPage<never>): IMedicine[] => {
  const records: IMedicine[] = []
  const { index, size } = config
  for (let i = 0; i < size; i++) {
    records.push({
      id: Mock.mock('@id'),
      name: Mock.mock('@cname'),
      specification: Mock.mock('@cparagraph(1, 2)'),
      unit: Mock.mock('@cword(1, 2)'),
      price: Mock.mock('@float(10, 100, 2, 2)'),
      stock: Mock.mock('@integer(10, 100)'),
      createAt: Mock.mock('@datetime'),
      updateAt: Mock.mock('@datetime'),
      status: Mock.mock('@integer(0, 1)'),
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
    Mock.mock(new RegExp('/api/stock/page'), 'post', (options) => {
      const config = JSON.parse(options.body)
      const resultList = getMedicinePage(config)
      return successResponseWrap({ resultList })
    })

    Mock.mock(new RegExp('/api/stock/add'), 'post', (options) => {
      const data = JSON.parse(options.body) as IEditMedicine
      return successResponseWrap({ message: '新增药品成功', status: 200 })
    })

    Mock.mock(new RegExp('/api/stock/update'), 'post', (options) => {
      const data = JSON.parse(options.body) as IEditMedicine
      return successResponseWrap({ message: '更新药品成功', status: 200 })
    })

    Mock.mock(new RegExp('/api/stock/delete'), 'post', (options) => {
      const index = JSON.parse(options.body)?.index
      return successResponseWrap({ message: '删除药品成功', status: 200 })
    })
  },
})
