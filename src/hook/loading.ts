import * as ramda from 'ramda'



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
