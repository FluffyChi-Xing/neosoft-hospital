<template>
  <el-dialog v-model="visible" draggable :title="title" :close-on-click-modal="false" width="500px">
    <template #default>
      <el-form :model="form">
        <el-form-item label="数量" required>
          <el-input-number v-model="form.amount" :min="1" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input-tag v-model="form.name" max="4" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="收货地址" required>
          <el-input v-model="form.address" placeholder="请输入收货地址" />
        </el-form-item>
        <el-form-item label="商品ID">
          <el-input-tag v-model="form.skuId" max="4" placeholder="请输入商品ID" />
        </el-form-item>
        <el-form-item label="单价" required>
          <el-input-number v-model="form.price" :min="1" placeholder="请输入单价" />
        </el-form-item>
        <el-form-item label="总价" required>
          <el-input-number v-model="form.totalPrice" :min="1" placeholder="请输入总价" />
        </el-form-item>
        <el-form-item label="状态" required>
          <el-radio-group v-model="form.status">
            <el-radio-button
              v-for="(item, index) in statusOptions"
              :key="index"
              :value="item.key"
              >{{ item.value }}</el-radio-button
            >
          </el-radio-group>
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
import { IEditAppointment, IOrderCreateReqDto } from '@/types/common'
import { getUsername, Message } from '@/utils'
import { addAppointment, createOrder, updateAppointment } from '@/server/api/order'
import { IKVType } from '@/types'

type addProp = {
  show: boolean
  mode: 'add' | 'edit'
  data: IOrderCreateReqDto | null
}

const props = withDefaults(defineProps<addProp>(), {
  show: false,
  mode: 'add',
  data: null,
})

const { show, mode, data } = toRefs(props)

const form = reactive<IOrderCreateReqDto>({
  id: '',
  userId: getUsername(),
  amount: 0,
  name: [],
  address: '',
  skuId: [],
  price: 0,
  totalPrice: 0,
  status: 'PENDING',
})

const emits = defineEmits(['update:show', 'submit'])

const visible = computed({
  get: () => show.value,
  set: (value) => emits('update:show', value),
})

const title = computed(() => {
  return mode.value === 'add' ? '新增预约' : '编辑预约'
})

const statusOptions: IKVType[] = [
  { key: 'PAID', value: '已支付' },
  { key: 'CONFIRMED', value: '已确认' },
  { key: 'COMPLETED', value: '已完成' },
  { key: 'PENDING', value: '待处理' },
  { key: 'CANCELLED', value: '已取消' },
]

const initData = () => {
  if (mode.value === 'edit') {
    form.id = data.value?.id ?? ''
    form.userId = getUsername()
    form.amount = data.value?.amount ?? 0
    form.name = data.value?.name ?? []
    form.address = data.value?.address ?? ''
    form.skuId = data.value?.skuId ?? []
    form.price = data.value?.price ?? 0
    form.totalPrice = data.value?.totalPrice ?? 0
    form.status = data.value?.status ?? 'PENDING'
  } else {
    form.id = ''
    form.userId = getUsername()
    form.amount = 0
    form.name = []
    form.address = ''
    form.skuId = []
    form.price = 0
    form.totalPrice = 0
    form.status = 'PENDING'
  }
}

const handleConfirm = async () => {
  const params: IOrderCreateReqDto = {
    ...form,
  }
  if (mode.value === 'add') {
    const res: never = await createOrder(params)
    const { code } = res
    if (code === 200) {
      Message.success('创建成功')
    } else {
      Message.warning('创建失败')
    }
  } else {
    const res: never = await updateAppointment(params)
    const { code } = res
    if (code === 200) {
      Message.success('更新成功')
    } else {
      Message.warning('更新失败')
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
