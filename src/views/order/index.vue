<template>
  <div class="w-full h-full flex flex-col gap-4">
    <PageHeader content="订单管理">
      <template #action>
        <el-button type="primary" @click="addAppointment">下单</el-button>
        <el-button type="warning" @click="refreshData">刷新</el-button>
      </template>
    </PageHeader>
    <div class="w-full h-full flex flex-col gap-4">
      <div class="w-full h-full flex">
        <el-card shadow="never" class="w-full h-full">
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
            <el-table-column width="250" label="操作" :fixed="'right'">
              <template #default="{ row }">
                <div class="w-full h-auto gap-4 flex items-center justify-center">
                  <el-button type="warning" size="small" @click="handleAppointmentFinish(row?.id)"
                    >接诊</el-button
                  >
                  <el-button type="primary" size="small" @click="editAppointment(row)"
                    >编辑</el-button
                  >
                  <el-popconfirm title="确定删除该预约吗？" @confirm="handleDelete(row.id)">
                    <template #reference>
                      <el-button type="danger" size="small">删除</el-button>
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
  <EditAppointmentModal
    v-model:show="showModal"
    :data="currentRow"
    :mode="modalMode"
    @submit="refreshData"
  />
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import { IOrderResDto } from '@/types/common'
import EditAppointmentModal from '@/views/order/components/EditAppointmentModal.vue'
import { IPage } from '@/types'
import useLoading from '@/hook/loading'
import { queryOrderPage } from '@/server/api/order'
import useDateFormat from '@/hook/date'

const modalMode = ref<'add' | 'edit'>('add')
const dataList = ref<IOrderResDto[]>([])
const showModal = ref<boolean>(false)
const orderStatus: Record<string, string> = {
  COMPLETED: '已完成',
  PAID: '已支付',
  CANCELLED: '已取消',
}
const currentRow = ref<IOrderResDto | null>(null)
const { loading, start, done } = useLoading(false)
const { getYMD } = useDateFormat(undefined)
const page = reactive<IPage>({
  current: 1,
  size: 10,
  total: 0,
})

const getData = async () => {
  start()
  const res = await queryOrderPage({ ...page })
  const { code, data } = res
  done()
  if (code === 200) {
    const { records, total, current, size } = data as unknown as IPageVo<IAppointment>
    dataList.value = records
    page.current = current
    page.size = size
    page.total = total
  }
}

const refreshData = () => {
  getData()
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
