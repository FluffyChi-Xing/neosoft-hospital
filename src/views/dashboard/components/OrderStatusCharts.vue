<template>
  <el-card shadow="never" class="w-full h-full">
    <template #header>
      <div class="w-full h-auto flex gap-4 items-center justify-between">
        <div class="text-[1rem] w-auto flex items-center whitespace-nowrap">订单状态</div>
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
    <div ref="chartsRef" class="w-full h-full min-h-[350px]"></div>
  </el-card>
</template>

<script setup lang="ts">
import useCharts from '@/hook/charts'

type orderChartsProp = {
  data: { value: number; name: string }[]
}
const props = withDefaults(defineProps<Partial<orderChartsProp>>(), {
  data: () => [],
})
const chartsRef = ref()
const dateDuration = ref<string[]>([])
const { data } = toRefs(props)

const option = {
  title: {
    text: '订单状态饼图',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
  },
  series: [
    {
      name: '订单状态',
      type: 'pie',
      radius: '50%',
      data: [...data.value],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
}

const { init } = useCharts({ el: chartsRef, options: option })

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
