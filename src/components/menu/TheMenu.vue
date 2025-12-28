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
import { cloneDeep, isArray } from 'lodash-es'
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
  return items.map((item: RouteRecordNormalized) => {
    return {
      label: item.meta?.title || item.name,
      index: item.name,
      children: item.children && item.children.length > 0 ? getMenuItems(item.children) : [],
      icon: item.meta?.icon,
      route: item.path,
    } as unknown as menuItemType
  })
}

const getMenus = () => {
  if (menuRoutes.value.length === 0) {
    const menus: RouteRecordNormalized[] = cloneDeep(appRoutes)
    if (menus && menus.length > 0) {
      const userInfo = localStorage.getItem('userInfo')
      const { role } = JSON.parse(userInfo ?? '{}')

      menus.forEach((item: RouteRecordNormalized) => {
        console.log('item:', item)
        if (item.meta?.role && isArray(item.meta.role) && item.meta.role.includes(role)) {
          menuRoutes.value.push({
            label: (item.meta?.title ?? item.name) as string,
            index: item.name as string,
            children: item.children && item.children.length > 0 ? getMenuItems(item.children) : [],
            icon: item.meta?.icon as string,
            route: item.path,
          })
        }
      })
    } else {
      menuRoutes.value = []
    }
  }
}

const findMenuItem = (items: menuItemType[], name: string): menuItemType | null => {
  for (const item of items) {
    if (item?.index === name) {
      return item
    }
    if (item?.children && item.children.length > 0) {
      const found = findMenuItem(item.children, name)
      if (found) {
        return found
      }
    }
  }
  return null
}

const getActiveIndex = () => {
  console.log('route.name:', route.name, menuRoutes.value)
  if (menuRoutes.value.length > 0) {
    const name = route.name as string
    const foundItem = findMenuItem(menuRoutes.value, name)
    if (foundItem) {
      activeIndex.value = foundItem.index
    } else {
      console.log('找不到菜单项', name)
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
