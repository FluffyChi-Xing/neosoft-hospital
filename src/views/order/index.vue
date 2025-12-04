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
          <el-table v-loading="isLoading" :data="dataList" border stripe fit>
            <!-- order -->
            <el-table-column prop="id" label="ID" />
            <el-table-column prop="patientId" label="患者ID" />
            <el-table-column prop="appointmentTime" label="预约时间" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag>{{
                  APPOINTMENT_STATUS.find((item) => item.value === row.status)?.key ?? '未知'
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column prop="updateTime" label="更新时间" />
            <el-table-column label="操作" :fixed="'right'">
              <template #default="{ row }">
                <div class="w-full h-auto gap-4 flex items-center justify-center">
                  <el-button
                    type="warning"
                    size="small"
                    @click="handleAppointmentFinish(row?.id)"
                    >接诊</el-button
                  >
                  <el-button
                    v-permission="'doctor'"
                    type="primary"
                    size="small"
                    @click="editAppointment(row)"
                    >编辑</el-button
                  >
                  <el-popconfirm title="确定删除该预约吗？" @confirm="handleDelete(row.id)">
                    <template #reference>
                      <el-button v-permission="'doctor'" type="danger" size="small">删除</el-button>
                    </template>
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty description="暂无预约" />
            </template>
          </el-table>
        </el-card>
      </div>
      <div class="w-full flex-1 justify-end items-center flex">
        <el-pagination
          layout="prev, pager, next"
          :total="page.total"
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
import useTable from '@/hook/table'
import { IAppointment } from '@/types/common'
import { ElMessage } from 'element-plus'
import { APPOINTMENT_STATUS } from '@/const'
import {
  deleteAppointment,
  finishAppointment,
  queryAppointmentPage,
} from '@/server/api/order'
import EditAppointmentModal from '@/views/order/components/EditAppointmentModal.vue'

const isLoading = ref<boolean>(false)
const modalMode = ref<'add' | 'edit'>('add')
const dataList = ref<IAppointment[]>([])
const showModal = ref<boolean>(false)
const currentRow = ref<IAppointment | null>(null)
const page = reactive({
  index: 1,
  size: 10,
  total: 0,
})
const { getPageData } = useTable<{ index: number; size: number }, IAppointment>({
  fetchData: queryAppointmentPage,
})

const initData = async () => {
  isLoading.value = true
  const data = await getPageData({ index: page.index, size: page.size })
  const { records, total, index, size } = data
  dataList.value = records
  page.index = index
  page.size = size
  page.total = total
  isLoading.value = false
}
const refreshData = async () => {
  isLoading.value = true
  const data = await getPageData({ index: page.index, size: page.size })
  const { records, total, index, size } = data
  dataList.value = records
  page.index = index
  page.size = size
  page.total = total
  isLoading.value = false
}

const addAppointment = () => {
  showModal.value = true
  modalMode.value = 'add'
  currentRow.value = null
}

const editAppointment = (row: IAppointment) => {
  showModal.value = true
  modalMode.value = 'edit'
  currentRow.value = row
}

const handleDelete = async (index: string) => {
  const res: never = await deleteAppointment(index)
  const { message } = res
  ElMessage.success(message)
  await refreshData()
}

const handleAppointmentFinish = async (index: string) => {
  const res: never = await finishAppointment(index)
  const { message } = res
  ElMessage.success(message)
  await refreshData()
}

const handlePageChange = async (index: number) => {
  page.index = index
  await refreshData()
}

onMounted(() => {
  initData()
})
</script>

<style scoped></style>
