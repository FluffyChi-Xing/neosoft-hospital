<template>
  <el-dialog
    v-model="visible"
    draggable
    :title="title"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    width="500px"
  >
    <template #default>
      <el-form ref="formRef" :model="form">
        <el-form-item required prop="name" label="商品名称">
          <el-input v-model="form.name" placeholder="请输入商品名称" clearable />
        </el-form-item>
        <el-form-item required prop="count" label="库存数量">
          <el-input-number
            v-model="form.count"
            step="5"
            :min="0"
            :max="1000"
            placeholder="请输入库存数量"
            clearable
          />
        </el-form-item>
        <el-form-item required prop="skuId" label="SKU ID">
          <el-input v-model="form.skuId" placeholder="请输入SKU ID" clearable />
        </el-form-item>
        <el-form-item required prop="type" label="类型">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option
              v-for="(item, index) in stockTypeOptions"
              :key="index"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item required prop="status" label="状态">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option
              v-for="(item, index) in stockStatusOptions"
              :key="index"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <!-- reversed count -->
        <el-form-item prop="reservedCount" required label="预留数量">
          <el-input-number
            v-model="form.reservedCount"
            step="5"
            :min="0"
            :max="1000"
            placeholder="请输入预留数量"
            clearable
          />
        </el-form-item>
        <!-- 单价 -->
        <el-form-item prop="price" required label="单价">
          <el-input-number
            v-model="form.price"
            step="0.01"
            :min="0"
            :max="1000"
            placeholder="请输入单价"
            clearable
          />
        </el-form-item>
        <el-form-item prop="remark" required label="备注">
          <el-input v-model="form.remark" placeholder="请输入备注" clearable />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div class="w-full h-auto flex items-center justify-end gap-4">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { InsertStockReqDto, IResponse, IStockResDto } from '@/types/common.ts'
import { createStock, queryStockDict, stockStatus } from '@/server/api/stock.ts'
import { Message } from '@/utils'
import { IKVType } from '@/types'

type addProp = {
  show: boolean
  mode: 'add' | 'edit'
  data: IStockResDto | null
}

const formRef = ref()
const props = withDefaults(defineProps<Partial<addProp>>(), {
  show: false,
  mode: 'add',
  data: null,
})

const stockTypeOptions = ref<IKVType[]>([])

const { show, mode, data } = toRefs(props)

const form = reactive<InsertStockReqDto>({
  skuId: '',
  count: 0,
  reservedCount: 0,
  name: '',
  type: '',
  status: 'available',
  remark: '',
  price: 0,
})

const emits = defineEmits(['update:show', 'submit'])

const visible = computed({
  get: () => show.value,
  set: (value) => emits('update:show', value),
})

const title = computed(() => {
  return mode.value === 'add' ? '新建库存' : '编辑库存'
})

const stockStatusOptions = computed(() => {
  const result: IKVType[] = []
  for (const key in stockStatus) {
    result.push({ key, value: stockStatus[key] })
  }
  return result
})

const getStockDict = async () => {
  const res = await queryStockDict()
  const { code, message, data } = res as unknown as IResponse<never>
  if (code === 200 && data) {
    stockTypeOptions.value = data as unknown as IKVType[]
  } else {
    Message.warning(message)
  }
}

const initData = () => {
  if (visible) {
    getStockDict()
    if (mode.value === 'edit') {
      Object.assign(form, data.value)
    } else {
      Object.assign(form, {
        skuId: '',
        count: 0,
        reservedCount: 0,
        name: '',
        type: '',
        status: 'available',
        remark: '',
        price: 0,
      })
    }
  } else {
    Object.assign(form, {
      skuId: '',
      count: 0,
      reservedCount: 0,
      name: '',
      type: '',
      status: '可售',
      remark: '',
      price: 0,
    })
  }
}

const handleConfirm = async () => {
  // 验证表单
  try {
    await formRef.value.validate()
  } catch {
    Message.warning('请填写完整信息')
    return
  }

  const params: InsertStockReqDto = {} as unknown as InsertStockReqDto
  Object.assign(params, form)

  try {
    const res = await createStock(params)
    const { message, code } = res as unknown as IResponse<never>

    if (code === 200) {
      Message.success(message || '创建成功')
      visible.value = false
      emits('submit')
    } else {
      Message.warning(message || '创建失败')
    }
  } catch (error) {
    console.error('创建库存失败:', error)
    Message.error('创建库存失败，请稍后重试')
  }
}

watchEffect(() => {
  initData()
})
</script>

<style scoped></style>
