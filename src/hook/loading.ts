import * as ramda from 'ramda'


/**
 * @description 使用 ramda.curry 保障 useLoading 的灵活性，可以传递 isLoading
 * @example
 * ```ts
 * const { loading, setLoading, start, done } = useLoading();
 * ```
 *
 * @param {*} isLoading 是否显示 loading
 *
 * @returns {Object} { loading, setLoading, start, done }
 */
const useLoading = ramda.curry(function useLoading(isLoading = true) {
  const loading = ref<boolean>(isLoading);
  const setLoading = (value: boolean) => {
    loading.value = value;
  };
  const start = () => {
    setLoading(true);
  }


  const done = () => {
    setLoading(false);
  }
  return { loading, setLoading, start, done };
});

export default useLoading;
