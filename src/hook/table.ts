import * as ramda from 'ramda'
import { Message } from '@/utils'
import type { IPage } from '@/types'

export type ITableConfig<T extends Record<string, never>> = {
  fetchData: (params?: Record<string, never>) => Promise<T[]>
  searchData?: (params?: Record<string, never>) => Promise<T[]>
}

const useTable = ramda.curry(function useTable(config: ITableConfig<never> = {}) {
  const { fetchData, searchData } = config

  const getData = async (params?: Record<string, never>) => {
    const { code, data, message } = await fetchData(params)
    if (code === 200) {
      const { resultList } = data
      // console.log('getData', resultList)
      return resultList || []
    } else {
      Message.warning(message)
      return []
    }
  }

  const handleSearch = async (val: string) => {
    if (searchData) {
      const queryBean = {
        property: val,
      }
      const { code, data, message } = await searchData(queryBean)
      if (code === 200) {
        const { resultList } = data
        return resultList || []
      } else {
        Message.warning(message)
        return []
      }
    }
    return []
  }

  const getPageData = async (params: IPage) => {
    const { current, size } = params
    const queryBean = {
      current,
      size,
    }
    return await getData(queryBean)
  }

  const filterData = async (params?: Record<string, never>) => {
    if (!params) return
    return await getData(params)
  }

  const filterPageData = async (params?: IPage<Record<string, never>>) => {
    if (!params) return
    const { current, size, queryBean } = params
    const query = {
      current,
      size,
      queryBean: {
        ...queryBean,
      },
    }
    return await getPageData(queryBean)
  }

  const onSearch = async (val: string) => {
    if (searchData && val.trim() !== '') {
      return await handleSearch(val)
    } else {
      Message.warning('请输入搜索内容')
      return []
    }
  }

  return {
    getPageData,
    filterData,
    getData,
    filterPageData,
    onSearch,
  }
})

export default useTable
