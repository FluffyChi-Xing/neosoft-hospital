<template>
  <div class="w-full h-full flex flex-col gap-4">
    <PageHeader content="订单管理">
      <template #action>
        <el-button type="primary" @click="handleOrderAdd">下单</el-button>
        <el-button type="warning" @click="refreshData">刷新</el-button>
      </template>
    </PageHeader>
    <div class="w-full h-full flex flex-col gap-4">
      <div class="w-full h-full flex">
        <el-card shadow="never" class="w-full h-fit">
          <el-table v-loading="loading" :data="dataList" border stripe fit>
            <!-- order -->
            <el-table-column prop="id" label="ID" />
            <el-table-column prop="uuid" width="100" show-overflow-tooltip label="uuid" />
            <el-table-column prop="name" width="200" label="订单名称">
              <template #default="{ row }">
                <el-tag v-for="(item, index) in row.name" :key="index" size="small">
                  {{ item.trim() }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="user id" prop="userId" />
            <el-table-column prop="skuId" width="200" label="sku ids">
              <template #default="{ row }">
                <el-tag v-for="(item, index) in row.skuId" :key="index" size="small">
                  {{ item.trim() }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="地址" prop="address" />
            <el-table-column label="总价" prop="totalPrice">
              <template #default="{ row }"> ￥{{ row.totalPrice }} </template>
            </el-table-column>
            <el-table-column label="状态" prop="status">
              <template #default="{ row }">
                <el-tag>{{ orderStatus[row.status] ?? '未知' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createAt" label="创建时间">
              <template #default="{ row }">
                {{ getYMD(row.createAt) }}
              </template>
            </el-table-column>
            <el-table-column prop="updateAt" label="更新时间">
              <template #default="{ row }">
                {{ getYMD(row.updateAt) }}
              </template>
            </el-table-column>
            <el-table-column width="300" label="操作" fixed="right">
              <template #default="{ row }">
                <div class="w-full h-auto gap-4 flex items-center justify-center">
                  <el-button
                    :disabled="canConfirm(row.status)"
                    type="success"
                    size="small"
                    @click="handleOrderConfirm(row?.uuid)"
                    >确认</el-button
                  >
                  <el-button
                    :disabled="canFinished(row.status)"
                    type="warning"
                    size="small"
                    @click="handleOrderFinish(row?.uuid)"
                    >完成</el-button
                  >
                  <el-button
                    :disabled="canCancel(row.status)"
                    type="primary"
                    size="small"
                    @click="handleOrderCancel(row?.uuid)"
                    >取消</el-button
                  >
                  <el-popconfirm title="确定删除该预约吗？" @confirm="handleOrderDelete(row?.uuid)">
                    <template #reference>
                      <el-button :disabled="canDelete(row.status)" type="danger" size="small"
                        >删除</el-button
                      >
                    </template>
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty description="暂无订单" />
            </template>
          </el-table>
        </el-card>
      </div>
      <div class="w-full flex-1 justify-end items-center flex">
        <el-pagination
          layout="prev, pager, next"
          :total="page.total"
          :current-page="page.current"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
  <EditOrderModal v-model:show="showModal" :mode="modalMode" @submit="refreshData" />
</template>

<script setup lang="ts">
import type { IOrderResDto, IOrderStatusUpdateReqDto, IResponse } from '@/types/common'
import useLoading from '@/hook/loading'
import useDateFormat from '@/hook/date'
import useStorage from '@/hook/storage'
import type { IPage, IPageVo } from '@/types'
import {
  cancelOrder,
  confirmOrder,
  finishOrder,
  queryOrderPage,
  deleteOrder,
} from '@/server/api/order.ts'
import { Message } from '@/utils'
import EditOrderModal from './components/EditOrderModal.vue'
import PageHeader from '../../components/PageHeader.vue'

const modalMode = ref<'add' | 'edit'>('add')
const dataList = ref<IOrderResDto[]>([])
const showModal = ref<boolean>(false)
const orderStatus: Record<string, string> = {
  COMPLETED: '已完成',
  PAID: '已支付',
  CANCELLED: '已取消',
  CONFIRMED: '已确认',
  PENDING: '待确认',
}
const currentRow = ref<IOrderResDto | null>(null)
const { loading, start, done } = useLoading(false)
const { getYMD } = useDateFormat(undefined)
const { get } = useStorage('local')
const page = reactive<IPage>({
  current: 1,
  size: 10,
  queryBean: {},
  total: 0,
})
const canConfirm = (index: string): boolean => {
  return ['PAID'].includes(index) // 只有已支付的订单可以确认
}
const canFinished = (index: string): boolean => {
  return ['CONFIRMED'].includes(index) // 只有已确认的订单可以完成
}
const canCancel = (index: string): boolean => {
  return ['PAID', 'PENDING'].includes(index) // 只有已支付和待确认的订单可以取消
}
const canDelete = (index: string): boolean => {
  return ['COMPLETED', 'CANCELLED'].includes(index) // 只有已完成和已取消的订单可以删除
}

const getData = async () => {
  start()
  const res = await queryOrderPage({ ...page }).finally(() => {
    done()
  })
  const { code, data } = res as unknown as IResponse<never>
  done()
  if (code === 200) {
    const { records, total, current, size } = data as unknown as IPageVo<IOrderResDto>
    dataList.value = records.filter((item: IOrderResDto) => !item.isDelete) || []
    page.current = current
    page.size = size
    page.total = total
  }
}

const handleOrderAdd = () => {
  showModal.value = true
  modalMode.value = 'add'
  currentRow.value = null
}

const refreshData = () => {
  getData()
}

const handleOrderCancel = async (row: IOrderResDto) => {
  const userInfo = get('userInfo')
  if (!userInfo) return
  const { id } = userInfo
  const params: IOrderStatusUpdateReqDto = {
    orderId: row.id,
    userId: id,
  }
  const res = await cancelOrder(params)
  const { code, message } = res as unknown as IResponse<never>
  // if (statusCode === 500) {
  //   Message.error(message)
  // }
  if (code === 200) {
    refreshData()
  } else {
    Message.warning(message)
  }
}

const handleOrderConfirm = async (orderId: string) => {
  const userInfo = get('userInfo')
  if (!userInfo) return
  const { id } = userInfo
  const params: IOrderStatusUpdateReqDto = {
    orderId,
    userId: id,
  }
  const res = await confirmOrder(params)
  const { code, message } = res as unknown as IResponse<never>
  // if (statusCode === 500) {
  //   Message.error(message)
  // } else
  if (code === 200) {
    refreshData()
  } else {
    Message.warning(message)
  }
}

const handleOrderFinish = async (orderId: string) => {
  const userInfo = get('userInfo')
  if (!userInfo) return
  const { id } = userInfo
  const params: IOrderStatusUpdateReqDto = {
    orderId,
    userId: id,
  }
  const res = await finishOrder(params)
  const { code, message } = res as unknown as IResponse<never>
  // if (statusCode === 500) {
  //   Message.error(message)
  // } else
  if (code === 200) {
    refreshData()
  } else {
    Message.warning(message)
  }
}

const handleOrderDelete = async (orderId: string) => {
  const userInfo = get('userInfo')
  if (!userInfo) return
  const { id } = userInfo
  const params: IOrderStatusUpdateReqDto = {
    orderId,
    userId: id,
  }
  const res = await deleteOrder(params)
  const { code, message } = res as unknown as IResponse<never>
  // if (statusCode === 500) {
  //   Message.error(message)
  // } else
  if (code === 200) {
    refreshData()
  } else {
    Message.warning(message)
  }
}

const handlePageChange = (val: number) => {
  page.current = val
  refreshData()
}

onMounted(() => {
  getData()
})
</script>

<style scoped></style>
