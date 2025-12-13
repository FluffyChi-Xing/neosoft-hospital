import * as ramda from 'ramda'
import type { UnwrapRef } from 'vue'
import useLoading from './loading'
import { AxiosResponse } from 'axios'


export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}


/**
 * @description 使用 ramda.curry 保障 useRequest 的灵活性，可以传递默认值和 isLoading
 * @example
 * ```ts
 * const { loading, response: data } = useRequest(api)(defaultValue);
 * ```
 *
 * @param {*} api 请求函数
 * @param {*} defaultValue 默认值
 * @param {*} isLoading 是否显示 loading
 *
 * @returns {Object} { loading, response }
 */
const useRequest = ramda.curry(function useRequest<T>(
  api: () => Promise<AxiosResponse<HttpResponse>>,
  defaultValue = [] as unknown as T,
  isLoading = true,
) {
  const { loading, done } = useLoading(isLoading)
  const response = ref<T>(defaultValue)
  api()
    .then((res) => {
      response.value = res.data as unknown as UnwrapRef<T>
    })
    .finally(() => {
      done()
    })
  return { loading, response } as unknown as { loading: Ref<boolean>, response: UnwrapRef<T> }
})

export default useRequest
