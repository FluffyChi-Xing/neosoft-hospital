<template>
  <div class="w-full h-full flex items-center justify-center">
    <!-- 模拟手机界面 -->
    <div
      id="phoneRef"
      class="w-[375px] h-full flex flex-col bg-white rounded-[10px] overflow-hidden"
    >
      <div class="w-full h-8 flex items-center justify-between bg-black text-white px-4">
        <span>12: 25</span>
        <span>4G LTE</span>
      </div>
      <div class="w-full h-10 flex items-center gap-4 bg-gray-900 text-white px-4">
        <van-icon name="cross" />
        消费者页面
      </div>
      <div class="w-full h-auto flex flex-col flex-1">
        <van-tabs v-model:active="activeIndex">
          <van-tab title="商品列表" name="0" />
          <van-tab title="订单详情" name="1" />
        </van-tabs>
        <!-- 商品列表页面 -->
        <div
          v-if="activeIndex === '0'"
          class="w-full h-auto relative flex flex-col flex-1 bg-gray-100"
        >
          <div class="w-full h-auto flex flex-1">
            <div class="w-20 h-full flex flex-col bg-white">
              <van-sidebar v-model="sideActiveIndex">
                <van-sidebar-item
                  v-for="(item, index) in sideTabsOptions"
                  :key="index"
                  :title="item"
                />
              </van-sidebar>
            </div>
            <div
              style="scrollbar-width: none"
              class="w-full h-auto max-h-[525px] flex flex-col overflow-y-auto"
            >
              <template v-if="showGoodList">
                <customer-good-card
                  v-for="(item, index) in goodDataList"
                  :key="index"
                  :data="item"
                  @add="handleAdd2Cart"
                />
              </template>
              <van-empty v-else description="暂无商品" />
            </div>
          </div>
          <van-action-bar style="position: relative">
            <van-action-bar-icon icon="chat-o" text="客服" dot />
            <van-action-bar-icon
              icon="cart-o"
              text="购物车"
              :badge="cartCount"
              @click="onCartToggle"
            />
            <van-action-bar-icon icon="shop-o" text="店铺" badge="12" />
            <van-action-bar-button @click="handleBuy" type="danger" text="付款" />
          </van-action-bar>
        </div>
        <!-- 订单详情页面 -->
        <div
          v-else
          style="scrollbar-width: none"
          class="w-full h-auto max-h-[619px] flex px-4 flex-col flex-1 bg-gray-100 overflow-y-auto"
        >
          <template v-if="showOrderList">
            <customer-order-card
              v-for="(item, index) in orderList"
              :key="index"
              :data="item"
            />
          </template>
          <van-empty v-else description="暂无订单" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IOrderCreateReqDto, IOrderResDto, IResponse, IStockResDto } from '@/types/common.ts'
import { queryStockPage } from '@/server/api/stock.ts'
import { IPage, IPageVo } from '@/types'
import { showLoadingToast, showToast } from 'vant'
import CustomerGoodCard from '@/views/customer/components/CustomerGoodCard.vue'
import { createOrder, queryOrderPage } from '@/server/api/order.ts'
import CustomerOrderCard from '@/views/customer/components/CustomerOrderCard.vue'

// const phoneRef = ref()
const activeIndex = ref<string>('0')
const sideActiveIndex = ref<string>('0')
const sideTabsOptions = ref<string[]>(['肉类', '海鲜', '蔬菜', '熟食'])
const goodDataList = ref<IStockResDto[]>([])
// 购物车
const cartList = ref<IStockResDto[]>([])
const orderList = ref<IOrderResDto[]>([])

const resetGoodData = () => {
  goodDataList.value = []
  cartList.value = []
  sideActiveIndex.value = '0'
  // activeIndex.value = 0
}

const cartCount = computed(() => cartList.value.length)
const showCart = ref<boolean>(false)
const showOrderList = computed(() => {
  return activeIndex.value === '1' && orderList.value.length > 0
})
const showGoodList = computed(() => {
  return activeIndex.value === '0' && goodDataList.value.length > 0
})

const getGoodsData = async () => {
  const toast = showLoadingToast({ message: '加载中...', forbidClick: true })
  const pageParams: IPage = {
    current: 1,
    size: 99,
    queryBean: {
      type: sideTabsOptions.value[sideActiveIndex.value],
    },
  }
  const res = await queryStockPage(pageParams).finally(() => toast.close())
  const { code, data } = res as unknown as IResponse<never>
  if (code === 200 && data) {
    goodDataList.value = (data as unknown as IPageVo<IStockResDto>).records
  } else {
    showToast('加载失败')
  }
}

const getOrderList = async () => {
  const toast = showLoadingToast({ message: '加载中...', forbidClick: true })
  const res = await queryOrderPage({ current: 1, size: 99 }).finally(() => toast.close())
  const { code, data } = res as unknown as IResponse<never>
  if (code === 200 && data) {
    orderList.value = (data as unknown as IPageVo<IOrderResDto>).records
  } else {
    showToast('加载失败')
  }
}

const handleAdd2Cart = (item: IStockResDto) => {
  if (cartList.value.length >= 2) {
    showToast('购物车已满')
    return
  }
  const set = new Set(cartList.value.map((i) => i.skuId))
  if (set.has(item.skuId)) {
    showToast('该商品已加入购物车')
    return
  }
  cartList.value.push(item)
}

const onCartToggle = () => {
  showCart.value = !showCart.value
}

const handleBuy = async () => {
  if (cartList.value.length === 0) {
    showToast('购物车为空')
    return
  }
  const createOrderParams: IOrderCreateReqDto = {
    userId: 1,
    address: 'xxx大学新校区一期12号',
    items: cartList.value.map((item) => ({
      skuId: item.skuId,
      name: item.name,
      quantity: 1,
    })),
    status: 'PENDING',
    orderId: '',
  }
  const toast = showLoadingToast({ message: '下单中...', forbidClick: true })
  const res = await createOrder(createOrderParams)
  toast.close()
  const { code, message } = res as unknown as IResponse<never>
  if (code === 200) {
    showToast('创建成功')
    cartList.value = []
    activeIndex.value = '1'
  } else {
    showToast(message)
  }
}

onMounted(() => {
  if (activeIndex.value === '0') {
    getGoodsData()
  } else {
    getOrderList()
  }
})

watch(
  () => sideActiveIndex.value,
  () => {
    resetGoodData()
    getGoodsData()
  },
)


watch(
  () => activeIndex.value,
  () => {
    if (activeIndex.value === '0') {
      getGoodsData()
    } else {
      getOrderList()
    }
  },
)
</script>

<style scoped></style>
