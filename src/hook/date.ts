import * as ramda from 'ramda'
import { dayjs } from 'element-plus'

const useDateFormat = ramda.curry(function useDateFormat(index?: string, formatStr = 'YYYY-MM-DD') {
  const getYMD = (date: Date) => {
    const target = index ? index : date
    return dayjs(target).format(formatStr === 'YYYY-MM-DD' ? 'YYYY-MM-DD' : formatStr)
  }

  const getYMDHMS = (date: Date) => {
    const target = index ? index : date
    return dayjs(target).format('YYYY-MM-DD HH:mm:ss')
  }

  const format = (date: Date) => {
    const target = index ? index : date
    return dayjs(target).format(formatStr)
  }

  return {
    getYMD,
    getYMDHMS,
    format,
  }
})

export default useDateFormat
