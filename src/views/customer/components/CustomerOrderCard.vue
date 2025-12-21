<template>
  <div class="w-full h-auto flex flex-col bg-white mb-4 rounded-[10px] p-4">
    <div class="w-full h-auto flex items-center justify-between">
      <span>{{ data.id }}</span>
      <span>{{ orderStatus[data.status] ?? '未知' }}</span>
    </div>
    <div class="w-full h-auto flex">
      <span>{{ data.address }}</span>
    </div>
    <div class="w-full h-auto flex flex-col gap-1">
      <span v-for="(item, index) in data.name" :key="index"> ×1 {{ item }} </span>
    </div>
    <div class="w-full h-auto flex items-center justify-end">
      <span class="text-red-500">￥ {{ data.totalPrice }}元</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IOrderResDto } from '@/types/common.ts'

interface customerOrderProps {
  data: IOrderResDto
}

const orderStatus: Record<string, string> = {
  COMPLETED: '已完成',
  PAID: '已支付',
  CANCELLED: '已取消',
  CONFIRMED: '已确认',
  PENDING: '待确认',
  FINISHED: '已完成',
}

const props = withDefaults(defineProps<Partial<customerOrderProps>>(), {
  data: () => ({
    id: 0,
    uuid: '',
    userId: '',
    amount: 0,
    name: [],
    address: '',
    skuId: [],
    price: 0,
    totalPrice: 0,
    status: '',
    isDelete: false,
    createAt: '',
    updateAt: '',
  }),
})

const { data } = toRefs(props)
</script>

<style scoped></style>
