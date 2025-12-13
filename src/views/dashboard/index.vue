<template>
  <div class="flex w-full h-full flex-col gap-4 text-2xl font-bold">
    <PageHeader content="仪表盘">
      <template #action>
        <el-button type="primary" @click="refreshData">刷新</el-button>
        <!--        <el-button v-permission="'doctor'" :type="onLineType" @click="handleOnlineOrOffline">{{-->
        <!--          appStore.getOnlineStatus ? '下线' : '上线'-->
        <!--        }}</el-button>-->
      </template>
    </PageHeader>
    <div class="w-full h-auto flex flex-col">
      <AlertCenter :loading="loading" :notices="notices" />
    </div>
    <div class="w-full h-auto grid grid-cols-5 gap-4">
      <DisplayCard
        :shadow="'never'"
        :icon="icon1"
        :title="'营业额'"
        :suffix="'元'"
        :data="orderStatistic?.turnover ?? 0"
      />
      <DisplayCard
        :shadow="'never'"
        :icon="icon2"
        :title="'库存量'"
        :suffix="'件'"
        :data="orderStatistic?.productCount ?? 0"
      />
      <DisplayCard
        :shadow="'never'"
        :icon="icon3"
        :title="'订单量'"
        :suffix="'单'"
        :data="orderStatistic?.orderCount ?? 0"
      />
      <DisplayCard
        :shadow="'never'"
        :icon="icon4"
        :title="'相较于昨日'"
        :suffix="'%'"
        :data="orderStatistic?.orderGrowth ?? 0"
      />
    </div>
    <div class="w-full h-auto flex-1 grid grid-cols-6 gap-4">
      <div class="w-full h-full flex flex-col col-span-2">
        <OrderStatusCharts />
      </div>
      <div class="w-full h-full flex flex-col col-span-3">
        <StockCountCharts />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import type { IOrderStatistic } from '@/types/common.ts'
import { Message } from '@/utils'
import AlertCenter from './components/AlertCenter.vue'
import { getOrderStatistic } from '@/server/api/order.ts'
import DisplayCard from './components/DisplayCard.vue'
import PageHeader from '../../components/PageHeader.vue'
import StockCountCharts from './components/StockCountCharts.vue'
import OrderStatusCharts from './components/OrderStatusCharts.vue'
import useRequest from '../../hook/request'
import { queryNoticeList } from '@/server/api/notice.ts'
import icon1 from '@/assets/img/dashboard-icon-1.svg'
import icon2 from '@/assets/img/dashboard-icon-2.svg'
import icon3 from '@/assets/img/dashboard-icon-3.svg'
import icon4 from '@/assets/img/dashboard-icon-4.svg'

// const appStore = useAppStore()
// const onLineType = computed(() => {
//   const onLineStatus = appStore.getOnlineStatus
//   return onLineStatus ? 'success' : 'warning'
// })
const orderStatistic = reactive<IOrderStatistic>({
  turnover: 0,
  orderCount: 0,
  productCount: 0,
  orderGrowth: 0,
})

// const handleOnlineOrOffline = () => {
//   isOnLine.value = !isOnLine.value
//   appStore.updateOnlineStatus(isOnLine.value)
//   Notice({
//     type: isOnLine.value ? 'success' : 'warning',
//     message: isOnLine.value ? '已上线' : '已下线',
//   })
// }

const getStatistic = async () => {
  const res = await getOrderStatistic()
  const { code, data, message } = res as unknown as never
  if (code === 200 && data) {
    console.log('获取订单统计成功:', data)
    Object.assign(orderStatistic, data)
  } else {
    console.error('获取订单统计失败:', message)
    Message.warning(message)
  }
}

const refreshData = () => {
  getStatistic()
  queryNoticeList()
}

const defaultNotices = []
const { loading, response: notices } = useRequest(queryNoticeList, defaultNotices)

onMounted(() => {
  getStatistic()
})
</script>

<style scoped></style>
