<template>
  <div class="w-full h-auto flex flex-col gap-4 bg-white rounded-[5px] mb-4 p-4 items-center">
   <div class="w-full h-auto flex gap-4">
     <div class="w-14 h-14">
       <img
         :src="randomGoodPoster"
         loading="lazy"
         alt="good-poster"
         class="w-full h-full object-cover"
       />
     </div>
     <div class="w-auto h-full flex flex-col gap-1 flex-1">
       <div class="w-full h-auto flex items-center font-bold">{{ goodName }}</div>
       <div class="w-full h-auto text-[14px] flex items-center text-ellipsis overflow-hidden">
         {{ data.remark ?? '暂无商品描述' }}
       </div>
       <div class="w-full h-auto flex items-center text-red-500">
         ￥ {{ data.price }}
       </div>
     </div>
   </div>
    <div class="w-full h-auto flex items-center justify-end">
      <el-button type="primary" size="small" @click="handleAddToCart">加入购物车</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IStockResDto } from '@/types/common.ts'

interface customerGoodProps {
  data: IStockResDto
}

const props = withDefaults(defineProps<Partial<customerGoodProps>>(), {
  data: () => ({
    id: 0,
    uuid: '',
    skuId: '',
    count: 0,
    reserveCount: 0,
    price: 0,
    name: '',
    type: '',
    status: '',
    remark: '',
    createAt: '',
    updateAt: '',
    isDelete: false,
  }),
})

const { data } = toRefs(props)

const goodName = computed(() => data.value.name ?? '暂无商品名称')

const randomGoodPoster = computed(() => {
  return `https://picsum.photos/200/200?${data.value.id}`;
})

const emits = defineEmits(['add'])
const handleAddToCart = () => {
  emits('add', data.value)
}
</script>

<style scoped></style>
