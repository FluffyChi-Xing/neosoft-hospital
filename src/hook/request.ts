import { AxiosResponse } from 'axios'
import * as ramda from 'ramda'
import { UnwrapRef } from 'vue'

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
  const { loading, setLoading } = useLoading(isLoading);
  const response = ref<T>(defaultValue);
  api()
    .then((res) => {
      response.value = res.data as unknown as UnwrapRef<T>;
    })
    .finally(_ => {
      setLoading(false);
    });
  return { loading, response };
})

export default useRequest;
