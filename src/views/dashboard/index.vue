<template>
  <div class="flex w-full h-full flex-col gap-4 text-2xl font-bold">
    <PageHeader content="仪表盘">
      <template #action>
        <el-button type="primary" @click="getData">刷新</el-button>
        <el-button v-permission="'doctor'" :type="onLineType" @click="handleOnlineOrOffline">{{
          appStore.getOnlineStatus ? '下线' : '上线'
        }}</el-button>
      </template>
    </PageHeader>
    <div class="w-full h-auto grid grid-cols-5 gap-4">
      <DisplayCard
        :shadow="'never'"
        :icon="icon1"
        :title="'营业额'"
        :data="dataList?.patientCount ?? 0"
      />
      <DisplayCard
        :shadow="'never'"
        :icon="icon2"
        :title="'库存量'"
        :data="dataList?.appointmentCount ?? 0"
      />
      <DisplayCard
        :shadow="'never'"
        :icon="icon3"
        :title="'订单量'"
        :data="dataList?.medicineCount ?? 0"
      />
      <DisplayCard
        :shadow="'never'"
        :icon="icon4"
        :title="'相较于昨日'"
        :data="dataList?.doctorCount ?? 0"
      />
    </div>
    <div class="w-full h-auto flex-1 grid grid-cols-6 gap-4">
      <div class="w-full h-full flex flex-col col-span-2">
        <OrderStatusCharts />
      </div>
      <div class="w-full h-full flex flex-col col-span-3">
        <StockCountCharts />
      </div>
      <div class="w-full h-full flex flex-col">
        <AlertCenter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IDashboard } from '@/types/common'
import { computed, onMounted } from 'vue'
import { queryDashboard } from '@/server/api/dashboard'
import useUserStore from '@/store/user'
import DisplayCard from '@/views/dashboard/components/DisplayCard.vue'
import PageHeader from '@/components/PageHeader.vue'
import { Notice } from '@/utils'
import useAppStore from '@/store/app'
import OrderStatusCharts from '@/views/dashboard/components/OrderStatusCharts.vue'
import StockCountCharts from '@/views/dashboard/components/StockCountCharts.vue'
import AlertCenter from '@/views/dashboard/components/AlertCenter.vue'

const dataList = ref<IDashboard | null>(null)
const isLoading = ref<boolean>(false)
const userStore = useUserStore()
const appStore = useAppStore()
const icon1 = 'src/assets/img/dashboard-icon-1.svg'
const icon2 = 'src/assets/img/dashboard-icon-2.svg'
const icon3 = 'src/assets/img/dashboard-icon-3.svg'
const icon4 = 'src/assets/img/dashboard-icon-4.svg'
const isOnLine = ref<boolean>(false)
const onLineType = computed(() => {
  const onLineStatus = appStore.getOnlineStatus
  return onLineStatus ? 'success' : 'warning'
})

const getData = async () => {
  isLoading.value = true
  const { id } = userStore.getUser ?? {}
  const res: never = await queryDashboard(id ?? '')
  const { status, data, message } = res
  isLoading.value = false
  if (status === 200) {
    dataList.value = data
    appStore.updateDashboardData(data)
  } else {
    console.error('获取数据失败:', message)
    dataList.value = null
  }
}

const handleOnlineOrOffline = () => {
  isOnLine.value = !isOnLine.value
  appStore.updateOnlineStatus(isOnLine.value)
  Notice({
    type: isOnLine.value ? 'success' : 'warning',
    message: isOnLine.value ? '已上线' : '已下线',
  })
}

onMounted(() => {
  if (appStore.isDashboardEmpty) {
    getData()
  } else {
    dataList.value = appStore.getDashboardData
  }
})
</script>

<style scoped>

</style>
