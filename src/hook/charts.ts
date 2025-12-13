import type { Ref, isRef } from 'vue'
import * as ECharts from 'echarts'

type useChartsConfig = {
  el: Ref<HTMLElement>
  options?: Record<string, never>
}

const useCharts = (config: useChartsConfig) => {
  const { el, options } = config

  const init = () => {
    console.log('el', config)
    if (el !== undefined && isRef(el)) {
      const chartInstance = ECharts.init(el.value)
      chartInstance.setOption(options || {})
      return chartInstance
    }
    return null
  }

  return {
    init,
  }
}

export default useCharts
