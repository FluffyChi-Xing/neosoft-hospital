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
  series: () => [
    {
      name: '苜蓿炒肉',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: '宫保鸡丁',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: '干炒牛河',
      type: 'line',
      stack: 'Total',
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: '葱爆肉',
      type: 'line',
      stack: 'Total',
      data: [320, 332, 301, 334, 390, 330, 320],
    },
    {
      name: '水煮肉片',
      type: 'line',
      stack: 'Total',
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
  ],
  legendData: ['苜蓿炒肉', '宫保鸡丁', '干炒牛河', '葱爆肉', '水煮肉片'],

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

const refreshChart = () => {
  return {
    duration: dateDuration.value,
    done: () => init(), // 惰性函数 不会直接执行 因为可能需要通过使用 duration 获取新的数据后再执行
  }
};

onMounted(() => {
  init()
})

defineExpose({
  refreshChart,
});
</script>

<style scoped></style>
