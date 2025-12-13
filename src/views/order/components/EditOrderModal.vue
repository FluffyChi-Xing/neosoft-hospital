<template>
  <el-dialog v-model="visible" draggable :title="title" :close-on-click-modal="false" width="500px">
    <template #default>
      <el-form :model="form" label-width="100px">
        <el-form-item label="收货地址" required>
          <el-input v-model="form.address" placeholder="请输入收货地址" />
        </el-form-item>
        <el-form-item label="订单状态" required>
          <el-radio-group v-model="form.status">
            <el-radio-button
              v-for="(item, index) in statusOptions"
              :key="index"
              :value="item.key"
              >{{ item.value }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-divider content-position="left">商品信息</el-divider>
        <el-scrollbar height="400px">
          <div v-for="(item, index) in form.items" :key="index" class="item-group">
            <div class="item-header">
              <span>商品 {{ index + 1 }}</span>
              <el-button
                type="danger"
                size="small"
                link
                @click="removeItem(index)"
                v-if="form.items.length > 1"
              >
                删除
              </el-button>
            </div>
            <el-form-item label="商品名称" required>
              <el-input v-model="item.name" placeholder="请输入商品名称" />
            </el-form-item>
            <el-form-item label="商品ID" required>
              <el-input v-model="item.skuId" placeholder="请输入商品ID" />
            </el-form-item>
            <el-form-item label="数量" required>
              <el-input-number v-model="item.quantity" :min="1" placeholder="请输入数量" />
            </el-form-item>
          </div>
        </el-scrollbar>
        <el-form-item>
          <el-button type="primary" plain @click="addItem">添加商品</el-button>
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
import { IOrderCreateReqDto } from '../../../types/common'
import { getUserId, Message } from '../../../utils'
import { IKVType } from '../../../types'
import { createOrder, updateOrder } from '../../../server/api/order'

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

const { show, mode } = toRefs(props)

const form = reactive<IOrderCreateReqDto>({
  userId: '',
  address: '',
  items: [],
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
  if (mode.value === 'edit' && props.data) {
    form.userId = props.data.userId
    form.address = props.data.address
    form.items =
      props.data.items.length > 0 ? [...props.data.items] : [{ skuId: '', name: '', quantity: 1 }]
    form.status = props.data.status || 'PENDING'
    form.orderId = props.data.orderId
  } else {
    form.userId = Number(getUserId()) ?? 0
    form.address = ''
    form.items = [{ skuId: '', name: '', quantity: 1 }]
    form.status = 'PENDING'
    form.orderId = undefined
  }
}

const addItem = () => {
  form.items.push({ skuId: '', name: '', quantity: 1 })
}

const removeItem = (index: number) => {
  if (form.items.length > 1) {
    form.items.splice(index, 1)
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
    const res: never = await updateOrder(params)
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

<style scoped>
.item-group {
  padding: 16px;
  margin-bottom: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-weight: 500;
  color: #303133;
}
</style>
