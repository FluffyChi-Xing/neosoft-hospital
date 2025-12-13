import Mock from 'mockjs'

Mock.setup({
  timeout: '600-1000',
})

// 引入所有mock文件
import '../mock/entry'
