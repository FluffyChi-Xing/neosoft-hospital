<template>
  <el-dialog v-model="visible" draggable :title="title" :close-on-click-modal="false" width="500px">
    <template #default>
<!--      <el-form :model="form">-->
<!--        <el-form-item label="药品名称" required>-->
<!--          <el-input v-model="form.name" placeholder="请输入药品名称" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="规格" required>-->
<!--          <el-input v-model="form.specification" placeholder="请输入药品规格" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="单位" required>-->
<!--          <el-input v-model="form.unit" placeholder="请输入药品单位" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="价格" required>-->
<!--          <el-input-number v-model="form.price" :min="0" placeholder="请输入药品价格" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="库存" required>-->
<!--          <el-input-number v-model="form.stock" :min="0" placeholder="请输入药品库存" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="状态" required>-->
<!--          <el-radio-group v-model="form.status">-->
<!--            <el-radio-button-->
<!--              v-for="(item, index) in MEDICINE_STATUS"-->
<!--              :key="index"-->
<!--              :value="item.value"-->
<!--              >{{ item.key }}</el-radio-button-->
<!--            >-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
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
import type { InsertStockReqDto, IStockResDto, IStockUpdateReqDto } from '@/types/common.ts'
import { createStock, updateStock } from '@/server/api/stock.ts'
import { Message } from '@/utils'

type addProp = {
  show: boolean
  mode: 'add' | 'edit'
  data: IStockResDto | null
}

const props = withDefaults(defineProps<addProp>(), {
  show: false,
  mode: 'add',
  data: null,
})

const { show, mode, data } = toRefs(props)

const form = reactive<IStockResDto>({
  id: '',
  uuid: '',
  skuId: '',
  count: 0,
  reserveCount: 0,
  name: '',
  type: '',
  status: '',
  remark: '',
  createAt: '',
  updateAt: '',
  isDelete: false,
})

const emits = defineEmits(['update:show', 'submit'])

const visible = computed({
  get: () => show.value,
  set: (value) => emits('update:show', value),
})

const title = computed(() => {
  return mode.value === 'add' ? '新增药品' : '编辑药品'
})

const initData = () => {
  if (mode.value === 'edit') {
    Object.assign(form, data.value)
  } else {
    Object.assign(form, {
      id: '',
      uuid: '',
      skuId: '',
      count: 0,
      reserveCount: 0,
      name: '',
      type: '',
      status: '',
      remark: '',
      createAt: '',
      updateAt: '',
      isDelete: false,
    })
  }
}

const handleConfirm = async () => {
  if (mode.value === 'add') {
    const params: InsertStockReqDto = {} as unknown as InsertStockReqDto
    Object.assign(params, form)
    const res: never = await createStock(params)
    const { message, status } = res
    if (status === 200) {
      Message.success(message)
    } else {
      Message.warning(message)
    }
  } else {
    const params: IStockUpdateReqDto = {} as unknown as IStockUpdateReqDto
    Object.assign(params, form)
    const res: never = await updateStock(params)
    const { status, message } = res
    if (status === 200) {
      Message.success(message)
    } else {
      Message.warning(message)
    }
  }
  visible.value = false
  emits('submit')
}

watchEffect(() => {
  initData()
})
</script>

<style scoped></style>
