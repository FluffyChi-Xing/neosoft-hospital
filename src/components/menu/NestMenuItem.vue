<template>
  <el-sub-menu v-if="item.children.length > 0" :index="item.index">
    <template #title>
      <span>{{ item.label }}</span>
      <el-icon v-if="item?.icon">
        <component :is="item.icon" />
      </el-icon>
    </template>
    <NestMenuItem v-for="(child, childIndex) in item.children" :key="childIndex" :item="child" />
  </el-sub-menu>
  <el-menu-item v-else-if="item" :index="item.index" @click="handleMenuItemClick(item.route)">
    <el-icon v-if="item?.icon">
      <component :is="item.icon" />
    </el-icon>
    <span>{{ item.label }}</span>
  </el-menu-item>
</template>

<script setup lang="ts">
import { menuItemType } from '@/components/menu/TheMenu.vue'

type menuProps = {
  item: menuItemType
}

const props = withDefaults(defineProps<menuProps>(), {
  item: () => ({
    label: '',
    index: '',
    children: [],
    icon: '',
    hide: false,
  }),
})

const { item } = toRefs(props)
const router = useRouter()

const handleMenuItemClick = (path: string) => {
  router.push(path)
}
</script>

<style scoped></style>
