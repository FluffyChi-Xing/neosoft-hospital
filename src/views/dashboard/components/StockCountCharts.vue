<template>
  <el-card shadow="never" class="w-full h-full">
    <template #header>
      <div class="w-full h-auto flex gap-4 items-center justify-between">
        <div class="text-[1rem] w-auto flex items-center whitespace-nowrap">库存数量统计</div>
        <el-date-picker
          v-model="dateDuration"
          type="daterange"
          range-separator="到"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          clearable
          class="flex-1"
        />
        <el-button type="primary">重置</el-button>
      </div>
    </template>
    <div ref="chartsRef" class="w-full h-full min-h-[350px] object-contain"></div>
  </el-card>
</template>

<script setup lang="ts">
import useCharts from '@/hook/charts'

type orderChartsProp = {
  legendData: string[]
  series: { data: number[]; name: string; type: string; stack?: string }[]
}
const props = withDefaults(defineProps<Partial<orderChartsProp>>(), {
  series: () => [],
  legendData: () => [],
})
const chartsRef = ref()
const dateDuration = ref<string[]>([])
const { series, legendData } = toRefs(props)

const option = {
  title: {
    text: '库存数量统计',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: [...legendData.value],
  },
  grid: {
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: {
    type: 'value',
  },
  series: [...series.value],
}

const { init } = useCharts({ el: chartsRef, options: option })
const showChart = computed(() => series.value.length > 0 && legendData.value.length > 0)


const refreshChart = () => {
  return {
    duration: dateDuration.value,
    done: () => init(), // 惰性函数 不会直接执行 因为可能需要通过使用 duration 获取新的数据后再执行
  }
}

onMounted(() => {
  init()
})

defineExpose({
  refreshChart,
})
</script>

<style scoped></style>
