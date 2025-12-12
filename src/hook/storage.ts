import * as ramda from 'ramda';


/**
 * @description 统一处理 localStorage 和 sessionStorage
 * @param {*} source local | session
 * @example
 * ```ts
 * const { get, set, clear, remove } = useStorage('local');
 * ```
 *
 * @returns {Object} { get, set, clear, remove }
 */
const useStorage = ramda.curry(function useStorage(source = 'local') {
  const storage = source === 'local' ? localStorage : sessionStorage;
  const get = (key: string) => {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : null;
  };
  const set = (key: string, value: never) => {
    storage.setItem(key, JSON.stringify(value));
  };
  const remove = (key: string) => {
    storage.removeItem(key);
  };
  const clear = () => {
    storage.clear();
  };
  return { get, set, remove, clear };
});

export default useStorage;
