<template>
  <div class="w-full h-full flex flex-col gap-4">
    <PageHeader content="库存管理">
      <template #action>
        <el-button v-permission="'doctor'" type="primary" @click="addMedicine">新增药品</el-button>
        <el-button type="warning" @click="refreshData">刷新</el-button>
      </template>
    </PageHeader>
    <div class="w-full h-full flex flex-col gap-4">
      <div class="w-full h-full flex">
        <el-card shadow="never" class="w-full h-full">
          <el-table v-loading="isLoading" :data="dataList" border stripe fit>
            <el-table-column prop="id" label="ID" />
            <el-table-column prop="name" label="药品名称">
              <template #default="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="价格">
              <template #default="{ row }">
                <div class="w-full h-auto flex items-center gap-4">
                  <span>{{ row.price }}</span>
                  <el-tag type="danger">{{ row.unit }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="库存" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag>{{
                  MEDICINE_STATUS.find((item) => item.value === row.status)?.key ?? '未知'
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createAt" label="创建时间" />
            <el-table-column prop="updateAt" label="更新时间" />
            <el-table-column label="操作" :fixed="'right'">
              <template #default="{ row }">
                <div class="w-full h-auto gap-4 flex items-center justify-center">
                  <el-button
                    v-permission="'doctor'"
                    type="primary"
                    size="small"
                    @click="editMedicine(row)"
                    >编辑</el-button
                  >
                  <el-popconfirm title="确定删除该药品吗？" @confirm="handleDelete(row?.id)">
                    <template #reference>
                      <el-button v-permission="'doctor'" type="danger" size="small">删除</el-button>
                    </template>
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty description="暂无药品" />
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
  <EditStockModal
    v-model:show="showModal"
    :data="currentRow"
    :mode="modalMode"
    @submit="refreshData"
  />
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import useTable from '@/hook/table'
import { IMedicine } from '@/types/common'
import { ElMessage } from 'element-plus'
import { MEDICINE_STATUS } from '@/const'
import { deleteMedicine, queryMedicinePage } from '@/server/api/stock'
import EditStockModal from '@/views/stock/components/EditStockModal.vue'

const isLoading = ref<boolean>(false)
const modalMode = ref<'add' | 'edit'>('add')
const dataList = ref<IMedicine[]>([])
const showModal = ref<boolean>(false)
const currentRow = ref<IMedicine | null>(null)
const page = reactive({
  index: 1,
  size: 10,
  total: 0,
})
const { getPageData } = useTable<{ index: number; size: number }, IMedicine>({
  fetchData: queryMedicinePage,
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

const addMedicine = () => {
  showModal.value = true
  modalMode.value = 'add'
  currentRow.value = null
}

const editMedicine = (row: IMedicine) => {
  showModal.value = true
  modalMode.value = 'edit'
  currentRow.value = row
}

const handleDelete = async (index: string) => {
  const res: never = await deleteMedicine(index)
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
