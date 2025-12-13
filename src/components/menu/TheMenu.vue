<template>
  <el-menu
    :default-active="activeIndex"
    :collapse="isCollapse"
    :unique-opened="true"
    class="h-full"
    background-color="#111827"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <template v-for="(item, index) in menuRoutes" :key="index">
      <NestMenuItem :item="item" />
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { appRoutes } from '@/router/const'
import { RouteRecordNormalized } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import { onMounted, watchEffect } from 'vue'
import NestMenuItem from '@/components/menu/NestMenuItem.vue'

interface menuProps {
  isCollapse: boolean
  router: boolean
}

export type menuItemType = {
  label: string
  icon?: string
  index: string
  hide?: boolean
  route: string
  children: menuItemType[]
}

const props = withDefaults(defineProps<Partial<menuProps>>(), {
  isCollapse: false,
  router: true,
})

const route = useRoute()
const activeIndex = ref<string>('')
const menuRoutes = ref<menuItemType[]>([])
const { isCollapse } = toRefs(props)

const getMenuItems = (items: RouteRecordNormalized[]): menuItemType[] => {
  return items
    .map((item: RouteRecordNormalized) => {
      return {
        label: item.meta?.title || item.name,
        index: item.name,
        children: item.children && item.children.length > 0 ? getMenuItems(item.children) : [],
        icon: item.meta?.icon,
        hide: item.meta?.hideInMenu ?? false,
        route: item.path,
      }
    })
    .filter((item) => !item.hide) // Filter out hidden items
}

const getMenus = () => {
  if (menuRoutes.value.length === 0) {
    const menus: RouteRecordNormalized[] = cloneDeep(appRoutes)
    if (menus && menus.length > 0) {
      menuRoutes.value = menus
        .map((item: RouteRecordNormalized) => {
          return {
            label: item.meta?.title || item.name,
            index: item.name,
            children: item.children && item.children.length > 0 ? getMenuItems(item.children) : [],
            icon: item.meta?.icon,
            hide: item.meta?.hideInMenu ?? false,
            route: item.path,
          }
        })
        .filter((item) => !item.hide)
    } else {
      menuRoutes.value = []
    }
  }
}

const findMenuItem = (items: menuItemType[], name: string): menuItemType | null => {
  for (const item of items) {
    if (item.index === name) {
      return item
    }
    if (item.children && item.children.length > 0) {
      const found = findMenuItem(item.children, name)
      if (found) {
        return found
      }
    }
  }
  return null
}

const getActiveIndex = () => {
  if (menuRoutes.value.length > 0) {
    const name = route.name as string
    const foundItem = findMenuItem(menuRoutes.value, name)
    if (foundItem) {
      activeIndex.value = foundItem.index
    } else {
      activeIndex.value = menuRoutes.value[0].index
    }
  } else {
    activeIndex.value = ''
  }
}

onMounted(() => {
  getMenus()
  getActiveIndex()
  // console.log('menuRoutes:', menuRoutes.value);
})

watchEffect(() => {
  getActiveIndex()
})
</script>

<style scoped>
.el-menu {
  border-right: none;
}

.el-menu:not(.el-menu--collapse) {
  width: 200px;
}
</style>
