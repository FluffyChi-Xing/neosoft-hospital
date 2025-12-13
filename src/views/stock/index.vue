<template>
  <div class="w-full h-full flex flex-col gap-4">
    <PageHeader content="库存管理">
      <template #action>
        <el-button type="primary" @click="addStock">新建库存</el-button>
        <el-button type="warning" @click="refreshData">刷新</el-button>
      </template>
    </PageHeader>
    <div class="w-full h-full flex flex-col gap-4">
      <div class="w-full h-full flex">
        <el-card shadow="never" class="w-full h-fit">
          <el-table v-loading="loading" :data="dataList" border stripe fit>
            <el-table-column prop="id" label="ID" />
            <el-table-column prop="uuid" label="uuid" show-overflow-tooltip width="100" />
            <el-table-column prop="name" label="库存名称" />
            <el-table-column prop="count" label="库存数量" />
            <el-table-column prop="reservedCount" label="预留数量" />
            <el-table-column prop="skuId" label="SKU ID">
              <template #default="{ row }">
                <div class="w-full h-auto flex items-center gap-2">
                  <el-tag
                    v-for="(item, index) in skuIdFormatter(row.skuId)"
                    :key="index"
                    size="small"
                  >
                    {{ item }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="类型" prop="type">
              <template #default="{ row }">
                <el-tag size="small">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" show-overflow-tooltip />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="getStockTagStatus(row.status)" size="small">{{
                  stockStatus[row.status] ?? '未知'
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价">
              <template #default="{ row }">
                <el-tag>￥ {{ row?.price ?? '-' }}</el-tag>
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
            <el-table-column label="操作" width="180" :fixed="'right'">
              <template #default="{ row }">
                <div class="w-full h-auto gap-4 flex items-center justify-center">
                  <!--                  <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>-->
                  <el-popconfirm title="确定删除该库存吗？" @confirm="handleDelete(row?.id)">
                    <template #reference>
                      <el-button type="danger" size="small">删除</el-button>
                    </template>
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty description="暂无库存" />
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
  <EditStockModal
    v-model:show="showModal"
    :data="currentRow"
    :mode="modalMode"
    @submit="refreshData"
  />
</template>

<script setup lang="ts">
import type { IResponse, IStockResDto } from '@/types/common.ts'
import useLoading from '../../hook/loading'
import useDateFormat from '../../hook/date'
import type { IPage, IPageVo } from '@/types'
import { deleteStock, queryStockPage, stockStatus } from '@/server/api/stock.ts'
import EditStockModal from './components/EditStockModal.vue'
import { Message } from '@/utils'
import PageHeader from '@/components/PageHeader.vue'

const modalMode = ref<'add' | 'edit'>('add')
const dataList = ref<IStockResDto[]>([])
const showModal = ref<boolean>(false)
const currentRow = ref<IStockResDto | null>(null)
const { loading, start, done } = useLoading(false)
const { getYMD } = useDateFormat(undefined)
const page = reactive<IPage>({
  current: 1,
  size: 10,
  queryBean: {},
})
const stockTagStatusMap: Record<string, string> = {
  available: 'primary',
  unavailable: 'warning',
  out_of_stock: 'danger',
  reserved: 'info',
  low_stock: 'success',
}
const getStockTagStatus = (index: string) => {
  return stockTagStatusMap[index] ?? 'info'
}
const skuIdFormatter = (index: string): string[] => {
  const result: string[] = []
  if (index.includes(',')) {
    const arr = index.split(',')
    arr.forEach((item) => {
      result.push(item.trim())
    })
  } else {
    result.push(index.trim())
  }
  return result
}

const handleDelete = async (skuId: string) => {
  const res = await deleteStock(skuId)
  const { code, message } = res as unknown as IResponse<never>
  if (code !== 200) {
    console.error('Failed to delete stock:', message)
    Message.error('删除失败')
    return
  }
  refreshData()
}

const addStock = () => {
  showModal.value = true
  modalMode.value = 'add'
  currentRow.value = null
}

// const handleEdit = (row: IStockResDto) => {
//   showModal.value = true
//   modalMode.value = 'edit'
//   currentRow.value = row
// }

const getStockPage = async () => {
  start()
  const res = await queryStockPage({ ...page })
  done()
  const { code, data } = res as unknown as IResponse<never>
  if (code === 200) {
    const { records, total, current, size } = data as unknown as IPageVo<IStockResDto>
    dataList.value = records
    page.current = current
    page.size = size
    page.total = total
  }
}

const handlePageChange = (index: number) => {
  page.current = index
  refreshData()
}

const refreshData = () => {
  getStockPage()
}

onMounted(() => {
  getStockPage()
})
</script>

<style scoped></style>
